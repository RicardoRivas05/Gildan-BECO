import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { ColumnItem } from 'src/Core/interfaces/col-meter-table.interface';
import { RollOverSchema } from 'src/Core/interfaces/roll-over.interface';
import { endOfMonth } from 'date-fns';
import { toBoolean, toNumber } from 'ng-zorro-antd/core/util';
import { MeterSchema } from 'src/Core/interfaces/meter.interface';
import { ThisReceiver } from '@angular/compiler';
import { NotificationService } from '@shared/services/notification.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-roll-over-modal',
  templateUrl: './roll-over-modal.component.html',
  styleUrls: ['./roll-over-modal.component.css']
})
export class RollOverModalComponent implements OnInit, OnChanges {
  isVisible = false;
  validateForm!: FormGroup;
  @Input() dataPosition!: MeterSchema;
  newRollOver!: any;
  ListOfRollOver: RollOverSchema[] = [];
  ListOfData: RollOverSchema[] = [];
  dates:{from: any, to: any} = {from: '', to: ''};
  ranges = { Today: [new Date(), new Date()], 'This Month': [new Date(), endOfMonth(new Date())] };
  IsEditableSchema!: RollOverSchema;
  IsEditableForm: boolean = false;
  IsDisableRollOver: boolean = false;
  pipe = new DatePipe('en-US');

  onChange(result: Date[]): void {
    this.dates = {
      from: result[0],
      to: result[1]
    }
  }

  url = {
    get: 'roll-overs',
    post: 'roll-overs',
    update: 'roll-overs'
  }
  EmptyForm = this.fb.group({
    fecha: [ '', [Validators.required]],
    medidorId: [ '', [Validators.required]],
    energia: [ '', [Validators.required]],
    lecturaAnterior: ['', [Validators.required]],
    lecturaNueva: ['', [Validators.required]],
    observacion: [''],
  });

  constructor(
    private globalService: EndPointGobalService,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private nzMessageService: NzMessageService,
    ) {}




  ngOnInit(): void {
    this.validateForm = this.EmptyForm;
    this.GetRollOver();
  }
  ngOnChanges(changes: SimpleChanges): void {
  }

  GetRollOver(){
    this.globalService.Get(this.url.get).subscribe(
      (result: any) => {
        this.ListOfRollOver = result;
        this.filterData(true, false);
      }
    );
  }

  filterData(estado: boolean, switched: boolean){
    if(switched){
      if(estado)
        this.IsDisableRollOver = false;
      else
        this.IsDisableRollOver = true;

    }
    this.ListOfData.length = 0;
    for(let i = 0; i < this.ListOfRollOver.length; i++){
      if(this.ListOfRollOver[i].estado === estado && this.ListOfRollOver[i].medidorId === this.dataPosition.id){
        this.ListOfData = [... this.ListOfData, this.ListOfRollOver[i]];
      }
    }

    this.ListOfData = [... this.ListOfData];
  }


  editableForm(data: RollOverSchema){
    this.IsEditableSchema = data;
    this.IsEditableForm = true;
    this.validateForm = this.fb.group({
      fecha: [ [this.pipe.transform(new Date(data.fechaInicial), 'yyyy-MM-dd HH:mm:ss', 'GMT'),
      this.pipe.transform(new Date( data.fechaFinal), 'yyyy-MM-dd HH:mm:ss', 'GMT')], [Validators.required]],
      medidorId: [ data.medidorId, [Validators.required]],
      energia: [ data.energia, [Validators.required]],
      lecturaAnterior: [ data.lecturaAnterior, [Validators.required]],
      lecturaNueva: [data.lecturaNueva, [Validators.required]],
      observacion: [data.observacion],
    });
  }

  disableVMeter(rollOver: RollOverSchema, estado : boolean){
    rollOver.estado = estado;
    this.globalService.Patch(this.url.update, rollOver.id, {estado: estado}).subscribe(
      result => {
        if(!result){
          this.UpdateTable(rollOver);

          if(estado === true){
            this.filterData(false, false);
          }else{
            this.filterData(true, false);
          }

        }
      }
    );
  }
  submitForm(){
    if(!this.IsEditableForm){
      this.submitPostForm();
    }
    else if(this.IsEditableForm){
      this.submitUpdateForm();
    }

  }

