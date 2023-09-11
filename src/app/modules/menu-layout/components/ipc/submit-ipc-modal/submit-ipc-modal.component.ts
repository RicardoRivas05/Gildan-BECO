import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { NotificationService } from '@shared/services/notification.service';
import { ipcShema } from 'src/Core/interfaces/ipc.interface';

@Component({
  selector: 'app-submit-ipc-modal',
  templateUrl: './submit-ipc-modal.component.html',
  styleUrls: ['./submit-ipc-modal.component.css']
})
export class SubmitipcModalComponent implements OnInit {
  @Output() DataUpdated: EventEmitter<ipcShema> = new EventEmitter<ipcShema>();
  @Input() dataPosition!: ipcShema;

  isVisible = false;
  ipcIsDisable: boolean = false;
  listOfData: ipcShema[] = [];
  validateForm!: FormGroup;
  newipc!: ipcShema;

  url = {
    get: 'get-ipc',
    post: 'ipc',
    delete: 'ipc',
    update: 'ipc',
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
      this.newipc = {
        ...this.validateForm.value,
        estado: true
      };
      this.isVisible = false;
      this.globalService.Post(this.url.post, this.newipc).subscribe(
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
      this.newipc = {
        ...this.validateForm.value,
        estado: true
      };
      this.isVisible = false;
      this.globalService
        .Patch(this.url.post, this.dataPosition.ID, this.newipc)
        .subscribe(
          (result: any) => {
            if (!result){
            this.dataPosition.fechaInicial = this.newipc.fechaInicial;
            this.dataPosition.fechaFinal = this.newipc.fechaFinal;
            this.dataPosition.ValorInicial = this.newipc.ValorInicial;
            this.dataPosition.ValorUltimoMes = this.newipc.ValorUltimoMes;
            this.dataPosition.Value = this.newipc.Value;
            this.dataPosition.RelacionInflacion = this.newipc.RelacionInflacion;

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

  editableFrom(data: ipcShema): void{
    //console.log(data);
    this.validateForm = this.fb.group({
      fechaInicial: [data.fechaInicial, [Validators.required]],
      fechaFinal: [data.fechaFinal, [Validators.required]],
      ValorInicial:[data.ValorInicial.toString(),[Validators.required]],
      ValorUltimoMes:[data.ValorUltimoMes.toString(),[Validators.required]],
      Value: [data.Value.toString(), [Validators.required]],
      RelacionInflacion:[data.RelacionInflacion.toString(), [Validators.required]],
    })
    console.log(this.validateForm.value);
  }

  fullSchema(){
    this.newipc = {
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
