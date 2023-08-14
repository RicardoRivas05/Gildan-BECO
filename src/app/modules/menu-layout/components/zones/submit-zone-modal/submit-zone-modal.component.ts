import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { NotificationService } from '@shared/services/notification.service';
import { ZoneShema } from 'src/Core/interfaces/zones.interface';

@Component({
  selector: 'app-submit-zone-modal',
  templateUrl: './submit-zone-modal.component.html',
  styleUrls: ['./submit-zone-modal.component.css']
})
export class SubmitZoneModalComponent implements OnInit {
  @Output() DataUpdated : EventEmitter<ZoneShema> = new EventEmitter<ZoneShema>();
  @Input() dataPosition!: ZoneShema;

  isVisible = false;
  zonaIsDisable: boolean = false;
  listOfData: ZoneShema[] = [];
  validateForm!: FormGroup;
  newZone!: ZoneShema;

  url = {
    get: 'get-zones',
    post: 'zonas',
    delete: 'zonas',
    update: 'zonas',
  };
  EmptyForm = this.fb.group({
    codigo: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    observacion: ['', [Validators.required]],
  })

  constructor(
    private globalService: EndPointGobalService,
    private fb: FormBuilder,
    private notificationService: NotificationService
    ) { }

  ngOnInit(): void {
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
      this.newZone = {
        ... this.validateForm.value,
        estado: true
      }
      //console.log(this.newZone);
      this.isVisible = false;
      this.globalService.Post(this.url.post, this.newZone).subscribe(
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
      this.newZone = {
        ... this.validateForm.value,
        estado: true
      }
      //console.log(this.newZone);
      this.isVisible = false;
      this.globalService.Patch(this.url.post, this.dataPosition.id, this.newZone).subscribe(
        (result:any) => {
          if(!result){
            this.dataPosition.codigo = this.newZone.codigo;
            this.dataPosition.descripcion = this.newZone.descripcion;
            this.dataPosition.observacion = this.newZone.observacion;

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

  editableFrom(data: ZoneShema): void{
    //console.log(data);
    this.validateForm = this.fb.group({
      codigo: [data.codigo, [Validators.required]],
      descripcion: [data.descripcion, [Validators.required]],
      observacion: [data.observacion, [Validators.required]],
    })

    //console.log(this.validateForm.value);

  }

  fullSchema(){

    this.newZone = {
      ... this.validateForm.value,
      estado: true
    }
  }

  updateMainTable(): void{
    this.dataPosition = {
      id: this.dataPosition.id,
      ... this.validateForm.value,
      estado: this.dataPosition.estado
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
      codigo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      observacion: ['', [Validators.required]],
    })
  }



}
