import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { NotificationService } from '@shared/services/notification.service';
import { eneeShema } from 'src/Core/interfaces/enee.interface';
import { MeasurePointSchema } from 'src/Core/interfaces/measure-point.interface';

@Component({
  selector: 'app-submit-enee-modal',
  templateUrl: './submit-enee-modal.component.html',
  styleUrls: ['./submit-enee-modal.component.css']
})
export class SubmiteneeModalComponent implements OnInit {
  @Output() DataUpdated: EventEmitter<eneeShema> = new EventEmitter<eneeShema>();
  @Input() dataPosition!: eneeShema;
  @Input() disabled: boolean = false;
  opcionesTipoMedidor = [
    { valor: '1', etiqueta: 'Principal' },
    { valor:'2', etiqueta: 'Respaldo' },
  ];


  isVisible = false;
  eneeIsDisable: boolean = false;
  listOfData: eneeShema[] = [];
  validateForm!: FormGroup;
  newenee!: eneeShema;
  fechaInicial: Date = new Date();
  fechaFinal: Date = new Date();

  url = {
    get: 'get-lecturasEnee',
    post: 'lecturasEnee',
    delete: 'lecturasEnee',
    update: 'lecturasEnee',
  };
  EmptyForm = this.fb.group({
    fechaInicial: ['', [Validators.required]],
    fechaFinal: ['', [Validators.required]],
    puntaInicial: ['', [Validators.required]],
    puntaFinal: ['', [Validators.required]],
    restoInicial:['',[Validators.required]],
    restoFinal:['',[Validators.required]],
    tipoMedidor: ['', [Validators.required]],

  });

  constructor(
    private globalService: EndPointGobalService,
    private fb: FormBuilder,
    private notificationService: NotificationService,

  ) {}

  ngOnInit(): void {this.validateForm = this.fb.group({
    fechaInicial: ['', [Validators.required]],
    fechaFinal: ['', [Validators.required]],
    puntaInicial: ['', [Validators.required]],
    puntaFinal: ['', [Validators.required]],
    restoInicial:['',[Validators.required]],
    restoFinal:['',[Validators.required]],
    tipoMedidor: ['', [Validators.required]],

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
      this.newenee = {
        ...this.validateForm.value,
        estado: true
      };
      this.isVisible = false;
      this.globalService.Post(this.url.post, this.newenee).subscribe(
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
      this.newenee = {
        ...this.validateForm.value,
        estado: true
      };
      this.isVisible = false;
      this.globalService
        .Patch(this.url.post, this.dataPosition.id, this.newenee)
        .subscribe(
          (result: any) => {
            if (!result){
            this.dataPosition.fechaInicial = this.newenee.fechaInicial;
            this.dataPosition.fechaInicial = this.newenee.fechaFinal;
            this.dataPosition.tipoMedidor = this.newenee.tipoMedidor;
            this.dataPosition.puntaInicial = this.newenee.puntaInicial;
            this.dataPosition.puntaFinal = this.newenee.puntaFinal;
            this.dataPosition.restoInicial = this.newenee.restoInicial;
            this.dataPosition.restoFinal = this.newenee.restoFinal;
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

  editableFrom(data: eneeShema): void{
    //console.log(data);
    this.validateForm = this.fb.group({
      fechaInicial: [data.fechaInicial, [Validators.required]],
      fechaFinal: [data.fechaFinal, [Validators.required]],
      tipoMedidor:[data.tipoMedidor.toString(),[Validators.required]],
      puntaInicial:[data.puntaInicial.toString(),[Validators.required]],
      puntaFinal:[data.puntaFinal.toString(),[Validators.required]],
      restoInicial: [data.restoInicial.toString(), [Validators.required]],
      restoFinal: [data.restoFinal.toString(), [Validators.required]],
    })
    console.log(this.validateForm.value);
  }

  fullSchema(){
    this.newenee = {
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
      fechaInicial: ['', [Validators.required]],
      fechaFinal: ['', [Validators.required]],
      puntaInicial: ['', [Validators.required]],
      puntaFinal: ['', [Validators.required]],
      restoInicial:['',[Validators.required]],
      restoFinal:['',[Validators.required]],
      tipoMedidor: ['', [Validators.required]],
    })
  }
}
