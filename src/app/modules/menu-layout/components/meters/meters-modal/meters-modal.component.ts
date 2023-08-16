import { Component, OnInit , Input, Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { NotificationService } from '@shared/services/notification.service';
import { toBoolean, toNumber } from 'ng-zorro-antd/core/util';
import { SourceSchema } from 'src/Core/interfaces/iondata-source.interface';
import { MeasurePointSchema } from 'src/Core/interfaces/measure-point.interface';
import { MeterSchema } from 'src/Core/interfaces/meter.interface';


@Component({
  selector: 'app-meters-modal',
  templateUrl: './meters-modal.component.html',
  styleUrls: ['./meters-modal.component.css']
})
export class MetersModalComponent implements OnInit {
  @Input() dataPosition!: MeterSchema;
  @Input() listOfMPoinst: MeasurePointSchema[] = [];
  @Input() listOfSourceId: SourceSchema[] = [];
  @Output() DataUpdated : EventEmitter<MeterSchema> = new EventEmitter<MeterSchema>();

  tipoMedidorMap: { [key: number]: string } = {};
  validateForm!: FormGroup;
  isVisible:boolean = false;
  meter!: MeterSchema;
  url = {
    getMeters: 'get-meters',
    getVMeters: 'get-vmeters',
    get: 'medidors',
    postMeter:'medidors',
    del:'medidors',
  }

  constructor(
    private fb: FormBuilder,
    private  globalService : EndPointGobalService,
    private notificationService: NotificationService

  ) { }

  ngOnInit(): void {
    this.createTipoMedidorMap();
    this.cleanForm();
  }


  createTipoMedidorMap(): void {
    this.tipoMedidorMap = {};
    this.listOfMPoinst.forEach(option => {
      this.tipoMedidorMap[option.id] = option.descripcion;
    });
  }

  showModal(): void {
    this.isVisible = true;
    if(this.dataPosition){
      this.editableFrom(this.dataPosition);

    }else{
      this.cleanForm();
    }
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.cleanForm();
  }

  submitForm(): void {
    if(!this.dataPosition){
      this.submitPostForm();
    }else{
      this.submitUpdateForm();
    }
  }

  submitPostForm(){
    //console.log(this.validateForm.value);

    if (this.validateForm.valid) {
      this.fullSchema();
      this.globalService.Post(this.url.postMeter, this.meter).subscribe(
        (result:any) => {
          if(result){
            this.DataUpdated.emit(result);
            this.isVisible = false;

            this.notificationService.createMessage('success', 'La acción se ejecuto con exito 😎');
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

  submitUpdateForm(): void {
    if (this.validateForm.valid) {

      this.fullSchema();
      //console.log(this.meter);

      this.globalService.Patch(this.url.postMeter, this.dataPosition.id ,this.meter).subscribe(
        (result:any) => {

          if(!result){
            this.updateMainTable();
            this.isVisible = false;

            this.notificationService.createMessage('success', 'La acción se ejecuto con exito 😎');
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

  editableFrom(data: MeterSchema): void{
    //console.log(this.dataPosition.funcionalidad);
    this.validateForm = this.fb.group({
      sourceId: [data.sourceId, [Validators.required]],
      codigo: [data.codigo, [Validators.required]],
      descripcion: [data.descripcion, [Validators.required]],
      multiplicador: [data.multiplicador, [Validators.required]],
      modelo: [data.modelo, [Validators.required]],
      serie: [data.serie, [Validators.required]],
      lecturaMax: [data.lecturaMax, [Validators.required]],
      puntoConexion: [data.puntoConexion, [Validators.required]],
      TipoMedidorId: [data.TipoMedidorId, [Validators.required]],
      observacion: [data.observacion, [Validators.required]],
      tipo: [data.tipo, [Validators.required]],
      almacenamientoLocal: [data.almacenamientoLocal, [Validators.required]],
      funcionalidad: [data.funcionalidad, [Validators.required]],
    });

  }

  fullSchema(){

    this.meter = {
      ... this.validateForm.value,
      estado: true
    }
  }

  updateMainTable(): void{
    this.dataPosition.sourceId = this.validateForm.value.sourceId;
    this.dataPosition.codigo = this.validateForm.value.codigo;
    this.dataPosition.descripcion = this.validateForm.value.descripcion;
    this.dataPosition.modelo = this.validateForm.value.modelo;
    this.dataPosition.serie = this.validateForm.value.serie;
    this.dataPosition.lecturaMax = this.validateForm.value.lecturaMax;
    this.dataPosition.puntoConexion = this.validateForm.value.puntoConexion;
    this.dataPosition.TipoMedidorId = this.validateForm.value.TipoMedidorId;
    this.dataPosition.observacion = this.validateForm.value.observacion;
    this.dataPosition.tipo = this.validateForm.value.tipo;

    this.dataPosition.almacenamientoLocal = this.validateForm.value.almacenamientoLocal;
    this.dataPosition.funcionalidad = this.validateForm.value.funcionalidad;
    //console.log(this.validateForm.value);
    //console.log(this.dataPosition);

  }


  cleanForm(){
    this.validateForm = this.fb.group({
      sourceId: ['', [Validators.required]],
      codigo: ['', [Validators.required]],
      multiplicador: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      modelo: ['', [Validators.required]],
      serie: ['', [Validators.required]],
      lecturaMax: ['', [Validators.required]],
      puntoConexion: ['', [Validators.required]],
      TipoMedidorId: ['', [Validators.required]],
      observacion: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      almacenamientoLocal: ['', [Validators.required]],
      funcionalidad: ['', [Validators.required]],
    });

  }
}