  submitPostForm(): void{

    if (this.validateForm.valid) {
      const {medidorId, energia, lecturaAnterior, lecturaNueva, observacion} = this.validateForm.value;

      this.newRollOver = {
        ... {medidorId, energia, lecturaAnterior, lecturaNueva, observacion},
        fechaInicial: this.pipe.transform( this.dates.from , 'yyyy-MM-dd HH:mm:ss', '-1200'),
        fechaFinal:this.pipe.transform( this.dates.to , 'yyyy-MM-dd HH:mm:ss', '-1200'),
        estado: true
      }
      //console.log(this.newRollOver);
      this.globalService.Post(this.url.post, this.newRollOver).subscribe(
        (result:any) => {
          if(result){
            this.ListOfRollOver = [... this.ListOfRollOver, result];
            this.filterData(true, false);
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
      const {medidorId, energia, lecturaAnterior, lecturaNueva, observacion} = this.validateForm.value;

      this.newRollOver = {
        ... {medidorId, energia, lecturaAnterior, lecturaNueva, observacion},
        fechaInicial: this.pipe.transform( this.validateForm.value.fecha[0] , 'yyyy-MM-dd HH:mm:ss', '-1200'),
        fechaFinal:this.pipe.transform( this.validateForm.value.fecha[1], 'yyyy-MM-dd HH:mm:ss', '-1200'),
        estado: true
      }
      this.IsEditableSchema.observacion = this.newRollOver.observacion;
      this.IsEditableSchema.energia = this.newRollOver.energia;
      this.IsEditableSchema.fechaFinal = this.newRollOver.fechaFinal;
      this.IsEditableSchema.fechaInicial = this.newRollOver.fechaInicial;
      this.IsEditableSchema.lecturaAnterior = this.newRollOver.lecturaAnterior;
      this.IsEditableSchema.lecturaNueva = this.newRollOver.lecturaNueva;

      if(this.IsEditableSchema)
      this.globalService.PutId(this.url.update, this.IsEditableSchema.id, this.newRollOver).subscribe(
        (result:any) => {
          if(!result){
            this.newRollOver.id = this.dataPosition.id;
            this.UpdateTable(this.IsEditableSchema);
            this.filterData(this.IsEditableSchema.estado, false);
            this.IsEditableForm = false;
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

  UpdateTable(data: RollOverSchema){
    this.ListOfData.length = 0;
    for(let i = 0; i < this.ListOfRollOver.length; i++){
      if(this.ListOfRollOver[i].id === data.id){
        this.ListOfRollOver[i] = data;
      }
    }
    this.ListOfData = [... this.ListOfRollOver];
  }

  cleanForm(): void{
    this.validateForm = this.fb.group({
      fecha:  [ '', [Validators.required]],
      medidorId: [this.dataPosition.id],
      energia: [ '', [Validators.required]],
      lecturaAnterior: ['', [Validators.required]],
      lecturaNueva: ['', [Validators.required]],
      observacion: [''],
    });
  }

  showModal(): void {
    this.validateForm = this.EmptyForm;
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

  cancel(): void {
    this.nzMessageService.info('click cancel');
  }





  listOfColumns: ColumnItem[] = [
    {
      name: 'Fecha inicial',
      sortOrder: null,
      sortFn: (a: RollOverSchema, b: RollOverSchema) => (String(a.fechaInicial)).localeCompare(String(b.fechaInicial)),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: string[], item: RollOverSchema) => list.some(codigo => (String(item.fechaInicial)).indexOf(codigo) !== -1)
    },
    {
      name: 'FechaFinal',
      sortOrder: null,
      sortFn: (a: RollOverSchema, b: RollOverSchema) =>(String(a.fechaFinal)).localeCompare(String(b.fechaFinal)),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: string[], item: RollOverSchema) => list.some(codigo => (String(item.fechaFinal)).indexOf(codigo) !== -1)
    },
    {
      name: 'Ultima lectura',
      sortOrder: null,
      sortFn:  (a: RollOverSchema, b: RollOverSchema) => a.lecturaAnterior - (b.lecturaAnterior),
      sortDirections: [],
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true
    },
    {
      name: 'Nueva Lectura',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a: RollOverSchema, b: RollOverSchema) => a.lecturaNueva - (b.lecturaNueva),
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null,
    },
  ];
}
