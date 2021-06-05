import { Component, Input, OnInit, Output } from "@angular/core";
import { FileUploader } from "ng2-file-upload";
import { Photo } from "src/app/_models/photo";
import { AuthService } from "src/app/_services/auth.service";
import { UserService } from "src/app/_services/user.service";
import { AlertifyService } from "src/app/_services/alertify.service";
import { environment } from "src/environments/environment";
import { EventEmitter } from "@angular/core";
import { error } from "selenium-webdriver";
import { isBuffer } from "util";


@Component({
  selector: "app-photo-edit",
  templateUrl: "./photo-edit.component.html",
  styleUrls: ["./photo-edit.component.css"],
})
export class PhotoEditComponent implements OnInit {
  @Input() photos: Photo[];
 // @Output() getMemberPhotoChange = new EventEmitter<string>();
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean = false;
  hasAnotherDropZoneOver: boolean = false;
  baseUrl = environment.baseUri;
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertifyService: AlertifyService
  ) {}

  ngOnInit() {
    this.initializeUploader();
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
  initializeUploader() {
    this.uploader = new FileUploader({
      url:
        this.baseUrl +
        "user/" +
        this.authService.decodedToken.nameid +
        "/photo",
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

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: Photo = JSON .parse(response);
        this.photos.push(res);
        console.log(response);
        if(res.isMain){
          this.authService.changeMemberPhoto(res.url);
          this.authService.currentUser.photoUrl = res.url;
          localStorage.setItem("user",JSON.stringify(this.authService.currentUser));
        }
      }
    };
  }
  setMainPhoto(photo: Photo) {
    this.userService
      .setMainPhoto(this.authService.decodedToken.nameid, photo.id)
      .subscribe(
        () => {
          console.log("Set main successfully");
          this.photos.filter(photo => photo.isMain === true)[0].isMain = false;
          photo.isMain = true;
          this.authService.changeMemberPhoto(photo.url);
          this.authService.currentUser.photoUrl = photo.url;
          localStorage.setItem("user",JSON.stringify(this.authService.currentUser));
        },
        (error) => {
          this.alertifyService.error(error);
        }
      );
  }

  deletePhoto(id: number){
    this.alertifyService.confirm('Are you sure want to delete this photo',() => {
      this.userService.deletePhoto(this.authService.decodedToken.nameid, id).subscribe(()=>{
        this.photos.splice(this.photos.findIndex(p => p.id === id),1);
        this.alertifyService.success("Photo has been deleted");
      }, error => {
        this.alertifyService.error('Failed to delete the photo');
      })
    });
   
  }
}
