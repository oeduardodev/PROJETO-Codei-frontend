import { CommonModule } from "@angular/common";
import { Component, effect, input, output } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { RouterLink } from "@angular/router";
import { Register } from "../../models/Register";

@Component({
  selector: "app-form-register",
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: "./form-register.component.html",
  styleUrls: ["./form-register.component.css"],
})
export class FormRegisterComponent {
  readonly submitted = output<Register>();
  readonly btnText = input.required<string>();
  readonly registerData = input<Register>({
    username: "",
    email: "",
    password: "",
  });

  readonly registerForm = new FormGroup({
    username: new FormControl("", Validators.required),
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", Validators.required),
  });

  constructor() {
    effect(() => {
      const data = this.registerData();
      this.registerForm.patchValue(
        {
          username: data.username ?? "",
          email: data.email ?? "",
          password: data.password ?? "",
        },
        { emitEvent: false },
      );
    });
  }

  submit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.submitted.emit(this.registerForm.getRawValue() as Register);
  }
}
