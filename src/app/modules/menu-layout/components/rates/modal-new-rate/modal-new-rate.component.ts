import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { RatesInterface } from 'src/Core/interfaces/Rates.interface';
import { EndPointGobalService } from "@shared/services/end-point-gobal.service";
import { NotificationService } from '@shared/services/notification.service';
@Component({
  selector: 'app-modal-new-rate',
  templateUrl: './modal-new-rate.component.html',
  styleUrls: ['./modal-new-rate.component.css']
})
export class ModalNewRateComponent implements OnInit {
  listOfData2: RatesInterface[] = [];
  @Output() DataUpdated : EventEmitter<RatesInterface> = new EventEmitter<RatesInterface>();
  @Input() dataPosition!: RatesInterface | undefined;

  inputValue: string = 'my site';
  isVisible = false;
  validateForm!: FormGroup;
  list: any[] = [];

  url = {
    get: 'get-rates',
    post: 'tarifas',
    delete: 'tarifas',
    update: 'tarifas',
  };

  EmptyForm = this.fb.group({
    codigo: ['', [Validators.required]],
    tipo: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    observacion: ['', [Validators.required]],
  });

  constructor(
    private globalService: EndPointGobalService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.validateForm = this.EmptyForm;


  }

  showModal(): void {
    this.isVisible = true;
    this.validateForm = this.EmptyForm;
    if(this.dataPosition){
      this.validateForm =this.fb.group({
        tipo: [String(this.dataPosition.tipo), [Validators.required]],
        descripcion: [this.dataPosition.descripcion, [Validators.required]],
        observacion: [this.dataPosition.observacion, [Validators.required]],
        codigo: [this.dataPosition.codigo, [Validators.required]],
      });
    }
  }

  handleOk(): void {
    this.isVisible = false;
    this.validateForm = this.EmptyForm;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.validateForm = this.EmptyForm;
  }

  submitForm(){
    //console.log(this.dataPosition);

    if (this.validateForm.valid) {
      this.validateForm.value.tipo = Boolean(this.validateForm.value.tipo);
      const provider = {
        ... this.validateForm.value,
        puntoMedicionId: 1,
        estado: true,
      }

      if(this.dataPosition){
        this.globalService.PutId( this.url.post, this.dataPosition?.id, provider).subscribe(
          (result:any) => {
            if(!result){
              if(this.dataPosition){

                this.dataPosition.codigo = provider.codigo;
                this.dataPosition.descripcion = provider.descripcion;
                this.dataPosition.observacion = provider.observacion;
                this.dataPosition.tipo = provider.tipo;

            this.notificationService.createMessage('success', 'La acción se ejecuto con exito 😎');
          }else{
            this.notificationService.createMessage('error', 'La accion fallo 😓');
          }

              this.isVisible = false;
            }
          }
        );

      }else{
        this.globalService.Post(this.url.post, provider).subscribe(
          (result:any) => {
            if(result){
              this.DataUpdated.emit(result);
              this.isVisible = false;
              this.notificationService.createMessage('success', 'La acción se ejecuto con exito 😎');
            }else{
              this.notificationService.createMessage('error', 'La accion fallo 😓');
            }


          }
        );

      }


    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }

  }
}
