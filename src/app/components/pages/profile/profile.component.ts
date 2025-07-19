import { ChangeDetectorRef, Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import Cropper from 'cropperjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { environment } from '../../../environment/environments';

import { Profile } from '../../../models/Profiles';
import { ProfileService } from '../../../services/profile.service';
import { LoadingComponent } from "../../../loading/loading.component";
import { faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MomentService } from '../../../services/moment.service';
import { MessageService } from '../../../services/message.service';
import { FormsModule } from '@angular/forms';
import { Moment } from '../../../models/Moments';
import { FriendsService } from '../../../services/friends.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, CommonModule, LoadingComponent, FontAwesomeModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  @ViewChild('imageCropper', { static: false }) imageElement!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  profileData!: Profile;

  id = '';
  myId = 0
  externalProfileId = 0;
  profileName = '';

  moments: Moment[] = [];
  technologies: string[] = [];
  levels: string[] = [];

  selectedLevel = this.levels[0] || "jovemscript";

  newTech = '';

  techListEdit = false;
  editOn = false;
  isFriendDemanded = false;

  dateMoment: Date = new Date();
  imageUrl = '';
  cropper!: Cropper;
  endpoint = environment.endpoint;

  faEdit = faEdit;
  faTimes = faTimes;
  availableIcons: string[] = [];
  isTechValid = false;
  isFriendRequested = false;

  constructor(
    private service: ProfileService,
    private momentService: MomentService,
    private messagesService: MessageService,
    private friendsService: FriendsService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,

  ) { }

  ngOnInit() {
    this.fetchAvailableIcons();
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id')?.toString() || '';
      if (this.id != '') {
        this.externalProfileId = + this.id;
        this.getOthersProfiles();
      } else {
        this.getMyProfile();
      }

    });
    console.log("ID do perfil externo:", this.externalProfileId);
    console.log("amigo requisitado:", this.isFriendRequested)
  }

  fetchAvailableIcons() {
    this.service.getAvailableIcons().subscribe({
      next: (icons) => {
        this.availableIcons = icons;
      },
      error: (err) => {
        console.error("Erro ao carregar ícones disponíveis:", err);
      }
    });
  }

  validateTechnology(): void {
    if (this.technologies.includes(this.newTech)) {
      return;
    }
    const techFormatted = this.newTech.toLowerCase().trim();
    this.isTechValid = this.availableIcons.includes(techFormatted);
  }

  addTechnology(): void {
    this.technologies.push(this.newTech);
    this.techListEdit = true;
    this.newTech = "";
    this.isTechValid = false; // Reseta a validação após a adição
  }

  removeTechnology(tech: string): void {
    this.technologies = this.technologies.filter(t => t !== tech);
    this.techListEdit = true;
  }

  getMyProfile() {
    this.service.getMyProfile().subscribe((response) => {
      this.profileData = new Profile(response.profile);
    }, (err) => {
      console.error("Erro ao obter o perfil:", err);
    });
  }

  getOthersProfiles() {
    this.service.getProfileById(this.externalProfileId).subscribe((response) => {
      this.profileData = new Profile(response.profile);
      this.selectedLevel = this.levels.length > 0 ? this.levels[0] : "jovemscript";
    }, (err) => {
      console.error("Erro ao obter o perfil:", err);
    });
    this.service.getMyProfile().subscribe((response) => {
      const myProfile = new Profile(response.profile);
      this.myId = myProfile.userId;
        console.log("Meu ID:", this.myId);
    })
    this.verifySolicitation();
  }


  editChange() {
    this.editOn = true
  }

  removeHandler(id: number) {
    this.momentService.removeMoment(id).subscribe();

    this.messagesService.addMessage("Momento excluido com sucesso!");
    this.router.navigate(['/']);
  }

  async sendProfile() {
    if (!this.profileData || !this.profileData.userId) {
      return;
    }

    const formData = new FormData();

    formData.append('username', this.profileData.username);
    formData.append('bio', this.profileData.bio);
    formData.append('technologies', JSON.stringify(this.profileData.technologies));
    formData.append('friends', JSON.stringify(this.profileData.friends));
    formData.append('levels', JSON.stringify([this.selectedLevel, ...this.levels.filter(l => l !== this.selectedLevel)]));

    const croppedBlob = await this.getCroppedImageBlob();
    if (croppedBlob) {
      formData.append('photo', croppedBlob, 'profile.jpg');
    }

    this.service.postProfileById(this.profileData.userId, formData).subscribe(
      () => this.messagesService.addMessage("Perfil atualizado com sucesso!"),
      (err) => console.error("Erro ao atualizar perfil:", err)
    );
  }

verifySolicitation() {
  this.friendsService.friendsList().subscribe((response) => {
    const myFriends = response.myFriends.map((i: any) => new Profile(i));
    
    const isFriendList = myFriends.some(friend => friend.userId === this.externalProfileId);
    if (isFriendList) {
      this.isFriendRequested = true;
    }
    this.isFriendDemanded = this.profileData.friends.map(f => f.toString()).includes(this.myId.toString());   

  }, (err) => {
    console.error("Erro ao verificar solicitações de amizade:", err);
    this.messagesService.addMessage("Erro ao verificar solicitações de amizade.");
  });
}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageUrl = (e.target?.result as string) || '';

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

  getCroppedImageBlob(): Promise<Blob | null> {
    return new Promise((resolve) => {
      if (!this.cropper) return resolve(null);

      this.cropper.getCroppedCanvas().toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg');
    });
  }

  addFriend() {
    this.friendsService.addFriend(this.externalProfileId).subscribe(() => {
      this.messagesService.addMessage("Solicitação enviada com sucesso!");
    })
  }
}