import { Component, Input, OnInit } from "@angular/core";
import { AngularFireFunctions } from "@angular/fire/compat/functions";
import { IconDefinition, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { ModalService } from "src/app/services/modal.service";
import { Constants } from "src/app/shared/utils/constants";
import { Helper } from "src/app/shared/utils/helper";

@Component({
  selector: "app-confirm-delete-account",
  templateUrl: "./confirm-delete-account.component.html",
  styleUrls: ["./confirm-delete-account.component.css"]
})
export class ConfirmDeleteAccountComponent implements OnInit {

  public faTrashAlt: IconDefinition;

  /**
   * @description User's id to delete
   *
   * @type {string}
   * @memberof ConfirmDeleteAccountComponent
   */
  @Input() userId: string;

  constructor(private modalService: ModalService,
    private angularFireFunctions: AngularFireFunctions,
    private loadingBarService: LoadingBarService) { }

  ngOnInit(): void {
    this.faTrashAlt = faTrashAlt;
  }

  /**
   * @description Close component
   * @function
   * @member
   * @memberof ConfirmDeleteAccountComponent
   */
  public close(): void {
    this.modalService.destroy();
  }

  /**
   * @description Call CF DeleteUserAcc to delete user account
   *
   * @memberof ConfirmDeleteAccountComponent
   */
  public deleteAcc(): void {
    this.loadingBarService.start();
    this.angularFireFunctions.httpsCallable(Constants.cloudFunctionDeleteUserAcc)(
      { userId: this.userId }).toPromise().then((): void => {
        this.close();
        Helper.reloadPage();
      }).catch((error: any): void => {
        console.error(error);
      }).finally((): void => {
        this.loadingBarService.complete();
      });
  }

}
