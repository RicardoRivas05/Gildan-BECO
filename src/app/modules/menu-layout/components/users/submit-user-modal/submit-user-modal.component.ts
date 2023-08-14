import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { NotificationService } from '@shared/services/notification.service';
import { roleShema, userSchema } from 'src/Core/interfaces/user.interface';

@Component({
  selector: 'app-submit-user-modal',
  templateUrl: './submit-user-modal.component.html',
  styleUrls: ['./submit-user-modal.component.css']
})
export class SubmitUserModalComponent implements OnInit  {
  @Output() DataUpdated : EventEmitter<userSchema> = new EventEmitter<userSchema>();
  @Input() dataPosition!: userSchema;
  @Input() listOfRoles: roleShema[] = [];

  isVisible = false;
  zonaIsDisable: boolean = false;
  listOfData: userSchema[] = [];
  validateForm!: FormGroup;
  newUser!: userSchema;

  url = {
    get: 'usuarios',
    post: 'usuarios',
    delete: 'usuarios',
    update: 'usuarios',
  };

  constructor(
    private globalService: EndPointGobalService,
    private fb: FormBuilder,
    private notificationService: NotificationService
    ) { }

  ngOnInit(): void {
    this.CleanForm();
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
      this.globalService.Patch(this.url.post, this.dataPosition.id, this.newUser).subscribe(
        (result:any) => {
          if(!result){
            this.updateMainTable();
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

    this.validateForm = this.fb.group({
      rolid: [data.rolid, [Validators.required]],
      nombre: [data.nombre, [Validators.required]],
      apellido: [data.apellido, [Validators.required]],
      telefono: [data.telefono, [Validators.required]],
      observacion: [data.observacion, [Validators.required]],
      correo: [data.correo, [Validators.required]],
    });

  }

  fullSchema(){

    this.newUser = {
      ... this.validateForm.value,
      estado: true
    }
  }

  updateMainTable(): void{
    this.dataPosition.id = this.dataPosition.id;
    this.dataPosition.nombre = this.validateForm.value.nombre;
    this.dataPosition.ad = this.dataPosition.ad;
    this.dataPosition.rolid = this.validateForm.value.rolid;
    this.dataPosition.apellido = this.validateForm.value.apellido;
    this.dataPosition.telefono = this.validateForm.value.telefono;
    this.dataPosition.observacion = this.validateForm.value.observacion;
    this.dataPosition = this.dataPosition;
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
    this.isVisible = false;
  }

  CleanForm(){
    this.validateForm = this.fb.group({
      rolid: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      observacion: ['', [Validators.required]],
      correo: ['', [Validators.required]],
    });
  }
}
