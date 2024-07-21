import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Register } from '../../Register';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './form-register.component.html',
  styleUrls: ['./form-register.component.css']
})
export class FormRegisterComponent implements OnInit {
  @Output() OnSubmit = new EventEmitter<Register>();
  @Input() btnText!: string;
  @Output() componenteRenderizado = new EventEmitter<string>();
  @Input() registerData: Register = { username: '', email: '', password: '' }; // Inicialização com valores padrão

  registerForm!: FormGroup;

  constructor() {
    // Emitir o nome do componente renderizado assim que ele for inicializado
    this.componenteRenderizado.emit('form-register');
  }

  ngOnInit(): void {
    // Verificação de segurança para garantir que registerData não seja indefinido
    if (!this.registerData) {
      this.registerData = { username: '', email: '', password: '' }; // Valores padrão
    }

    this.registerForm = new FormGroup({
      username: new FormControl(this.registerData.username, Validators.required),
      email: new FormControl(this.registerData.email, [Validators.required, Validators.email]),
      password: new FormControl(this.registerData.password, Validators.required),
    });
  }

  submit() {
    if (this.registerForm.invalid) {
      console.log('deu ruim');
      return;
    }
    console.log("deu bom");
    this.OnSubmit.emit(this.registerForm.value);
  }
}
