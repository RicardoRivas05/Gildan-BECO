import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { NotificationService } from '@shared/services/notification.service';
import { feriadosHnShema } from 'src/Core/interfaces/feriadosHn.interface';

@Component({
  selector: 'app-submit-feriadosHn-modal',
  templateUrl: './submit-feriadosHn-modal.component.html',
  styleUrls: ['./submit-feriadosHn-modal.component.css']
})
export class SubmitferiadosHnModalComponent implements OnInit {
  @Output() DataUpdated: EventEmitter<feriadosHnShema> = new EventEmitter<feriadosHnShema>();
  @Input() dataPosition!: feriadosHnShema;

  isVisible = false;
  feriadosHnIsDisable: boolean = false;
  listOfData: feriadosHnShema[] = [];
  validateForm!: FormGroup;
  newferiadosHn!: feriadosHnShema;

  url = {
    get: 'get-feriadosHn',
    post: 'feriadosHn',
    delete: 'feriadosHn',
    update: 'feriadosHn',
  };
  EmptyForm = this.fb.group({
    fecha: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
  });

  constructor(
    private globalService: EndPointGobalService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {this.validateForm = this.fb.group({
    fecha: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
  });}

  submitForm(): void {
    if (!this.dataPosition) {

      this.submitPostForm();
    } else {

      this.submitUpdateForm();
    }
  }

  submitPostForm() {
    if (this.validateForm.valid) {
      this.newferiadosHn = {
        ...this.validateForm.value,
        estado: true
      };
      this.isVisible = false;
      this.globalService.Post(this.url.post, this.newferiadosHn).subscribe(
        (result: any) => {
          console.log("----------", result);
          if (result) {
            this.DataUpdated.emit(result);
            this.notificationService.createMessage(
              'success',
              'La acción se ejecutó con éxito 😎'
            );
          } else {
            this.notificationService.createMessage(
              'error',
              'La acción falló 😓'
            );
          }
        }
      );
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  submitUpdateForm() {
    if (this.validateForm.valid) {
      this.newferiadosHn = {
        ...this.validateForm.value,
        estado: true
      };
      this.isVisible = false;
      this.globalService
        .Patch(this.url.post, this.dataPosition.id, this.newferiadosHn)
        .subscribe(
          (result: any) => {
            if (!result){
            this.dataPosition.fecha = this.newferiadosHn.fecha;
            this.dataPosition.descripcion = this.newferiadosHn.descripcion;
            this.notificationService.createMessage(
              'success',
              'La acción se ejecutó con éxito 😎'
            );
          } else {
            this.notificationService.createMessage(
              'error',
              'La acción falló 😓'
            );
          }
        }
      );
  } else {
    Object.values(this.validateForm.controls).forEach((control) => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
  }
  }






  editableFrom(data: feriadosHnShema): void{
    //console.log(data);
    let fechaParts = data.fecha.split('-').map(part => parseInt(part, 10));

    let fechaUTC = new Date(fechaParts[0], fechaParts[1] - 1, fechaParts[2]);

    this.validateForm = this.fb.group({
    fecha: [fechaUTC, [Validators.required]],
    descripcion: [data.descripcion, [Validators.required]],
    })
    console.log(this.validateForm.value);
  }

  fullSchema(){
    this.newferiadosHn = {
      ... this.validateForm.value,
      estado: true
    }
  }

  updateMainTable(): void{
    this.dataPosition = {
      ID: this.dataPosition.id,
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
    fecha: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    })
  }
}
