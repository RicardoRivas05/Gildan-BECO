import { Component, Input, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { ChargesShema } from 'src/Core/interfaces/charges.interface';
import { LecturasPorContrato } from "src/Core/interfaces/eeh-invoice";
import { DatePipe, formatDate } from '@angular/common';
import { concatMap } from 'rxjs/operators';

import { NzMessageService } from 'ng-zorro-antd/message';



import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TimeService } from '@shared/services/time.service';
//import { InvoiceInterface } from 'src/Core/interfaces/invoices-tables.interface';

export interface  InvoiceInterface{
    sourceID: number,
    TimestampUTC : string,
    sourceName: string,
    Signature: string,
    quantityID: number,
    quantityName:string,
    Value: number,
    TipoMedidor:string;
  }

@Component({
  selector: 'app-digital-invoice',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './digital-invoice.component.html',
  styleUrls: ['./digital-invoice.component.css']
})
export class DigitalInvoiceComponent implements OnInit, OnChanges, OnDestroy {
  @Input() dataInvoice !: InvoiceInterface;
  diaFacturacion: string = '';
  isVisible: boolean = false;
  spinnerIsVisible: boolean = false;
  UnDiaMLS = 86400000;
  hoy = Date.now();
  vencimiento: any;
  ChargePosition!: ChargesShema;
  @Input() dataSource!:{chart:{}, categories: any[], dataset: any[], contFacturas: number, promedioConsumo: number};
  title: string;
  @Input() historicData!: InvoiceInterface[];
  @Input() typeInvoice!: number;
  pieGraph!: {chart:{}, data: any[]};
  dataDocument: any;
  pipe = new DatePipe('en-US');




  url = {
    getHistorico: "get-report",
  }
  constructor(
    private globalService: EndPointGobalService,
    private message: NzMessageService,
    private times: TimeService,

  ) {
    this.title = 'Historico consumo energia activa';

  }

  ngOnInit(): void {
    this.isVisible = false;
  }

  ngOnChanges(changes: SimpleChanges): void {

    if(this.dataInvoice){
      // this.vencimiento = (this.UnDiaMLS * this.dataInvoice.contrato.diasDisponibles) + this.hoy;
      // this.diaFacturacion = this.numeroADia(this.dataInvoice.contrato.diaGeneracion);


    }

  }

  ngOnDestroy(): void {

  }

  GenerarFactura(): void {
    this.message
      .loading('Action in progress', { nzDuration: 4000 })
      .onClose!.pipe(
        concatMap(() => this.message.success('Loading finished', { nzDuration: 2500 }).onClose!),
        concatMap(() => this.message.info('Loading finished is finished', { nzDuration: 2500 }).onClose!)
      )
      .subscribe(() => {
        //console.log('All completed!');
      });
      this.createDocument(1);

  }


  sendFile() {
    this.message
      .loading('Action in progress', { nzDuration: 4000 })
      .onClose!.pipe(
        concatMap(() => this.message.success('Loading finished', { nzDuration: 2500 }).onClose!),
        concatMap(() => this.message.info('Loading finished is finished', { nzDuration: 2500 }).onClose!)
      )
      .subscribe(() => {
        //console.log('All completed!');
      });
        this.createDocument(2);
  }

   createDocument(opc: number){
    const div = document.getElementById('content');
    const pag2 = document.getElementById('pag2');
    var doc = new jsPDF('p', 'mm', 'a4', true);

    const options = {
      background: 'white',
      scale: 3
    };


    if(div){

      html2canvas(div, options).then((canvas) => {
        var imgWidth = 210;
        var pageHeight = 290;
        var imgHeight = canvas.height * imgWidth / canvas.width;
        var heightLeft = imgHeight;


        var position = 5;
        var pageData = canvas.toDataURL('image/jpeg', 1.0);
        var imgData = encodeURIComponent(pageData);
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        doc.setLineWidth(5);
        doc.setDrawColor(255, 255, 255);
        doc.rect(0, 0, 210, 295);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          doc.setLineWidth(5);
          doc.setDrawColor(255, 255, 255);
          doc.rect(0, 0, 210, 295);
          heightLeft -= pageHeight;
        }
        if(pag2){
          html2canvas(pag2, options).then((canvas) => {
          let imgHeight1 = imgHeight;
          imgWidth = 210;
          pageHeight = 290;
          imgHeight = canvas.height * imgWidth / canvas.width;
          pageData = canvas.toDataURL('image/jpeg', 1.0);
          imgData = encodeURIComponent(pageData);

          if((heightLeft * -1) < (imgHeight + 6)){
            doc.addPage();
            heightLeft = imgHeight;
            position = 5;
          }else{
            if(imgHeight1 > 290){
              imgHeight1 -= 290;
            }
            heightLeft = imgHeight;
            position = imgHeight1 + 6;
          }
          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            doc.setLineWidth(5);
            doc.setDrawColor(255, 255, 255);
            doc.rect(0, 0, 210, 295);
            heightLeft -= pageHeight;
          }
          return doc;
        }).then(async (doc) => {
        //imprimir
        if(opc === 1){
          doc.save(`Factura ${this.dataInvoice.sourceID} ${this.times.getMountLeters(this.dataInvoice.sourceName)}.pdf`);
        }
        //enviar por correo
        if(opc === 2){
          this.globalService.Post('send-email', {
            identificator: this.dataInvoice.sourceName,
            subject: 'Factura de consumo',
            text: 'Su factura a fue generada el ' + this.pipe.transform(new Date().toISOString(), 'yyyy/MM/dd HH:mm:ss', '-1200'),
            atachment: doc.output('datauri'),
            option: 2
          }).subscribe(
             (data: any) => {
              if(data){

              }

             }
           )
        }


      })

      }
    })
  }

}

  numeroADia(dia: number){
    let day;
    switch (dia) {
      case 1: day = "Lunes";
      break;
      case 2: day = "Martes";
      break;
      case 3: day = "Miercoles";
      break;
      case 4: day = "Jueves";
      break;
      case 5: day = "Viernes";
      break;
      case 6: day = "Sabado";
      break;
      case 7: day = "Domingo";
      break;
      default:
        day = '';
       }

    return day;

  }


}
