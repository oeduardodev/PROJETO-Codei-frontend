import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { FriendsService } from '../../services/friends.service';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../services/profile.service';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-aside-friends',
  standalone: true,
  imports: [CommonModule,ChatComponent],
  templateUrl: './aside-friends.component.html',
  styleUrls: ['./aside-friends.component.css']
})
export class AsideFriendsComponent implements OnInit, AfterViewInit {

  friends: any;
  friendsListComplate: any;
  
  @ViewChild('container') container!: ElementRef;
  @ViewChild('firstChild') firstChild!: ElementRef;
  
  selectedFriend: any = null;

  constructor(
    private friendsService: FriendsService,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.friendsList();
  }

  ngAfterViewInit() {
    // Chama a função para verificar a altura após a visualização do componente
    this.checkHeight();

    // Adiciona evento de scroll para verificar a altura enquanto rola
    this.container.nativeElement.addEventListener('scroll', this.checkHeight.bind(this));
  }

  friendsList() {
    this.friendsService.friendsList().subscribe((data) => {
      this.friends = data;
      console.log(this.friends.myFriends);
      this.friendsListComplate = this.friends.myFriends;
    });
  }

  checkHeight() {
    const containerElement = this.container.nativeElement;
    const firstChildElement = this.firstChild.nativeElement;

    if (containerElement.scrollHeight >= containerElement.clientHeight) {
      this.renderer.setStyle(firstChildElement, 'margin-top', '250px');
    } else {
      this.renderer.setStyle(firstChildElement, 'margin-top', '0');
    }
  }


  openChat(friend: any) {
    this.selectedFriend = friend;
  }
}
