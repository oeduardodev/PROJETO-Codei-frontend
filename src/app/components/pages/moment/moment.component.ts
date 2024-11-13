import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MomentService } from '../../../services/moment.service';
import { MessageService } from '../../../services/message.service';
import { Moment } from '../../../models/Moments';
import { Comment } from '../../../models/Comments';
import { environment } from '../../../environment/environments';
import { CommonModule } from '@angular/common';
import { faTimes, faEdit, faUsersRays } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommentService } from '../../../services/comment.service';
import { UsersService } from '../../../services/users.service';
import { AsideProfileComponent } from '../../aside-profile/aside-profile.component';
import { LikeService } from '../../../services/like.service';
import { AuthorizationService } from '../../../services/auth.service';

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
    private likeService: LikeService,
    private authService: AuthorizationService
  ) { }

  ngOnInit(): void {
    this.getMoment();
    this.setupCommentForm();
    this.getUser();
  }

  setupCommentForm() {
    this.commentForm = new FormGroup({
      text: new FormControl("", [Validators.required]),
      username: new FormControl("", [Validators.required])
    });
  }

  getUser() {
    const headers = this.authService.getAuthorizationHeaders(); // Obtenha os cabeçalhos com o token
  
    this.userService.getUser(headers).subscribe((user) => {
      this.userNameLog = user.username;
      if (this.userNameLog) {
        this.commentForm.patchValue({
          username: this.userNameLog
        });
        this.commentForm.get('username')?.disable();  // Desabilita o campo se o usuário estiver logado
      }
    });
  }

  getMoment() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.momentService.getMoment(id).subscribe((item) => {
      this.moment = item.data;

      if (this.moment && this.moment.id !== undefined) {
        this.likeService.getLike(this.moment.id, this.token).subscribe(
          (like) => {
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
    if (this.userNameLog) {
      return
    }
    this.commentForm.get("username")!;
  }

  async onSubmit(formDirective: FormGroupDirective) {
    if (this.commentForm.invalid) {
      return;
    }
  
    // Habilitar o campo username temporariamente se estiver desabilitado
    const usernameControl = this.commentForm.get('username');
    if (usernameControl?.disabled) {
      usernameControl.enable();
    }
  
    // Verifica se o campo `username` está vazio e preenche com `userNameLog` se necessário
    if (!usernameControl || !usernameControl.value.trim()) {
      this.commentForm.patchValue({ username: this.userNameLog });
    }
  
    const data: Comment = {
      ...this.commentForm.value,
      momentId: Number(this.moment!.id)
    };
  
    // Desabilitar o campo username novamente se necessário
    if (this.userNameLog) {
      usernameControl?.disable();
    }
  
    await this.commentService.createComment(data).subscribe((comment) => {
      this.moment!.comments!.push(comment.data);
    });
  
    this.messagesService.addMessage("Comentário Adicionado");
  
    this.commentForm.reset();
    formDirective.resetForm();
    this.getMoment(); 
    this.getUser();
  }
  
  async removeHandler(id: number) {
    await this.momentService.removeMoment(id).subscribe();

    this.messagesService.addMessage("Momento excluido com sucesso!");
    this.router.navigate(['/']);
  }

  async sendLike() {
    if (this.moment && this.moment.id !== undefined) {
      // Inverta o estado de likeAtive imediatamente
      this.likeAtive = !this.likeAtive;

      // Atualize a imagem imediatamente após a inversão
      const imageElement = document.querySelector('.capilike') as HTMLImageElement;
      if (imageElement) {
        imageElement.src = this.updateLikeImage();
      }

      // Envie a requisição de like para o servidor
      this.likeService.sendLike(this.moment.id, this.token).subscribe();
      // Opcional: Atualize o estado de like após obter a resposta do servidor
      this.likeService.getLike(this.moment.id, this.token).subscribe(
        (like) => {
          this.likeAtive = like.liked;
          // Atualize a imagem novamente após receber a resposta do servidor
          if (imageElement) {
            imageElement.src = this.updateLikeImage();
          }
        }
      );
      this.getMoment()
    } else {
      console.error('Moment ID is undefined. Cannot send like.');
    }

    // Animação de clique (opcional)
    const imageElement = document.querySelector('.capilike');

    if (imageElement) {
      imageElement.classList.add('clicked');
      setTimeout(() => {
        imageElement.classList.remove('clicked');
        this.getMoment()
      }, 200); 
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
