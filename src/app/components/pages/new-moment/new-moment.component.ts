import { Component } from '@angular/core';
import { MomentFormComponent } from "../../moment-form/moment-form.component";
import { Moment } from '../../../Moments';
import { MomentService } from '../../../services/moment.service';

@Component({
    selector: 'app-new-moment',
    standalone: true,
    templateUrl: './new-moment.component.html',
    styleUrl: './new-moment.component.css',
    imports: [MomentFormComponent]
})
export class NewMomentComponent {
    btnText = 'Compartilhar'

    constructor(private momentService: MomentService) { }

    async createHander(moment: Moment) {
        const formData = new FormData();

        formData.append('title', moment.title);
        formData.append('description', moment.description);

        if (moment.image) {
            formData.append('image', moment.image)
        }

        await this.momentService.createMoment(formData).subscribe()


        console.log("chegados ao crate handler");
    }
}
