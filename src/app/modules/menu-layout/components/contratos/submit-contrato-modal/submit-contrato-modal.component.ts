import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { NotificationService } from '@shared/services/notification.service';
import { variablesContratoShema } from 'src/Core/interfaces/variablesContrato.interface';

@Component({
  selector: 'app-submit-variablesContrato-modal',
  templateUrl: './submit-contrato-modal.component.html',
  styleUrls: ['./submit-contrato-modal.component.css']
})
export class SubmitvariablesContratoModalComponent implements OnInit {
  @Output() DataUpdated: EventEmitter<variablesContratoShema> = new EventEmitter<variablesContratoShema>();
  @Input() dataPosition!: variablesContratoShema;

  isVisible = false;
  variablesContratoIsDisable: boolean = false;
  listOfData: variablesContratoShema[] = [];
  validateForm!: FormGroup;
  newvariablesContrato!: variablesContratoShema;

  url = {
    get: 'get-variablesContratos',
    post: 'variablesContratos',
    delete: 'variablesContratos',
    update: 'variablesContratos',
  };
  EmptyForm = this.fb.group({
    fechaInicial: ['', [Validators.required]],
    fechaFinal: ['', [Validators.required]],
    nombreContrato: ['', [Validators.required]],
    cpcf: ['', [Validators.required]],
    cfc: ['', [Validators.required]],
    fdr: ['', [Validators.required]],
    cpomD:['', [Validators.required]],
    cpomL: ['', [Validators.required]],
    cvci: ['', [Validators.required]],
    cvco1: ['', [Validators.required]],
    cvco2: ['', [Validators.required]],
    otrosCargos: ['', [Validators.required]],

  });

  constructor(
    private globalService: EndPointGobalService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {this.validateForm = this.fb.group({
    fechaInicial: ['', [Validators.required]],
    fechaFinal: ['', [Validators.required]],
    nombreContrato: ['', [Validators.required]],
    cpcf: ['', [Validators.required]],
    cfc: ['', [Validators.required]],
    fdr: ['', [Validators.required]],
    cpomD:['', [Validators.required]],
    cpomL: ['', [Validators.required]],
    cvci: ['', [Validators.required]],
    cvco1: ['', [Validators.required]],
    cvco2: ['', [Validators.required]],
    otrosCargos: ['', [Validators.required]],
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
      this.newvariablesContrato = {
        ...this.validateForm.value,
        estado: true
      };
      this.isVisible = false;
      this.globalService.Post(this.url.post, this.newvariablesContrato).subscribe(
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
      this.newvariablesContrato = {
        ...this.validateForm.value,
        estado: true
      };


      this.isVisible = false;
      this.globalService
        .Patch(this.url.post, this.dataPosition.id, this.newvariablesContrato)
        .subscribe(
          (result: any) => {
            if (!result){
            this.dataPosition.fechaInicial = this.newvariablesContrato.fechaInicial;
            this.dataPosition.fechaFinal = this.newvariablesContrato.fechaFinal;
            this.dataPosition.nombreContrato = this.newvariablesContrato.nombreContrato;
            this.dataPosition.cpcf = this.newvariablesContrato.cpcf;
            this.dataPosition.cfc = this.newvariablesContrato.cfc;
            this.dataPosition.fdr = this.newvariablesContrato.fdr;
            this.dataPosition.cpomD = this.newvariablesContrato.cpomD;
            this.dataPosition.cpomL = this.newvariablesContrato.cpomL;
            this.dataPosition.cvci = this.newvariablesContrato.cvci;
            this.dataPosition.cvco1 = this.newvariablesContrato.cvco1;
            this.dataPosition.cvco2 = this.newvariablesContrato.cvco2;
            this.dataPosition.otrosCargos = this.newvariablesContrato.otrosCargos;


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

  editableFrom(data: variablesContratoShema): void{
    //console.log(data);
    this.validateForm = this.fb.group({
      fechaInicial: [data.fechaInicial, [Validators.required]],
      fechaFinal: [data.fechaFinal, [Validators.required]],
      nombreContrato: [data.nombreContrato, [Validators.required]],
      cpcf: [data.cpcf.toString(), [Validators.required]],
      cfc: [data.cfc.toString(), [Validators.required]],
      fdr: [data.fdr.toString(), [Validators.required]],
      cpomD: [data.cpomD.toString(), [Validators.required]],
      cpomL: [data.cpomL.toString(), [Validators.required]],
      cvci: [data.cvci.toString(), [Validators.required]],
      cvco1: [data.cvco1.toString(), [Validators.required]],
      cvco2: [data.cvco2.toString(), [Validators.required]],
      otrosCargos: [data.otrosCargos.toString(), [Validators.required]],

    })
    console.log(this.validateForm.value);
  }

  fullSchema(){
    this.newvariablesContrato = {
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
      nombreContrato: ['', [Validators.required]],
      cpcf: ['', [Validators.required]],
      cfc: ['', [Validators.required]],
      fdr: ['', [Validators.required]],
      cpomD:['', [Validators.required]],
      cpomL: ['', [Validators.required]],
      cvci: ['', [Validators.required]],
      cvco1: ['', [Validators.required]],
      cvco2: ['', [Validators.required]],
      otrosCargos: ['', [Validators.required]],
    })
  }
}
