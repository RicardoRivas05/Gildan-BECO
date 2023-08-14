import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { NotificationService } from '@shared/services/notification.service';
import { toBoolean, toNumber } from 'ng-zorro-antd/core/util';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ColumnItem } from 'src/Core/interfaces/col-meter-table.interface';
import { MeterSchema } from 'src/Core/interfaces/meter.interface';
import { VirtualMeterInterface, VirtualMeterShema } from 'src/Core/interfaces/virtual-meter.interface';


@Component({
  selector: 'app-virtual-meter-modal',
  templateUrl: './virtual-meter-modal.component.html',
  styleUrls: ['./virtual-meter-modal.component.css']
})

export class VirtualMeterModalComponent implements OnInit {
  isVisible = false;
  @Input() listOfVMeters: VirtualMeterInterface[] = [];
  @Input() dataPosition!: MeterSchema;
  @Input() listOfMeters: MeterSchema[] = [];
  newVMeter!: any;
  validateForm!: FormGroup;
  listOfData: VirtualMeterInterface[] = [];
  VMIsDisable: boolean = false;
  IsEditableForm: boolean = false;
  IsEditableSchema!: VirtualMeterInterface;
  isDisableSourceId: boolean = true;

  url = {
    post: 'medidor-virtuals-custom',
    getVMetersDetail: 'medidor-virtual-detalles',
    update: 'medidor-virtuals'
  }

  constructor(
    private globalService: EndPointGobalService,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private nzMessageService: NzMessageService,
  ) { }

  ngOnInit(): void {
    this.GetVirtualMeters(true, false);
    this.cleanForm();
  }


  GetVirtualMeters(estado: boolean, switched: boolean){
    this.listOfData.length = 0;

    if(switched){
      if((!this.VMIsDisable) && estado === false){
        this.VMIsDisable = true;
      }else{
        this.VMIsDisable = false;
      }
    }
      for(let i = 0; i < this.listOfVMeters.length ; i++){
        if(this.dataPosition.id === this.listOfVMeters[i].medidorId && this.listOfVMeters[i].estado === estado){
          this.listOfData = [... this.listOfData, this.listOfVMeters[i]];
        }
      }


    this.listOfData = [... this.listOfData];
  }

  submitForm(estado: boolean){
    if(!this.IsEditableForm){
      this.submitPostForm(estado);
    }
    else if(this.IsEditableForm){
      this.submitUpdateForm();
    }
  }

  submitPostForm(estado: boolean): void{
    if (this.validateForm.valid) {
      //console.log(this.validateForm.value);

      this.newVMeter = {
        ... this.validateForm.value,
        estado: true
      }
      this.globalService.Post(this.url.post, this.newVMeter).subscribe(
        (result:any) => {
          if(result){

            this.listOfVMeters = [...this.listOfVMeters, result];
              this.GetVirtualMeters(result.estado, false);

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

  submitUpdateForm(){

    if (this.validateForm.valid) {

      const {porcentaje, operacion, observacion, sourceId, mostrar} =  this.validateForm.value;
      this.newVMeter = {
        ... {porcentaje, operacion, observacion},
        estado: true
      }
      this.IsEditableSchema.observacion = this.newVMeter.observacion;
      this.IsEditableSchema.operacion = this.newVMeter.operacion;
      this.IsEditableSchema.porcentaje = this.newVMeter.porcentaje;
      this.IsEditableSchema.sourceId = this.validateForm.value.sourceId;
      this.IsEditableSchema.mostrar = this.validateForm.value.mostrar;

      if(this.IsEditableSchema)
      this.globalService.PutId(this.url.update, this.IsEditableSchema.vmedidorId, this.newVMeter).subscribe(
        (result:any) => {
          if(!result){
            this.globalService.Patch( 'medidor-virtual-detalles', this.IsEditableSchema.id, {sourceId: this.validateForm.value.sourceId, mostrar: this.validateForm.value.mostrar}).subscribe(
              (result:any) => {
                if(!result){

                  this.IsEditableForm = false;
                  this.updateTable(this.IsEditableSchema);

                  this.cleanForm();
                  this.notificationService.createMessage('success', 'La acción se ejecuto con exito 😎');
                }else{
                  this.notificationService.createMessage('error', 'La accion fallo 😓');
                }

              }
            );
            this.IsEditableForm = false;
            this.cleanForm();
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

  editableForm(data: VirtualMeterInterface){
    //console.log(data.sourceId);
    //console.log(this.listOfMeters);
    this.IsEditableSchema = data;
    this.IsEditableForm = true;
    this.validateForm = this.fb.group({
      medidorId: [data.medidorId],
      sourceId: [data.sourceId],
      porcentaje: [data.porcentaje, [Validators.required]],
      operacion: [data.operacion, [Validators.required]],
      mostrar: [data.mostrar, [Validators.required]],
      observacion: [data.observacion, [Validators.required]],
    })

  }
  disableVMeter(vmeter: VirtualMeterInterface, estado : boolean){

    this.globalService.Patch(this.url.getVMetersDetail, vmeter.id, {estado: estado}).subscribe(
      result => {
        if(!result){
          for(let i = 0; i < this.listOfVMeters.length; i++){
            if(this.listOfVMeters[i].id === vmeter.id){
              this.listOfVMeters[i].estado = estado;
            }
          }

          if(estado){
            this.GetVirtualMeters(false, false);
          }else{
            this.GetVirtualMeters(true, false);
          }

        }
      }
    );
  }


  cleanForm(): void{
    this.validateForm = this.fb.group({
      medidorId: [this.dataPosition.id],
      sourceId: [''],
      porcentaje: ['', [Validators.required]],
      operacion: ['', [Validators.required]],
      mostrar: ['', [Validators.required]],
      observacion: ['', [Validators.required]],
    })
  }


  updateTable(data: any){
    for(let i = 0;i < this.listOfData.length; i++){
      if(this.listOfData[i].id === data.id ){
        this.listOfData[i] = data;
      }
    }
    this.listOfData = [... this.listOfData];

  }

  operacionEvent(data: boolean){
    if(data){
      this.isDisableSourceId = false;
    }

  }
  showModal(): void {
    this.isVisible = true;
    this.GetVirtualMeters(true, false);
    this.cleanForm();
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




  listOfColumns: ColumnItem[] = [
    {
      name: 'Porcentaje',
      sortOrder: 'descend',
      sortFn: (a: VirtualMeterShema, b: VirtualMeterShema) => a.porcentaje - b.porcentaje,
      sortDirections: ['ascend', 'descend', null],
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true
    },
    {
      name: 'Operacion',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a: VirtualMeterShema, b: VirtualMeterShema) => Number(a.operacion) - Number(b.operacion),
      filterMultiple: false,
      listOfFilter: [
      ],
      filterFn: null
    },
  ];

}
