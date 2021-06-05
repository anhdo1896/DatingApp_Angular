import { Component, OnInit } from "@angular/core";
import { Photo } from "src/app/_models/photo";
import { AdminService } from "src/app/_services/admin.service";
import { AlertifyService } from "src/app/_services/alertify.service";

@Component({
  selector: "app-photo-management",
  templateUrl: "./photo-management.component.html",
  styleUrls: ["./photo-management.component.css"],
})
export class PhotoManagementComponent implements OnInit {
  photos;
  constructor(
    private adminService: AdminService,
    private alertService: AlertifyService
  ) {}

  ngOnInit(): void {
    this.getPhotosForApproval();
  }

  getPhotosForApproval() {
    this.adminService.getPhotosForApproval().subscribe(
      (photos) => {
        this.photos = photos;
      },
      (error) => {
        this.alertService.error(error);
      }
    );
  }

  approvePhoto(photoId){
    this.adminService.approvePhoto(photoId).subscribe(() => {
      this.photos.splice(this.photos.findIndex(p => p.id === photoId),1);
      this.alertService.success('Approval success');
    }, error => {
      this.alertService.error(error);
    });
  }

  rejectPhoto(photoId){
    this.adminService.rejectPhoto(photoId).subscribe(() => {
      this.photos.splice(this.photos.findIndex(p => p.id === photoId),1);
      this.alertService.success('Reject success');

    }, error => {
      this.alertService.error(error);

    })
  }
}
