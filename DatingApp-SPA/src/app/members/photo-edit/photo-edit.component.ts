import { Component, Input, OnInit } from "@angular/core";
import { FileUploader } from "ng2-file-upload";
import { Photo } from "src/app/_models/photo";
import { AuthService } from "src/app/_services/auth.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-photo-edit",
  templateUrl: "./photo-edit.component.html",
  styleUrls: ["./photo-edit.component.css"],
})
export class PhotoEditComponent implements OnInit {
  @Input() photos: Photo[];
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean = false;
  hasAnotherDropZoneOver: boolean = false;
  baseUrl = environment.baseUri;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.initializeUploader();
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
  initializeUploader() {
    this.uploader = new FileUploader({
      url:  this.baseUrl +  "user/" +
      this.authService.decodedToken.nameid + "/photo",
      authToken: "Bearer " + localStorage.getItem("token"),
      isHTML5: true,
      allowedFileType: ["image"],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
  }
}
