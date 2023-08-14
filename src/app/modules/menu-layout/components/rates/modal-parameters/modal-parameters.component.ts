import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { ColumnItem } from 'src/Core/interfaces/col-meter-table.interface';
import { RatesInterface } from 'src/Core/interfaces/Rates.interface';
import { InputParametersInterface, InputParamSchema } from "src/Core/interfaces/input-parameters.interface";
import { ChargesInterface } from 'src/Core/interfaces/charges.interface';
import { endOfMonth } from 'date-fns';
import { NotificationService } from '@shared/services/notification.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-modal-parameters',
  templateUrl: './modal-parameters.component.html',
  styleUrls: ['./modal-parameters.component.css']
})
export class ModalParametersComponent implements OnInit, OnChanges {
  selectedValue = null;
  ListOfData: InputParametersInterface[] = [];
  @Input() dataPosition !: RatesInterface;
  @Input() listOfParamRelation : InputParametersInterface[] = [];
  newParam!: InputParametersInterface | InputParamSchema;
  ListOfCharges: ChargesInterface[] = [];
  isVisible = false;
  editIsActive!: InputParametersInterface;
  isEditable: boolean = false;
  paramIsDisable: boolean = false;
  dates:{from: any, to: any} = {from: '', to: ''};
  ranges = { Today: [new Date(), new Date()], 'This Month': [new Date(), endOfMonth(new Date())] };
  validateForm!: FormGroup;
  pipe = new DatePipe('en-US');

  url = {
    get: 'get-parameter',
    getcargo: 'tipo-cargos',
    post: 'parametro-tarifa',
    update: 'tarifa-parametro-detalles',
    updateParam: 'parametro-tarifas',
  };

  constructor(
    private globalService: EndPointGobalService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.GetCargo();
    this.GetParams(true, false);
    this.cleanForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.GetParams(true, false);


  }

  GetCargo(){
    this.globalService.Get(this.url.getcargo).subscribe(
      (result: any) => {
        this.ListOfCharges = result;
        //console.log(result);

      }
    );
  }



  GetParams(estado: boolean, switched: boolean){
    this.ListOfData.length = 0;

    if(switched){
      if(estado === false){
        this.paramIsDisable = true;
      }else{
        this.paramIsDisable = false;
      }
    }
    for(let i = 0; i < this.listOfParamRelation.length ; i++){
      if(this.dataPosition.id === this.listOfParamRelation[i].tarifaId && this.listOfParamRelation[i].estado === estado){
        this.ListOfData = [... this.ListOfData,this.listOfParamRelation[i]];
      }
    }

    this.ListOfData = [... this.ListOfData];


  }

  disableRelation(param: InputParametersInterface, estado : boolean){
    this.globalService.Patch(this.url.update, param.id, {estado: estado}).subscribe(
      result => {
        if(!result){
          for(let i = 0; i < this.listOfParamRelation.length; i++){
            if(this.listOfParamRelation[i].id === param.id){
              this.listOfParamRelation[i].estado = estado;
            }
          }

          if(estado === true){
            this.GetParams(false, false);
          }else{
            this.GetParams(true, false);
          }

        }
      }
    );
  }

