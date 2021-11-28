import { Component, OnInit } from "@angular/core";
import { IconDefinition, faPaperPlane, faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from "src/app/core/auth.service";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.css"]
})
export class FooterComponent implements OnInit {

  /**
   * @description FormGroup for email subscription
   *
   * @type {FormGroup}
   * @memberof FooterComponent
   */
  public subscriptionFG: FormGroup;

  /**
   * @description Was form submitted
   *
   * @type {boolean}
   * @memberof FooterComponent
   */
  public isFormSubmitted: boolean;

  faPaperPlane: IconDefinition = faPaperPlane;
  faCheckCircle: IconDefinition = faCheckCircle;
  faTimesCircle: IconDefinition = faTimesCircle;

  public currentEmailSubsFI: IconDefinition;
  public currFIStatus: string;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.initFormGroup();
    this.isFormSubmitted = false;
    this.currentEmailSubsFI = faPaperPlane;
    this.currFIStatus = "defaultFIStatus";
  }

  /**
   * @description Init form for email subscription
   *
   * @private
   * @memberof FooterComponent
   */
  private initFormGroup(): void {
    this.subscriptionFG = new FormGroup({
      emailFormC: new FormControl(null, [Validators.email]),
    });
  }

  /**
   * @description Submit form for Email subscription
   *
   * @returns {void}
   * @memberof FooterComponent
   */
  public submitForm(): void {
    this.isFormSubmitted = true;

    // stop here if form is invalid
    if (this.subscriptionFG.invalid || !(!!this.subscriptionFG.value.emailFormC)) {
      return;
    } else {
      this.trySubscribeUser();
    }
  }

  /**
   * @description Convenience getter for easy access to form fields
   * @readonly
   * @type {FormGroup["controls"]}
   * @memberof FooterComponent
   */
  get formContRef(): FormGroup["controls"] {
    return this.subscriptionFG.controls;
  }

  /**
   * @description Insert user mail in DB and show result via Fa icon.
   *
   * @private
   * @param {FormGroup} formGroup
   * @memberof FooterComponent
   */
  private trySubscribeUser(): void {
    this.authService.subscribeUser(this.subscriptionFG.value)
      .then((): void => {
        this.currentEmailSubsFI = faCheckCircle;
        this.currFIStatus = "okFIStatus";
        this.defaultFIStatus();
        this.authService.sendSubscribedEmail(this.subscriptionFG.value.emailFormC);
      }).catch((error: any): void => {
        console.log(error);
        this.currentEmailSubsFI = faTimesCircle;
        this.currFIStatus = "nokFIStatus";
        this.defaultFIStatus();
      });
  }

  /**
   * @description Default Fa icon status after 5000 ms
   *
   * @private
   * @memberof FooterComponent
   */
  private defaultFIStatus(): void {
    setTimeout((): void => {
      this.currentEmailSubsFI = faPaperPlane;
      this.currFIStatus = "defaultFIStatus";
    }, 5000); // Wait 5 seconds
  }

}
