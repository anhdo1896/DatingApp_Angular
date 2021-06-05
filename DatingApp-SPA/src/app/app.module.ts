import { environment } from "src/environments/environment";
//#region Module
import {
  BrowserModule,
  HammerGestureConfig,
  HAMMER_GESTURE_CONFIG,
} from "@angular/platform-browser";
import { NgModule, Pipe, Injectable } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { JwtModule } from "@auth0/angular-jwt";
import { HttpClientModule } from "@angular/common/http";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TabsModule } from "ngx-bootstrap/tabs";
import { NgxGalleryModule } from "@kolkov/ngx-gallery";
import { AppRoutingModule } from "./app-routing.module";
import { FileUploadModule } from "ng2-file-upload";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { ButtonsModule } from "ngx-bootstrap/buttons";
import { BsDatepickerModule } from "ngx-bootstrap";
import { ModalModule } from 'ngx-bootstrap/modal';

//#endregion Module

//#region Component
import { AppComponent } from "./app.component";
import { NavComponent } from "./nav/nav.component";
import { HomeComponent } from "./home/home.component";
import { RegisterComponent } from "./register/register.component";
import { MemberListComponent } from "./members/member-list/member-list.component";
import { ListsComponent } from "./lists/lists.component";
import { MessagesComponent } from "./messages/messages.component";
import { MemberCardComponent } from "./members/member-card/member-card.component";
import { MemberDetailComponent } from "./members/member-detail/member-detail.component";
import { MemberEditComponent } from "./members/member-edit/member-edit.component";
import { PhotoEditComponent } from "./members/photo-edit/photo-edit.component";
import { HasRoleDirective } from "./_directives/has-role.directive";
import { AdminComponent } from "./admin/admin-panel/admin.component";
import { UserManagementComponent } from "./admin/user-management/user-management.component";
import { PhotoManagementComponent } from "./admin/photo-management/photo-management.component";
import { MemberMessagesComponent } from "./members/member-messages/member-messages.component";
import { TimeAgoPipe } from "time-ago-pipe";

//#endregion Component

//#region Service
import { AuthService } from "./_services/auth.service";
import { UserService } from "./_services/user.service";
import { ErrorInterceptorProvider } from "./_services/error.interceptor";

//#endregion Service

//#region resolver
import { MemberDetailResolver } from "./_resolvers/member-detail.resolver";
import { MemberListResolver } from "./_resolvers/member-list.resolver";
import { ListsResolver } from "./_resolvers/lists.resolver";
import { MessagesResolver } from "./_resolvers/messages.resolver";
import { MemberEditResolver } from "./_resolvers/member-edit.resolver";

//#endregion resolver

//#region guard
import { AuthGuard } from "./_guards/auth.guard";
import { PreventUnSavedChanges } from "./_guards/prevent-unsaved-changes.guard";
import { RoleModalComponent } from './admin/role-modal/role-modal.component';

//#endregion guard

@Injectable()
export class CustomHammerConfig extends HammerGestureConfig {
  overrides = {
    pinch: { enable: false },
    rotate: { enable: false },
  };
}

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    MemberListComponent,
    ListsComponent,
    MessagesComponent,
    MemberCardComponent,
    MemberDetailComponent,
    MemberEditComponent,
    PhotoEditComponent,
    TimeAgoPipe,
    MemberMessagesComponent,
    AdminComponent,
    HasRoleDirective,
    UserManagementComponent,
    PhotoManagementComponent,
    RoleModalComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    PaginationModule.forRoot(),
    ButtonsModule.forRoot(),
    ModalModule.forRoot(),
    AppRoutingModule,
    NgxGalleryModule,
    FileUploadModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem("token");
        },
        allowedDomains: ["localhost:5000"],
        disallowedRoutes: [environment.baseUri + "/auth/"],
      },
    }),
  ],
  providers: [
    AuthService,
    ErrorInterceptorProvider,
    AuthGuard,
    UserService,
    MemberDetailResolver,
    MemberEditResolver,
    MemberListResolver,
    ListsResolver,
    MessagesResolver,
    PreventUnSavedChanges,
    { provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig },
  ],
  entryComponents: [
    RoleModalComponent
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
