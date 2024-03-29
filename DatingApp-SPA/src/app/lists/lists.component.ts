import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PaginatedResult, Pagination } from "../_models/pagination";
import { User } from "../_models/user";
import { AlertifyService } from "../_services/alertify.service";
import { UserService } from "../_services/user.service";

@Component({
  selector: "app-lists",
  templateUrl: "./lists.component.html",
  styleUrls: ["./lists.component.css"],
})
export class ListsComponent implements OnInit {
  users: User[];
  user: User = JSON.parse(localStorage.getItem("user"));
  genderList = [
    { value: "male", display: "Males" },
    { value: "female", display: "Females" },
  ];
  pagination: Pagination;
  likesParam: string;
  userParams: any = {
    gender: this.user.gender === "female" ? "male" : "female",
  };
  constructor(
    private userService: UserService,
    private alertService: AlertifyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    });
    this.likesParam='likers';
  }

  loadUsers() {
    
    this.userService
      .getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams, this.likesParam)
      .subscribe(
        (data: PaginatedResult<User[]>) => {
          this.users = data.result;
          this.pagination = data.pagination;
        },
        (error) => {
          this.alertService.error(error);
        }
      );
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }


}
