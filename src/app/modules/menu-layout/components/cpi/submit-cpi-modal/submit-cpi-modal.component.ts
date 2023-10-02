import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { NotificationService } from '@shared/services/notification.service';
import { cpiShema } from 'src/Core/interfaces/cpi.interface';

@Component({
  selector: 'app-submit-cpi-modal',
  templateUrl: './submit-cpi-modal.component.html',
  styleUrls: ['./submit-cpi-modal.component.css']
})
export class SubmitcpiModalComponent implements OnInit {
  @Output() DataUpdated: EventEmitter<cpiShema> = new EventEmitter<cpiShema>();
  @Input() dataPosition!: cpiShema;

  isVisible = false;
  CPIIsDisable: boolean = false;
  listOfData: cpiShema[] = [];
  validateForm!: FormGroup;
  newcpi!: cpiShema;

  url = {
    get: 'get-cpi',
    post: 'cpi',
    delete: 'cpi',
    update: 'cpi',
  };
  EmptyForm = this.fb.group({
    fechaInicial: ['', [Validators.required]],
    fechaFinal: ['', [Validators.required]],
    ValorUltimoMes: ['', [Validators.required]],
    ValorInicial: ['', [Validators.required]],
    Value: ['', [Validators.required]],
    RelacionInflacion: ['', [Validators.required]],

  });

  constructor(
    private globalService: EndPointGobalService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {this.validateForm = this.fb.group({
    fechaInicial: ['', [Validators.required]],
    fechaFinal: ['', [Validators.required]],
    ValorUltimoMes: ['', [Validators.required]],
    ValorInicial: ['', [Validators.required]],
    Value: ['', [Validators.required]],
    RelacionInflacion: ['', [Validators.required]],
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
      this.newcpi = {
        ...this.validateForm.value,
        estado: true
      };
      this.isVisible = false;
      this.globalService.Post(this.url.post, this.newcpi).subscribe(
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
      this.newcpi = {
        ...this.validateForm.value,
        estado: true
      };
      this.isVisible = false;
      this.globalService
        .Patch(this.url.post, this.dataPosition.ID, this.newcpi)
        .subscribe(
          (result: any) => {
            if (!result){
            this.dataPosition.fechaInicial = this.newcpi.fechaInicial;
            this.dataPosition.fechaFinal = this.newcpi.fechaFinal;
            this.dataPosition.ValorUltimoMes = this.newcpi.ValorUltimoMes;
            this.dataPosition.ValorInicial = this.newcpi.ValorInicial;
            this.dataPosition.Value = this.newcpi.Value;
            this.dataPosition.RelacionInflacion = this.newcpi.RelacionInflacion;

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

  editableFrom(data: cpiShema): void{
    //console.log(data);
    let fechaInicialParts = data.fechaInicial.split('-').map(part => parseInt(part, 10));
    let fechaFinalParts = data.fechaFinal.split('-').map(part => parseInt(part, 10));

    let fechaInicialUTC = new Date(fechaInicialParts[0], fechaInicialParts[1] - 1, fechaInicialParts[2]);
    let fechaFinalUTC = new Date(fechaFinalParts[0], fechaFinalParts[1] - 1, fechaFinalParts[2]);

    this.validateForm = this.fb.group({
      fechaInicial: [fechaInicialUTC, [Validators.required]],
      fechaFinal: [fechaFinalUTC, [Validators.required]],
      ValorUltimoMes: [data.ValorUltimoMes.toString(), [Validators.required]],
      ValorInicial: [data.ValorInicial.toString(), [Validators.required]],
      Value: [data.Value.toString(), [Validators.required]],
      RelacionInflacion: [data.RelacionInflacion.toString(), [Validators.required]],
    })
    console.log(this.validateForm.value);
  }

  fullSchema(){
    this.newcpi = {
      ... this.validateForm.value,
      estado: true
    }
  }

  updateMainTable(): void{
    this.dataPosition = {
      ID: this.dataPosition.ID,
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
      ValorUltimoMes: ['', [Validators.required]],
      ValorInicial: ['', [Validators.required]],
      Value: ['', [Validators.required]],
      RelacionInflacion: ['', [Validators.required]],
    })
  }
}
