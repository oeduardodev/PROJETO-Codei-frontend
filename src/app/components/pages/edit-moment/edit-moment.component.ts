import { Component } from '@angular/core';

import { Moment } from '../../../Moments';

import { MomentService } from '../../../services/moment.service';

import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MomentFormComponent } from '../../moment-form/moment-form.component';

@Component({
  selector: 'app-edit-moment',
  standalone: true,
  imports: [CommonModule, MomentFormComponent],
  templateUrl: './edit-moment.component.html',
  styleUrl: './edit-moment.component.css'
})
export class EditMomentComponent {
  moment!: Moment;
  btnText: string = 'Editar';

  constructor(
    private momentService: MomentService,
    private route: ActivatedRoute
    ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get("id"));

    this.momentService.getMoment(id).subscribe((item) => {
      this.moment = item.data;  
    })

  }
}
