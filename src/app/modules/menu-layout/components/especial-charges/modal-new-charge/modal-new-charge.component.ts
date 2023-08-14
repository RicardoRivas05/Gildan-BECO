import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { toNumber } from 'ng-zorro-antd/core/util';
import { ColumnItem } from 'src/Core/interfaces/col-meter-table.interface';
import { EspecialChargesInterface } from 'src/Core/interfaces/especial-charges.interface';
import { InputParametersInterface } from 'src/Core/interfaces/input-parameters.interface';
import { EndPointGobalService } from "@shared/services/end-point-gobal.service";
import { endOfMonth } from 'date-fns';
import { NotificationService } from '@shared/services/notification.service';

@Component({
  selector: 'app-modal-new-charge',
  templateUrl: './modal-new-charge.component.html',
  styleUrls: ['./modal-new-charge.component.css']
})
export class ModalNewChargeComponent implements OnInit, OnChanges {
  isVisible = false;
  validateForm!: FormGroup;
  provider!: any;
  @Input() dataPosition!: EspecialChargesInterface;
  @Output() DataUpdated : EventEmitter<EspecialChargesInterface> = new EventEmitter<EspecialChargesInterface>();

  dates:{from: any, to: any} = {from: '', to: ''};
  ranges = { Today: [new Date(), new Date()], 'This Month': [new Date(), endOfMonth(new Date())] };
  
  listOfData: any[] = [];
  url = {
    get: 'get-especial-charges',
    post: 'cargos-facturas',
    delete: 'cargos-facturas',
    update: 'cargos-facturas',
  };

  EmptyForm = this.fb.group({
    fecha: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    cargoFinanciamiento: ['', [Validators.required]],
    ajuste: ['', [Validators.required]],
    cargoCorte: ['', [Validators.required]],
    cargoMora: ['', [Validators.required]],
    otrosCargos: ['', [Validators.required]],
    observacion: ['', [Validators.required]],
  });

  EditableForm: FormGroup = this.fb.group({
    fecha: ['', [Validators.required]],
    descripcion: [this.dataPosition?.descripcion, [Validators.required]],
    cargoFinanciamiento: [this.dataPosition?.cargoFinanciamiento, [Validators.required]],
    ajuste: [this.dataPosition?.ajuste, [Validators.required]],
    cargoCorte: [this.dataPosition?.cargoCorte, [Validators.required]],
    cargoMora: [this.dataPosition?.cargoMora, [Validators.required]],
    otrosCargos: [this.dataPosition?.otrosCargos, [Validators.required]],
    observacion: [this.dataPosition?.observacion, [Validators.required]],
  });
  constructor(
    private globalService: EndPointGobalService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    
    this.validateForm = this.fb.group({
      fecha: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      cargoFinanciamiento: ['', [Validators.required]],
      ajuste: ['', [Validators.required]],
      cargoCorte: ['', [Validators.required]],
      cargoMora: ['', [Validators.required]],
      otrosCargos: ['', [Validators.required]],
      observacion: ['', [Validators.required]],
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.dataPosition){
      this.EditableForm = this.fb.group({
        fecha: [[this.dataPosition.fechaInicio.toString(), this.dataPosition.fechaFinal.toString()], [Validators.required]],
        descripcion: [this.dataPosition?.descripcion, [Validators.required]],
        cargoFinanciamiento: [this.dataPosition?.cargoFinanciamiento, [Validators.required]],
        ajuste: [this.dataPosition?.ajuste, [Validators.required]],
        cargoCorte: [this.dataPosition?.cargoCorte, [Validators.required]],
        cargoMora: [this.dataPosition?.cargoMora, [Validators.required]],
        otrosCargos: [this.dataPosition?.otrosCargos, [Validators.required]],
        observacion: [this.dataPosition?.observacion, [Validators.required]],
      });
    }
  }
  
  showModal(): void {
    if(this.dataPosition){
      this.editableForm();
    }else{
      this.validateForm = this.fb.group({
        fecha: ['', [Validators.required]],
        descripcion: ['', [Validators.required]],
        cargoFinanciamiento: ['', [Validators.required]],
        ajuste: ['', [Validators.required]],
        cargoCorte: ['', [Validators.required]],
        cargoMora: ['', [Validators.required]],
        otrosCargos: ['', [Validators.required]],
        observacion: ['', [Validators.required]],
      });
    }
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  Get(){
    this.globalService.Get(this.url.get).subscribe( 
      (result:any) => {
        result.Id = Number(result.Id);
        this.listOfData = result;
      }
    );
  }

  editableForm(){
    this.validateForm = this.fb.group({
      fecha: [[this.dataPosition.fechaInicio.toString(), this.dataPosition.fechaFinal.toString()], [Validators.required]],
      descripcion: [this.dataPosition.descripcion, [Validators.required]],
      cargoFinanciamiento: [this.dataPosition.cargoFinanciamiento, [Validators.required]],
      ajuste: [this.dataPosition.ajuste, [Validators.required]],
      cargoCorte: [this.dataPosition.cargoCorte, [Validators.required]],
      cargoMora: [this.dataPosition.cargoMora, [Validators.required]],
      otrosCargos: [this.dataPosition.otrosCargos, [Validators.required]],
      observacion: [this.dataPosition.observacion, [Validators.required]],
    });

  }

  submitForm(){
    if(!this.dataPosition){
      this.submitPostForm();

    }
    else{
      this.submitUpdateForm();
  

    }
  }
  
  submitPostForm(): void{
    if (this.validateForm.valid) {
      this.fullSchema();
      this.globalService.Post(this.url.post, this.provider).subscribe(
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
      this.globalService.PutId( this.url.post, this.dataPosition.id , this.provider).subscribe(
        (result:any) => {
          if(!result){
            this.updateMainTable(this.provider);
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

  fullSchema(){
    const {descripcion, cargoFinanciamiento, ajuste, cargoCorte, cargoMora, otrosCargos, observacion} = this.validateForm.value;
    this.provider = {
      ... {descripcion, cargoFinanciamiento, ajuste, cargoCorte, cargoMora, otrosCargos, observacion} ,
      fechaInicio: this.validateForm.value.fecha[0],
      fechaFinal: this.validateForm.value.fecha[1],
      totalCargos: 
      toNumber(this.validateForm.value.cargoCorte + this.validateForm.value.cargoMora
      + this.validateForm.value.otrosCargos + this.validateForm.value.ajuste),
      estado: true
    }  
  }

  updateMainTable(data: any){
    
    this.dataPosition.ajuste = data.ajuste;
    this.dataPosition.cargoCorte = data.cargoCorte;
    this.dataPosition.cargoFinanciamiento = data.cargoFinanciamiento;
    this.dataPosition.cargoMora = data.cargoMora;
    this.dataPosition.descripcion = data.descripcion;
    this.dataPosition.estado = data.estado;
    this.dataPosition.fechaFinal = data.fechaFinal;
    this.dataPosition.fechaInicio = data.fechaInicio;
    this.dataPosition.observacion = data.observacion;
    this.dataPosition.otrosCargos = data.otrosCargos;
    this.dataPosition.totalCargos = data.totalCargos;

  }


  
  onChange(result: Date[]): void {
    this.dates = {
      from: result[0],
      to: result[1]
    }
  }

}

