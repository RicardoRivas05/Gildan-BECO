import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { FilesService } from '@shared/services/files.service';
import { NotificationService } from '@shared/services/notification.service';
import { rejects } from 'assert';
import { resolve } from 'dns';
import { ActorInterface } from 'src/Core/interfaces/actors.interface';

@Component({
  selector: 'app-submit-client-modal',
  templateUrl: './submit-client-modal.component.html',
  styleUrls: ['./submit-client-modal.component.css']
})
export class SubmitClientModalComponent implements OnInit {
  @Output() DataUpdated : EventEmitter<ActorInterface> = new EventEmitter<ActorInterface>();
  @Input() dataPosition!: ActorInterface;
  listOfProviders: ActorInterface[] = [];
  newProvider!: ActorInterface;
  validateForm!: FormGroup;
  isVisible = false;
  file!: any;
  previsualize!: any;
  url = {
    get: 'get-providers',
    post: 'actores',
    delete: 'actores',
    update: 'actores',
    postFile: 'files',
  };
  constructor(
    private globalService:EndPointGobalService,
    private filesService:FilesService,
    private fb: FormBuilder,
    private notificationService: NotificationService,
  ) { }

  EmptyForm = this.fb.group({
    nombre: ['', [Validators.required]],
    telefono: ['', [Validators.required]],
    direccion: ['', [Validators.required]],
    observacion: ['', [Validators.required]],
    correo: ['', [Validators.required]],
  })

  ngOnInit(): void {
    this.CleanForm();
  }

  captureFile(event: any): any{
    this.file = event.target.files[0];
    this.filesService.extraerBase64(this.file).then((file:any) => {
      this.previsualize = file.base;
      
    })
  }

  submitForm(): void{
    if(!this.dataPosition){
      this.submitPostForm();
    }
    else{
      this.submitUpdateForm();
    }
  }

 

  submitPostForm(){
    if (this.validateForm.valid) {
      // let fileUrl;
      // this.globalService.Post(this.url.postFile, this.file).subscribe( (result: any ) => {
      //   fileUrl = result;
      // });
      this.newProvider = {
        ... this.validateForm.value,
        tipo: true,
        imagen: this.previsualize,
        estado: true
      }

      this.globalService.Post(this.url.post, this.newProvider).subscribe(
        (result:any) => {
          if(result){
            this.DataUpdated.emit(result);
            this.isVisible = false;
            this.CleanForm();
            this.notificationService.createMessage('success', 'Cliente creado exitosamente 😎');
          }else{
            this.notificationService.createMessage('error', 'Fallo en la creacion del cliente 😓');
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
        tipo: true,
        imagen: this.previsualize,
        estado: true
      }

      this.globalService.PutId(this.url.update, this.dataPosition.id ,this.newProvider).subscribe(
        (result:any) => {
          if(!result){
            this.newProvider.id = this.dataPosition.id;
            this.CleanForm();
            this.UpdateMainTable(this.newProvider);
            this.isVisible = false;
            
            this.notificationService.createMessage('success', 'Acción realizada con exito 😎');
          }else{
            this.notificationService.createMessage('error', 'Fallo la ejecucion 😓');
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
    this.previsualize = this.dataPosition.imagen;
  }

  UpdateMainTable(data: ActorInterface){
    this.dataPosition.nombre = data.nombre;
    this.dataPosition.telefono = data.telefono;
    this.dataPosition.observacion = data.observacion;
    this.dataPosition.direccion = data.direccion;
    this.dataPosition.imagen = data.imagen;
    this.dataPosition.correo = data.correo;

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

  showModal(): void {
    this.isVisible = true;
    if(!this.dataPosition){
      this.CleanForm();
    }else{
      this.editableForm();
    }
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}