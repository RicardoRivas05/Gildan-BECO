import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { toNumber } from 'ng-zorro-antd/core/util';
import { ContractMeterInterface } from 'src/Core/interfaces/contract-meter.interface';
import { EspecialChargesInterface } from 'src/Core/interfaces/especial-charges.interface';
import { InvoiceInterface } from 'src/Core/interfaces/invoices-tables.interface';

@Component({
  selector: 'app-modal-new-invoices',
  templateUrl: './modal-new-invoices.component.html',
  styleUrls: ['./modal-new-invoices.component.css']
})
export class ModalNewInvoicesComponent implements OnInit {
  isVisible = false;
  validateForm!: FormGroup;
  listOfData: InvoiceInterface[] = [];
  @Input() ListOfContractMeditors: ContractMeterInterface[] = [];
  @Input() state: number = 0;
  @Input() ListOfCharges: EspecialChargesInterface[] = [];
  @Output() DataUpdated : EventEmitter<InvoiceInterface> = new EventEmitter<InvoiceInterface>();

  url = {
    getcontratosM: 'get-c-meter',
    post: 'facturas',
    delete: 'facturas',
    update: 'facturas',
  };

  EmptyForm = this.fb.group({
    contratoMedidorId: [ '', [Validators.required]],
    cargoId: [ '', [Validators.required]],
    codigo: [ '', [Validators.required]],
    fechaLectura: ['', [Validators.required]],
    fechaVencimiento: ['', [Validators.required]],
    fechaInicio: ['', [Validators.required]],
    fechaFin: ['', [Validators.required]],
    tipoConsumo: ['', [Validators.required]],
    energiaConsumida: ['', [Validators.required]],
    observacion: ['', [Validators.required]],
  });

  constructor(
    private globalService: EndPointGobalService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.validateForm = this.EmptyForm;
  }
  
  showModal(): void {
    this.isVisible = true;
      this.validateForm = this.fb.group({
        contratoMedidorId: [ '', [Validators.required]],
        cargoId: [ '', [Validators.required]],
        codigo: [ '', [Validators.required]],
        fechaLectura: ['', [Validators.required]],
        fechaVencimiento: ['', [Validators.required]],
        fechaInicio: ['', [Validators.required]],
        fechaFin: ['', [Validators.required]],
        tipoConsumo: ['', [Validators.required]],
        energiaConsumida: ['', [Validators.required]],
        observacion: ['', [Validators.required]],
      });
    
  }

  handleOk(): void {
    this.isVisible = false;
    this.validateForm = this.fb.group({
      contratoMedidorId: [ '', [Validators.required]],
      cargoId: [ '', [Validators.required]],
      codigo: [ '', [Validators.required]],
      fechaLectura: ['', [Validators.required]],
      fechaVencimiento: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
      tipoConsumo: ['', [Validators.required]],
      energiaConsumida: ['', [Validators.required]],
      observacion: ['', [Validators.required]],
    });
  }

  handleCancel(): void {
    this.isVisible = false;
    this.validateForm = this.fb.group({
      contratoMedidorId: [ '', [Validators.required]],
      cargoId: [ '', [Validators.required]],
      codigo: [ '', [Validators.required]],
      fechaLectura: ['', [Validators.required]],
      fechaVencimiento: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
      tipoConsumo: ['', [Validators.required]],
      energiaConsumida: ['', [Validators.required]],
      observacion: ['', [Validators.required]],
    });
  }
  
  
  PushData(): void{
    if (this.validateForm.valid) {

      const provider = {
        ... this.validateForm.value,
        estado: 1,
      }  
       
        this.globalService.Post(this.url.post, provider).subscribe(
          (result:any) => { 
            if(result){
              this.DataUpdated.emit(result);
            }
          }
        );

      this.isVisible = false;
      
      this.validateForm = this.EmptyForm;
      
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
