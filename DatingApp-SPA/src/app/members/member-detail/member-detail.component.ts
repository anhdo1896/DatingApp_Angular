import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { User } from "src/app/_models/user";
import { NgxGalleryOptions } from "@kolkov/ngx-gallery";
import { NgxGalleryImage } from "@kolkov/ngx-gallery";
import { NgxGalleryAnimation } from "@kolkov/ngx-gallery";
import { TabsetComponent } from "ngx-bootstrap";

@Component({
  selector: "app-member-detail",
  templateUrl: "./member-detail.component.html",
  styleUrls: ["./member-detail.component.css"],
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs', {static: true}) memberTabs: TabsetComponent;
  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.user = data["user"];
    });

    this.route.queryParams.subscribe(params => {
      const selectedTab = params['tab'];
      this.memberTabs.tabs[selectedTab > 0 ? selectedTab: 0].active = true;
    })
    this.galleryOptions = [
      {
        width: "400px",
        height: "400px",
        thumbnailsColumns: 4,
        arrowPrevIcon: "fa fa-chevron-left",
        arrowNextIcon: "fa fa-chevron-right",
        imageAnimation: NgxGalleryAnimation.Slide,
      },
      // max-width 800
      {
        breakpoint: 800,
        width: "100%",
        height: "600px",
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20,
      },
      // max-width 400
      {
        breakpoint: 400,
        preview: false,
      },
    ];
    this.galleryImages = this.loadImage();
  }

  loadImage() {
    const imageUrls = [];
    for (const photo of this.user.photos) {
      imageUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url,
        description: photo.description,
      });
    }
    return imageUrls;
  }

  selectTabs(tabId: number){
    this.memberTabs.tabs[tabId].active = true;
  }

}
