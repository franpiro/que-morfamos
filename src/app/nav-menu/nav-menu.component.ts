import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user/user.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {

  constructor(public userService: UserService) { }

  ngOnInit(): void {    
  }
  isExpanded = false;

  collapse() {
    this.isExpanded = false;    
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }  

  logOut() {
    this.userService.logOut();
  }

}
