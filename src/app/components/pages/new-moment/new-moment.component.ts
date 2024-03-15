import { Component } from '@angular/core';
import { MomentFormComponent } from "../../moment-form/moment-form.component";

@Component({
    selector: 'app-new-moment',
    standalone: true,
    templateUrl: './new-moment.component.html',
    styleUrl: './new-moment.component.css',
    imports: [MomentFormComponent]
})
export class NewMomentComponent {
    btnText = 'Compartilhar'
}
