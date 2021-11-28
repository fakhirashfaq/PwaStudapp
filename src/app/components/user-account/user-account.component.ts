import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { ModalService } from 'src/app/services/modal.service';
import { ConfirmDeleteAccountComponent } from '../confirm-delete-account/confirm-delete-account.component';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent implements OnInit {

  /**
   * @description Current Logged in User
   *
   * @type {User}
   * @memberof UserAccountComponent
   */
  @Input() currUser: User;

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
  }

  /**
   * @description Display modal for confirming user's choice
   *
   * @memberof UserAccountComponent
   */
  public confirmDeleteAccount(): void {
    this.modalService.init(ConfirmDeleteAccountComponent, { userId: this.currUser.uid }, {});
  }

}
