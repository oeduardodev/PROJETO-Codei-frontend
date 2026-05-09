import { CommonModule } from "@angular/common";
import { Component, effect, input, output } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { Register } from "../../models/Register";
import { AuthorizationService } from "../../services/auth.service";
import { MessageService } from "../../services/message.service";

@Component({
  selector: "app-form-access",
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: "./form-access.component.html",
  styleUrls: ["./form-access.component.css"],
})
export class FormAccessComponent {
  readonly submitted = output<Register>();
  readonly registerData = input<Register>({
    username: "",
    email: "",
    password: "",
  });
  readonly btnText = input.required<string>();

  readonly loginForm = new FormGroup({
    username: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required),
  });

  constructor(
    private route: ActivatedRoute,
    private authService: AuthorizationService,
    private router: Router,
    private messageService: MessageService,
  ) {
    effect(() => {
      const data = this.registerData();
      this.loginForm.patchValue(
        {
          username: data.username ?? "",
          password: data.password ?? "",
        },
        { emitEvent: false },
      );
    });

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

  submit(): void {
    this.submitted.emit(this.loginForm.getRawValue() as Register);
  }

  showGoogleUnavailableMessage(event: MouseEvent): void {
    event.preventDefault();
    this.messageService.addMessage("Função ainda não disponível para você.");
  }
}
