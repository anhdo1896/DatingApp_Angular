import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Message } from "../_models/message";
import { PaginatedResult } from "../_models/pagination";
import { User } from "../_models/user";

@Injectable({
  providedIn: "root",
})
export class UserService {
  baseUri = environment.baseUri;
  constructor(private http: HttpClient) {}

  getUsers(
    page?,
    itemsPerPage?,
    userParams?,
    likeParams?
  ): Observable<PaginatedResult<User[]>> {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<
      User[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("pageNumber", page);
      params = params.append("pageSize", itemsPerPage);
    }
    if (userParams != null) {
      if (userParams.orderBy != null) {
        params = params.append("orderBy", userParams.orderBy);
      }

      if (userParams.gender != null) {
        params = params.append("gender", userParams.gender);
      }
      if (userParams.minAge != null && userParams.maxAge != null) {
        params = params.append("minAge", userParams.minAge);
        params = params.append("maxAge", userParams.maxAge);
      }
    }

    if (likeParams === "likers") {
      params = params.append("likers", "true");
    }
    if (likeParams === "likees") {
      params = params.append("likees", "true");
    }
    return this.http
      .get<User[]>(this.baseUri + "user", {
        observe: "response",
        params,
      })
      .pipe(
        map((response) => {
          paginatedResult.result = response.body;
          if (response.headers.get("Pagination") != null) {
            paginatedResult.pagination = JSON.parse(
              response.headers.get("Pagination")
            );
          }
          return paginatedResult;
        })
      );
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.baseUri + "user/" + id);
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(this.baseUri + "user/" + id, user);
  }

  setMainPhoto(userId: number, id: number) {
    return this.http.post<User>(
      this.baseUri + "user/" + userId + "/photo/" + id + "/setMain",
      {}
    );
  }
  deletePhoto(userId: number, id: number) {
    return this.http.delete(this.baseUri + "user/" + userId + "/photo/" + id);
  }

  sendLike(id: number, recipientId: number) {
    return this.http.post<User>(
      this.baseUri + "user/" + id + "/like/" + recipientId,
      {}
    );
  }

  getMessages(
    id: number,
    page?,
    itemsPerPage?,
    messageContainer?
  ): Observable<PaginatedResult<Message[]>> {
    const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<
      Message[]
    >();
    var params = new HttpParams();
    if (page != null && itemsPerPage) {
      params = params.append("pageNumber", page);
      params = params.append("pageSize", itemsPerPage);
    }

    if (messageContainer != null) {
      params = params.append("messageContainer", messageContainer);
    }

    return this.http
      .get<Message[]>(this.baseUri + "user/" + id + "/messages", {
        observe: "response",
        params: params,
      })
      .pipe(
        map((response) => {
          paginatedResult.result = response.body;
          if (response.headers.get("Pagination") != null) {
            paginatedResult.pagination = JSON.parse(
              response.headers.get("Pagination")
            );
          }
          return paginatedResult;
        })
      );
  }

  getMessageThread(id: number, recipientId: number): Observable<Message[]> {
    return this.http.get<Message[]>(
      this.baseUri + "user/" + id + "/messages/thread/" + recipientId
    );
  }

  sendMessage(id: number, message: Message) {
    return this.http.post(this.baseUri + "user/" + id + "/messages", message);
  }
  deleteMessage(id: number,userId: number) {
    return this.http.post(this.baseUri + "user/" + userId + "/messages/" + id, {});
  }

  markAsReadMessage(id: number,userId: number) {
    return this.http.post(this.baseUri + "user/" + userId + "/messages/" + id + "/read", {}).subscribe();
  }
}
