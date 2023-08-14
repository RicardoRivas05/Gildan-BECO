import { Component, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { ColumnItem } from 'src/Core/interfaces/col-meter-table.interface';
import { MeterSchema } from 'src/Core/interfaces/meter.interface';
import { MeasurePointSchema } from 'src/Core/interfaces/measure-point.interface';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { ManualInterface, ManualSchema } from 'src/Core/interfaces/manualRegister.interface';
import { VariableSchema } from 'src/Core/interfaces/variable.interface';
import { VirtualMeterInterface } from 'src/Core/interfaces/virtual-meter.interface';
import { SourceSchema } from 'src/Core/interfaces/iondata-source.interface';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NotificationService } from '@shared/services/notification.service';


@Component({
  selector: 'app-meters',
  templateUrl: './meters.component.html',
  styleUrls: ['./meters.component.css']
})
export class MetersComponent implements OnInit, OnChanges {
  listOfData: MeterSchema[] = [];
  listOfDataVM: VirtualMeterInterface [] = [];
  meterIsManual: boolean = false;
  meterIsActive: boolean = false;
  vmeterIsActive: boolean = false;
  listOfMPoinst: MeasurePointSchema[] = [];
  listOfManualRegister: MeterSchema[] = [];
  listOfVariables: VariableSchema[] = [];
  listOfManualMeterAux: MeterSchema[] = [];
  listOfSource: SourceSchema[] = [];

  url = {
    getMeters: 'get-meters',
    getVMetersDetail: 'get-vmeters-detail',
    getVMeters: 'get-vmeters',
    getSource: 'get-source',
    getVMetersmodel: 'medidor-virtuals',
    getMeasurePoints: 'get-zones',
    getVariables: "variables",
    get: 'medidors',
    post:'medidors',
    delete:'medidors',
    update: 'medidors'
  }

  constructor(
    private fb: FormBuilder,
    private http:HttpClient,
    private globalService: EndPointGobalService,
    private nzMessageService: NzMessageService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.GetMeters(1, false);
    this.GetVirtualMeters();
    this.GetMeasurePoint();
    this.GetVariables();
    this.GetSource();

  }
 ngOnChanges(changes: SimpleChanges): void {

 }
  updateTable(list: MeterSchema){
    this.listOfData = [...this.listOfData, list];
  }

  GetMeters(estado: number, switched: boolean){
    if(switched){
      if((!this.meterIsActive) && estado === 0){
        this.meterIsActive = true;
      }else{
        this.meterIsActive = false;
      }
    }

    this.globalService.GetId(this.url.getMeters, estado).subscribe(
      (result:any) => {
        this.listOfData =  result;
        this.listOfManualMeterAux = result;
      }
    );
  }

  GetMeasurePoint(): void{
    this.globalService.GetId(this.url.getMeasurePoints, 1).subscribe(
      (result:any) => {
        this.listOfMPoinst = result;
      }
    );
  }

  GetVirtualMeters(){
    this.globalService.Get(this.url.getVMetersDetail).subscribe(
      (result:any) => {
        this.listOfDataVM = result;

      }
    );
  }

  GetSource(){
    this.globalService.Get(this.url.getSource).subscribe(
      (result:any) => {
        this.listOfSource = result;
      }
    );
  }


  GetManualSchemas(isManual: boolean){
    if(isManual)
      this.meterIsManual = true;
    else
      this.meterIsManual = false;

    if(this.listOfManualMeterAux){
      this.listOfData = [... this.listOfManualMeterAux];

    }

    this.listOfManualRegister.length = 0;

    for(let i = 0; i < this.listOfData.length; i++){
      if(this.listOfData[i].registroDatos == isManual){
        this.listOfManualRegister = [... this.listOfManualRegister, this.listOfData[i]];
      }
    }

    this.listOfData.length = 0;
    this.listOfData = [... this.listOfManualRegister];

  }

  GetVariables(){
    this.globalService.Get(this.url.getVariables).subscribe(
      (result:any) => {
        this.listOfVariables = result;
      }
    );
  }

  disableMeter(meter: MeterSchema, estado : number){
    let newEstado = Boolean(estado);
    this.globalService.Patch(this.url.update, meter.id, {estado: newEstado}).subscribe(
      result => {
        if(!result){
          if(estado === 1){
            this.GetMeters(0, false);
          }else{
            this.GetMeters(1, false);
          }

          this.notificationService.createMessage('success', 'La acción se ejecuto con exito 😎');
        }else{
          this.notificationService.createMessage('error', 'La accion fallo 😓');
        }
      }
    );
  }
  cancel(): void {
    this.nzMessageService.info('click cancel');
  }

  listOfColumns: ColumnItem[] = [
    {
      name: 'Codigo',
      sortOrder: null,
      sortFn: (a: MeterSchema, b: MeterSchema) => a.codigo.localeCompare(b.codigo),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: string[], item: MeterSchema) => list.some(codigo => item.codigo.indexOf(codigo) !== -1)
    },
    {
      name: 'Source ID',
      sortOrder: null,
      sortFn: (a: MeterSchema, b: MeterSchema) => a.sourceId - (b.sourceId),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Descripcion',
      sortOrder: null,
      sortFn: (a: MeterSchema, b: MeterSchema) => a.descripcion.localeCompare(b.descripcion),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: string[], item: MeterSchema) => list.some(codigo => item.descripcion.indexOf(codigo) !== -1)
    },
    {
      name: 'Modelo',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a: MeterSchema, b: MeterSchema) => a.modelo.localeCompare(b.modelo),
      filterMultiple: false,
      listOfFilter: [],
      filterFn: (address: string, item: MeterSchema) => item.modelo.indexOf(address) !== -1
    },
    {
      name: 'Serie',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a: MeterSchema, b: MeterSchema) => a.serie.localeCompare(b.serie),
      filterMultiple: false,
      listOfFilter: [],
      filterFn: (address: string, item: MeterSchema) => item.serie.indexOf(address) !== -1
    },
    {
      name: 'Tipo',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: null,
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null
    },
  ];
}
