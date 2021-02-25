import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUri = environment.baseUri;
  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]>{
    return this.http.get<User[]>(this.baseUri+'user');
  }

  getUser(id : number): Observable<User>{
    return this.http.get<User>(this.baseUri+'user/'+id);
  }

  updateUser(id : number, user: User): Observable<User>{
    return this.http.put<User>(this.baseUri+'user/'+id, user);
  }
}
