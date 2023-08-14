import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { ColumnItem } from 'src/Core/interfaces/col-meter-table.interface';
import { RatesInterface } from 'src/Core/interfaces/Rates.interface';
import { EndPointGobalService } from "@shared/services/end-point-gobal.service";
import { InvoiceInterface } from 'src/Core/interfaces/invoices-tables.interface';
import { MeterSchema } from 'src/Core/interfaces/meter.interface';
import { ContractMeterInterface } from 'src/Core/interfaces/contract-meter.interface';
import { EspecialChargesInterface } from 'src/Core/interfaces/especial-charges.interface';
import { endOfMonth } from 'date-fns';
import { Router } from '@angular/router';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { formatDate, NumberSymbol } from '@angular/common';
import { LecturasPorContrato } from "src/Core/interfaces/eeh-invoice";
import { NotificationService } from '@shared/services/notification.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { concatMap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { TimeService } from '@shared/services/time.service';


@Component({
  selector: 'app-generated-invoices',
  templateUrl: './generated-invoices.component.html',
  styleUrls: ['./generated-invoices.component.css']
})
export class GeneratedInvoicesComponent implements OnInit {
  FacturaIsVisible: boolean = false;
  dataInvoice!: LecturasPorContrato;
  isVisible = false;
  validateForm!: FormGroup;
  generateInvoicesForm!: FormGroup;
  listOfData: LecturasPorContrato[] = [];
  listOfMeters: MeterSchema[] = [];
  ListOfContractMeditors: ContractMeterInterface[] = [];
  ListOfCharges: EspecialChargesInterface[] = [];
  list: any[] = [];
  newFacturas!:any;
  dates:{from: any, to: any} = {from: '', to: ''};
  initialDate = new Date(formatDate((new Date()).toISOString(), 'yyyy-MM-dd 00:00:00.000', 'en-US', 'GMT'));

  ranges = { Today: [this.initialDate, this.initialDate], 'This Month': [this.initialDate, endOfMonth(new Date())] };
  UnDiaMLS = 86400000;
  hoy = Date.now();
  vencimiento: any;
  dataSource: {chart:{}, categories: any[], dataset: any[], contFacturas: number, promedioConsumo: number} =  {
    chart: {
      caption: 'Histórico de consumo por facturas generadas',
      subCaption: 'Energía activa consumida',
      xAxisName: 'Fecha',
      yAxisName: 'Consumo kWh',
      numberSuffix: 'K',
      theme: 'fusion'

    },
    categories: [{
      category: []
    }],
    dataset: [
        {
        seriesname: "ENEE",
        color: "008ee4",
        data: [
        ],
        },
        {
        seriesname: "Generación Solar",
        color: "f8bd19",
        data: [
        ],

        }
    ],
    contFacturas: 0,
    promedioConsumo: 0
  }

  historicData: InvoiceInterface[] = [];
  pipe = new DatePipe('en-US');
  isLoading: boolean = false;

  onChange(result: Date[]): void {
    this.dates = {
      from: result[0],
      to: result[1]
    }
  }
  url = {
    id: 1,
    get: 'get-invoices',
    getMeters: 'get-meters',
    getcontratosM: 'get-c-meter',
    getECharges: 'get-especial-charges',
    post: 'facturas',
    delete: 'facturas',
    update: 'facturas',
    generateFacturas: 'generate-invoice',
    getHistorico: "get-invoices-contract",
  };

  constructor(
    private globalService: EndPointGobalService,
    private fb: FormBuilder,
    private router: Router,
    private notificationService: NotificationService,
    private nzMessageService: NzMessageService,
    private times: TimeService,
  ) { }

  ngOnInit(): void {
    // this.GetRates();
    // this.GetContratos();
    // this.GetCargos();
  this.GenerateInvoicesCleanForm();
  }


  // updateTable(list: any){
  //   this.GetRates();

  // }

