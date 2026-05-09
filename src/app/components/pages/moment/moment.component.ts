import { CommonModule } from "@angular/common";
import { Component, computed, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { Router, RouterLink, ActivatedRoute } from "@angular/router";
import { faEdit, faTimes, faUsersRays } from "@fortawesome/free-solid-svg-icons";
import { Comment } from "../../../models/Comments";
import { Moment } from "../../../models/Moments";
import { User } from "../../../models/User";
import { ImageFallbackDirective } from "../../../directives/image-fallback.directive";
import { environment } from "../../../environment/environments";
import { CommentService } from "../../../services/comment.service";
import { LikeService } from "../../../services/like.service";
import { MessageService } from "../../../services/message.service";
import { MomentService } from "../../../services/moment.service";
import { UsersService } from "../../../services/users.service";

@Component({
  selector: "app-moment",
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterLink,
    ReactiveFormsModule,
    ImageFallbackDirective,
  ],
  templateUrl: "./moment.component.html",
  styleUrl: "./moment.component.css",
})
export class MomentComponent {
  readonly baseApiUrl = environment.endpoint;
  readonly moment = signal<Moment | null>(null);
  readonly userNameLog = signal("");
  readonly likeAtive = signal(false);
  readonly animateLike = signal(false);

  readonly likeImage = computed(() =>
    this.likeAtive()
      ? "../../../../assets/capilike-ative.png"
      : "../../../../assets/capilike.png",
  );
  readonly comments = computed(() => this.moment()?.comments ?? []);
  readonly hasComments = computed(() => this.comments().length > 0);
  readonly commentCount = computed(() => this.comments().length);

  readonly faEdit = faEdit;
  readonly faTimes = faTimes;
  readonly faRay = faUsersRays;

  readonly commentForm = new FormGroup({
    text: new FormControl("", [Validators.required]),
    username: new FormControl("", [Validators.required]),
  });

  constructor(
    private momentService: MomentService,
    private route: ActivatedRoute,
    private messagesService: MessageService,
    private router: Router,
    private commentService: CommentService,
    private userService: UsersService,
    private likeService: LikeService,
  ) {
    this.getMoment();
    this.getUser();
  }

  get text() {
    return this.commentForm.get("text")!;
  }

  getMoment(): void {
    const id = Number(this.route.snapshot.paramMap.get("id"));

    if (!id) {
      return;
    }

    this.momentService.getMoment(id).subscribe((item) => {
      const loadedMoment = new Moment(item.data);
      this.moment.set(loadedMoment);

      if (!loadedMoment.id) {
        return;
      }

      // Carrega comentários explicitamente para garantir que apareçam
      this.commentService.getCommentsByMoment(loadedMoment.id).subscribe({
        next: (res) => {
          this.moment.update((moment) => {
            if (!moment) return moment;
            return { ...moment, comments: res.comments ?? moment.comments };
          });
        },
      });

      this.likeService.getLike(loadedMoment.id).subscribe((like) => {
        this.likeAtive.set(like.liked);
      });
    });
  }

  getUser(): void {
    this.userService.getUser().subscribe((user: User) => {
      const username = user.username ?? "";
      this.userNameLog.set(username);

      if (!username) {
        return;
      }

      this.commentForm.patchValue({ username });
      this.commentForm.get("username")?.disable();
    });
  }

  onSubmit(formDirective: FormGroupDirective): void {
    const currentMoment = this.moment();

    if (this.commentForm.invalid || !currentMoment?.id) {
      return;
    }

    const usernameControl = this.commentForm.get("username");
    if (usernameControl?.disabled) {
      usernameControl.enable();
    }

    if (!usernameControl?.value?.trim()) {
      this.commentForm.patchValue({ username: this.userNameLog() });
    }

    const data: Comment = {
      ...(this.commentForm.getRawValue() as Comment),
      momentId: currentMoment.id,
    };

    if (this.userNameLog()) {
      usernameControl?.disable();
    }

    this.commentService.createComment(data).subscribe((comment) => {
      this.moment.update((moment) => {
        if (!moment) {
          return moment;
        }

        return {
          ...moment,
          comments: [...(moment.comments ?? []), comment.data],
        };
      });
    });

    this.messagesService.addMessage("Comentário adicionado");
    this.commentForm.reset();
    formDirective.resetForm();

    if (this.userNameLog()) {
      this.commentForm.patchValue({ username: this.userNameLog() });
      this.commentForm.get("username")?.disable();
    }
  }

  removeHandler(id: number): void {
    this.momentService.removeMoment(id).subscribe();
    this.messagesService.addMessage("Momento excluido com sucesso!");
    void this.router.navigate(["/"]);
  }

  sendLike(): void {
    const currentMoment = this.moment();

    if (!currentMoment?.id) {
      return;
    }

    this.likeAtive.update((liked) => !liked);
    this.animateLike.set(true);

    this.likeService.sendLike(currentMoment.id).subscribe(() => {
      this.likeService.getLike(currentMoment.id).subscribe((like) => {
        this.likeAtive.set(like.liked);
        this.getMoment();
      });
    });

    setTimeout(() => {
      this.animateLike.set(false);
    }, 200);
  }
}
