import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Moment } from '../../models/Moments';
import { UsersService } from '../../services/users.service';
import Cropper from 'cropperjs';
import { AuthorizationService } from '../../services/auth.service';

@Component({
  selector: 'app-moment-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './moment-form.component.html',
  styleUrls: ['./moment-form.component.css']
})
export class MomentFormComponent implements OnInit {
  @Output() OnSubmit = new EventEmitter<FormData>();
  @Input() btnText!: string;
  @Input() momentData!: Moment;
  @ViewChild('imageCropper', { static: false }) imageElement!: ElementRef;

  imageUrl = '';
  cropper!: Cropper;
  croppedImage: string | null = null;

  momentForm!: FormGroup;
  userId?: number;

  token: string = localStorage.getItem('authToken') || '';

  constructor(
    private usersService: UsersService,
    private cdr: ChangeDetectorRef,
    private authService: AuthorizationService
  ) { }

  ngOnInit(): void {
    this.getUserInfo();
    this.momentForm = new FormGroup({
      id: new FormControl(this.momentData ? this.momentData.id : ''),
      title: new FormControl(this.momentData ? this.momentData.title : '', [Validators.required]),
      description: new FormControl(this.momentData ? this.momentData.description : '', [Validators.required]),
      image: new FormControl(''),
      user_id: new FormControl('')
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

  initializeCropper(): void {
  
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

  getUserInfo() {
    const headers = this.authService.getAuthorizationHeaders(); // Obtenha os cabeçalhos com o token

    this.usersService.getUser(headers).subscribe(
      (data) => {
        this.userId = data.id;
        this.momentForm.patchValue({ user_id: this.userId });
      },
      (error) => {
        console.error('Error fetching user info', error);
      }
    );
  }
  
  get title() {
    return this.momentForm.get('title')!;
  }

  get description() {
    return this.momentForm.get('description')!;
  }
  async cropImage(): Promise<File | null> {
    return new Promise((resolve) => {
      if (this.cropper) {
        const canvas = this.cropper.getCroppedCanvas({
          width: 1080,
          height: 1080,
        });
  
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
            this.momentForm.patchValue({ image: file });
            resolve(file);
          } else {
            console.error('Erro ao converter canvas para blob.');
            resolve(null);
          }
        }, 'image/jpeg');
      } else {
        console.error('Cropper não foi inicializado.');
        resolve(null);
      }
    });
  }
  
  async submit() {
    const croppedImageFile = await this.cropImage();
    if (!croppedImageFile) {
      console.error('Erro ao preparar a imagem cortada.');
      return;
    }

    if (this.momentForm.invalid) {
      console.error('O formulário está inválido.');
      return;
    }
  
    if (this.userId === undefined) {
      console.error('User ID não foi definido.');
      return;
    }
  
    const formData = new FormData();
    formData.append('id', this.momentForm.get('id')!.value || '');
    formData.append('title', this.momentForm.get('title')!.value);
    formData.append('description', this.momentForm.get('description')!.value);
    formData.append('user_id', this.userId.toString());

    if (croppedImageFile) {
      formData.append('image', croppedImageFile);
    } else {
      console.error('Imagem cortada não está presente no FormData.');
    }

    this.OnSubmit.emit(formData);
  }
}