  submitPostParam(): void {
    if (this.validateForm.valid) {
        this.initializePostParam();
        this.globalService.Post(this.url.post, this.newParam).subscribe(
          (result:any) => {
            //console.log(result);

            if(result){
              this.listOfParamRelation = [...this.listOfParamRelation,result];
              if(this.paramIsDisable)
                this.GetParams(false, false);
              else
                this.GetParams(true, false);

              this.cleanForm();
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
  initializePostParam(): void{
    this.newParam = {
      idTarifa: this.dataPosition.id,
      ... this.validateForm.value,
      fechaInicio:  this.pipe.transform(this.validateForm.value.fecha[0], 'yyyy-MM-dd HH:mm', '-1200'),
      fechaFinal:  this.pipe.transform(this.validateForm.value.fecha[1], 'yyyy-MM-dd HH:mm', '-1200'),
      estado: true,
    }

  }

  submitEditableForm(dataEditable?: InputParametersInterface){
    if (this.validateForm.valid) {
      if(dataEditable){
        const {valor, observacion, tipoCargoId} = this.validateForm.value;
        this.newParam = {
        ... {valor, observacion, tipoCargoId},
        id: dataEditable.idParametro,
        tipo: dataEditable.tipo,
        fechaInicio:  this.pipe.transform(this.validateForm.value.fecha[0], 'yyyy-MM-dd HH:mm:ss', '-1200') || '',
        fechaFinal: this.pipe.transform(this.validateForm.value.fecha[1], 'yyyy-MM-dd HH:mm:ss', '-1200')  || '',
        estado: dataEditable.estado,
        }

        dataEditable.cargoId = this.newParam.tipoCargoId;
        dataEditable.fechaFinal = this.newParam.fechaFinal;
        dataEditable.fechaInicio = this.newParam.fechaInicio;
        dataEditable.valor = this.newParam.valor;
        dataEditable.observacion = this.newParam.observacion;

        this.globalService.PutId(this.url.updateParam, dataEditable.idParametro, this.newParam).subscribe(
          (result:any) => {
            if(!result){
              if(dataEditable)
              this.update(dataEditable, dataEditable.estado);
              this.notificationService.createMessage('success', 'La acción se ejecuto con exito 😎');
              this.isEditable = false;
            }else{
              this.notificationService.createMessage('error', 'La accion fallo 😓');
            }


          }
        );
        this.cleanForm();

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

  cleanForm(): void{
    this.validateForm = this.fb.group({
      fecha: ['', [Validators.required]],
      tipoCargoId: ['', [Validators.required]],
      valor: [0 , [Validators.required]],
      observacion: ['', [Validators.required]],
    })
    this.isEditable = false;

  }

  update(data: InputParametersInterface, estado: boolean): void{
    for(let i = 0; i < this.listOfParamRelation.length; i++){
      if(this.listOfParamRelation[i].id === data.id){
        this.listOfParamRelation[i] = {
          ... data
        }
      }
    }
    this.listOfParamRelation = [... this.listOfParamRelation];
    this.GetParams(estado, false)
  }

  editableForm(data: InputParametersInterface){
    this.editIsActive = data;
    this.isEditable = true;

    this.validateForm = this.fb.group({
      fecha: [[this.pipe.transform(data.fechaInicio, 'yyyy-MM-dd HH:mm', 'GMT'),  this.pipe.transform(data.fechaFinal, 'yyyy-MM-dd HH:mm', 'GMT')], [Validators.required]],
      tipoCargoId: [data.cargoId, [Validators.required]],
      valor: [data.valor, [Validators.required]],
      observacion: [data.observacion, [Validators.required]],
    })

  }


  showModal(): void {
    this.cleanForm();
    this.isVisible = true;
  }

  handleOk(): void {
    //console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    //console.log('Button cancel clicked!');
    this.isVisible = false;
  }


  listOfColumns: ColumnItem[] = [
    {
      name: 'Descripcion',
      sortOrder: null,
      sortFn: null,
      sortDirections: ['descend', null],
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true
    },
    {
      name: 'Fecha Inicial',
      sortOrder: null,
      sortFn: (a: InputParametersInterface, b: InputParametersInterface)=> a.fechaInicio.localeCompare(b.fechaInicio),
      sortDirections: ['ascend' ,'descend', null],
      listOfFilter:[],
      filterFn: null,
      filterMultiple: true
    },
    {
      name: 'Fecha Final',
      sortOrder: null,
      sortFn: (a: InputParametersInterface, b: InputParametersInterface)=> a.fechaFinal.localeCompare(b.fechaFinal),
      sortDirections: ['ascend' ,'descend', null],
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true
    },
  ];

}
