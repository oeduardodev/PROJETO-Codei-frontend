import { Component, EventEmitter, Input, Output, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { Register } from "../../models/Register";
import { CommonModule } from "@angular/common";
import { AuthorizationService } from "../../services/auth.service";
import { MessageService } from "../../services/message.service";

@Component({
  selector: "app-form-access",
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: "./form-access.component.html",
  styleUrls: ["./form-access.component.css"],
})
export class FormAccessComponent implements OnInit {
  @Output() OnSubmit = new EventEmitter<Register>();
  @Output() componenteRenderizado = new EventEmitter<string>();
  @Input() registerData: Register = { username: "", email: "", password: "" }; // Inicialização com valores padrão
  @Input() btnText!: string;

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthorizationService,
    private router: Router,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.componenteRenderizado.emit("form-login");

    // Initialize form group
    this.loginForm = new FormGroup({
      username: new FormControl(
        this.registerData.username,
        Validators.required,
      ),
      password: new FormControl(
        this.registerData.password,
        Validators.required,
      ),
    });
    this.route.queryParams.subscribe((params) => {
      const token = params["token"];
      if (token) {
        this.authService.setToken(token);
        this.messageService.addMessage("Login via Google bem-sucedido");
        this.router.navigate(["/"]);
      }
    });
  }

  submit() {
    this.OnSubmit.emit(this.loginForm.value);
  }

  showGoogleUnavailableMessage(event: MouseEvent) {
    event.preventDefault();
    this.messageService.addMessage("Função ainda não disponível para você.");
  }
}
