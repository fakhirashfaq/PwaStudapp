import { Directive, HostBinding, Output, EventEmitter, HostListener } from "@angular/core";

/**
 * @description Custom directive that can receive the files from the browser.
 * The directive customize the Drag and Drop API (@see https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
 * to meet the specific needs of our feature
 *
 * @export
 * @class DndDirective
 */
@Directive({
  selector: "[appDnd]"
})
export class DndDirective {

  @HostBinding("class.fileOver") fileOver: boolean;

  // @Output() fileDropped: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @description Listens to the drop event on the parent element.
   * This event contains the FileList that the user wants to upload.
   * This data is emitted up as a custom event so it can be used by the DnDFUploaderComponent component
   *
   * @type {EventEmitter<FileList>}
   * @memberof DndDirective
   */
  @Output() dropped: EventEmitter<FileList> =  new EventEmitter<FileList>();

  /**
   * @description Listen to dragover/dragleave events so we can toggle CSS styles
   * when the user is hovering over the dropzone
   *
   * @type {EventEmitter<boolean>}
   * @memberof DndDirective
   */
  @Output() hovered: EventEmitter<boolean> =  new EventEmitter<boolean>();

  constructor() { }

  /**
   * @description HostListener to detect Drag Over / Dragover listener
   *
   * @param {*} evt
   * @memberof DndDirective
   * @summary Decorator that declares a DOM event to listen for, and provides a handler method to run when that event occurs.
   */
  @HostListener("dragover", ["$event"])
  public onDragOver($event: any): void {
    $event.preventDefault();
    // evt.stopPropagation();
    // this.fileOver = true;
    this.hovered.emit(true);
  }

  /**
   * @description HostListener to detect dragleave / Dragleave listener
   *
   * @param {*} evt
   * @memberof DndDirective
   */
  @HostListener("dragleave", ["$event"])
  public onDragLeave($event: any): void {
    $event.preventDefault();
    // $event.stopPropagation();
    // this.fileOver = false;
    this.hovered.emit(false);
  }

  /**
   * @description HostListener to detect drop / drop listener
   *
   * @param {*} evt
   * @memberof DndDirective
   */
  @HostListener("drop", ["$event"])
  public onDrop($event: any): void {
    $event.preventDefault();
    // $event.stopPropagation();
    // this.fileOver = false;
    // const files: any = $event.dataTransfer.files;
    // if (files.length > 0) {
    //   this.fileDropped.emit(files);
    // }
    this.dropped.emit($event.dataTransfer.files);
    this.hovered.emit(false);
  }

}
