import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsideProfileComponent }  from "./aside-profile.component"

describe('AsideProfileComponent', () => {
  let component: AsideProfileComponent;
  let fixture: ComponentFixture<AsideProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsideProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsideProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
