import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Message } from "../_models/message";
import { PaginatedResult, Pagination } from "../_models/pagination";
import { AlertifyService } from "../_services/alertify.service";
import { AuthService } from "../_services/auth.service";
import { UserService } from "../_services/user.service";

@Component({
  selector: "app-messages",
  templateUrl: "./messages.component.html",
  styleUrls: ["./messages.component.css"],
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer = "Unread";
  messageUnread: number = 0;
  messageInbox: number = 0;
  messageOutbox: number = 0;

  constructor(
    private userService: UserService,
    private alertService: AlertifyService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.messages = data["messages"].result;
      this.pagination = data["messages"].pagination;
    });
    this.getTotalMessageContainer("Unread");
    this.getTotalMessageContainer("Inbox");
    this.getTotalMessageContainer("Outbox");
  }
  loadMessage() {
    this.userService
      .getMessages(
        this.authService.decodedToken.nameid,
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        this.messageContainer
      )
      .subscribe(
        (res: PaginatedResult<Message[]>) => {
          this.messages = res.result;
          this.pagination = res.pagination;
        },
        (error) => {
          this.alertService.error(error);
        }
      );
  }

  deleteMessage(id: number) {
    this.alertService.confirm(
      "Are you sure you want to delete this message",
      () => {
        this.userService
          .deleteMessage(id, this.authService.decodedToken.nameid)
          .subscribe(
            () => {
              this.messages.splice(
                this.messages.findIndex((m) => m.id === id),
                1
              );
              this.alertService.success("Message has been deleted");
            },
            (error) => {
              this.alertService.error(error);
            }
          );
      }
    );
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMessage();
  }
  getTotalMessageContainer(container: string) {
    this.userService
      .getMessages(this.authService.decodedToken.nameid, null, null, container)
      .subscribe(
        (res: PaginatedResult<Message[]>) => {
          switch (container) {
            case "Unread": {
              this.messageUnread = res.result.length;
              break;
            }
            case "Inbox": {
              this.messageInbox = res.result.length;
              break;
            }
            case "Outbox": {
              this.messageOutbox = res.result.length;
              break;
            }
          }
        },
        (error) => {
          this.alertService.error(error);
        }
      );
  }
}
