import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-aside-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './aside-profile.component.html',
  styleUrls: ['./aside-profile.component.css']
})
export class AsideProfileComponent {
  constructor() {}
}

