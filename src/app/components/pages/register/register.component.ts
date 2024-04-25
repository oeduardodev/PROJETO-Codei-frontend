import { Component } from '@angular/core';
import { FormAccessComponent } from "../../form-access/form-access.component";
import { FormRegisterComponent } from "../../form-register/form-register.component";

@Component({
    selector: 'app-register',
    standalone: true,
    templateUrl: './register.component.html',
    styleUrl: './register.component.css',
    imports: [FormAccessComponent, FormRegisterComponent]
})
export class RegisterComponent {
  btnText = "Cadastrar";

}
