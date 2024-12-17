import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { environment } from '../../../environment/environments';

import { Profile } from '../../../models/Profiles';
import { ProfileService } from '../../../services/profile.service';
import { AuthorizationService } from '../../../services/auth.service';
import { LoadingComponent } from "../../../loading/loading.component";
import { faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MomentService } from '../../../services/moment.service';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, CommonModule, LoadingComponent, FontAwesomeModule],
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
  editOn: boolean = false;
  dateMoment: Date = new Date();

  faEdit = faEdit;
  faTimes = faTimes;
  
  constructor(
    private service: ProfileService,
    private authService: AuthorizationService,
    private route: ActivatedRoute,
    private momentService: MomentService,
    private messagesService: MessageService,
    private router: Router,
    

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
        this.profileData = response.profile;
        
        // Verifica se moments é um array; se for um objeto, transforma em um array com um elemento
        this.moments = this.profileData?.moments
  
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
        this.profileData = response.profile;
        
        // Verifica se moments é um array; se for um objeto, transforma em um array com um elemento
        this.moments = this.profileData?.moments
        this.profileName = response.username;
        if (this.profileData) {
          this.technologies = this.profileData.technologies || [];
          this.levels = this.profileData.levels || [];
        }
      }
    );
  }  
  

  editChange(){
    this.editOn = true
  }

    
  removeHandler(id: number) {
   this.momentService.removeMoment(id).subscribe();

    this.messagesService.addMessage("Momento excluido com sucesso!");
    this.router.navigate(['/']);
  }

}
