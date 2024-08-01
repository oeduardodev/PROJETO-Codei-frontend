import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MomentService } from '../../../services/moment.service';
import { MessageService } from '../../../services/message.service';

import { Moment } from '../../../Moments';
import { Comment } from '../../../Comments';

import { environment } from '../../../environment/environments';

import { CommonModule } from '@angular/common';
import { faTimes, faEdit, faUsersRays, } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommentService } from '../../../services/comment.service';
import { AsideProfileComponent } from '../../aside-profile/aside-profile.component';

@Component({
  selector: 'app-moment',
  standalone: true,
  imports: [AsideProfileComponent, CommonModule, FontAwesomeModule, RouterLink, ReactiveFormsModule],
  templateUrl: './moment.component.html',
  styleUrl: './moment.component.css'
})
export class MomentComponent {
  moment?: Moment;
  baseApiUrl = environment.baseApiUrl

  faEdit = faEdit
  faTimes = faTimes
  faRay = faUsersRays
  commentForm!: FormGroup

  constructor(
    private momentService: MomentService,
    private route: ActivatedRoute,
    private messagesService: MessageService,
    private router: Router,
    private commentService: CommentService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'))

    this.momentService.getMoment(id).subscribe((item) => {
      this.moment = item.data
    });

    this.commentForm = new FormGroup({
      text: new FormControl("", [Validators.required]),
      username: new FormControl("", [Validators.required])
    })
  }

  get text() {
    return this.commentForm.get('text')!;
  }

  get username() {
    return this.commentForm.get("username")!;
  }

  async onSubmit(formDirective: FormGroupDirective) {
    if (this.commentForm.invalid) {
      return
    }

    const data: Comment = this.commentForm.value;

    data.momentId = Number(this.moment!.id);

    await this.commentService.createComment(data).subscribe((comment) => this.moment!.comments!.push(comment.data))
    this.messagesService.addMessage("Comentário Adicionado")

    this.commentForm.reset()
    formDirective.resetForm()
  }

  async removeHandler(id: number) {
    await this.momentService.removeMoment(id).subscribe()

    this.messagesService.addMessage("Momento excluido com sucesso!")
    this.router.navigate(['/'])
  }

}
