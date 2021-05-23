import { Component, OnInit } from "@angular/core";
import { PaginatedResult, Pagination } from "src/app/_models/pagination";
import { User } from "../../_models/user";
import { AlertifyService } from "../../_services/alertify.service";
import { UserService } from "../../_services/user.service";

@Component({
  selector: "app-member-list",
  templateUrl: "./member-list.component.html",
  styleUrls: ["./member-list.component.css"],
})
export class MemberListComponent implements OnInit {
  users: User[];
  user: User = JSON.parse(localStorage.getItem("user"));
  genderList = [
    { value: "male", display: "Males" },
    { value: "female", display: "Females" },
  ];
  userParams: any = {
    minAge: 18,
    maxAge: 99,
    gender: this.user.gender === "female" ? "male" : "female",
    orderBy: 'lastActive'
  };
  pageNumber = 1;
  pageSize = 5;
  pagination: Pagination;

  constructor(
    private userService: UserService,
    private alertService: AlertifyService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService
      .getUsers(this.pageNumber, this.pageSize, this.userParams)
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

  resetFilter() {
    this.userParams.gender = this.user.gender === "female" ? "male" : "female";
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
  }
  pageChanged(event: any): void {
    this.pageNumber = event.page;
    this.loadUsers();
  }
}
