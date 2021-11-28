import { Component, Input, OnInit } from "@angular/core";
import { IconDefinition, faCheckCircle, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { Institution } from "src/app/models/institution";
import { User } from "src/app/models/user";
import { CustomValidatorsService } from "src/app/services/custom-validators.service";
import { InstitutionsService } from "src/app/services/institutions.service";
import { Constants } from "src/app/shared/utils/constants";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {

  /**
   * @description Current Logged in User
   *
   * @type {User}
   * @memberof UserProfileComponent
   */
  @Input() currUser: User;

  /**
   * @description Current User's institution details
   *
   * @type {Institution}
   * @memberof UserProfileComponent
   */
  public currInstitution: Institution;

  public faCheckCircle: IconDefinition = faCheckCircle;
  public faExclamationCircle: IconDefinition = faExclamationCircle;

  /**
   * @description Current user's profile pic
   *
   * @type {string}
   * @memberof UserProfileComponent
   */
  public profPic: string;

  constructor(private institutionService: InstitutionsService) { }

  ngOnInit(): void {
    this.profPic = this.currUser?.profilePic ? this.currUser.profilePic : Constants.defaultProfilePic;
    this.fetchUserInstitution(this.currUser.insId);
  }

  /**
   * @description Fetch user's institution details
   *
   * @private
   * @param {string} insId
   * @memberof UserProfileComponent
   */
  private fetchUserInstitution(insId: string): void {
    this.institutionService.retrieveInstitution$(insId).subscribe((institution: Institution) => {
      this.currInstitution = institution
    });
  }

}
