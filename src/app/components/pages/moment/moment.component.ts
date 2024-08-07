import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MomentService } from '../../../services/moment.service';
import { MessageService } from '../../../services/message.service';
import { Moment } from '../../../Moments';
import { Comment } from '../../../Comments';
import { environment } from '../../../environment/environments';
import { CommonModule } from '@angular/common';
import { faTimes, faEdit, faUsersRays } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommentService } from '../../../services/comment.service';
import { UsersService } from '../../../services/users.service';
import { AsideProfileComponent } from '../../aside-profile/aside-profile.component';
import { LikeService } from '../../../services/like.service';

@Component({
  selector: 'app-moment',
  standalone: true,
  imports: [AsideProfileComponent, CommonModule, FontAwesomeModule, RouterLink, ReactiveFormsModule],
  templateUrl: './moment.component.html',
  styleUrl: './moment.component.css'
})
export class MomentComponent {
  moment?: Moment;
  baseApiUrl = environment.endpoint;
  userNameLog!: string;
  likeAtive: boolean = false; 

  faEdit = faEdit;
  faTimes = faTimes;
  faRay = faUsersRays;
  commentForm!: FormGroup;

  token: string = localStorage.getItem('authToken') || '';

  constructor(
    private momentService: MomentService,
    private route: ActivatedRoute,
    private messagesService: MessageService,
    private router: Router,
    private commentService: CommentService,
    private userService: UsersService,
    private likeService: LikeService
  ) { }

  ngOnInit(): void {
    this.commentForm = new FormGroup({
      text: new FormControl("", [Validators.required]),
      username: new FormControl("", [Validators.required])
    });

    this.userService.user(this.token).subscribe((user) => {
      this.userNameLog = user.username;

      // Set the username form control to the user's name and disable the input
      this.commentForm.patchValue({
        username: this.userNameLog
      });

      if (this.userNameLog) {
        this.commentForm.get('username')?.disable();
      }
    });
  
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.momentService.getMoment(id).subscribe((item) => {
      this.moment = item.data;

      if (this.moment && this.moment.id !== undefined) {
        this.likeService.getLike(this.moment.id, this.token).subscribe(
          (like) => {
            console.log(like);
            this.likeAtive = like.liked; 
          }
        );
      } else {
        console.error('Moment or Moment ID is undefined.');
      }
    });
  }

  get text() {
    return this.commentForm.get('text')!;
  }

  get username() {
    return this.commentForm.get("username")!;
  }

  async onSubmit(formDirective: FormGroupDirective) {
    if (this.commentForm.invalid) {
      return;
    }

    const data: Comment = this.commentForm.value;

    data.momentId = Number(this.moment!.id);

    await this.commentService.createComment(data).subscribe((comment) => this.moment!.comments!.push(comment.data));
    this.messagesService.addMessage("Comentário Adicionado");

    this.commentForm.reset();
    formDirective.resetForm();
  }

  async removeHandler(id: number) {
    await this.momentService.removeMoment(id).subscribe();

    this.messagesService.addMessage("Momento excluido com sucesso!");
    this.router.navigate(['/']);
  }

  sendLike() {
    if (this.moment && this.moment.id !== undefined) {
      this.likeService.sendLike(this.moment.id, this.token).subscribe();
      this.likeService.getLike(this.moment.id, this.token).subscribe(
        (like) => {
          this.likeAtive = like.liked; 
          console.log(like);
        }
      )
    } else {
      console.error('Moment ID is undefined. Cannot send like.');
    }
  }

  updateLikeImage(): string {
    if (this.moment && this.moment.id !== undefined) {
      return this.likeAtive
        ? '../../../../assets/capilike-ative.png'
        : '../../../../assets/capilike.png';
    } else {
      console.error('Moment ID is undefined. Cannot get like image.');
      return '../../../../assets/capilike.png'; 
    }
  }  
}
