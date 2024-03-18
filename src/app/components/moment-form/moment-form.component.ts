import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Moment } from '../../Moments';


@Component({
  selector: 'app-moment-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './moment-form.component.html',
  styleUrl: './moment-form.component.css'
})

export class MomentFormComponent implements OnInit {

  @Output() OnSubmit = new EventEmitter<Moment>()
  @Input() btnText!: string;

  momentForm!: FormGroup;

  ngOnInit(): void {
    this.momentForm = new FormGroup({
      id: new FormControl(''),
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      image: new FormControl(''),
    });
  }

  get title() {
    return this.momentForm.get('title')!;
  }

  get description() {
    return this.momentForm.get('description')!;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.momentForm.patchValue({ image: file })
  }
  submit() {
    if (this.momentForm.invalid) {
      console.log('deu ruim');
      return;
    }

    this.OnSubmit.emit(this.momentForm.value)

  }
}

