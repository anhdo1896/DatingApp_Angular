import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { MemberEditComponent } from "../members/member-edit/member-edit.component";
import { AuthService } from "../_services/auth.service";

@Injectable()
export class PreventUnSavedChanges
  implements CanDeactivate<MemberEditComponent> {
  /**
   *
   */
  constructor(private authService: AuthService) {}
  canDeactivate(component: MemberEditComponent) {
    if (component.editForm.dirty) {
      return confirm(
        "Are you sure want to countinue? Any unsaved changes will be lost"
      );
    }
    return true;
  }
}
