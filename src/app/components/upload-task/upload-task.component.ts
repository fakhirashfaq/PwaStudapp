import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { AngularFireUploadTask } from "@angular/fire/compat/storage";
import { Observable } from "rxjs";
import { FbStorageService } from "src/app/services/fb-storage.service";
import { IconDefinition, faFile, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { tap } from "rxjs/operators";
import { Constants } from "src/app/shared/utils/constants";

/**
 * @description Each child component is a self contained UploadTask that will start running as soon as the component is initialized.
 * It will display the upload progress in realtime and save the download URL in firestore when it completes
 *
 * @export
 * @class UploadTaskComponent
 * @implements {OnInit}
 */
@Component({
  selector: "app-upload-task",
  templateUrl: "./upload-task.component.html",
  styleUrls: ["./upload-task.component.css"]
})
export class UploadTaskComponent implements OnInit {

  /**
   * @description This component File to upload
   *
   * @type {File}
   * @memberof UploadTaskComponent
   */
  @Input() fileToUpload: File;

  /**
   * @description Current file number to be emitted to parent component in case of delete
   *
   * @type {number}
   * @memberof UploadTaskComponent
   */
  @Input() index: number;

  /**
   * @description Current user uid
   *
   * @type {string}
   * @memberof UploadTaskComponent
   */
  @Input() userId: string;

  public task: AngularFireUploadTask;

  /**
   * @description Percentage completed from AngularFireUploadTask upload
   *
   * @type {Observable<number>}
   * @memberof UploadTaskComponent
   */
  percentage$: Observable<number>;

  /**
   * @description Fa Icon representing a File
   *
   * @type {IconDefinition}
   * @memberof UploadTaskComponent
   */
  faFile: IconDefinition = faFile;

  /**
   * @description Fa Icon representing a Trash can
   *
   * @type {IconDefinition}
   * @memberof UploadTaskComponent
   */
  faTrashAlt: IconDefinition = faTrashAlt;

  /**
   * @description Event to emit the index number of the file
   *
   * @type {EventEmitter<number>}
   * @memberof UploadTaskComponent
   */
  @Output() deleteReqEvtEmitter: EventEmitter<number> = new EventEmitter<number>();

  /**
   * @description Event to emit when percentage is 100
   *
   * @type {EventEmitter<number>}
   * @memberof UploadTaskComponent
   */
   @Output() completedEvtEmitter: EventEmitter<number> = new EventEmitter<number>();

  constructor(private fbStorageService: FbStorageService) { }

  ngOnInit(): void {
    this.startUpload();
  }

  /**
   * @description Upload File object
   *
   * @private
   * @memberof UploadTaskComponent
   */
  private startUpload(): void {

    this.percentage$ = this.fbStorageService.uploadVerificationFiles(this.userId, this.fileToUpload);

    this.percentage$.subscribe(
      () => {},
      () => {},
      () => this.completedEvtEmitter.emit(this.index)
    )

    // The storage path
    // const path: string = `users/${Date.now()}_${this.file.name}`;

    // // Reference to storage bucket
    // const ref: AngularFireStorageReference = this.storage.ref(path);

    // // The main task
    // this.task = this.storage.upload(path, this.file);

    // // Progress monitoring
    // this.percentage$ = this.task.percentageChanges();

    // this.snapshot   = this.task.snapshotChanges().pipe(
    //   tap(console.log),
    //   // The file's download URL
    //   finalize( async() =>  {
    //     this.downloadURL = await ref.getDownloadURL().toPromise();

    //     this.db.collection("files").add( { downloadURL: this.downloadURL, path });
    //   }),
    // );
  }

  // public isActive(snapshot: any): boolean {
  //   return snapshot.state === "running" && snapshot.bytesTransferred < snapshot.totalBytes;
  // }

  /**
   * @description format bytes
   *
   * @param {number} bytes (File size in bytes)
   * @param {number} [decimals=2] (Decimals point)
   * @returns {*}
   * @memberof UploadTaskComponent
   */
  formatBytes(bytes: number, decimals: number = 2): any {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k: number = 1024;
    const dm: number = decimals <= 0 ? 0 : decimals;
    const sizes: string[] = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i: number = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  /**
   * @description Emit file index number to parent component
   *
   * @memberof UploadTaskComponent
   */
  public deleteFile(): void {
    this.deleteReqEvtEmitter.emit(this.index);
  }


}
