import { Component, ViewChild, ElementRef } from '@angular/core';
import { ListView } from 'ui/list-view';
import { TextView } from 'ui/text-view'
import { ChatService, User, Message } from '../services/chat.service';

@Component({
  selector: 'tc-chat',
  templateUrl: 'components/chat.component.html',
  styleUrls: ['components/chat.component.css'],
  providers: [ChatService],
})
export class ChatComponent {
  @ViewChild('chatBox') chatBoxRef: ElementRef;

  private get chatBox(): ListView {
    return this.chatBoxRef.nativeElement;
  }

  @ViewChild('newMessage') newMessageRef;

  private get newMessage(): TextView {
    return this.newMessageRef.nativeElement;
  }

  public me: User;
  public other: User;
  public messages: Array<Message>;

  constructor(private chatService: ChatService) {
    const chat = chatService.getChat();

    this.me = chat.participants.me;
    this.other = chat.participants.other;
    this.messages = chat.messages;
  }

  public bubbleClass(message: Message): string {
    const sender = this.isMy(message) ? 'me' : 'other';
    return `bubble-from-${sender}`;
  }

  public isMy(message: Message): boolean {
    return message.sender == this.me;
  }

  public sendMessage(): void {
    const content = this.newMessage.text;
    if (content == '') {
      return;
    }

    const message = this.initializeMessageWith(content);
    this.messages.push(message);
    this.scrollChatToBottom();
    this.dismissKeyBoard();
  }

  private initializeMessageWith(content: string): Message {
    return {
      content: content,
      sender: this.me,
      date: new Date()
    };
  }

  public scrollChatToBottom(): void {
    setTimeout(() => {
      this.chatBox.scrollToIndex(this.messages.length - 1);
    }, 0);
  }

  private dismissKeyBoard(): void {
    this.newMessage.text = '';
    if (this.newMessage.ios) {
      this.newMessage.ios.endEditing(true);
    }
    if (this.newMessage.android) {
      this.newMessage.android.clearFocus();
    }
  }
}
