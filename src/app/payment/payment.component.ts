import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { PaypalService } from '../services/paypal-service.service';
declare const paypal: any;

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements AfterViewInit {
  paymentSuccess: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private userService: UserService,
    private router: Router,
    private paypalService: PaypalService
  ) {}

  ngAfterViewInit(): void {
    this.initializePayPalButton();
  }


  initializePayPalButton(): void {
    this.paypalService.getAccessToken().subscribe({
      next: (tokenResponse: any) => {
        const accessToken = tokenResponse.access_token;

        this.paypalService.createOrder(accessToken).subscribe({
          next: (orderResponse: any) => {
            const orderId = orderResponse.id;

            paypal.Buttons({
              createOrder: (data: any, actions: any) => {
                return orderId;
              },
              onApprove: (data: any, actions: any) => {
                this.paypalService.capturePayment(accessToken, data.orderID).subscribe({
                  next: (paymentResponse: any) => {
                    this.onPaymentSuccess(paymentResponse);
                  },
                  error: (err) => {
                    console.error('Error capturing payment:', err);
                    this.errorMessage = 'Payment was successful, but an issue occurred.';
                  },
                });
              },
              onError: (err: any) => {
                console.error('PayPal error:', err);
                this.errorMessage = 'There was an issue with the payment. Please try again.';
              },
            }).render('#paypal-button-container');
          },
          error: (err) => {
            console.error('Error creating PayPal order:', err);
            this.errorMessage = 'Could not create PayPal order.';
          },
        });
      },
      error: (err) => {
        console.error('Error getting access token:', err);
        this.errorMessage = 'Could not connect to PayPal. Please try again later.';
      },
    });
  }


  onPaymentSuccess(subscriptionDetails: any): void {
    const userId = localStorage.getItem('authUserId');
    if (userId) {
      this.userService.upgradeToPremium(userId).subscribe({
        next: () => {
          this.paymentSuccess = true;
          this.router.navigate(['/plan-premium/home']);
        },
        error: (error) => {
          console.error('Error upgrading plan:', error);
          this.errorMessage = 'Payment was successful, but there was an issue upgrading your plan.';
        },
      });
    } else {
      this.errorMessage = 'User not authenticated. Please log in to continue.';
    }
  }
}
