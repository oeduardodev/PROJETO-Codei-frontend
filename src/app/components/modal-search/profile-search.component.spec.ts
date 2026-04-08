import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import { ProfileSearchComponent } from './profile-search.component';
import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../models/Profiles';

describe('ProfileSearchComponent', () => {
  let component: ProfileSearchComponent;
  let fixture: ComponentFixture<ProfileSearchComponent>;
  let routerMock: jasmine.SpyObj<Router>;
  const profileServiceMock = {
    searchProfiles: () => of([]),
  };

  beforeEach(async () => {
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ProfileSearchComponent],
      providers: [
        { provide: ProfileService, useValue: profileServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfileSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should only show empty state after a search is performed', () => {
    component.searchTerm = 'eduardo';
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.empty-state')).toBeNull();

    component.searchProfiles();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.empty-state')?.textContent).toContain('Nenhum perfil encontrado.');
  });

  it('should navigate to the selected profile when a result is clicked', () => {
    const profile = new Profile({ userId: 7, username: 'eduardo' });
    component.profiles = [profile];
    fixture.detectChanges();

    fixture.nativeElement.querySelector('.result-card').click();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/profile', 7]);
  });
});
