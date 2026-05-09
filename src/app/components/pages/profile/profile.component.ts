import { CommonModule } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faEdit, faTimes } from "@fortawesome/free-solid-svg-icons";
import Cropper from "cropperjs";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { LoadingComponent } from "../../../loading/loading.component";
import { ImageFallbackDirective } from "../../../directives/image-fallback.directive";
import { environment } from "../../../environment/environments";
import { IconTech } from "../../../models/IconTechs";
import { Moment } from "../../../models/Moments";
import { Profile } from "../../../models/Profiles";
import { FriendsService } from "../../../services/friends.service";
import { MessageService } from "../../../services/message.service";
import { MomentService } from "../../../services/moment.service";
import { ProfileService } from "../../../services/profile.service";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    LoadingComponent,
    FontAwesomeModule,
    FormsModule,
    ImageFallbackDirective,
  ],
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
  @ViewChild("imageCropper", { static: false }) imageElement!: ElementRef;
  @ViewChild("fileInput") fileInput!: ElementRef;

  profileData?: Profile;
  myProfile?: Profile;
  friendsList: Profile[] = [];
  id = "";
  externalProfileId = 0;

  isFriendDemanded = false;
  isFriendRequested = false;
  isFriends = false;

  levels: string[] = [];
  selectedLevel = "jovemscript";
  newTech = "";
  availableIcons: IconTech[] = [];
  isTechValid = false;
  techListEdit = false;

  editOn = false;
  imageUrl = "";
  originalPhoto = "";
  cropper?: Cropper;

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
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.fetchAvailableIcons();

    this.service.getMyProfile().subscribe((response) => {
      this.myProfile = new Profile(response.profile);
      this.route.paramMap.subscribe((params) => {
        this.id = params.get("id")?.toString() || "";

        if (this.id && this.id !== this.myProfile?.userId.toString()) {
          this.externalProfileId = Number(this.id);
          this.getOthersProfiles();
          return;
        }

        this.externalProfileId = 0;
        this.getMyProfile();
      });
    });
  }

  get repeatedTechnologies(): string[] {
    if (!this.profileData?.technologies?.length) {
      return [];
    }

    return [...this.profileData.technologies, ...this.profileData.technologies];
  }

  triggerFileInput(): void {
    if (!this.editOn) {
      return;
    }

    this.fileInput.nativeElement.click();
  }

  fetchAvailableIcons(): void {
    this.service.getAvailableIcons().subscribe((data) => {
      this.availableIcons = data;
    });
  }

  getFriendsList(): void {
    if (!this.profileData) {
      this.friendsList = [];
      return;
    }

    this.friendsService.friendsById(this.profileData.userId).subscribe((response) => {
      this.friendsList = response.myFriends.map((friend) => new Profile(friend));
    });
  }

  validateTechnology(): void {
    const techFormatted = this.newTech.toLowerCase().trim();
    this.isTechValid = this.availableIcons.some(
      (icon) => icon.name.toLowerCase() === techFormatted,
    );
  }

  addTechnology(): void {
    if (!this.profileData || this.profileData.technologies.includes(this.newTech)) {
      return;
    }

    this.profileData.technologies.push(this.newTech);
    this.techListEdit = true;
    this.newTech = "";
    this.isTechValid = false;
  }

  removeTechnology(tech: string): void {
    if (!this.profileData) {
      return;
    }

    this.profileData.technologies = this.profileData.technologies.filter(
      (item) => item !== tech,
    );
    this.techListEdit = true;
  }

  getMyProfile(): void {
    this.service.getMyProfile().subscribe((response) => {
      this.profileData = new Profile(response.profile);
      this.originalPhoto = this.profileData.photo;
      this.selectedLevel = this.profileData.levels[0] || "jovemscript";
      this.verifySolicitation();
      this.getFriendsList();
    });
  }

  getOthersProfiles(): void {
    this.service.getProfileById(this.externalProfileId).subscribe((response) => {
      this.profileData = new Profile(response.profile);
      this.selectedLevel = this.profileData.levels[0] || "jovemscript";
      this.verifySolicitation();
      this.getFriendsList();
    });
  }

  removeHandler(id: number): void {
    this.momentService.removeMoment(id).subscribe();
    this.messagesService.addMessage("Momento excluido com sucesso!");
    void this.router.navigate(["/"]);
  }

  async sendProfile(): Promise<void> {
    if (!this.profileData?.userId) {
      return;
    }

    const formData = new FormData();
    formData.append("username", this.profileData.username);
    formData.append("bio", this.profileData.bio);
    formData.append("technologies", JSON.stringify(this.profileData.technologies));
    formData.append("friends", JSON.stringify(this.profileData.friends));
    formData.append(
      "levels",
      JSON.stringify([
        this.selectedLevel,
        ...this.levels.filter((level) => level !== this.selectedLevel),
      ]),
    );

    const croppedBlob = await this.getCroppedImageBlob();
    if (croppedBlob) {
      formData.append("photo", croppedBlob, "profile.jpg");
    }

    this.service.postProfileById(this.profileData.userId, formData).subscribe({
      next: () => {
        this.messagesService.addMessage("Perfil atualizado com sucesso!");
      },
      error: () => {
        this.messagesService.addMessage("Erro ao atualizar perfil.");
      },
    });
  }

  verifySolicitation(): void {
    if (!this.myProfile || !this.profileData) {
      return;
    }

    this.isFriendRequested = this.myProfile.friends.includes(this.externalProfileId);

    this.friendsService.friendsList().subscribe((response) => {
      const myFriendIds = response.myFriends.map((friend: any) => friend.user_id);
      this.isFriends = myFriendIds.includes(this.externalProfileId);
      this.isFriendDemanded = this.profileData?.friends.includes(this.myProfile!.userId) ?? false;
    });
  }

  removeFriend(): void {
    this.friendsService.removeFriend(this.externalProfileId).subscribe({
      next: () => {
        this.messagesService.addMessage("Amizade removida com sucesso!");
        this.isFriends = false;
      },
      error: () => {
        this.messagesService.addMessage("Erro ao remover amizade.");
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file || !this.profileData) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const base64Image = loadEvent.target?.result as string;
      this.imageUrl = base64Image;
      this.profileData!.photo = base64Image;
      this.cdr.detectChanges();
      this.initializeCropper();
    };
    reader.readAsDataURL(file);
  }

  initializeCropper(): void {
    if (!this.imageElement?.nativeElement) {
      return;
    }

    this.cropper?.destroy();
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
      if (!this.cropper) {
        resolve(null);
        return;
      }

      this.cropper.getCroppedCanvas().toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg");
    });
  }

  cancelImageSelection(): void {
    if (!this.profileData) {
      return;
    }

    this.imageUrl = "";
    this.profileData.photo = this.originalPhoto;
    this.cdr.detectChanges();
  }

  addFriend(): void {
    this.friendsService.addFriend(this.externalProfileId).subscribe(() => {
      this.messagesService.addMessage("Solicitação enviada com sucesso!");
      this.isFriends = true;
    });
  }
}
