import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { tap } from "rxjs/operators";
import { Message } from "src/app/_models/message";
import { AlertifyService } from "src/app/_services/alertify.service";
import { AuthService } from "src/app/_services/auth.service";
import { UserService } from "src/app/_services/user.service";

@Component({
  selector: "app-member-messages",
  templateUrl: "./member-messages.component.html",
  styleUrls: ["./member-messages.component.css"],
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  messages: Message[];
  message: any = {};

  constructor(
    private userService: UserService,
    private alertService: AlertifyService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    
    const currentUserId = this.authService.decodedToken.nameid;
    this.userService
      .getMessageThread(this.authService.decodedToken.nameid, this.recipientId)
      .pipe(
        tap( data => {
          for(let i=0; i < data.length;i++)
          {
            if(data[i].isRead === false && data[i].recipientId == currentUserId)
             {
               
               this.userService.markAsReadMessage(data[i].id, currentUserId);
             } 
          }
        }
  
        )
      )
      .subscribe(
        (data) => {
          this.messages = data;
          console.log(this.messages);
        },
        (error) => {
          this.alertService.error(error);
        }
      );
  }
  sendMessage() {
    this.message.recipientId = this.recipientId;
    this.userService
      .sendMessage(this.authService.decodedToken.nameid, this.message)
      .subscribe((newMessage: Message) => {
        this.messages.unshift(newMessage);
        this.message.content = "";
      },error => {
        this.alertService.error(error);
      });
  }
}
