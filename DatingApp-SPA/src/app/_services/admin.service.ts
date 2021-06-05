import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.baseUri+"admin/";
  constructor(private http: HttpClient) { }

  getUsersWithRoles() {
    return this.http.get(this.baseUrl+ "usersWithRoles");
  }
  updateUserRoles(user: User, role:{}) {
    return this.http.post(this.baseUrl+ "editRoles/"+user.userName, role);
  }
  getPhotosForApproval(){
    return this.http.get(this.baseUrl+ "photosForModeration");
  }
  approvePhoto(photoId){
    return this.http.post(this.baseUrl+ "approvePhoto/"+ photoId, {});
  }
  rejectPhoto(photoId){
    return this.http.post(this.baseUrl+ "rejectPhoto/"+ photoId, {});
  }
}
