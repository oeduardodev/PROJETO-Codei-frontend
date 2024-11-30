import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../services/users.service';
import { AuthorizationService } from '../../../services/auth.service';
import { Profile } from '../../../models/Profiles';
import { ProfileService } from '../../../services/profile.service';
import { LoadingComponent } from "../../../loading/loading.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, CommonModule, LoadingComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'] 
})

export class ProfileComponent {
  profileData: Profile | null = null;
  technologies: any[] = [];
  levels: any[] = [];
  profileName: string[] = [];
  moments: any;

  constructor(
    private service: ProfileService,
    private authService: AuthorizationService
  ) {}

  ngOnInit() {
    this.getMyProfile();
  }

  getMyProfile() {
    const headers = this.authService.getAuthorizationHeaders();
  
    this.service.getMyProfile().subscribe({
      next: (response: any) => {
        console.log(response);
        this.profileData = response;
        console.log(this.profileData)
        
        // Verifica se moments é um array; se for um objeto, transforma em um array com um elemento
        this.moments = this.profileData?.moments
        console.log(this.moments);
  
        this.profileName = response.username;
        if (this.profileData) {
          this.technologies = this.profileData.technologies || [];
          this.levels = this.profileData.levels || [];
        }
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
      }
    });
  }  
}
