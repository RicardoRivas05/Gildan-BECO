import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { ColumnItem } from 'src/Core/interfaces/col-meter-table.interface';
import { InvoiceInterface } from 'src/Core/interfaces/invoices-tables.interface';
import { EndPointGobalService } from "@shared/services/end-point-gobal.service";
import { LecturasPorContrato } from "src/Core/interfaces/eeh-invoice";
import { NotificationService } from '@shared/services/notification.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { formatDate } from '@angular/common';
import { TimeService } from '@shared/services/time.service';
export interface facturas{

  cliente: string,
  codigo: string,
  codigoContrato: string,
  contratoId: number
  energiaConsumida: number,
  estado: number
  fechaCancelacion: string,
  fechaEmision: string,
  fechaFin: string,
  fechaInicio: string,
  fechaLectura: string,
  fechaVencimiento: string,
  total: number
}

@Component({
  selector: 'app-issued-invoices',
  templateUrl: './issued-invoices.component.html',
  styleUrls: ['./issued-invoices.component.css']
})
export class IssuedInvoicesComponent implements OnInit {
  FacturaIsVisible: boolean = false;
  dataInvoice!: LecturasPorContrato;
  inputValue: string = 'my site';
  isVisible = false;
  validateForm!: FormGroup;
  listOfData: InvoiceInterface[] = [];
  list: any[] = [];
  historicData: InvoiceInterface[] = [];


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

  url = {
    id: 2,
    get: 'get-invoices',
    post: 'facturas',
    delete: 'facturas',
    update: 'detalle-facturas',
    getHistorico: "get-invoices-contract",
    generateFacturas: 'generate-invoice',
  };

  constructor(
    private globalService: EndPointGobalService,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private nzMessageService: NzMessageService,
    private times: TimeService,
  ) { }

  ngOnInit(): void {

    this.GetRates();
  }


  dataBarGraphic(valorSolar: number, valorExterno: number){
    let result = {
      dataset: [
      {
      seriesname: "ENEE",
      color: "008ee4",
      data: [
        {  value: (valorExterno.toFixed(2)).toString() }],

      },
      {
      seriesname: "Generación Solar",
      color: "008ee4",
      data: [
        {  value: (valorSolar.toFixed(2)).toString() }],

      },

      ]

    }
    return result;

  }

  updateTable(list: any){
    this.listOfData = [...this.listOfData,list];
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
  GetRates(){
    this.globalService.GetId(this.url.get, this.url.id).subscribe(
      (result:any) => {
        this.listOfData = result;
      }
    );
  }

  GenerateInvoice(data: InvoiceInterface): void{
    let generateFacturaSchema = {
      fechaInicial: data.fechaInicio,
      fechaFinal:  data.fechaFin,
      facturaEEH: true,
      contratoId: data.codigoContrato
    }

    this.globalService.Post(this.url.generateFacturas, generateFacturaSchema).subscribe(
      (result: any) => {
        if(result){
          this.dataInvoice = result;
          this.getHistoric(result.contrato.contratoId, data);
          this.FacturaIsVisible = true;

          this.notificationService.createMessage('success', 'La acción se ejecuto con exito 😎');
        }else{
          this.notificationService.createMessage('error', 'No hay lecturas facturables 😓');
        }


      }
    );

  }

  async getHistoric(contratoId:number, facturas : InvoiceInterface){
    this.globalService.GetId( this.url.getHistorico, contratoId).subscribe(
      (result : any) => {
        if(result){
          this.historicData = result;
          this.historicData = this.historicData.slice(0, 5);
          for(let i = 0; i < this.historicData.length ; i ++){
            if(Date.parse(this.historicData[i].fechaFin) <= Date.parse(this.dataInvoice.medidor[0].historico.fechaAnterior )+ (900000 * 24)){

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
              {label: this.times.extractTextMount(facturas.fechaInicio) }
            ]

            this.dataSource.dataset[0].data = [
              ... this.dataSource.dataset[0].data,
            {  value: ((facturas.consumoExterno).toFixed(2)).toString() },
            ]

            this.dataSource.dataset[1].data = [
              ... this.dataSource.dataset[1].data,
            {  value: ((facturas.consumoSolar).toFixed(2)).toString() },
            ]

          this.dataSource.contFacturas ++;
          this.dataSource.promedioConsumo += facturas.energiaConsumida;
          this.dataSource.promedioConsumo /= this.dataSource.contFacturas;

        }
      }
    );

  }

  CancelarFactura(invoicePosition: InvoiceInterface){
    let provider = {
      estado: 0
    }
    this.globalService.Patch(this.url.update, invoicePosition.facturaId, provider).subscribe(
      (result: any) => {

        if(result){
          this.notificationService.createMessage('error', 'No fue posible cancelar su factura 😞')
        }else{
          this.notificationService.createMessage( 'succes', 'Factura cancelada con exito. 😄');
        }

        this.GetRates();

      }
    );

  }

  Back(): void {
    this.FacturaIsVisible = false;
    this.dataSource.categories[0].category.length = 0;
    for(let i = 0 ; i < this.dataSource.dataset.length ; i ++){
      this.dataSource.dataset[i].data.length = 0;

    }
  }
  cancel(): void {
    this.nzMessageService.info('click cancel');
  }

  listOfColumns: ColumnItem[] = [
    {
      name: 'Codigo',
      sortOrder: 'descend',
      sortFn: (a: InvoiceInterface, b: InvoiceInterface) => a.codigo.localeCompare(b.codigo),
      sortDirections: ['descend', 'ascend', null],
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true
    },
    {
      name: 'Contrato',
      sortOrder: null,
      sortFn: (a: InvoiceInterface, b: InvoiceInterface) => a.codigoContrato.localeCompare(b.codigoContrato),
      sortDirections: ['descend', 'ascend', null],
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true
    },
    {
      name: 'Cliente',
      sortOrder: null,
      sortFn: (a: InvoiceInterface, b: InvoiceInterface) => a.cliente.localeCompare(b.cliente),
      sortDirections: ['descend', 'ascend', null],
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true
    },
    {
      name: 'Fecha',
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
      name: 'Total',
      sortOrder: null,
      sortFn: (a: InvoiceInterface, b: InvoiceInterface) => a.total - b.total,
      sortDirections: ['descend', 'ascend', null],
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true
    },
  ];
}
