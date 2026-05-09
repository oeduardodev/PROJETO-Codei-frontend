import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { FormRegisterComponent } from "../../form-register/form-register.component";
import { Register } from "../../../models/Register";
import { MessageService } from "../../../services/message.service";
import { UsersService } from "../../../services/users.service";

@Component({
  selector: "app-register",
  standalone: true,
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
  imports: [FormRegisterComponent],
})
export class RegisterComponent {
  btnText = "Cadastrar";

  constructor(
    private service: UsersService,
    private messageService: MessageService,
    private router: Router,
  ) {}

  createHandler(register: Register): void {
    const formData = new FormData();
    formData.append("username", register.username);
    formData.append("password", register.password);

    if (register.email) {
      formData.append("email", register.email);
    }

    if (register.photo) {
      formData.append("photo", register.photo);
    }

    this.service.register(formData).subscribe({
      next: () => {
        this.messageService.addMessage("Usuário adicionado com sucesso!");
        void this.router.navigate(["/"]);
      },
      error: () => {
        this.messageService.addMessage("Erro ao adicionar usuário.");
      },
    });
  }
}
