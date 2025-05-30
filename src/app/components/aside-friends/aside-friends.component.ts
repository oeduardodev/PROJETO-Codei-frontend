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
      this.friendsListComplate = friendsData.myFriends.map((f: Profile) => new Profile(f));
    });
  }

  openChat(friend: Profile) {  
    if (this.selectedFriends.some(f => f.userId === friend.userId)) {
      return;
    }
  
    if (this.selectedFriends.length >= 5) {
      const removed = this.selectedFriends.shift();
    }
  
    this.selectedFriends = [...this.selectedFriends, friend];

  }
  
  
  closeChat(friend: Profile) {
    this.selectedFriends = this.selectedFriends.filter(f => f.userId !== friend.userId);
  }
  
  
  
}
