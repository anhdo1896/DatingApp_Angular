import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { User } from "../_models/user";
import { AlertifyService } from "../_services/alertify.service";
import { AuthService } from "../_services/auth.service";
import {Router} from '@angular/router';
@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  user: User;
  model: any = {};
  resgisterForm: FormGroup;
  constructor(
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private fb : FormBuilder,
    private router : Router
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
    if(this.resgisterForm.valid){
      this.user = Object.assign({},this.resgisterForm.value);
      this.authService.register(this.user).subscribe(()=>{
        this.alertifyService.success("Register successfully")
      },error=> {
        this.alertifyService.error(error);
      },() => {
        this.authService.login(this.user).subscribe(()=>{
            this.router.navigate(['/members']);
        })
      })
    }
   

    //console.log(this.resgisterForm.value);
  }

  cancel() {
    this.cancelRegister.emit(false);
    console.log("Cancel");
  }
}
