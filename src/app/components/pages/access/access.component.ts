import { Component, EventEmitter, Output } from '@angular/core';
import { FormAccessComponent } from "../../form-access/form-access.component";
import { FormRegisterComponent } from "../../form-register/form-register.component";

@Component({
    selector: 'app-access',
    standalone: true,
    templateUrl: './access.component.html',
    styleUrl: './access.component.css',
    imports: [FormAccessComponent, FormRegisterComponent]
})
export class AccessComponent {
    btnText = "Entrar";
}
