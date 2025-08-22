import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-typebot',
  templateUrl: './typebot.component.html',
  styleUrls: ['./typebot.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class TypebotComponent {
  showChat = false;

  toggleChat() {
    this.showChat = !this.showChat;
  }
}
