import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { ColumnItem } from 'src/Core/interfaces/col-meter-table.interface';
import { ContractInterface, ContractSchema } from 'src/Core/interfaces/contracts.interface';
import { EndPointGobalService } from "@shared/services/end-point-gobal.service";
import { ActorInterface } from 'src/Core/interfaces/actors.interface';
import { toBoolean, toNumber } from 'ng-zorro-antd/core/util';
import { endOfMonth } from 'date-fns';
import { NotificationService } from '@shared/services/notification.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DatePipe } from '@angular/common';



@Component({
  selector: 'app-modal-new-contract',
  templateUrl: './modal-new-contract.component.html',
  styleUrls: ['./modal-new-contract.component.css']
})
export class ModalNewContractComponent implements OnInit {
  inputValue: string = 'my site';
  isVisible = false;
  validateForm!: FormGroup;
  newContract!: any;
  @Input() dataPosition!: ContractInterface;
  @Input() ListOfClients: ActorInterface[] = [];
  @Output() DataUpdated : EventEmitter<ContractInterface> = new EventEmitter<ContractInterface>();
  ListOfContractTypes: any[] = [];
  ListOfClientsAux: ActorInterface[] = [];
  dates:{from: any, to: any} = {from: '', to: ''};
  ranges = { Today: [new Date(), new Date()], 'This Month': [new Date(), endOfMonth(new Date())] };
  pipe = new DatePipe('en-US');

  url = {
    get: 'get-contracts',
    post: 'contratos',
    delete: 'contratos',
    update: 'contratos',
  };


  constructor(
    private fb: FormBuilder,
    private globalService: EndPointGobalService,
    private notificationService: NotificationService,
    private nzMessageService: NzMessageService,
    ) { }

  ngOnInit(): void {
    this.cleanForm();
    this.globalService.Get("tipo-contratos").subscribe(
      (result: any) => {
        this.ListOfContractTypes = result;
      }
    );
  }

  showModal(): void {
    this.isVisible = true;
    if(this.dataPosition){
      this.filterActores(this.dataPosition.tipoContratoId);
      this.editableForm();
    }else{
      this.cleanForm();

    }
  }

  editableForm(){
    this.validateForm = this.fb.group({
      codigo: [ this.dataPosition.codigo , [Validators.required]],
      tipoContratoId: [ this.dataPosition.tipoContratoId, [Validators.required]],
      actorId: [ this.dataPosition.actorId, [Validators.required]],
      fecha: [ [this.pipe.transform(new Date(this.dataPosition.fechaCreacion), 'yyyy-MM-dd HH:mm:ss', 'GMT'),
      this.pipe.transform(new Date(this.dataPosition.fechaVenc), 'yyyy-MM-dd HH:mm:ss', 'GMT')], [Validators.required]],
      diaGeneracion: [ this.dataPosition.diaGeneracion, [Validators.required]],
      diasDisponibles: [ this.dataPosition.diasDisponibles, [Validators.required]],
      exportacion: [ this.dataPosition.exportacion, [Validators.required]],
      descripcion: [ this.dataPosition.descripcion, [Validators.required]],
      observacion: [ this.dataPosition.observacion, [Validators.required]],
    })
  }

  cleanForm(){
    this.validateForm = this.fb.group({
      codigo: ['', [Validators.required]],
      tipoContratoId: ['', [Validators.required]],
      actorId: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
      diaGeneracion: ['', [Validators.required]],
      diasDisponibles: ['', [Validators.required]],
      exportacion: [true, [Validators.required]],
      descripcion: ['', [Validators.required]],
      observacion: ['', [Validators.required]],
    })
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  submitForm(){
    if(!this.dataPosition){
      this.submitPostForm();
    }else{
      this.submitUpdateForm();
    }

  }
  submitPostForm(): void{
    if (this.validateForm.valid) {
      this.fullSchema();
      this.globalService.Post(this.url.post, this.newContract).subscribe(
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

      this.globalService.PutId( this.url.post, this.dataPosition.id , this.newContract).subscribe(
        (result:any) => {
          if(!result){
            this.updateMainTable(this.newContract);
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

  updateMainTable(data: ContractSchema){

    for(let i=0; i<this.ListOfClients.length ; i++){
      if(this.ListOfClients[i].id == this.newContract.actorId){
        this.dataPosition.nombre = this.ListOfClients[i]?.nombre;

      }
    }
    for(let i = 0; i< this.ListOfClientsAux.length; i++){
      if(data.actorId === this.ListOfClients[i].id){
        this.dataPosition.nombre = this.ListOfClientsAux[i-1]?.nombre;
      }
    }
    this.dataPosition.codigo = this.newContract.codigo;
    this.dataPosition.descripcion = this.newContract.descripcion;
    this.dataPosition.fechaCreacion = this.newContract.fechaCreacion;
    this.dataPosition.fechaVenc = this.newContract.fechaVenc;
    this.dataPosition.exportacion = this.newContract.exportacion;
    this.dataPosition.tipoContratoId = this.newContract.tipoContratoId;
    this.dataPosition.actorId = this.newContract.actorId;
    this.dataPosition.diaGeneracion = this.newContract.diaGeneracion;
    this.dataPosition.diasDisponibles = this.newContract.diasDisponibles;
    this.dataPosition.observacion = this.newContract.observacion;
  }

  fullSchema(){
    const {codigo, clasificacion, actorId, diaGeneracion, diasDisponibles, exportacion, descripcion, observacion, tipoContratoId} = this.validateForm.value;

    this.newContract = {
      ... {codigo, clasificacion, actorId, diaGeneracion, diasDisponibles, exportacion, descripcion, observacion, tipoContratoId},
      fechaCreacion: this.pipe.transform(this.validateForm.value.fecha[0], 'yyyy-MM-dd HH:mm:ss', '-1200'),
      fechaVenc:  this.pipe.transform(this.validateForm.value.fecha[1], 'yyyy-MM-dd HH:mm:ss', '-1200'),
      estado: true,
    }

  }

  filterActores(tipoActor: any){
    if(tipoActor === 1 || tipoActor === 4 ){
      tipoActor = false;
    }
    else
      tipoActor = true;

    this.ListOfClientsAux.length = 0;
    for(let i = 0; i < this.ListOfClients.length; i++){
      if(this.ListOfClients[i].tipo === tipoActor && this.ListOfClients[i].estado === true){
        this.ListOfClientsAux = [... this.ListOfClientsAux, this.ListOfClients[i]];
      }
    }
  }

  cancel(): void {
    this.nzMessageService.info('click cancel');
  }
  listOfColumns: ColumnItem[] = [
    {
      name: 'Codigo Medidor',
      sortOrder: 'descend',
      sortFn: (a: any, b: any) => a.codigo.localeCompare(b.codigo),
      sortDirections: ['descend', null],
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true
    },
    {
      name: 'Fecha Inicial',
      sortOrder: 'descend',
      sortFn: (a: any, b: any) => a.descripcion.localeCompare(b.descripcion),
      sortDirections: ['descend', null],
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true
    },
    {
      name: 'Fecha Final',
      sortOrder: 'descend',
      sortFn: (a: any, b: any) => a.descripcion.localeCompare(b.descripcion),
      sortDirections: ['descend', null],
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true
    }
  ];

}
