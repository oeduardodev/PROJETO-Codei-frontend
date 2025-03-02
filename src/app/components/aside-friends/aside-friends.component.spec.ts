import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideFriendsComponent } from './aside-friends.component';

describe('AsideFriendsComponent', () => {
  let component: AsideFriendsComponent;
  let fixture: ComponentFixture<AsideFriendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsideFriendsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AsideFriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
