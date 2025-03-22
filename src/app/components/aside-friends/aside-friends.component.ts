import { Component, OnInit } from '@angular/core';
import { FriendsService } from '../../services/friends.service';
import { CommonModule } from '@angular/common';
import { ChatComponent } from '../chat/chat.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-aside-friends',
  standalone: true,
  imports: [CommonModule, ChatComponent, FontAwesomeModule],
  templateUrl: './aside-friends.component.html',
  styleUrls: ['./aside-friends.component.css']
})
export class AsideFriendsComponent implements OnInit {

  friendsListComplate: any[] = [];
  selectedFriends: any[] = []; 
  selectedFriendsChats: { [key: string]: any[] } = {};  
  faArrowLeft = faArrowLeft
  faArrowRight = faArrowRight

  constructor(
    private friendsService: FriendsService,
  ) { }

  ngOnInit() {
    this.friendsList();
  }

  friendsList() {
    this.friendsService.friendsList().subscribe((data: any) => {
      const friendsData = data;
      console.log(friendsData.myFriends);
      this.friendsListComplate = friendsData.myFriends;
    });
  }
  
  openChat(friend: any) {  
    if (!this.selectedFriendsChats[friend.user_id]) {
      this.selectedFriendsChats[friend.user_id] = [];
    }
  
    const existingChat = this.selectedFriendsChats[friend.user_id].find(chat => chat.user_id === friend.user_id);
  
    if (existingChat) {
      return;  
    }
  
    if (!this.selectedFriends.some(f => f.user_id === friend.user_id)) {
      if (this.selectedFriends.length >= 5) {
        const removedFriend = this.selectedFriends.shift();
        delete this.selectedFriendsChats[removedFriend.user_id]; 
      }
      this.selectedFriends.push(friend); 
    }
  
    this.selectedFriendsChats[friend.user_id].push(friend);  
    console.log(this.selectedFriendsChats); 
  }

  closeChat(friend: any) {
    this.selectedFriends = this.selectedFriends.filter(f => f.user_id !== friend.user_id);
    delete this.selectedFriendsChats[friend.user_id];
  }
}