  Back(): void {
    this.FacturaIsVisible = false;
    this.dataSource.categories[0].category.length = 0;
    for(let i = 0 ; i < this.dataSource.dataset.length ; i ++){
      this.dataSource.dataset[i].data.length = 0;

    }
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  cancel(): void {
  }

  GenerateInvoice(data: LecturasPorContrato): void{
    this.dataInvoice = data;
    this.getHistoric(data.contrato.contratoId, data);
    this.FacturaIsVisible = true;
  }

  getHistoric(contratoId: number, data: LecturasPorContrato){

    this.globalService.GetId( this.url.getHistorico, contratoId).subscribe(
      (result : any) => {
        if(result){
          this.historicData = result;
          this.historicData = this.historicData.slice(0, 5);
          for(let i = 0; i < this.historicData.length ; i ++){

            if(Date.parse(this.historicData[i].fechaFin) <= Date.parse(this.dataInvoice.medidor[0].historico.fechaAnterior)+ (900000 * 24)){

                this.dataSource.categories[0].category = [
                  ... this.dataSource.categories[0].category,
                  {label: this.times.extractTextMount(this.historicData[i].fechaInicio)}
                ]

                this.dataSource.dataset[0].data = [
                  ... this.dataSource.dataset[0].data,
                {  value: ((this.historicData[i].consumoExterno).toFixed(2)).toString() },

                ]

                this.dataSource.dataset[1].data = [
                  ... this.dataSource.dataset[1].data,
                {  value: ((this.historicData[i].consumoSolar).toFixed(2)).toString() },
                ]

              this.dataSource.contFacturas ++;
              this.dataSource.promedioConsumo += this.historicData[i].energiaConsumida;
            }
          }

          this.dataSource.categories[0].category = [
              ... this.dataSource.categories[0].category,
              {label: this.times.extractTextMount(data.medidor[0].historico.fechaAnterior)}
            ]

            this.dataSource.dataset[0].data = [
              ... this.dataSource.dataset[0].data,
            {  value: ((data.totalLecturaActivaAjustada + (data.PT * data.PPPTT)).toFixed(2)).toString() },
            ]

            this.dataSource.dataset[1].data = [
              ... this.dataSource.dataset[1].data,
            {  value: ((data.totalEnergiaFotovoltaicaActivaConsumida + data.totalEnergiaDeInyeccionConsumida).toFixed(2)).toString() },
            ]

            this.dataSource.contFacturas ++;
            this.dataSource.promedioConsumo += data.totalLecturaActivaAjustada;
            this.dataSource.promedioConsumo /= this.dataSource.contFacturas;
        }
      }
    );

  }

  dataBarGraphic(valorSolar: number, valorExterno: number){

    return {
      dataset: [
      {
      seriesname: "ENEE",
      color: "008ee4",
      data: [
        {  value: (valorExterno.toFixed(2)).toString() }],

      },
      {
      seriesname: "Generacion Solar",
      color: "008ee4",
      data: [
        {  value: (valorSolar.toFixed(2)).toString() }],

      },

      ]
    }

  }
  EmitirFactura(invoicePosition: LecturasPorContrato){
    const provider = {
      contratoId:  invoicePosition.contrato.contratoId,
      codigo:  formatDate((new Date()).toISOString(), 'yyyy-MM-dd','en-US', 'GMT') + ' - FA#',
      fechaLectura:  invoicePosition.medidor[0].historico.fechaActual,
      fechaVencimiento:  (this.UnDiaMLS * invoicePosition.contrato.diasDisponibles) + this.hoy,
      fechaInicio : invoicePosition.medidor[0].historico.fechaAnterior,
      fechaFin:  invoicePosition.medidor[0].historico.fechaActual,
      fechaEmision: (new Date()).toISOString(),
      energiaConsumida: invoicePosition.totalLecturaActivaAjustada  + ( invoicePosition.totalEnergiaFotovoltaicaActivaConsumida) + invoicePosition.totalEnergiaDeInyeccionConsumida + ( invoicePosition.PT * invoicePosition.PPPTT),
      consumoSolar: ( invoicePosition.totalEnergiaFotovoltaicaActivaConsumida)  + invoicePosition.totalEnergiaDeInyeccionConsumida,
      consumoExterno: invoicePosition.totalLecturaActivaAjustada  + ( invoicePosition.PT *  invoicePosition.PPPTT),
      total: invoicePosition.cargo? invoicePosition.cargo[invoicePosition.cargo.length - 1].valorAjustado: 0,
      estado: true,
    }

    this.globalService.Post(this.url.post, provider).subscribe(
      (result: any) => {
        if(result){
          if(result.error){
            this.notificationService.createMessage('error', result.error)
          }else{
            this.notificationService.createMessage( 'succes', 'Factura emitida con exito. 😄');
          }
        }

      }
    );

  }

  EmitAll(){
    this.isLoading = true;
    this.nzMessageService
      .loading('Action in progress', { nzPauseOnHover: this.isLoading })
      .onClose!.pipe(
        concatMap(() => this.nzMessageService.success('Loading finished', { nzDuration: 2500 }).onClose!),
        concatMap(() => this.nzMessageService.info('Loading finished is finished', { nzDuration: 2500 }).onClose!)
      )
      .subscribe(() => {
      });
    for(let i = 0; i < this.listOfData.length; i++){

      let provider = {
        contratoId:  this.listOfData[i].contrato.contratoId,
        codigo:   this.pipe.transform(new Date().toISOString(), 'yyyy-MM-dd HH:mm:ss', '-0600') + ' - FA#',
        fechaLectura:  this.listOfData[i].medidor[0].historico.fechaActual,
        fechaVencimiento:  (this.UnDiaMLS * this.listOfData[i].contrato.diasDisponibles) + this.hoy,
        fechaInicio : this.listOfData[i].medidor[0].historico.fechaAnterior,
        fechaFin:  this.listOfData[i].medidor[0].historico.fechaActual,
        fechaEmision: (new Date()).toISOString(),
        energiaConsumida: this.listOfData[i].totalLecturaActivaAjustada + (this.listOfData[i].totalEnergiaFotovoltaicaActivaConsumida) + this.listOfData[i].totalEnergiaDeInyeccionConsumida + (this.listOfData[i].PT * this.listOfData[i].PPPTT),
        consumoSolar: (this.listOfData[i].totalEnergiaFotovoltaicaActivaConsumida)   + this.listOfData[i].totalEnergiaDeInyeccionConsumida,
        consumoExterno: this.listOfData[i].totalLecturaActivaAjustada + (this.listOfData[i].PT * this.listOfData[i].PPPTT),
        total: this.listOfData[i].cargo ? this.listOfData[i].cargo[this.listOfData[i].cargo.length - 1].valorAjustado  : 0,
        estado: true,
      }
      this.globalService.Post(this.url.post, provider).subscribe(
        (result: any) => {
        }
      );

      if(i+1 == this.listOfData.length){
        this.isLoading = false;
      }

    }
  }

  GenerateInvoicesCleanForm(){
    this.generateInvoicesForm = this.fb.group({
      fecha: [ '', [Validators.required]],
      facturaEEH: [ '', [Validators.required]],
    });
  }

  submitForm(){
    let isLoading = true;
    this.nzMessageService
      .loading('Action in progress', { nzAnimate:  isLoading, nzPauseOnHover: isLoading})
      .onClose!.pipe(
        concatMap(() => this.nzMessageService.success('Loading finished').onClose!),
        concatMap(() => this.nzMessageService.info('Loading finished').onClose!)
      )
      .subscribe(() => {
      });
    let generateFacturaSchema = {
      fechaInicial: this.pipe.transform(new Date(this.generateInvoicesForm.value.fecha[0]), 'yyyy-MM-dd HH:mm:ss', '-0600'),
      fechaFinal: this.pipe.transform(new Date(this.generateInvoicesForm.value.fecha[1]), 'yyyy-MM-dd HH:mm:ss', '-0600'),
      facturaEEH: this.generateInvoicesForm.value.facturaEEH,
    }

    this.globalService.Post(this.url.generateFacturas, generateFacturaSchema).subscribe(
      (result: any) => {

        if(result.error){
          this.notificationService.createNotification('error', 'Falló',`${result.error} 😓`);
          isLoading = false;
        }else{
          this.listOfData = result;
          this.listOfData = [... this.listOfData];
          this.notificationService.createMessage('success', 'La acción se ejecuto con exito 😎');
          isLoading = false;
          console.log("este es result", result);
        }
      }
    );

  }

  listOfColumns: ColumnItem[] = [
    {
      name: 'Contrato',
      sortOrder: null,
      sortFn: (a: InvoiceInterface, b: InvoiceInterface) => a.codigo.localeCompare(b.codigo),
      sortDirections: ['descend', 'ascend', null],
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true
    },
    {
      name: 'Cliente',
      sortOrder: null,
      sortFn: (a: InvoiceInterface, b: InvoiceInterface) => a.codigo.localeCompare(b.codigo),
      sortDirections: ['descend', 'ascend', null],
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true
    },
    {
      name: 'Fecha Inicial',
      sortOrder: null,
      sortFn: null ,
      sortDirections: ['descend', 'ascend', null],
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true
    },
    {
      name: 'Fecha Final',
      sortOrder: null,
      sortFn: null ,
      sortDirections: ['descend', 'ascend', null],
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true
    },
    {
      name: 'Energia consumida (kWh)',
      sortOrder: null,
      sortFn: (a: InvoiceInterface, b: InvoiceInterface) => a.energiaConsumida - b.energiaConsumida,
      sortDirections: ['descend', 'ascend', null],
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true
    },
    {
      name: 'Total a pagar',
      sortOrder: 'descend',
      sortFn: (a: InvoiceInterface, b: InvoiceInterface) => a.total - (b.total),
      sortDirections: ['descend', 'ascend', null],
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true
    }
  ];
}
