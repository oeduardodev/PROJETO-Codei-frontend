import { Component, OnInit } from '@angular/core';
import { FriendsService } from '../../services/friends.service';
import { CommonModule } from '@angular/common';
import { ChatComponent } from '../chat/chat.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Profile } from '../../models/Profiles';

@Component({
  selector: 'app-aside-friends',
  standalone: true,
  imports: [CommonModule, ChatComponent, FontAwesomeModule],
  templateUrl: './aside-friends.component.html',
  styleUrls: ['./aside-friends.component.css']
})
export class AsideFriendsComponent implements OnInit {

  friendsListComplate: Profile[] = [];
  selectedFriends: Profile[] = [];
  selectedFriendsChats: Record<number, Profile[]> = {};
  faArrowLeft = faArrowLeft
  faArrowRight = faArrowRight

  constructor(
    private friendsService: FriendsService,
  ) { }

  ngOnInit() {

    this.friendsList();
  }

  friendsList() {
    this.friendsService.friendsList().subscribe((data) => {
      const friendsData = data;
      console.log(friendsData.myFriends);
      this.friendsListComplate = friendsData.myFriends.map((f: Profile) => new Profile(f));
    });
  }

  openChat(friend: Profile) {
    console.log('Tentando abrir chat com:', friend.username);
  
    if (this.selectedFriends.some(f => f.userId === friend.userId)) {
      console.log('Chat já aberto com:', friend.username);
      return;
    }
  
    if (this.selectedFriends.length >= 5) {
      const removed = this.selectedFriends.shift();
      console.log('Removendo chat com:', removed?.username);
    }
  
    this.selectedFriends = [...this.selectedFriends, friend];
    console.log('Chats abertos agora:', this.selectedFriends.map(f => f.username));
    console.log('Adicionando ao selectedFriends:', friend.userId, friend.username);

  }
  
  
  closeChat(friend: Profile) {
    console.log('Fechando chat com:', friend.username);
    this.selectedFriends = this.selectedFriends.filter(f => f.userId !== friend.userId);
    console.log('Chats abertos depois de fechar:', this.selectedFriends.map(f => f.username));
  }
  
  
  
}
