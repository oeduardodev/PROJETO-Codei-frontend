import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { environment } from '../../../environment/environments';

import { Profile } from '../../../models/Profiles';
import { ProfileService } from '../../../services/profile.service';
import { AuthorizationService } from '../../../services/auth.service';
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
  externalProfileId: number = 0;
  endpoint = environment.endpoint;

  constructor(
    private service: ProfileService,
    private authService: AuthorizationService,
    private route: ActivatedRoute

  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.externalProfileId =+ id; 
        this.getOthersProfiles(); 
      } else {
        this.getMyProfile();
      }

    });
  }

  getMyProfile() {
    this.service.getMyProfile().subscribe({
      next: (response: any) => {
        console.log(response);
        this.profileData = response.profile;
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

  getOthersProfiles() {
    this.service.getProfileById(this.externalProfileId).subscribe(
      (response)=>{
        console.log(response);
        this.profileData = response.profile;
        console.log(this.profileData)
        
        // Verifica se moments é um array; se for um objeto, transforma em um array com um elemento
        this.moments = this.profileData?.moments
        console.log(this.moments);
  
        this.profileName = response.username;
        if (this.profileData) {
          this.technologies = this.profileData.technologies || [];
          this.levels = this.profileData.levels || [];
        }
      }
    );
  }  
}
