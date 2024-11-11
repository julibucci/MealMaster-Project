import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeDetailsComponentComponent } from './recipe-details-component.component';

describe('RecipeDetailsComponentComponent', () => {
  let component: RecipeDetailsComponentComponent;
  let fixture: ComponentFixture<RecipeDetailsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeDetailsComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecipeDetailsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
