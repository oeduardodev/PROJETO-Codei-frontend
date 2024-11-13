import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Register } from '../../models/Register';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-access',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],  
  templateUrl: './form-access.component.html',
  styleUrls: ['./form-access.component.css']
})
export class FormAccessComponent implements OnInit {

  @Output() OnSubmit = new EventEmitter<Register>();
  @Output() componenteRenderizado = new EventEmitter<string>();
  @Input() registerData: Register = { username: '', email: '', password: '' }; // Inicialização com valores padrão
  @Input() btnText!: string;

  loginForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.componenteRenderizado.emit('form-login');

    // Initialize form group
    this.loginForm = new FormGroup({
      username: new FormControl(this.registerData.username, Validators.required),
      password: new FormControl(this.registerData.password, Validators.required),
    });
  }

  submit() {
    this.OnSubmit.emit(this.loginForm.value);
  }
}
