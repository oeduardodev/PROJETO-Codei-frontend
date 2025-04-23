import { Component, OnInit } from '@angular/core';
import { Moment } from '../../../models/Moments';
import { MomentService } from '../../../services/moment.service';
import { MessageService } from '../../../services/message.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MomentFormComponent } from '../../moment-form/moment-form.component';

@Component({
  selector: 'app-edit-moment',
  standalone: true,
  imports: [CommonModule, MomentFormComponent],
  templateUrl: './edit-moment.component.html',
  styleUrls: ['./edit-moment.component.css']
})
export class EditMomentComponent implements OnInit {
  moment!: Moment;
  btnText = 'Editar';

  constructor(
    private momentService: MomentService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get("id"));

    this.momentService.getMoment(id).subscribe((item) => {
      this.moment = item.data;
    });
  }

  async editHandler(formData: FormData) {
    const id = this.moment.id;

    this.momentService.updateMoment(id!, formData).subscribe(() => {
      this.messageService.addMessage(`Momento ${id} foi atualizado.`);
      this.router.navigate(['/']);
    });
  }
}
