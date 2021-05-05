import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { AlertifyService } from "../_services/alertify.service";
import { AuthService } from "../_services/auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  model: any = {};
  resgisterForm: FormGroup;
  constructor(
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private fb : FormBuilder
  ) {}

  ngOnInit() {
    // this.resgisterForm = new FormGroup({
    //   username: new FormControl("", Validators.required),
    //   password: new FormControl(
    //     "",
    //     [Validators.required,
    //     Validators.minLength(4),
    //     Validators.maxLength(8)]
    //   ),
    //   confirmpassword: new FormControl("", Validators.required),
    // }, this.passwordMatchValidator);
    this.createRegisterForm();
  }

  createRegisterForm(){
    this.resgisterForm = this.fb.group({
      gender:['male'],
      username: ['', Validators.required],
      knownAs:['', Validators.required],
      dateOfBirth:[null, Validators.required],
      city:['', Validators.required],
      country:['',Validators.required],
      password: ['', [Validators.required,Validators.minLength(4), Validators.maxLength(8)]],
      confirmpassword: ['', Validators.required]
    },{validators: this.passwordMatchValidator})
  }

  passwordMatchValidator(g: FormGroup){
    return g.get('password').value === g.get('confirmpassword').value ? null : {'mismatch' : true}
  }

  register() {
    // this.authService.register(this.model).subscribe(next => {
    //   this.alertifyService.success("Register successfully")
    // }, error => {
    //   this.alertifyService.error(error);
    // });
    console.log(this.resgisterForm.value);
  }

  cancel() {
    this.cancelRegister.emit(false);
    console.log("Cancel");
  }
}
