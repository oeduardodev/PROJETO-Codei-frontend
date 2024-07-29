import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Moment } from '../../Moments';
import { HttpClient } from '@angular/common/http';
import { UsersService } from '../../services/users.service';

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

  momentForm!: FormGroup;
  userId?: number;

  token: string = localStorage.getItem('authToken') || '';

  constructor(
    private http: HttpClient,
    private usersService: UsersService
  ) {}

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
  
  getUserInfo() {
    this.usersService.user(this.token).subscribe(
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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.momentForm.patchValue({ image: file });
  }

  submit() {
    if (this.momentForm.invalid) {
      return;
    }

    if (this.userId === undefined) {
      console.error('User ID is not set');
      return;
    }

    const formData = new FormData();
    formData.append('id', this.momentForm.get('id')!.value);
    formData.append('title', this.momentForm.get('title')!.value);
    formData.append('description', this.momentForm.get('description')!.value);
    formData.append('user_id', this.userId.toString());

    if (this.momentForm.get('image')!.value) {
      formData.append('image', this.momentForm.get('image')!.value);
    }

    this.OnSubmit.emit(formData);
  }
}
