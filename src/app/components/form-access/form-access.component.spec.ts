import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAccessComponent } from './form-access.component';
import { RouterLink } from '@angular/router';

describe('FormAccessComponent', () => {
  let component: FormAccessComponent;
  let fixture: ComponentFixture<FormAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAccessComponent,RouterLink]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
