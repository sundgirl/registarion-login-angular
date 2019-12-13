import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/auth.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  username: string;
  constructor(
    private authService: AuthenticationService,
  ) { }
  ngOnInit() {
   this.username =  this.authService.currentUserValue.username;

  }

  logout() {
    this.authService.logout();
  }
}
