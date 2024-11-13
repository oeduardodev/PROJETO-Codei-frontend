import { Component } from '@angular/core';
import { FormRegisterComponent } from "../../form-register/form-register.component";
import { UsersService } from '../../../services/users.service';
import { MessageService } from '../../../services/message.service';
import { Router } from '@angular/router';
import { Register } from '../../../models/Register';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormRegisterComponent]
})
export class RegisterComponent {
  btnText = "Cadastrar";

  constructor(
    private service: UsersService,
    private messageService: MessageService,
    private router: Router
  ) { }

  async createHandler(register: Register) {
    const formData = new FormData();

    formData.append('username', register.username);
    formData.append('password', register.password);

    if (register.email) {
      formData.append('email', register.email);
    }

    await this.service.register(formData).subscribe(
      () => {
        this.messageService.addMessage("Usuário adicionado com sucesso!");
        this.router.navigate(['/']);
      },
      (error) => {
        console.error("Erro ao adicionar usuário: ", error);
        this.messageService.addMessage("Erro ao adicionar usuário.");
      }
    );
  }
}
