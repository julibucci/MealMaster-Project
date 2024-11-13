import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRecipeComponentComponent } from './create-recipe-component.component';

describe('CreateRecipeComponentComponent', () => {
  let component: CreateRecipeComponentComponent;
  let fixture: ComponentFixture<CreateRecipeComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRecipeComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateRecipeComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
