import { Component, OnInit } from '@angular/core';
import { User } from './_models/user';
import { AuthService } from './_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'DatingApp-SPA';

  constructor(private authService : AuthService) {

  }

  ngOnInit(): void {
    const token = localStorage.getItem("token");
    const user: User = JSON.parse(localStorage.getItem("user"));
    if(token){
      this.authService.decodedToken = this.authService.jwtHelper.decodeToken(token);
    }
    if(user){
      this.authService.currentUser = user;
      this.authService.changeMemberPhoto(user.photoUrl);
    }

  }
}
