import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ColumnItem } from 'src/Core/interfaces/col-meter-table.interface';
import { EEHSchema } from 'src/Core/interfaces/eeh-invoice';
import { endOfMonth } from 'date-fns';
import { InvoiceChargeTypeSchema } from 'src/Core/interfaces/charge-type-invoices.interface';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { ManualInvoiceDetailSchema, ManualInvoiceDetailView } from 'src/Core/interfaces/manual-invoice-detail.interface';
import { ManualInvoiceChargue } from 'src/Core/interfaces/manual-invoice-chargue.interface';
import { NotificationService } from '@shared/services/notification.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-modal-cargos-eeh',
  templateUrl: './modal-cargos-eeh.component.html',
  styleUrls: ['./modal-cargos-eeh.component.css']
})
export class ModalCargosEehComponent implements OnInit {
  isVisible = false;
  validateForm!: FormGroup;
  @Input() dataPosition!: EEHSchema;
  listOfData: ManualInvoiceDetailView[] = [];
  @Input() listOfDataAux: ManualInvoiceDetailView[] = [];
  newCargo!: any;
  IsDisable: boolean = false;
  editIsActive: boolean = false;
  dates:{from: any, to: any} = {from: '', to: ''};
  ranges = { Today: [new Date(), new Date()], 'This Month': [new Date(), endOfMonth(new Date())] };
  localPosition!: ManualInvoiceDetailView;
  total: number = 0;
  totalAux: number = 0;
  url = {
    get: "tipo-cargo-factura-manuals",
    post: "detalle-factura-manuals-custom",
    update: "detalle-factura-manuals",
    updateCargo: "tipo-cargo-factura-manuals",
  }

  constructor(private fb: FormBuilder,
    private globalService: EndPointGobalService,
    private notificationService: NotificationService,
    private nzMessageService: NzMessageService,
    ) {}

  ngOnInit(): void {
    this.CleanForm();
    this.filterCargos(true, false);
    this.totalCargos();
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
      this.validateForm.value.valor = this.validateForm.value.valor.replace(/(,)/gm, "");
      this.fullSchema();
      this.newCargo.estado = true;
      this.newCargo.facturaId =  this.dataPosition.id;
      this.globalService.Post(this.url.post, this.newCargo).subscribe(
        (result:any) => { 
          if(result){
            this.listOfDataAux = [... this.listOfDataAux, result];
            this.filterCargos(true, false);

            this.CleanForm(); 
            
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

  submitUpdateForm(): void{
    
    if (this.validateForm.valid) {
      this.validateForm.value.valor = this.validateForm.value.valor.replace(/(,)/gm, "");
      this.newCargo = {
        ... this.validateForm.value,
        estado: this.localPosition.estado
      }
      this.globalService.PutId( this.url.updateCargo, this.localPosition.tipoCargoId, this.newCargo).subscribe(
        (result:any) => {
          if(!result){
            this.updateTable(this.localPosition.tipoCargoId, this.newCargo.estado);

            this.CleanForm(); 
            
            this.editIsActive = false;
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

  updateTable(id: number, estado: boolean){
    this.listOfData.length =0;
    for(let i=0; i < this.listOfDataAux.length; i++){
      
    if(id === this.listOfDataAux[i].tipoCargoId){
      this.listOfDataAux[i].nombre = this.validateForm.value.nombre;
    }
  }

  this.totalCargos();
  this.filterCargos(estado, false);

  }

  fullSchema(): void{

    
    const {nombre, valor} = this.validateForm.value;

    this.newCargo = {
      ... {nombre, valor},
      estado: true,
    }
  }

  disable(data: ManualInvoiceDetailView, estado: boolean): void{
    this.globalService.Patch(this.url.update, data.detalleId, {estado: estado}).subscribe(
      result => {
        if(!result){
          for(let i=0; i < this.listOfDataAux.length; i++){
            
          if(data.tipoCargoId === this.listOfDataAux[i].tipoCargoId){
            this.listOfDataAux[i].estado = estado;
          }

        }
          
          if(estado === true){
            this.filterCargos(false, false)
          }else{
            this.filterCargos(true  , false);
          }
          
        }
      }
    );
    
  }


  editableForm(data: ManualInvoiceDetailView){
    
    this.validateForm = this.fb.group({
      nombre: [data.nombre, [Validators.required]],
      valor: [data.valor.toString(), [Validators.required]],
    });
    this.localPosition = data;
    this.editIsActive = true;
  }

  
  showModal(): void {
    this.CleanForm();
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  cancel(): void {
    this.nzMessageService.info('click cancel');
  }

  CleanForm(): void {
    this.validateForm = this.fb.group({
      nombre: ["", [Validators.required]],
      valor: [0, [Validators.required]],
    });
    this.editIsActive = false;
  }

  GetTipoCargosFacturaManual(): void{
    this.globalService.Get(this.url.get).subscribe(
      (result: any) => {
        this.listOfData = [... result];
      }
    );
  }

  filterCargos(estado: boolean, switched: boolean){
    if(switched){
      if(estado == false)
        this.IsDisable = true;
      else
        this.IsDisable = false;
    }
      this.listOfData.length = 0;

      for(let i=0; i < this.listOfDataAux.length; i++){
      if(this.dataPosition.id === this.listOfDataAux[i].id  && this.listOfDataAux[i].estado === estado){
        this.listOfData = [... this.listOfData, this.listOfDataAux[i]];
      }
    }
    this.listOfData = [... this.listOfData];
    
  }

  totalCargos(){
    this.total = 0;
    for(let i=0; i < this.listOfData.length; i++){
      this.total += this.listOfData[i].valor;
    }
  }

  UpdateTotalCargos(valor: any){
    valor = Number(valor);
    this.total= 0;
    this.totalCargos();
    return this.total += valor;
  }

  
  
  
  listOfColumns: ColumnItem[] = [
    {
      name: 'Nombre',
      sortOrder: null,
      sortFn: (a: any, b: any) => a.codigo.localeCompare(b.codigo),
      sortDirections: ['ascend','descend', null],
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true
    },
    {
      name: 'Valor',
      sortOrder: null,
      sortFn: (a: any, b: any) => a.fechaEmision.localeCompare(b.fechaEmision),
      sortDirections: ['ascend','descend', null],
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true
    },
  ];
}
