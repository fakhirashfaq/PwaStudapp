import { Component, OnInit } from "@angular/core";
import { faThumbsUp, faThumbsDown, IconDefinition, } from "@fortawesome/free-solid-svg-icons";
import { FaqsService } from "src/app/services/faqs.service";

@Component({
  selector: "app-faqs",
  templateUrl: "./faqs.component.html",
  styleUrls: ["./faqs.component.css"]
})
export class FAQsComponent implements OnInit {

  faThumbsUp: IconDefinition;
  faThumbsDown: IconDefinition;

  /**
   * @description Feedback likes value
   *
   * @type {number}
   * @memberof FAQsComponent
   */
  public likes: number;

  /**
   * @description Feedback dislikes value
   *
   * @type {number}
   * @memberof FAQsComponent
   */
  public dislikes: number;

  /**
   * @description Is like and dislike DB save in progress
   *
   * @type {boolean}
   * @memberof FAQsComponent
   */
  public isSaveInProgress: boolean;

  constructor(private faqsService: FaqsService) { }

  ngOnInit(): void {
    this.faThumbsUp = faThumbsUp;
    this.faThumbsDown = faThumbsDown;
    this.isSaveInProgress = false;
    this.setFeedbackVal();
  }

  /**
   * @description Set likes and dislikes value in template
   *
   * @private
   * @memberof FAQsComponent
   */
  private setFeedbackVal(): void {
    this.faqsService.fetchFeedbackVal().subscribe((payload: any): void => {
      this.likes = payload.likes;
      this.dislikes = payload.dislikes;
    });
  }

  /**
   * @description Like feedback val
   *
   * @memberof FAQsComponent
   */
  public likeFeed(): void {
    this.isSaveInProgress = true;
    this.faqsService.incrementVal()
      // .then((): void => { })
      .catch((error: any): void => console.error(error))
      .finally((): void => {
        this.isSaveInProgress = false;
        this.setFeedbackVal();
      });
  }

  /**
   * @description Dislike Feedback val
   *
   * @memberof FAQsComponent
   */
  public dislikeFeed(): void {
    this.isSaveInProgress = true;
    this.faqsService.decrementVal()
      // .then((): void => { })
      .catch((error: any): void => console.error(error))
      .finally((): void => {
        this.isSaveInProgress = false;
        this.setFeedbackVal();
      });
  }

}
