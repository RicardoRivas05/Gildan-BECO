import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { NotificationService } from '@shared/services/notification.service';
import { credentiaView, roleShema, userSchema } from 'src/Core/interfaces/user.interface';

@Component({
  selector: 'app-credential-user-modal',
  templateUrl: './credential-user-modal.component.html',
  styleUrls: ['./credential-user-modal.component.css']
})
export class CredentialUserModalComponent implements OnInit, OnChanges {
  @Output() DataUpdated : EventEmitter<userSchema> = new EventEmitter<userSchema>();
  @Input() dataPosition!: userSchema;
  @Input() listOfRoles: roleShema[] = [];
  credentialPosition: credentiaView[] = [];

  isVisible = false;
  zonaIsDisable: boolean = false;
  listOfData: userSchema[] = [];
  validateForm!: FormGroup;
  newUser!: userSchema;

  url = {
    get: 'usuarios',
    post: 'create-credentials',
    delete: 'usuarios',
    update: 'update-credentials',
  };

  constructor(
    private globalService: EndPointGobalService,
    private fb: FormBuilder,
    private notificationService: NotificationService
    ) { }

  ngOnInit(): void {
    this.CleanForm();
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  submitForm(): void{
    if(!this.dataPosition){
      this.submitPostForm();
    }else{
      this.submitUpdateForm();
    }
  }

  submitPostForm(){
    if (this.validateForm.valid) {
      this.newUser = {
        ... this.validateForm.value,
        estado: true
      }
      //console.log(this.newUser);
      this.isVisible = false;
      this.globalService.Post(this.url.post, this.newUser).subscribe(
        (result:any) => {
          if(result){
            this.DataUpdated.emit(result);

            this.notificationService.createMessage('success', 'La acción se ejecuto con exito 😎');
          }else{
            this.notificationService.createMessage('error', 'La accion fallo 😓');
          }

        }
      );

    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }

  }

  submitUpdateForm(){
    if (this.validateForm.valid) {
      this.newUser = {
        ... this.validateForm.value,
        estado: true
      }
      //console.log(this.newUser);
      this.isVisible = false;
      this.globalService.Post(this.url.update, this.newUser).subscribe(
        (result:any) => {
          if(!result){
            this.dataPosition = this.newUser;

            this.notificationService.createMessage('success', 'La acción se ejecuto con exito 😎');
          }else{
            this.notificationService.createMessage('error', 'La accion fallo 😓');
          }

        }
      );

    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }

  }

  editableFrom(data: userSchema): void{
    this.globalService.GetIdString( 'getcredential', data.correo).subscribe(
      (result:any) => {

        this.credentialPosition = result;

        this.validateForm = this.fb.group({
          correo: [this.credentialPosition[0].Correo, [Validators.required]],
          username: [this.credentialPosition[0].Username, [Validators.required]],
          newPassword: ['', [Validators.required]],
        });

      }
    )

  }

  fullSchema(){
    this.newUser = {
      ... this.validateForm.value,
      estado: true
    }
  }

  showModal(): void {
    this.isVisible = true;
    if(!this.dataPosition){
      this.CleanForm();

    }else{
      this.editableFrom(this.dataPosition);
    }
  }

  handleOk(): void {
    //console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    //console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  CleanForm(){
    this.validateForm = this.fb.group({
      correo: ['', [Validators.required]],
      username: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
    });
  }
}
