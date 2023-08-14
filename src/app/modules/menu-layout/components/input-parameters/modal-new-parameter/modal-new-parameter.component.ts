import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { ContractInterface } from 'src/Core/interfaces/contracts.interface';
import { EndPointGobalService } from "@shared/services/end-point-gobal.service";
import { RatesInterface } from 'src/Core/interfaces/Rates.interface';
import { InputParametersInterface, InputParamSchema } from 'src/Core/interfaces/input-parameters.interface';
import { ChargesInterface } from 'src/Core/interfaces/charges.interface';
import { endOfMonth } from 'date-fns';

@Component({
  selector: 'app-modal-new-parameter',
  templateUrl: './modal-new-parameter.component.html',
  styleUrls: ['./modal-new-parameter.component.css']
})
export class ModalNewParameterComponent implements OnInit {
  isVisible = false;
  validateForm!: FormGroup;
  newParam!: any;
  @Input() dataPosition!: InputParamSchema;
  @Input() ListOfCharges: ChargesInterface[] = [];
  @Output() DataUpdated : EventEmitter<InputParamSchema> = new EventEmitter<InputParamSchema>();
  dates:{from: any, to: any} = {from: '', to: ''};
  ranges = { Today: [new Date(), new Date()], 'This Month': [new Date(), endOfMonth(new Date())] };

  
  url = {
    get: 'get-allparameters',
    getcargo: 'tipo-cargos',
    post: 'parametro-global',
    delete: 'parametro-tarifas',
    update: 'parametro-tarifas',
  };

  EmptyForm = this.fb.group({
    fecha: [ '', [Validators.required]],
    tipoCargoId: ['', [Validators.required]],
    valor: ['', [Validators.required]],
    observacion: ['', [Validators.required]],
  });
  constructor(
    private globalService: EndPointGobalService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.validateForm = this.EmptyForm;
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
      this.fullSchema();
      this.globalService.Post(this.url.post, this.newParam).subscribe(
        (result:any) => {
          if(result){
            this.DataUpdated.emit(result);
            this.isVisible = false;
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
      this.fullSchema();
      if(this.dataPosition.id)
      this.globalService.Patch(this.url.update, this.dataPosition.id , this.newParam).subscribe(
        (result:any) => {
          if(!result){
            this.updateMainTable();
            this.isVisible = false;
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
  editableFrom(data: InputParamSchema): void{
    this.validateForm = this.fb.group({
      fecha: [[data.fechaInicio.toString(), data.fechaFinal.toString()], [Validators.required]],
      tipoCargoId: [data.tipoCargoId, [Validators.required]],
      valor: [data.valor, [Validators.required]],
      observacion: [data.observacion, [Validators.required]],
    });
  }

  fullSchema(){
    const {tipoCargoId, valor, observacion} = this.validateForm.value;
      this.newParam = {
        ... {tipoCargoId, valor, observacion},
        fechaInicio: this.validateForm.value.fecha[0],
        fechaFinal: this.validateForm.value.fecha[1],
        tipo: false,
        estado: true
      }
  }

  updateMainTable(): void{
    this.dataPosition.fechaInicio = this.newParam.fechaInicio;
    this.dataPosition.fechaFinal = this.newParam.fechaFinal;
    this.dataPosition.observacion = this.newParam.observacion;
    this.dataPosition.tipoCargoId = this.newParam.tipoCargoId;
    this.dataPosition.valor = this.newParam.valor;
  }


  showModal(): void {
    this.isVisible = true;
    if(!this.dataPosition){
      this.validateForm = this.EmptyForm;

    }else{
      this.editableFrom(this.dataPosition);
    }
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }


}
