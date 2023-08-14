import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColumnItem } from 'src/Core/interfaces/col-meter-table.interface';
import { ContractInterface } from 'src/Core/interfaces/contracts.interface';
import { endOfMonth } from 'date-fns';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { EEHSchema } from 'src/Core/interfaces/eeh-invoice';
import { ManualInvoiceDetailView } from 'src/Core/interfaces/manual-invoice-detail.interface';
import { NotificationService } from '@shared/services/notification.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-factura-ehh',
  templateUrl: './factura-ehh.component.html',
  styleUrls: ['./factura-ehh.component.css']
})
export class FacturaEHHComponent implements OnInit {
  isVisible = false;
  validateForm!: FormGroup;
  @Input() dataPosition!: ContractInterface;
  listOfData: EEHSchema[] = [];
  listOfDataAux: EEHSchema[] = [];
  listOfManualInvoiceDetail: ManualInvoiceDetailView[] = [];
  localPosition!: EEHSchema;
  newFacturaEEH!:any;
  IsDisable: boolean = false;
  editIsActive: boolean = false;
  dates:{from: any, to: any} = {from: '', to: ''};
  ranges = { Today: [new Date(), new Date()], 'This Month': [new Date(), endOfMonth(new Date())] };
  listOfOption: Array<{ label: string; value: string }> = [];
  listOfTagOptions = [];
  
  url = {
    get: "factura-manuals",
    getdetalle: "get-manual-invoices-detail",
    post: "factura-manuals",
    update: "factura-manuals",

  }
  pipe = new DatePipe('en-US');

  constructor(
    private fb: FormBuilder,
    private globalService: EndPointGobalService,
    private notificationService: NotificationService,
    private nzMessageService: NzMessageService,
    ) { }


  ngOnInit(): void {
    this.cleanForm();
    const children: Array<{ label: string; value: string }> = [];
    for (let i = 10; i < 36; i++) {
      children.push({ label: i.toString(36) + i, value: i.toString(36) + i });
    }
    this.listOfOption = children;

    this.GetFacturas(true, false);
    this.GetManualInvoicesDetail();
    
  }

  showModal(): void {
    this.isVisible = true;
  }

  GetFacturas(estado: boolean, switched: boolean){

    this.globalService.Get(this.url.get).subscribe(
      (result: any) => {
        this.listOfDataAux = [... result];
        this.filterInvoices(estado, switched);
        
      }
    );  
  }

  GetManualInvoicesDetail(){
    this.globalService.Get(this.url.getdetalle).subscribe(
      (result: any) => {
        this.listOfManualInvoiceDetail = [... result];
      }
    );
  }

  filterInvoices(estado: boolean, switched: boolean){
    if(switched){
      if(estado == false)
        this.IsDisable = true;
      else
        this.IsDisable = false;
    }
      this.listOfData.length = 0;

    for(let i = 0; i < this.listOfDataAux.length; i++){
      if(this.dataPosition.id === this.listOfDataAux[i].contratoId && this.listOfDataAux[i].estado === estado){
        this.listOfData = [... this.listOfData, this.listOfDataAux[i]]
      }
    }
    this.listOfData = [... this.listOfData];
    
  }


