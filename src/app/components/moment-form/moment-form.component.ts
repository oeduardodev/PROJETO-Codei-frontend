import { CommonModule } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
  computed,
  effect,
  input,
  output,
  signal,
} from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import Cropper from "cropperjs";
import { Moment } from "../../models/Moments";
import { UsersService } from "../../services/users.service";

@Component({
  selector: "app-moment-form",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: "./moment-form.component.html",
  styleUrls: ["./moment-form.component.css"],
})
export class MomentFormComponent {
  readonly submitted = output<FormData>();
  readonly btnText = input.required<string>();
  readonly momentData = input<Moment | null>(null);
  @ViewChild("imageCropper", { static: false }) imageElement!: ElementRef;

  readonly imageUrl = signal("");
  readonly hasImage = computed(() => !!this.imageUrl());
  readonly isImageLoading = signal(false);
  readonly userId = signal<number | null>(null);

  cropper?: Cropper;

  readonly momentForm = new FormGroup({
    id: new FormControl(""),
    title: new FormControl("", Validators.required),
    description: new FormControl("", Validators.required),
    image: new FormControl<File | null>(null),
    user_id: new FormControl(""),
  });

  constructor(
    private usersService: UsersService,
    private cdr: ChangeDetectorRef,
  ) {
    this.getUserInfo();

    effect(() => {
      const moment = this.momentData();

      this.momentForm.patchValue(
        {
          id: moment?.id?.toString() ?? "",
          title: moment?.title ?? "",
          description: moment?.description ?? "",
        },
        { emitEvent: false },
      );
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.isImageLoading.set(true);

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      this.imageUrl.set((loadEvent.target?.result as string) || "");
      this.momentForm.patchValue({ image: file });
      this.isImageLoading.set(false);
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

  getUserInfo(): void {
    this.usersService.getUser().subscribe((data) => {
      this.userId.set(data.id);
      this.momentForm.patchValue({ user_id: data.id?.toString() ?? "" });
    });
  }

  get title() {
    return this.momentForm.get("title")!;
  }

  get description() {
    return this.momentForm.get("description")!;
  }

  async cropImage(): Promise<File | null> {
    return new Promise((resolve) => {
      if (!this.cropper) {
        resolve(null);
        return;
      }

      const canvas = this.cropper.getCroppedCanvas({
        width: 1080,
        height: 1080,
      });

      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(null);
          return;
        }

        const file = new File([blob], "cropped-image.jpg", {
          type: "image/jpeg",
        });

        this.momentForm.patchValue({ image: file });
        resolve(file);
      }, "image/jpeg");
    });
  }

  async submit(): Promise<void> {
    if (this.momentForm.invalid || !this.userId()) {
      return;
    }

    const croppedImageFile = await this.cropImage();

    if (!croppedImageFile) {
      return;
    }

    const formData = new FormData();
    formData.append("id", this.momentForm.get("id")?.value || "");
    formData.append("title", this.momentForm.get("title")?.value || "");
    formData.append(
      "description",
      this.momentForm.get("description")?.value || "",
    );
    formData.append("user_id", this.userId()!.toString());
    formData.append("image", croppedImageFile);

    this.submitted.emit(formData);
  }
}
