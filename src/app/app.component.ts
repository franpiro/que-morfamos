import { Component } from '@angular/core';
import { CheckboxControlValueAccessor } from '@angular/forms';
import { UserService } from './shared/services/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public userService: UserService){
    this.checkUser();
  }
  title = 'que-morfamos';

  checkUser() {
    if (this.userService.authenticated) {
      this.userService.setCurrentUser();
    }
  }
}
