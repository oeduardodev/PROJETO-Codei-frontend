import { Component } from '@angular/core';
import { MomentFormComponent } from "../../moment-form/moment-form.component";
import { Router } from '@angular/router';
import { MomentService } from '../../../services/moment.service';
import { MessageService } from '../../../services/message.service';

@Component({
    selector: 'app-new-moment',
    standalone: true,
    templateUrl: './new-moment.component.html',
    styleUrls: ['./new-moment.component.css'],
    imports: [MomentFormComponent]
})
export class NewMomentComponent {
    btnText = 'Compartilhar';

    constructor(
        private momentService: MomentService,
        private messageService: MessageService,
        private router: Router
    ) { }

    async createHandler(formData: FormData) {
        try {
            await this.momentService.createMoment(formData).toPromise();
            this.messageService.addMessage("Momento adicionado com sucesso!");
            this.router.navigate(['/']);
        } catch (error) {
            console.error('Error creating moment', error);
        }
    }
}
