import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule, Router, ActivatedRoute } from "@angular/router";

import { FormAccessComponent } from "../../form-access/form-access.component";
import { UsersService } from "../../../services/users.service";
import { MessageService } from "../../../services/message.service";
import { Register } from "../../../models/Register";
import { AuthorizationService } from "../../../services/auth.service";
import { environment } from "../../../environment/environments";

@Component({
  selector: "app-access",
  standalone: true,
  templateUrl: "./access.component.html",
  styleUrls: ["./access.component.css"],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    FormAccessComponent,
  ],
})
export class AccessComponent implements OnInit {
  btnText = "Entrar";
  private token: string = localStorage.getItem("authToken") || "";
  googleUrl: string = `${environment.endpoint}/api/auth/google`;

  constructor(
    private service: UsersService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthorizationService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      if (token) {
        this.authService.setToken(token);
        this.messageService.addMessage('Login via Google bem-sucedido');
        this.router.navigate(['/']);
      }
    });
  }

  createHandler(register: Register) {
    const formData = new FormData();
    formData.append("username", register.username);
    formData.append("password", register.password);

    this.service.login(formData).subscribe({
      next: (response) => {
        if (response.token) {
          localStorage.setItem("authToken", response.token);
          this.token = response.token;
          this.messageService.addMessage("Bem-vindo de volta capivara!");
          this.router.navigate(["/"]);
        } else {
          console.error("Token não encontrado na resposta");
          this.messageService.addMessage(
            "Erro ao adicionar usuário: Token não encontrado."
          );
        }
      },
      error: (error) => {
        console.error("Erro ao adicionar usuário:", error);
        this.messageService.addMessage("Erro ao adicionar usuário.");
      },
    });
  }
}
