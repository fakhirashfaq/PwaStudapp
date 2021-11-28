import { Injectable } from "@angular/core";
import { DomService } from "./dom.service";

/**
 * @description Service used in conjunction to initialize a modal window or to destroy it.
 *
 * @export
 * @class ModalService
 */
@Injectable({
  providedIn: "root"
})
export class ModalService {

  constructor(private domService: DomService) { }

  private modalElementId: string = "modal-container";
  private overlayElementId: string = "overlay";

  /**
   * @description Initializes the modal window
   * @summary The init method appends the component to the DOM and the Angular component tree using the DomService.
   * Then, we show the modal and the overlay by using the .show class.
   *
   * @param {*} component
   * @param {object} inputs
   * @param {object} outputs
   * @memberof ModalService
   */
  public init(component: any, inputs: object, outputs: object): void {
    const componentConfig: any = {
      inputs: inputs,
      outputs: outputs
    };
    this.domService.appendComponentTo(this.modalElementId, component, componentConfig);
    document.getElementById(this.modalElementId).className = "show";
    document.getElementById(this.overlayElementId).className = "show";
  }

  /**
   * @description Destroys the component and hides the modal and overlay.
   * @member destroy
   * @memberof ModalService
   */
  destroy(): void {
    this.domService.removeComponent();
    document.getElementById(this.modalElementId).className = "hidden";
    document.getElementById(this.overlayElementId).className = "hidden";
  }
}
