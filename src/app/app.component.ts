/* Import the Component decorator (which is just a function that takes parameters, for ex: selector) and OnInit method to use */
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ModalService } from "./services/modal.service";
import { Constants } from "./shared/utils/constants";
import { NgcCookieConsentService, NgcNoCookieLawEvent, NgcInitializeEvent, NgcStatusChangeEvent, } from "ngx-cookieconsent";
import { Subscription } from "rxjs";
import { SwUpdate } from "@angular/service-worker";

/* Define this class as a component */
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})

/*
The bootstrapped root component of the application.
Every Angular application requires at least one component called a root component.
All other components will reside in this primary root component. An application may only have one root component.

A bootstrapped component is an entry component that Angular loads into the DOM during the bootstrap process (application launch).
Other entry components are loaded dynamically by other means, such as with the router.
Angular loads a root AppComponent dynamically because it's listed by type in @NgModule.bootstrap.
 */
export class AppComponent implements OnInit, OnDestroy {
  // keep refs to subscriptions to be able to unsubscribe later
  private popupOpenSubscription: Subscription;
  private popupCloseSubscription: Subscription;
  private initializeSubscription: Subscription;
  private statusChangeSubscription: Subscription;
  private revokeChoiceSubscription: Subscription;
  private noCookieLawSubscription: Subscription;

  /**
   * @description Emits an UpdateAvailableEvent event whenever a new app version is available.
   *
   * @private
   * @type {Subscription}
   * @memberof AppComponent
   */
  private updateAvailableEvent$: Subscription;

  /**
   * @description Creates an instance of AppComponent.
   * @param {NgcCookieConsentService} ccService
   * @param {Title} titleService
   * @param {ModalService} modalService
   * @param {SwUpdate} swUpdate for managing application version updates
   * @memberof AppComponent
   */
  constructor(
    private ccService: NgcCookieConsentService,
    private titleService: Title,
    private modalService: ModalService,
    private swUpdate: SwUpdate
  ) {
    this.updateAvailableEvent$ = this.swUpdate.available.subscribe((): void => {
      alert("An update was found. This website will reload. Thanks.");
      window.location.reload()
    });
  }

  /*
  A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
  Define an ngOnInit() method to handle any additional initialization tasks.
   */
  /**
   * @description Dynamic page titles setter
   * @summary Will set the title of the page after the navigation to this page is completed.
   * @type void
   * @function ngOnInit
   * @memberof AppComponent
   * @see https://ultimatecourses.com/blog/dynamic-page-titles-angular-2-router-events
   */
  ngOnInit(): void {
    this.setTitle();

    // subscribe to cookieconsent observables to react to main events
    this.popupOpenSubscription = this.ccService.popupOpen$.subscribe(() => {
      // you can use this.ccService.getConfig() to do stuff...
    });

    this.popupCloseSubscription = this.ccService.popupClose$.subscribe(() => {
      // you can use this.ccService.getConfig() to do stuff...
    });

    this.initializeSubscription = this.ccService.initialize$.subscribe(
      (event: NgcInitializeEvent) => {
        // you can use this.ccService.getConfig() to do stuff...
      }
    );

    this.statusChangeSubscription = this.ccService.statusChange$.subscribe(
      (event: NgcStatusChangeEvent) => {
        // you can use this.ccService.getConfig() to do stuff...
      }
    );

    this.revokeChoiceSubscription = this.ccService.revokeChoice$.subscribe(
      () => {
        // you can use this.ccService.getConfig() to do stuff...
      }
    );

    this.noCookieLawSubscription = this.ccService.noCookieLaw$.subscribe(
      (event: NgcNoCookieLawEvent) => {
        // you can use this.ccService.getConfig() to do stuff...
      }
    );
  }

  /**
   * @description Set title of tabs
   *
   * @private
   * @memberof AppComponent
   */
  private setTitle(): void {
    this.titleService.setTitle(Constants.tabsName);
  }

  /**
   * @description Close component
   * @function
   * @member
   * @memberof ConvertUserComponent
   */
  public close(): void {
    this.modalService.destroy();
  }

  public ngOnDestroy(): void {
    // unsubscribe to cookieconsent observables to prevent memory leaks
    this.popupOpenSubscription.unsubscribe();
    this.popupCloseSubscription.unsubscribe();
    this.initializeSubscription.unsubscribe();
    this.statusChangeSubscription.unsubscribe();
    this.revokeChoiceSubscription.unsubscribe();
    this.noCookieLawSubscription.unsubscribe();

    this.updateAvailableEvent$.unsubscribe();
  }
}
