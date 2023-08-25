import { Component, OnInit } from '@angular/core';
import { ReportsService } from './service/reports.service';
import jsPDF from 'jspdf';
import { ReportData } from 'src/Core/interfaces/report.interface';
import { NotificationService } from '@shared/services/notification.service';
import { forkJoin } from 'rxjs';
import * as path from 'path';

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
  pdfData: string = '';

  constructor(private reportService: ReportsService) {
    this.tipoReporte = '';
  }

  ngOnInit(): void { }

  onFechaInicialChange(value: Date): void {
    this.fechaInicial = value;
  }

  onFechaFinalChange(value: Date): void {
    this.fechaFinal = value;
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
            },
            (error) => {
              console.log('Error en la solicitud HTTP', error);
            }
          );
      }else{

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
      const fechaFinFormateada = this.fechaFinal.toLocaleDateString();
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
      let dataLecturaAnteriorMP = 0;
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
      let porcentajeTotales =0
      doc.setFontSize(10);
      const title = `PERIODO DE FACTURACIÓN DEL ${fechaInicioFormateada} AL ${fechaFinFormateada}`;
      const subtitle = `ENERGÍA ELÉCTRICA SUMINISTRADA`;
      const subtitle1 = `ENERGÍA TOTAL TOMADA DE MEDIDORES PRINCIPALES (kwh)`;
      const subtitle2 = `ENERGÍA TOTAL TOMADA DE MEDIDORES DE RESPALDO (kwh)`;
      const subtitle3 = `COMPARACION ENTRE TOTAL DE MEDIDORES PRINCIPALES Y TOTAL DE MEDIDORES DE RESPALDO`;
      const firma1 = `Ing. Roberto Martínez`;
      const firma2 = `Ing. Roldán Bustillo`;
      const firma3 = `Ing. Guillermo González`;
      const lineafirma= `________________________`;
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
                    dataDiferencia =Number(dataDiferencia.toFixed(2));
                    dataEnergiaNetaAnterior = dataLecturaAnterior - dataLecturaAnteriorRec;
                    dataEnergiaNetaAnterior = Number(dataEnergiaNetaAnterior.toFixed(2));
                    dataenergiaNetaActual = dataLecturaActual - dataLecturaActualRec;
                    dataenergiaNetaActual = Number(dataenergiaNetaActual.toFixed(2));
                    dataDiferenciaEnergiaNeta = (dataLecturaActual - dataLecturaAnterior) - (dataLecturaAnteriorRec - dataLecturaActualRec);
                    dataDiferenciaEnergiaNeta =Number(dataDiferenciaEnergiaNeta.toFixed(2));
                    sumMedPrimarios += dataDiferenciaEnergiaNeta;
                    doc.text(dataNombreMedidor, xPosLegend1, 45 + i * 20);
                    doc.text(dataSerieMedidor, xPosLegend1 + 40, 45 + i * 20);
                    doc.text(LAnterior, xPosLegend1, 50 + i * 20);
                    doc.text(LActual, xPosLegend1 + 23, 50 + i * 20);
                    doc.text(kwh, xPosLegend1 + 7, 52 + i * 20)
                    doc.text(kwh, xPosLegend1 + 29, 52 + i * 20)
                    doc.text(kwh, xPosLegend1 + 49, 52 + i * 20)
                    doc.text(diferencia, xPosLegend1 + 44, 50 + i * 20);
                    doc.text(EnergiaEnviada, 10, 55 + i * 20);
                    doc.text(EnergiaRecibida, 10, 60 + i * 20);
                    doc.text(calibracion, 10, 65 + i * 20);
                    doc.text(EnergiNeta, 10, 70 + i * 20);

                    //data
                    doc.text(dataLecturaAnterior.toString(), xPosLegend1 + 2, 55 + i * 20);
                    doc.text(dataLecturaActual.toString(), xPosLegend1 + 24, 55 + i * 20);
                    doc.text(dataDiferencia.toString(), xPosLegend1 + 46, 55 + i * 20);
                    doc.text(dataEnergiaNetaAnterior.toString(), xPosLegend1 + 1, 70 + i * 20);
                    doc.text(dataenergiaNetaActual.toString(), xPosLegend1 + 22, 70 + i * 20);
                    doc.text(dataDiferenciaEnergiaNeta.toString(), xPosLegend1 + 46, 70 + i * 20);
                  } else {
                    //labels para medidores de respaldo
                    dataDiferencia = dataLecturaActual - dataLecturaAnterior;
                    dataDiferencia =Number(dataDiferencia.toFixed(2))
                    dataEnergiaNetaAnterior = dataLecturaAnterior - dataLecturaAnteriorRec;
                    dataEnergiaNetaAnterior = dataLecturaAnterior - dataLecturaAnteriorRec;
                    dataenergiaNetaActual = dataLecturaActual - dataLecturaActualRec;
                    dataenergiaNetaActual = Number(dataenergiaNetaActual.toFixed(2));
                    dataDiferenciaEnergiaNeta = (dataLecturaActual - dataLecturaAnterior) - (dataLecturaAnteriorRec - dataLecturaActualRec);
                    dataDiferenciaEnergiaNeta =Number(dataDiferenciaEnergiaNeta.toFixed(2));
                    sumMedSecundarios += dataDiferenciaEnergiaNeta;
                    doc.text(dataNombreMedidor, xPosLegend2, 25 + i * 20);
                    doc.text(dataSerieMedidor, xPosLegend2 + 40, 25 + i * 20);
                    doc.text(LAnterior, xPosLegend2, 30 + i * 20);
                    doc.text(LActual, xPosLegend2 + 23, 30 + i * 20);
                    doc.text(kwh, xPosLegend2 + 7, 32 + i * 20);
                    doc.text(kwh, xPosLegend2 + 29, 32 + i * 20);
                    doc.text(kwh, xPosLegend2 + 49, 32 + i * 20);
                    doc.text(diferencia.toString(), xPosLegend2 + 44, 30 + i * 20);
                    doc.text(EnergiaEnviada, xPosLegend2 - 20, 35 + i * 20);
                    doc.text(EnergiaRecibida, xPosLegend2 - 20, 40 + i * 20);
                    doc.text(calibracion, xPosLegend2 - 20, 45 + i * 20);
                    doc.text(EnergiNeta, xPosLegend2 - 20, 50 + i * 20);

                    //data
                    doc.text(dataLecturaAnterior.toString(), xPosLegend2 + 2, 35 + i * 20);
                    doc.text(dataLecturaActual.toString(), xPosLegend2 + 25, 35 + i * 20);
                    doc.text(dataDiferencia.toString(), xPosLegend2 + 46, 35 + i * 20);
                    doc.text(dataEnergiaNetaAnterior.toString(), xPosLegend2 + 2, 50 + i * 20);
                    doc.text(dataenergiaNetaActual.toString(), xPosLegend2 + 25, 50 + i * 20);
                    doc.text(dataDiferenciaEnergiaNeta.toString(), xPosLegend2 + 46, 50 + i * 20);

                  }
                  doc.setFontSize(10);
                }
              } else {
                console.log('this.resp es null para el servicio 129');
              }
              porcentajeTotales = Number(((sumMedPrimarios - sumMedSecundarios)/sumMedPrimarios).toFixed(4));
              doc.setFontSize(6);
              doc.text(subtitle1, xPosLegend1 - 25, 240)
              doc.text(subtitle2, xPosLegend2 - 25, 240)
              doc.setFontSize(7);
              doc.text(sumMedPrimarios.toString(), 75, 240);
              doc.text(sumMedSecundarios.toString(), xPosLegend2 + 46, 240)
              doc.text(porcentajeTotales.toString() + "%", xPosLegend2-20 ,248)
              doc.setFontSize(6)
              doc.text(subtitle3, xPosLegend1-25, 248);
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
                    dataDiferenciaRec = Number(dataDiferenciaRec.toFixed(4));
                    //data
                    doc.text(dataLecturaAnteriorRec.toString(), xPosLegend1 + 3, 60 + j * 20);
                    doc.text(dataLecturaActualRec.toString(), xPosLegend1 + 26, 60 + j * 20);
                    doc.text(dataDiferenciaRec.toString(), xPosLegend1 + 46, 60 + j * 20);
                  } else {
                    //labels para medidores de respaldo
                    let dataDiferenciaRec = dataLecturaActualRec - dataLecturaAnteriorRec;
                    dataDiferenciaRec = Number(dataDiferenciaRec.toFixed(4));

                    //data
                    doc.text(dataLecturaAnteriorRec.toString(), xPosLegend2 + 3, 40 + j * 20);
                    doc.text(dataLecturaActualRec.toString(), xPosLegend2 + 27, 40 + j * 20);
                    doc.text(dataDiferenciaRec.toString(), xPosLegend2 + 46, 40 + j * 20);
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
      doc.text(subtitle, xPosSubtitle, 20);
      doc.text(legend1, xPosLegend1, 35);
      doc.text(legend2, xPosLegend2, 35);


      doc.text(lineafirma, xPosLegend1-20, 260);
      doc.text(lineafirma, xPosLegend1+50, 260);
      doc.text(lineafirma, xPosLegend1+120, 260);
      doc.setFontSize(8);
      doc.text(firma1, xPosLegend1-10, 264);
      doc.text(porEnee, xPosLegend1-4, 267);
      doc.text(firma2, xPosLegend1+60, 264);
      doc.text(porEnee, xPosLegend1+66, 267);
      doc.text(firma3, xPosLegend1+130, 264);
      doc.text(porEnersa, xPosLegend1+136, 267);
      doc.setFontSize(10);
    }
  }
}
