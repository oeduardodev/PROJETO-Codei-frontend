import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';

import { FormAccessComponent } from "../../form-access/form-access.component";
import { UsersService } from '../../../services/users.service';
import { MessageService } from '../../../services/message.service';
import { Register } from '../../../models/Register';

@Component({
  selector: 'app-access',
  standalone: true,
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.css'],
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule, FormAccessComponent]
})
export class AccessComponent {
  btnText = "Entrar";
  private token: string = localStorage.getItem('authToken') || '';

  constructor(
    private service: UsersService,
    private messageService: MessageService,
    private router: Router
  ) { }

  createHandler(register: Register) {
    const formData = new FormData();
    formData.append('username', register.username);
    formData.append('password', register.password);

    this.service.login(formData).subscribe({
      next: (response: any) => {
        if (response.token) {
          localStorage.setItem('authToken', response.token.token); 
          this.token = response.token.token; 
          this.messageService.addMessage("Usuário adicionado com sucesso!");
          this.router.navigate(['/']);
        } else {
          console.error("Token não encontrado na resposta");
          this.messageService.addMessage("Erro ao adicionar usuário: Token não encontrado.");
        }
      },
      error: (error) => {
        console.error("Erro ao adicionar usuário:", error);
        this.messageService.addMessage("Erro ao adicionar usuário.");
      },
    });
  }
}
