import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { FilesService } from '@shared/services/files.service';
import { NotificationService } from '@shared/services/notification.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActorInterface } from 'src/Core/interfaces/actors.interface';

@Component({
  selector: 'app-submit-provider-modal',
  templateUrl: './submit-provider-modal.component.html',
  styleUrls: ['./submit-provider-modal.component.css']
})
export class SubmitProviderModalComponent implements OnInit {
  @Output() DataUpdated : EventEmitter<ActorInterface> = new EventEmitter<ActorInterface>();
  @Input() dataPosition!: ActorInterface;
  listOfProviders: ActorInterface[] = [];
  newProvider!: ActorInterface;
  validateForm!: FormGroup;
  isVisible = false;

  url = {
    get: 'get-providers',
    post: 'actores',
    delete: 'actores',
    update: 'actores',
  };
  constructor(
    private globalService:EndPointGobalService,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private nzMessageService: NzMessageService,
    private filesService:FilesService,
  ) { }

  EmptyForm = this.fb.group({
    nombre: ['', [Validators.required]],
    telefono: ['', [Validators.required]],
    direccion: ['', [Validators.required]],
    observacion: ['', [Validators.required]],
    correo: ['', [Validators.required]],
  })

  ngOnInit(): void {
    this.validateForm = this.EmptyForm;
  }

  submitForm(): void{
    if(!this.dataPosition){
      this.submitPostForm();
    }
    else{
      this.submitUpdateForm();
    }
  }

  file!: any;
  previsualize!: any;
  captureFile(event: any): any{
    this.file = event.target.files[0];
    this.filesService.extraerBase64(this.file).then((file:any) => {
      this.previsualize = file.base;

    })
  }
  submitPostForm(){
    if (this.validateForm.valid) {
      this.newProvider = {
        ... this.validateForm.value,
        tipo: false,
        imagen: this.previsualize,
        estado: true
      }

      this.globalService.Post(this.url.post, this.newProvider).subscribe(
        (result:any) => {
          if(result){
            this.CleanForm();
            this.DataUpdated.emit(result);
            this.isVisible = false;

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
      this.newProvider = {
        ... this.validateForm.value,
        tipo: false,
        imagen: this.previsualize,
        estado: true
      }

      this.globalService.Patch(this.url.update, this.dataPosition.id ,this.newProvider).subscribe(
        (result:any) => {
          if(!result){
            this.UpdateMainTable(this.newProvider);
            this.CleanForm();
            this.isVisible = false;

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

  editableForm(){
    this.validateForm  = this.fb.group({
      nombre: [this.dataPosition.nombre, [Validators.required]],
      telefono: [this.dataPosition.telefono, [Validators.required]],
      direccion: [this.dataPosition.direccion, [Validators.required]],
      observacion: [this.dataPosition.observacion, [Validators.required]],
      correo: [this.dataPosition.correo, [Validators.required]],
    })
    this.previsualize = this.dataPosition.imagen
  }


  CleanForm(){
    this.validateForm = this.fb.group({
      nombre: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      observacion: ['', [Validators.required]],
      correo: ['', [Validators.required]],
    })
  }

  UpdateMainTable(data: ActorInterface){
    this.dataPosition.nombre = data.nombre;
    this.dataPosition.telefono = data.telefono;
    this.dataPosition.observacion = data.observacion;
    this.dataPosition.direccion = data.direccion;
    this.dataPosition.imagen = data.imagen
    this.dataPosition.correo = data.correo

  }

  showModal(): void {
    this.isVisible = true;
    if(!this.dataPosition){
      this.CleanForm();
    }else{
      this.editableForm();
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
  cancel(): void {
    this.nzMessageService.info('click cancel');
  }


}
