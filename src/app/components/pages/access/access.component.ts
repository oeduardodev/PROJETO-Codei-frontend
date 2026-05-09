import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { FormAccessComponent } from "../../form-access/form-access.component";
import { Register } from "../../../models/Register";
import { AuthorizationService } from "../../../services/auth.service";
import { MessageService } from "../../../services/message.service";
import { UsersService } from "../../../services/users.service";

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
  private token = localStorage.getItem("authToken") || "";

  constructor(
    private service: UsersService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthorizationService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params["token"];

      if (!token) {
        return;
      }

      this.authService.setToken(token);
      this.messageService.addMessage("Login via Google bem-sucedido");
      void this.router.navigate(["/"]);
    });
  }

  createHandler(register: Register): void {
    const formData = new FormData();
    formData.append("username", register.username);
    formData.append("password", register.password);

    this.service.login(formData).subscribe({
      next: (response) => {
        if (!response.token) {
          this.messageService.addMessage("Não foi possível concluir o login agora.");
          return;
        }

        localStorage.setItem("authToken", response.token);
        this.token = response.token;
        this.messageService.addMessage("Bem-vindo de volta capivara!");
        void this.router.navigate(["/"]);
      },
      error: () => {
        this.messageService.addMessage("Erro ao entrar na sua conta.");
      },
    });
  }
}
