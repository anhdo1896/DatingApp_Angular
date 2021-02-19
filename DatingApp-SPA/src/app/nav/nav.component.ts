import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  constructor(public authService : AuthService,
    private alertifyService : AlertifyService, private router : Router) { }

  ngOnInit() {

  }

  login(){
    this.authService.login(this.model).subscribe(next => {
      this.alertifyService.success("Login successfully!");
    }, error => {
        this.alertifyService.error(error);
    }, () => {
      this.router.navigate(['/members'])
    });
  }

  loggedIn(){
    return this.authService.loggedIn();
  }

  logOut(){
    localStorage.removeItem("token");
    this.alertifyService.warning("You logged out!");
    this.router.navigate(['/home'])
  }

}
