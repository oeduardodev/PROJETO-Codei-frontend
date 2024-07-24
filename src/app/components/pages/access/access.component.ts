import { Component, EventEmitter, Output } from '@angular/core';
import { FormAccessComponent } from "../../form-access/form-access.component";
import { FormRegisterComponent } from "../../form-register/form-register.component";
import { UsersService } from '../../../services/users.service';
import { MessageService } from '../../../services/message.service';
import { Router } from '@angular/router';
import { Register } from '../../../Register';

@Component({
    selector: 'app-access',
    standalone: true,
    templateUrl: './access.component.html',
    styleUrl: './access.component.css',
    imports: [FormAccessComponent, FormRegisterComponent]
})
export class AccessComponent {
    btnText = "Entrar";

    constructor(
        private service: UsersService,
        private messageService: MessageService,
        private router: Router
      ) { }

    async createHandler(register: Register) {
        const formData = new FormData();
  
        formData.append('username', register.username);
        formData.append('password', register.password);
  
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