  submitForm():void{
    if(this.editIsActive){
      this.submitUpdateForm();
    }
    else{
      this.submitPostForm();
    }
  }
  submitPostForm(): void{
    
    if (this.validateForm.valid) {
      this.fullSchema();
      this.newFacturaEEH.estado = true;
      this.globalService.Post(this.url.post, this.newFacturaEEH).subscribe(
        (result:any) => { 
          if(result){
            this.GetFacturas(this.newFacturaEEH.estado, false);
            this.cleanForm();
            this.notificationService.createMessage('success', 'Factura creada con exito 😎');
          }else{
            this.notificationService.createMessage('error', 'La creacion fallo 😓');

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

  submitUpdateForm(): void{
    
    if (this.validateForm.valid) {
      this.fullSchema();
      this.newFacturaEEH.estado = this.localPosition.estado;
      this.globalService.PutId( this.url.post, this.localPosition.id, this.newFacturaEEH).subscribe(
        (result:any) => {
          if(!result){
            if(this.localPosition.estado)
              this.GetFacturas(true, false);
            else
              this.GetFacturas(false, false);

            this.cleanForm();
            this.notificationService.createMessage('success', 'Factura actualizada con exito 😎');
          }else{
            this.notificationService.createMessage('error', 'La actualizacion fallo 😓');

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

  updateTable(data: EEHSchema){

    for(let i = 0; i < this.listOfDataAux.length; i++){
      if(this.listOfDataAux[i].id === data.id){
        this.listOfDataAux[i].codigo = this.validateForm.value.codigo;
        this.listOfDataAux[i].fechaEmision = this.validateForm.value.fechaVencimiento[0];
        this.listOfDataAux[i].fechaVencimiento = this.validateForm.value.fechaVencimiento[1];
        this.listOfDataAux[i].fechaInicial = this.validateForm.value.fechaFacturacion[0];
        this.listOfDataAux[i].fechaFinal = this.validateForm.value.fechaFacturacion[1];
      }
    }
    
    this.filterInvoices(true, false);
    
    
  }

  fullSchema(): void{
    const {codigo, cargoReactivo} = this.validateForm.value;

    this.newFacturaEEH = {
      ... {codigo, cargoReactivo},
      contratoId: this.dataPosition.id,
      tipoFacturaId: 1,
      fechaEmision: this.pipe.transform(this.validateForm.value.fechaVencimiento[0], 'yyyy-MM-dd HH:mm:ss', '-1200'),
      fechaVencimiento: this.pipe.transform(this.validateForm.value.fechaVencimiento[1], 'yyyy-MM-dd HH:mm:ss', '-1200'),
      fechaInicial: this.pipe.transform(this.validateForm.value.fechaFacturacion[0], 'yyyy-MM-dd HH:mm:ss', '-1200'),
      fechaFinal: this.pipe.transform(this.validateForm.value.fechaFacturacion[1], 'yyyy-MM-dd HH:mm:ss', '-1200'),
      estado: true,
    }
  }

  disable(data: EEHSchema, estado: boolean): void{
    this.globalService.Patch(this.url.update, data.id, {estado: estado}).subscribe(
      result => {
        
        if(!result){
          if(estado === true){
            this.GetFacturas(false, false);
          }else{
            this.GetFacturas(true, false);
          }

        }
      }
    );
    
  }

  editableForm(data: EEHSchema){
    this.validateForm = this.fb.group({
      fechaVencimiento: [[ this.pipe.transform(new Date(data.fechaEmision), 'yyyy-MM-dd HH:mm:ss', 'GMT'), this.pipe.transform(new Date(data.fechaVencimiento), 'yyyy-MM-dd HH:mm:ss', 'GMT')], [Validators.required]],
      fechaFacturacion: [[this.pipe.transform(new Date(data.fechaInicial), 'yyyy-MM-dd HH:mm:ss', 'GMT'),
       this.pipe.transform(new Date( data.fechaFinal), 'yyyy-MM-dd HH:mm:ss', 'GMT')], [Validators.required]],
      codigo: [data.codigo, [Validators.required]],
      cargoReactivo: [ data.cargoReactivo , [Validators.required]],
    })
    this.localPosition = data;
    this.editIsActive = true;
  }

  cleanForm(){
    this.validateForm = this.fb.group({
      fechaVencimiento: ['', [Validators.required]],
      fechaFacturacion: ['', [Validators.required]],
      codigo: ["", [Validators.required]],
      cargoReactivo: [ 0 , [Validators.required]],
    })
    this.editIsActive = false;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  cancel(): void {
  }
  
  
  listOfColumns: ColumnItem[] = [
    {
      name: 'Codigo',
      sortOrder: null,
      sortFn: (a: EEHSchema, b: EEHSchema) => a.codigo.localeCompare(b.codigo),
      sortDirections: ['ascend','descend', null],
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true
    },
    {
      name: 'Fecha Emision',
      sortOrder: null,
      sortFn: (a: EEHSchema, b: EEHSchema) => a.fechaEmision.localeCompare(b.fechaEmision),
      sortDirections: ['ascend','descend', null],
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true
    },
    {
      name: 'Fecha Vencimiento',
      sortOrder: null,
      sortFn: (a: EEHSchema, b: EEHSchema) => a.fechaVencimiento.localeCompare(b.fechaVencimiento),
      sortDirections: ['ascend','descend', null],
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true
    },
    {
      name: 'Fecha Inicial',
      sortOrder: null,
      sortFn:  (a: EEHSchema, b: EEHSchema) => a.fechaInicial.localeCompare(b.fechaInicial),
      sortDirections: ['ascend','descend', null],
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true
    },
    {
      name: 'Fecha Final',
      sortOrder: null,
      sortFn: (a: EEHSchema, b: EEHSchema) => a.fechaFinal.localeCompare(b.fechaFinal),
      sortDirections: ['ascend','descend', null],
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true
    },
  ];

}
