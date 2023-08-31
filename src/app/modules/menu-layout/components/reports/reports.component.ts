import { Component, OnInit } from '@angular/core';
import { ReportsService } from './service/reports.service';
import jsPDF from 'jspdf';
import { ReportData } from 'src/Core/interfaces/report.interface';
import { NotificationService } from '@shared/services/notification.service';
import { forkJoin } from 'rxjs';
import * as path from 'path';
import { ColumnItem } from 'src/Core/interfaces/col-meter-table.interface';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  fechaInicial: Date = new Date();
  fechaFinal: Date = new Date();
  tipoReporte: string;
  energiaEntregada: boolean = false;
  energiaRecibida: boolean = false;
  mostrarTabla: boolean = false;
  resp: ReportData | null = null;
  resp2: ReportData | null = null;
  pdfData: string = '';

  constructor(private reportService: ReportsService) {
    this.tipoReporte = '';
  }

  ngOnInit(): void { }

  onFechaInicialChange(value: Date): void {
    this.fechaInicial = value;
    console.log("esto es", this.fechaInicial)
  }

  onFechaFinalChange(value: Date): void {
    this.fechaFinal = value;
    console.log("esto es", this.fechaFinal)
  }

  generarReporte(): void {
    this.mostrarTabla = true;
    if (this.tipoReporte === 'Energia Sumistrada') {
      if (this.energiaEntregada) {
        const fechaInicialFormatted = new Date(this.fechaInicial);
        fechaInicialFormatted.setHours(0, 0, 0, 0);
        const fechaFinalFormatted = this.fechaFinal.toISOString().split('T')[0];
        this.reportService
          .getConsumoMedidores(
            129,
            fechaInicialFormatted.toISOString().split('T')[0],
            fechaFinalFormatted
          )
          .subscribe(
            (resp: any) => {
              this.resp = resp.inicial[0];
              this.resp2 = resp.final[1];
              console.log("los resp ", this.resp, this.resp2)

            },
            (error) => {
              console.log('Error en la solicitud HTTP', error);
            }
          );
      } else {

      }
      if (this.energiaRecibida) {
        const fechaInicialFormatted = new Date(this.fechaInicial);
        fechaInicialFormatted.setHours(0, 0, 0, 0);
        const fechaFinalFormatted = this.fechaFinal.toISOString().split('T')[0];
        this.reportService
          .getConsumoMedidores(
            139,
            fechaInicialFormatted.toISOString().split('T')[0],
            fechaFinalFormatted
          )
          .subscribe((resp: any) => {
            this.resp = resp.inicial[0];
          });
      }
    }
  }

  crearPDF() {
    if (this.tipoReporte == 'Energia Sumistrada' && this.resp) {
      const doc = new jsPDF();
      const img = new Image();
      const img2 = new Image();
      img.src = 'assets/Images/gobierno.jpg';
      img2.src = 'assets/Images/enee.png';

      img.onload = () => {
        doc.addImage(img, 25, 10, 25, 10);
      };

      img2.onload = () => {
        doc.addImage(img2, 160, 10, 25, 10);
      };

      const fechaInicioFormateada = this.fechaInicial.toLocaleDateString();
      const fechaFinal = new Date(this.fechaFinal);
      fechaFinal.setDate(fechaFinal.getDate() - 1);
      const fechaFinFormateada = fechaFinal.toLocaleDateString();
      const fechaInicialFormatted = new Date(this.fechaInicial);
      fechaInicialFormatted.setHours(0, 0, 0, 0);
      const fechaFinalFormatted = this.fechaFinal.toISOString().split('T')[0];
      let legend1 = '';
      let legend2 = '';
      let legend1Width = 0;
      let legend2Width = 0;
      let xPosLegend1 = 0;
      let xPosLegend2 = 0;
      let fontSize = 0;
      let fontSize2 = 0;
      let diferencia = '';
      let EnergiaEnviada = '';
      let EnergiaRecibida = '';
      let kwh = 'kwh';
      let EnergiNeta = '';
      let dataLecturaAnterior = 0;
      let dataLecturaActual = 0;
      let dataLecturaAnteriorRec = 0;
      let dataLecturaActualRec = 0;
      let dataNombreMedidor = '';
      let serieMedidor = '';
      let dataSerieMedidor = '';
      let pageWidth = doc.internal.pageSize.getWidth();
      let LAnterior = '';
      let LActual = '';
      let calibracion = '';
      let dataDiferencia = 0;
      const ids = [129, 139];
      let dataEnergiaNetaAnterior = 0
      let dataenergiaNetaActual = 0;
      let dataDiferenciaEnergiaNeta = 0;
      let sumMedPrimarios = 0;
      let sumMedSecundarios = 0;
      let porcentajeTotales = 0
      doc.setFontSize(10);
      const title = `PERIODO DE FACTURACIÓN DEL ${fechaInicioFormateada} AL ${fechaFinFormateada}`;
      const subtitle = `ENERGÍA ELÉCTRICA SUMINISTRADA`;
      const subtitle1 = `ENERGÍA TOTAL TOMADA DE MEDIDORES PRINCIPALES (kwh)`;
      const subtitle2 = `ENERGÍA TOTAL TOMADA DE MEDIDORES DE RESPALDO (kwh)`;
      const subtitle3 = `COMPARACION ENTRE TOTAL DE MEDIDORES PRINCIPALES Y TOTAL DE MEDIDORES DE RESPALDO`;
      const firma1 = `Ing. Roberto Martínez`;
      const firma2 = `Ing. Roldán Bustillo`;
      const firma3 = `Ing. Guillermo González`;
      const lineafirma = `________________________`;
      const porEnee = `Por ENEE`;
      const porEnersa = `Por ENERSA`;
      pageWidth = doc.internal.pageSize.getWidth();
      fontSize = 10;
      const titleWidth =
        (doc.getStringUnitWidth(title) * fontSize) / doc.internal.scaleFactor;
      const xPosTitle = (pageWidth - titleWidth) / 2;
      const subtitleWidth =
        (doc.getStringUnitWidth(subtitle) * fontSize) /
        doc.internal.scaleFactor;
      const xPosSubtitle = (pageWidth - subtitleWidth) / 2;
      legend1 = `MEDIDORES PRINCIPALES`;
      fontSize2 = 10;
      legend1Width =
        (doc.getStringUnitWidth(legend1) * fontSize2) /
        doc.internal.scaleFactor;
      xPosLegend1 = pageWidth / 4 - legend1Width / 2;
      legend2 = `MEDIDORES DE RESPALDO`;
      fontSize2 = 10;
      legend2Width =
        (doc.getStringUnitWidth(legend2) * fontSize2) /
        doc.internal.scaleFactor;
      xPosLegend2 = (pageWidth * 3) / 4 - legend2Width / 2;
      this.reportService
        .getConsumoMedidores(
          129,
          fechaInicialFormatted.toISOString().split('T')[0],
          fechaFinalFormatted
        )
        .subscribe((resp129: any) => {
          console.log('Esto trae el backend del servicio 129', resp129);

          // Obtener los datos del servicio 139
          this.reportService
            .getConsumoMedidores(
              139,
              fechaInicialFormatted.toISOString().split('T')[0],
              fechaFinalFormatted
            )
            .subscribe((resp139: any) => {
              console.log('Esto trae el backend del servicio 139', resp139);

              // Procesar datos del servicio 129
              if (this.resp) {
                for (let i = 0; i < resp129.inicial.length; i++) {
                  const elementoInicial = resp129.inicial[i];
                  const elementoFinal = resp129.final[i];
                  dataLecturaAnterior = elementoInicial.Value.toFixed(2);
                  dataLecturaActual = elementoFinal.Value.toFixed(2);
                  const elementoInicialRec = resp139.inicial[i];
                  const elementoFinalRec = resp139.final[i];
                  dataLecturaAnteriorRec = elementoInicialRec.Value.toFixed(2);
                  dataLecturaActualRec = elementoFinalRec.Value.toFixed(2);
                  fontSize = 8;
                  serieMedidor = 'Serie de medidor';
                  dataNombreMedidor = elementoInicial.sourceName;
                  dataSerieMedidor = elementoInicial.Signature;
                  LAnterior = 'Lectura Anterior(A)';
                  LActual = 'Lectura Actual(B)';
                  EnergiaEnviada = 'Energia Enviada ';
                  EnergiaRecibida = 'Energia Recibida';
                  calibracion = 'Calibracion';
                  EnergiNeta = 'Energia Neta';
                  diferencia = 'Diferencia(A-B)';

                  doc.setFontSize(7);
                  if (elementoInicial.TipoMedidor === 'Principal') {
                    dataDiferencia = dataLecturaActual - dataLecturaAnterior;
                    dataDiferencia = Number(dataDiferencia.toFixed(2));
                    dataEnergiaNetaAnterior = dataLecturaAnterior - dataLecturaAnteriorRec;
                    dataEnergiaNetaAnterior = Number(dataEnergiaNetaAnterior.toFixed(2));
                    dataenergiaNetaActual = dataLecturaActual - dataLecturaActualRec;
                    dataenergiaNetaActual = Number(dataenergiaNetaActual.toFixed(2));
                    dataDiferenciaEnergiaNeta = (dataLecturaActual - dataLecturaAnterior) - (dataLecturaAnteriorRec - dataLecturaActualRec);
                    dataDiferenciaEnergiaNeta = Number(dataDiferenciaEnergiaNeta.toFixed(2));
                    sumMedPrimarios += dataDiferenciaEnergiaNeta;
                    sumMedPrimarios=Number(sumMedPrimarios.toFixed(2));

                    let canvas = document.createElement('canvas');
                    canvas.width = 300;
                    canvas.height = 200;
                    let ctx = canvas.getContext('2d');
                    if (ctx) {
                      ctx.font = "20px Arial";
                      let margin = 10;
                      //inicio x            //inicio de Y  //fin de x  // fin de Y
                      doc.rect(xPosLegend1 - 11 - margin, 42 + i * 15, 83, 16);
                      //lineas verticales
                      doc.line(xPosLegend1 - 11 - margin, 46 + i * 15, xPosLegend1 - 11 - margin + 83, 46 + i * 15);
                      doc.line(xPosLegend1 - 11 - margin, 50 + i * 15, xPosLegend1 - 11 - margin + 83, 50 + i * 15);
                      doc.line(xPosLegend1 - 11 - margin, 54 + i * 15, xPosLegend1 - 11 - margin + 83, 54 + i * 15);

                      //linea de encima
                      doc.line(xPosLegend1 -1 , 36 + i * 15, xPosLegend1 - 11 - margin + 83, 36 + i * 15);

                      //lineas horizontales

                        const x = 29;
                        const y1 = 58; // Coordenada y de inicio de la línea
                        const y2 = 36; // Coordenada y de fin de la línea (más corta)
                        //linea inicial
                        doc.line(x , y1 +i*15,x, y2 + i*15);
                        //linea final
                        doc.line(92 , y1 +i*15,92, y2 + i*15);
                        //segunda linea
                        doc.line(52 , y1 +i*15,52, y2 + i*15);
                        //tercer linea
                        doc.line(73 , y1 +i*15,73, y2 + i*15);

                    } else {
                      console.error('No se pudo obtener el contexto 2D del canvas');
                    }
                    doc.text(dataNombreMedidor, xPosLegend1 - 10, 35 + i * 15);
                    doc.text(dataSerieMedidor, xPosLegend1 + 30, 35 + i * 15);
                    doc.text(LAnterior, xPosLegend1, 39 + i * 15);
                    doc.text(LActual, xPosLegend1 + 23, 39 + i * 15);
                    doc.text(kwh, xPosLegend1 + 7, 41 + i * 15)
                    doc.text(kwh, xPosLegend1 + 29, 41 + i * 15)
                    doc.text(kwh, xPosLegend1 + 49, 41 + i * 15)
                    doc.text(diferencia, xPosLegend1 + 44, 39 + i * 15);
                    doc.text(EnergiaEnviada, 10, 45 + i * 15);
                    doc.text(EnergiaRecibida, 10, 49 + i * 15);
                    doc.text(calibracion, 10, 53 + i * 15);
                    doc.text(EnergiNeta, 10, 57 + i * 15);
                    //data
                    doc.text(dataLecturaAnterior.toString(), xPosLegend1 + 2, 45 + i * 15);
                    doc.text(dataLecturaActual.toString(), xPosLegend1 + 25, 45 + i * 15);
                    doc.text(dataDiferencia.toString(), xPosLegend1 + 48, 45 + i * 15);
                    doc.text(dataEnergiaNetaAnterior.toString(), xPosLegend1 + 2, 57 + i * 15);
                    doc.text(dataenergiaNetaActual.toString(), xPosLegend1 + 25, 57 + i * 15);
                    doc.text(dataDiferenciaEnergiaNeta.toString(), xPosLegend1 + 47, 57 + i * 15);
                  } else {
                    //labels para medidores de respaldo
                    dataDiferencia = dataLecturaActual - dataLecturaAnterior;
                    dataDiferencia = Number(dataDiferencia.toFixed(2))
                    dataEnergiaNetaAnterior = dataLecturaAnterior - dataLecturaAnteriorRec;
                    dataEnergiaNetaAnterior = dataLecturaAnterior - dataLecturaAnteriorRec;
                    dataenergiaNetaActual = dataLecturaActual - dataLecturaActualRec;
                    dataenergiaNetaActual = Number(dataenergiaNetaActual.toFixed(2));
                    dataDiferenciaEnergiaNeta = (dataLecturaActual - dataLecturaAnterior) - (dataLecturaAnteriorRec - dataLecturaActualRec);
                    dataDiferenciaEnergiaNeta = Number(dataDiferenciaEnergiaNeta.toFixed(2));
                    sumMedSecundarios += dataDiferenciaEnergiaNeta;

                    sumMedSecundarios =Number(sumMedSecundarios.toFixed(2));
                    let canvas = document.createElement('canvas');
                    canvas.width = 300;
                    canvas.height = 200;
                    let ctx = canvas.getContext('2d');
                    if (ctx) {
                      ctx.font = "20px Arial";
                      let margin = 10;
                      //inicio x            //inicio de Y  //fin de x  // fin de Y
                      doc.rect(xPosLegend2 - 11 - margin, 27 + i * 15, 83, 16);

                      //lineas verticales
                      doc.line(xPosLegend2 - 11 - margin, 31 + i * 15, xPosLegend2 - 11 - margin + 83, 31 + i * 15);
                      doc.line(xPosLegend2 - 11 - margin, 35 + i * 15, xPosLegend2 - 11 - margin + 83, 35 + i * 15);
                      doc.line(xPosLegend2 - 11 - margin, 39 + i * 15, xPosLegend2 - 11 - margin + 83, 39 + i * 15);

                      //linea de encima
                      doc.line(xPosLegend2 -1 , 21 + i * 15, xPosLegend2 - 11 - margin + 83, 21 + i * 15);

                      // lineas horizontales
                        const x = 133;
                        const y1 = 43; // Coordenada y de inicio de la línea
                        const y2 = 21; // Coordenada y de fin de la línea (más corta)
                        //linea inicial
                        doc.line(x , y1 +i*15,x, y2 + i*15);
                        //linea final
                        doc.line(196.1 , y1 +i*15,196.1, y2 + i*15);
                        //segunda linea
                        doc.line(156 , y1 +i*15,156, y2 + i*15);
                        //tercer linea
                        doc.line(177 , y1 +i*15,177, y2 + i*15);

                    } else {
                      console.error('No se pudo obtener el contexto 2D del canvas');
                    }
                    doc.text(dataNombreMedidor, xPosLegend2 - 10, 20 + i * 15);
                    doc.text(dataSerieMedidor, xPosLegend2 + 30, 20 + i * 15);
                    doc.text(LAnterior, xPosLegend2, 24 + i * 15);
                    doc.text(LActual, xPosLegend2 + 23, 24 + i * 15);
                    doc.text(kwh, xPosLegend2 + 7, 26 + i * 15);
                    doc.text(kwh, xPosLegend2 + 29, 26 + i * 15);
                    doc.text(kwh, xPosLegend2 + 49, 26 + i * 15);
                    doc.text(diferencia.toString(), xPosLegend2 + 44, 24 + i * 15);
                    doc.text(EnergiaEnviada, xPosLegend2 - 20, 30 + i * 15);
                    doc.text(EnergiaRecibida, xPosLegend2 - 20, 34 + i * 15);
                    doc.text(calibracion, xPosLegend2 - 20, 38 + i * 15);
                    doc.text(EnergiNeta, xPosLegend2 - 20, 42 + i * 15);

                    //data
                    doc.text(dataLecturaAnterior.toString(), xPosLegend2 + 2, 30 + i * 15);
                    doc.text(dataLecturaActual.toString(), xPosLegend2 + 25, 30 + i * 15);
                    doc.text(dataDiferencia.toString(), xPosLegend2 + 48, 30 + i * 15);
                    doc.text(dataEnergiaNetaAnterior.toString(), xPosLegend2 + 2, 42 + i * 15);
                    doc.text(dataenergiaNetaActual.toString(), xPosLegend2 + 25, 42 + i * 15);
                    doc.text(dataDiferenciaEnergiaNeta.toString(), xPosLegend2 + 47, 42 + i * 15);

                  }
                  doc.setFontSize(10);
                }
              } else {
                console.log('this.resp es null para el servicio 129');
              }
              porcentajeTotales = Number(((sumMedPrimarios - sumMedSecundarios) / sumMedPrimarios).toFixed(2));
              doc.setFontSize(6);
              doc.text(subtitle1, xPosLegend1 - 21, 185.5)
              doc.text(subtitle2, xPosLegend2 - 21, 185.5)
              doc.setFontSize(7);
              doc.text(sumMedPrimarios.toString(), 76, 185.5);
              doc.text(sumMedSecundarios.toString(), xPosLegend2 + 45, 185.5)
              doc.text(porcentajeTotales.toString() + "%", xPosLegend2 - 19, 193)
              doc.setFontSize(6)
              doc.text(subtitle3, xPosLegend1 - 21, 193);
              doc.setFontSize(10);
              // Procesar datos del servicio 139
              if (this.resp) {
                for (let j = 0; j < resp139.inicial.length; j++) {
                  const elementoInicialRec = resp139.inicial[j];
                  const elementoFinalRec = resp139.final[j];
                  dataLecturaAnteriorRec = elementoInicialRec.Value.toFixed(2);
                  dataLecturaActualRec = elementoFinalRec.Value.toFixed(2);
                  fontSize = 8;
                  serieMedidor = 'Serie de medidor';
                  dataNombreMedidor = elementoInicialRec.sourceName;
                  dataSerieMedidor = elementoInicialRec.Signature;
                  LAnterior = 'Lectura Anterior(A)';
                  LActual = 'Lectura Actual(B)';
                  EnergiaEnviada = 'Energia Enviada ';
                  EnergiaRecibida = 'Energia Recibida';
                  calibracion = 'Calibracion';
                  EnergiNeta = 'Energia Neta';
                  diferencia = 'Diferencia(A-B)';
                  doc.setFontSize(7);
                  if (elementoInicialRec.TipoMedidor === 'Principal') {
                    let dataDiferenciaRec = dataLecturaActualRec - dataLecturaAnteriorRec;
                    dataDiferenciaRec = Number(dataDiferenciaRec.toFixed(2));
                    //data
                    doc.text(dataLecturaAnteriorRec.toString(), xPosLegend1 + 5, 49 + j * 15);
                    doc.text(dataLecturaActualRec.toString(), xPosLegend1 + 28, 49 + j * 15);
                    doc.text(dataDiferenciaRec.toString(), xPosLegend1 + 48, 49 + j * 15);
                  } else {
                    //labels para medidores de respaldo
                    let dataDiferenciaRec = dataLecturaActualRec - dataLecturaAnteriorRec;
                    dataDiferenciaRec = Number(dataDiferenciaRec.toFixed(2));

                    //data
                    doc.text(dataLecturaAnteriorRec.toString(), xPosLegend2 + 3, 34 + j * 15);
                    doc.text(dataLecturaActualRec.toString(), xPosLegend2 + 28, 34 + j * 15);
                    doc.text(dataDiferenciaRec.toString(), xPosLegend2 + 48, 34 + j * 15);
                  }
                  doc.setFontSize(10);
                }
              } else {
                console.log('this.resp es null para el servicio 139');
              }
              window.open(doc.output('bloburl'))
            });
        });
      doc.text(title, xPosTitle, 10);
      doc.text(title, xPosTitle, 10);
      doc.text(subtitle, xPosSubtitle, 18);
      doc.text(subtitle, xPosSubtitle, 18);
      doc.text(legend1, xPosLegend1, 30);
      doc.text(legend1, xPosLegend1, 30);
      doc.text(legend2, xPosLegend2, 30);
      doc.text(legend2, xPosLegend2, 30);

      doc.text(lineafirma, xPosLegend1 - 20, 220);
      doc.text(lineafirma, xPosLegend1 + 50, 220);
      doc.text(lineafirma, xPosLegend1 + 120, 220);
      doc.setFontSize(8);
      doc.text(firma1, xPosLegend1 - 10, 224);
      doc.text(porEnee, xPosLegend1 - 4, 227);
      doc.text(firma2, xPosLegend1 + 60, 224);
      doc.text(porEnee, xPosLegend1 + 66, 227);
      doc.text(firma3, xPosLegend1 + 130, 224);
      doc.text(porEnersa, xPosLegend1 + 136, 227);

      //cuadritos
      doc.rect(xPosLegend1-21, 183, 83, 3);
      doc.rect(xPosLegend2-21, 183, 83, 3);
      doc.rect(xPosLegend1-21, 190.5, 115, 3);
      const x = 73;
      const y1 = 183;
      const y2 = 186;
      //linea inicial
      doc.line(x , y1,x, y2);
      doc.line(178 , y1,178, y2);
      doc.line(x+41 , y1+7.5,x+41, y2+7.5);
      doc.setFontSize(10);
    }
  }
}
