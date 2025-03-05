import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import Cropper from 'cropperjs';
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
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, CommonModule, LoadingComponent, FontAwesomeModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent {
  @ViewChild('imageCropper', { static: false }) imageElement!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  profileData: Profile | null = null;

  id: any = '';

  externalProfileId: number = 0;
  profileName: string[] = [];

  moments: any;
  technologies: any[] = [];
  levels: any[] = [];

  selectedLevel = this.levels[0] || "jovemscript";

  newTech: string = '';

  techListEdit: boolean = false;
  editOn: boolean = false;

  dateMoment: Date = new Date();
  imageUrl: any;
  cropper!: Cropper;
  endpoint = environment.endpoint;

  faEdit = faEdit;
  faTimes = faTimes;

  constructor(
    private service: ProfileService,
    private authService: AuthorizationService,
    private route: ActivatedRoute,
    private momentService: MomentService,
    private messagesService: MessageService,
    private router: Router,
    private cdr: ChangeDetectorRef,

  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.externalProfileId = + this.id;
        this.getOthersProfiles();
      } else {
        this.getMyProfile();
      }

    });
  }

  addTechnology(): void {
    this.technologies.push(this.newTech)
    this.techListEdit = true;
    this.newTech = "";
  }

  getMyProfile() {
    this.service.getMyProfile().subscribe({
      next: (response: any) => {
        this.profileData = response.profile;
        this.moments = this.profileData?.moments;

        if (this.profileData) {
          console.log(this.profileData);

          this.technologies = this.profileData.technologies || [];
          this.levels = this.profileData.levels || [];

          // ✅ Aguarde os dados antes de definir selectedLevel
          this.selectedLevel = this.levels.length > 0 ? this.levels[0] : "jovemscript";
        }
      },
      error: (err) => {
        console.error("Erro ao obter o perfil:", err);
      }
    });
  }

  getOthersProfiles() {
    this.service.getProfileById(this.externalProfileId).subscribe((response) => {
      this.profileData = response.profile;
      this.moments = this.profileData?.moments;

      if (this.profileData) {

        this.technologies = this.profileData.technologies || [];
        this.levels = this.profileData.levels || [];

        this.selectedLevel = this.levels.length > 0 ? this.levels[0] : "jovemscript";
      }
    });
  }


  editChange() {
    this.editOn = true
  }

  removeHandler(id: number) {
    this.momentService.removeMoment(id).subscribe();

    this.messagesService.addMessage("Momento excluido com sucesso!");
    this.router.navigate(['/']);
  }

  sendProfile() {
    if (this.profileData) {
      // Reorganiza os levels colocando o selecionado como o primeiro
      this.levels = [this.selectedLevel, ...this.levels.filter(level => level !== this.selectedLevel)];

      const updatedProfile = {
        user_id: this.profileData.user_id,
        photo: this.profileData.photo,
        username: this.profileData.username,
        bio: this.profileData.bio,
        technologies: this.technologies,
        friends: this.profileData.friends,
        levels: this.levels,
        moments: this.moments
      };

      this.service.postProfileById(this.profileData.user_id, updatedProfile).subscribe({
        next: () => {
          console.log("Perfil atualizado com sucesso!");
        },
        error: (err) => {
          console.error("Erro ao atualizar perfil:", err);
        }
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageUrl = e.target?.result;

        this.cdr.detectChanges();
        this.initializeCropper();

      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  initializeCropper() {
    if (!this.imageElement?.nativeElement) {
      console.error('Image element not found.');
      return;
    }

    this.cropper = new Cropper(this.imageElement.nativeElement, {
      aspectRatio: 1,
      viewMode: 1,
      autoCropArea: 1,
      movable: true,
      zoomable: true,
      scalable: false,
      cropBoxResizable: true,
    });
  }

}
