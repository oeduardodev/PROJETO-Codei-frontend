import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../models/Profiles';

@Component({
  selector: 'app-aside-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './aside-profile.component.html',
  styleUrls: ['./aside-profile.component.css']
})
export class AsideProfileComponent implements OnInit {
  userProfile: Profile | null = null;
  perfilCompleted = false

  constructor(
    private profileService: ProfileService,
  ) { }

  ngOnInit() {  
    this.getUserData()
  }

  getUserData() {
    this.profileService.getMyProfile().subscribe((data) => {
      this.userProfile = new Profile(data.profile);
  
      if (
        this.userProfile.photo &&
        this.userProfile.technologies &&
        this.userProfile.bio
      ) {
        console.log(this.userProfile.photo, this.userProfile.technologies, this.userProfile.bio);
        console.log('Perfil completo');
  
        this.perfilCompleted = true;
      }
    });
  }
  
}

