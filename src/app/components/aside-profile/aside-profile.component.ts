import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { AuthorizationService } from '../../services/auth.service';
import { User } from '../../models/User';
import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../models/Profiles';

@Component({
  selector: 'app-aside-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './aside-profile.component.html',
  styleUrls: ['./aside-profile.component.css']
})
export class AsideProfileComponent {
  userLogged: any;
  userProfile:any;
  perfilCompleted: boolean = false
  constructor(
    private profileService: ProfileService,
  ) { }

  ngOnInit() {
    this.getUserData()
  }
  getUserData() {
    this.profileService.getMyProfile().subscribe((profile: Profile) => {
      this.userProfile = profile
      console.log(this.userProfile)
    })

    if(this.userProfile.photo && this.userProfile.technologies && this.userProfile.bio){
      this.perfilCompleted = true
    }
  }
}

