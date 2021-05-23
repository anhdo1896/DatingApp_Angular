import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
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
    userParams?
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
      params = params.append("minAge", userParams.minAge);
      params = params.append("maxAge", userParams.maxAge);
      params = params.append("gender", userParams.gender);
      params = params.append("orderBy", userParams.orderBy);
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
}
