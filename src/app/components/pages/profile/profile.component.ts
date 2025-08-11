import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
  OnInit,
} from "@angular/core";
import Cropper from "cropperjs";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";

import { environment } from "../../../environment/environments";

import { Profile } from "../../../models/Profiles";
import { ProfileService } from "../../../services/profile.service";
import { LoadingComponent } from "../../../loading/loading.component";
import { faEdit, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { MomentService } from "../../../services/moment.service";
import { MessageService } from "../../../services/message.service";
import { FormsModule } from "@angular/forms";
import { Moment } from "../../../models/Moments";
import { FriendsService } from "../../../services/friends.service";
import { IconTech } from "../../../models/IconTechs";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    LoadingComponent,
    FontAwesomeModule,
    FormsModule,
  ],
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
  @ViewChild("imageCropper", { static: false }) imageElement!: ElementRef;
  @ViewChild("fileInput") fileInput!: ElementRef;

  triggerFileInput() {
    if (!this.editOn) {
      return;
    }
    this.fileInput.nativeElement.click();
  }

  profileData!: Profile;
  myProfile!: Profile;
  friendsList!: Profile[];
  id = "";
  externalProfileId = 0;
  profileName = "";

  isFriendDemanded = false;
  isFriendRequested = false;
  isFriends = false;

  moments: Moment[] = [];
  levels: string[] = [];
  selectedLevel = this.levels[0] || "jovemscript";

  technologies: IconTech[] = [];
  newTech = "";
  availableIcons: IconTech[] = [];
  isTechValid = false;
  techListEdit = false;

  editOn = false;
  dateMoment: Date = new Date();
  imageUrl = "";
  originalPhoto = "";
  cropper!: Cropper;

  endpoint = environment.endpoint;
  faEdit = faEdit;
  faTimes = faTimes;

  constructor(
    private service: ProfileService,
    private momentService: MomentService,
    private messagesService: MessageService,
    private friendsService: FriendsService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchAvailableIcons();

    this.service.getMyProfile().subscribe((response) => {
      const myProfile = new Profile(response.profile);
      this.myProfile = myProfile;
      this.route.paramMap.subscribe((params) => {
        this.id = params.get("id")?.toString() || "";
        if (this.id !== "" && this.id !== this.myProfile.userId.toString()) {
          this.externalProfileId = +this.id;
          this.getOthersProfiles();
        } else {
          this.externalProfileId = +"";
          this.getMyProfile();
        }
      });
    });
  }

  fetchAvailableIcons() {
    this.service.getAvailableIcons().subscribe((data) => {
      this.availableIcons = data;
    });
  }

  getFriendsList() {
    this.friendsService
      .friendsById(this.profileData.userId)
      .subscribe((response) => {
        this.friendsList = response.myFriends.map(
          (friend) => new Profile(friend)
        );
      });
  }

  validateTechnology(): void {
    const techFormatted = this.newTech.toLowerCase().trim();
    this.isTechValid = this.availableIcons.some(
      (icon) => icon.name.toLowerCase() === techFormatted
    );
  }

  addTechnology(): void {
    if (!this.profileData.technologies.includes(this.newTech)) {
      this.profileData.technologies.push(this.newTech);
      this.techListEdit = true;
      this.newTech = "";
      this.isTechValid = false;
    }
  }

  removeTechnology(tech: string): void {
    this.profileData.technologies = this.profileData.technologies.filter(
      (t) => t !== tech
    );
    this.techListEdit = true;
  }

  getMyProfile() {
    this.service.getMyProfile().subscribe(
      (response) => {
        this.profileData = new Profile(response.profile);
        this.originalPhoto = this.profileData.photo; // ← aqui
        this.verifySolicitation();
        this.getFriendsList();
      },
      (err) => {
        console.error("Erro ao obter o perfil:", err);
      }
    );
  }

  getOthersProfiles() {
    this.service.getProfileById(this.externalProfileId).subscribe(
      (response) => {
        this.profileData = new Profile(response.profile);
        this.selectedLevel =
          this.levels.length > 0 ? this.levels[0] : "jovemscript";
        this.verifySolicitation();
        this.getFriendsList();
      },
      (err) => {
        console.error("Erro ao obter o perfil:", err);
      }
    );
  }

  editChange() {
    this.editOn = true;
  }

  removeHandler(id: number) {
    this.momentService.removeMoment(id).subscribe();

    this.messagesService.addMessage("Momento excluido com sucesso!");
    this.router.navigate(["/"]);
  }

  async sendProfile() {
    if (!this.profileData || !this.profileData.userId) {
      return;
    }

    const formData = new FormData();

    formData.append("username", this.profileData.username);
    formData.append("bio", this.profileData.bio);
    formData.append(
      "technologies",
      JSON.stringify(this.profileData.technologies)
    );
    formData.append("friends", JSON.stringify(this.profileData.friends));
    formData.append(
      "levels",
      JSON.stringify([
        this.selectedLevel,
        ...this.levels.filter((l) => l !== this.selectedLevel),
      ])
    );

    const croppedBlob = await this.getCroppedImageBlob();
    if (croppedBlob) {
      formData.append("photo", croppedBlob, "profile.jpg");
    }

    this.service.postProfileById(this.profileData.userId, formData).subscribe(
      () => this.messagesService.addMessage("Perfil atualizado com sucesso!"),
      (err) => console.error("Erro ao atualizar perfil:", err)
    );
  }

  verifySolicitation() {
    const myFriendIds = this.myProfile.friends;
    if (myFriendIds.includes(this.externalProfileId)) {
      this.isFriendRequested = true;
    } else {
      this.isFriendRequested = false;
    }
    this.friendsService.friendsList().subscribe((response) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const myFriendIds = response.myFriends.map((f: any) => f.user_id);

      // Verifica se o perfil que estou vendo está entre meus amigos
      this.isFriends = myFriendIds.includes(this.externalProfileId);

      // Verifica se eu estou na lista de amigos do perfil que estou vendo
      this.isFriendDemanded = this.profileData.friends.includes(
        this.myProfile.userId
      );
    });
  }

  removeFriend() {
    this.friendsService.removeFriend(this.externalProfileId).subscribe(
      () => {
        this.messagesService.addMessage("Amizade removida com sucesso!");
        this.isFriends = false;
      },
      (err) => {
        console.error("Erro ao remover amizade:", err);
        this.messagesService.addMessage("Erro ao remover amizade.");
      }
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target?.result as string;

        // Atualiza o preview imediato na view
        this.imageUrl = base64Image;
        this.profileData.photo = base64Image;

        this.cdr.detectChanges();
        this.initializeCropper();
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  initializeCropper() {
    if (!this.imageElement?.nativeElement) {
      console.error("Image element not found.");
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
      }, "image/jpeg");
    });
  }

  cancelImageSelection(): void {
    this.imageUrl = "";
    this.profileData.photo = this.originalPhoto;
    this.cdr.detectChanges();
  }

  addFriend() {
    this.friendsService.addFriend(this.externalProfileId).subscribe(() => {
      this.messagesService.addMessage("Solicitação enviada com sucesso!");
      this.isFriends = true;
    });
  }
}
