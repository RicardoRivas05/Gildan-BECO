import { Component, OnInit } from '@angular/core';
import { ReportsService } from './service/reports.service';
import jsPDF from 'jspdf';
import { forkJoin } from 'rxjs';
import { ReportData } from 'src/Core/interfaces/report.interface';
import { direction } from 'html2canvas/dist/types/css/property-descriptors/direction';
import { timeStamp } from 'console';
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

  resp3: any;
  resp4: any;

  pdfData: string = '';

  constructor(private reportService: ReportsService) {
    this.tipoReporte = '';
  }

  ngOnInit(): void { }

  onFechaInicialChange(value: Date): void {
    this.fechaInicial = value;
    console.log("esto es iinicial", this.fechaInicial)
  }

  onFechaFinalChange(value: Date): void {
    this.fechaFinal = value;
    console.log("esto es fina", this.fechaFinal)
  }

  generarReporte(): void {
    this.mostrarTabla = true;

  }
  crearPDF() {
    let fechaInicioFormateada = this.fechaInicial.toLocaleDateString();
    let fechaFinal = new Date(this.fechaFinal);
    let fechaFinal1 = new Date(this.fechaFinal);
    fechaFinal.setDate(fechaFinal.getDate() - 1);
    let fechaFinFormateada = fechaFinal.toLocaleDateString();
    let fechaInicialFormatted = new Date(this.fechaInicial);
    fechaInicialFormatted.setHours(0, 0, 0, 0);
    let fechaFinalFormatted = fechaFinal1.toISOString().split('T')[0];

    if (this.tipoReporte == 'Energia Sumistrada') {
      const doc = new jsPDF();
      const img = new Image();
      const img2 = new Image();
      img.src = 'assets/Images/gobierno.jpg';
      img2.src = 'assets/Images/enee.png';

      img.onload = () => {
        doc.addImage(img, 25, 10, 30, 10);
      };

      img2.onload = () => {
        doc.addImage(img2, 160, 10, 30, 10);
      };
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
              if (resp129) {
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
                    sumMedPrimarios = Number(sumMedPrimarios.toFixed(2));

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
                      doc.line(xPosLegend1 - 1, 36 + i * 15, xPosLegend1 - 11 - margin + 83, 36 + i * 15);
                      //lineas horizontales
                      const x = 29;
                      const y1 = 58; // Coordenada y de inicio de la línea
                      const y2 = 36; // Coordenada y de fin de la línea (más corta)
                      //linea inicial
                      doc.line(x, y1 + i * 15, x, y2 + i * 15);
                      //linea final
                      doc.line(92, y1 + i * 15, 92, y2 + i * 15);
                      //segunda linea
                      doc.line(52, y1 + i * 15, 52, y2 + i * 15);
                      //tercer linea
                      doc.line(73, y1 + i * 15, 73, y2 + i * 15);

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
                    sumMedSecundarios = Number(sumMedSecundarios.toFixed(2));
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
                      doc.line(xPosLegend2 - 1, 21 + i * 15, xPosLegend2 - 11 - margin + 83, 21 + i * 15);
                      // lineas horizontales
                      const x = 133;
                      const y1 = 43; // Coordenada y de inicio de la línea
                      const y2 = 21; // Coordenada y de fin de la línea (más corta)
                      //linea inicial
                      doc.line(x, y1 + i * 15, x, y2 + i * 15);
                      //linea final
                      doc.line(196.1, y1 + i * 15, 196.1, y2 + i * 15);
                      //segunda linea
                      doc.line(156, y1 + i * 15, 156, y2 + i * 15);
                      //tercer linea
                      doc.line(177, y1 + i * 15, 177, y2 + i * 15);

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
              }
              else {
                console.log('this.resp es null para el servicio 129');
              }
              porcentajeTotales = Number(((sumMedPrimarios - sumMedSecundarios) / sumMedPrimarios).toFixed(4));
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
              if (resp139) {
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
      //cuadritos finales
      doc.rect(xPosLegend1 - 21, 183, 83, 3);
      doc.rect(xPosLegend2 - 21, 183, 83, 3);
      doc.rect(xPosLegend1 - 21, 190.5, 120, 3);
      const x = 73;
      const y1 = 183;
      const y2 = 186;
      //linea inicial
      doc.line(x, y1, x, y2);
      doc.line(178, y1, 178, y2);
      doc.line(x + 41, y1 + 7.5, x + 41, y2 + 7.5);
      doc.setFontSize(10);
    } else if (this.tipoReporte === 'Resumen') {
      const doc = new jsPDF();
      let stuDel = 0;
      let stuRec = 0;
      let diferencia = 0;
      let cogPrincipalDelArray: number[] = [];
      let cogRespaldoDelArray: number[] = [];
      let cogPrincipalRecArray: number[] = [];
      let cogRespaldoRecArray: number[] = [];
      let promediosCogDel: number[] = [];
      let promediosCogRec: number[] = [];
      let motoresDelArray: number[] = [];
      let motoresRecArray: number[] = [];
      let diferenciaMotores: number[] = [];
      let promedioCogDel = 0;
      let promedioCogRec = 0;
      let promedioDel = 0;
      let promedioRec = 0;
      let sumaStuDel = 0;
      let sumaStuDelArray: number[] = [];
      let sumaStuRecArray: number[] = [];
      let sumaStuRec = 0;
      let motoresRec = 0;
      let motoresDel = 0;
      const stuDelByTimestamp: { [key: string]: number } = {};
      const stuRecByTimestamp: { [key: string]: number } = {};
      this.reportService.getCogeneracion(fechaInicialFormatted.toISOString().split('T')[0], fechaFinalFormatted).subscribe(
        (resp3: any) => {
          console.log("Respuesta 1 ", resp3);

          for (let i = 0; i < resp3.medidoresSTUDel.length && i < resp3.medidoresSTURec.length; i++) {
            const medidorDel = resp3.medidoresSTUDel[i];
            const medidorRec = resp3.medidoresSTURec[i];

            if (medidorDel.TipoMedidor === 'Principal' && medidorRec.TipoMedidor === 'Principal') {
              const timestampDel = medidorDel.Fecha;
              const timestampRec = medidorRec.Fecha;


              if (timestampDel === timestampDel && timestampRec === timestampRec) {
                stuDelByTimestamp[timestampDel] = (stuDelByTimestamp[timestampDel] || 0) + medidorDel.Value;
                stuRecByTimestamp[timestampRec] = (stuRecByTimestamp[timestampRec] || 0) + medidorRec.Value;
              }
            }
          }

          for (const timestamp in stuDelByTimestamp) {
            if (stuDelByTimestamp.hasOwnProperty(timestamp)) {
              sumaStuDel = stuDelByTimestamp[timestamp];
              sumaStuDelArray.push(sumaStuDel);
            }
          }

          for (const timestamp in stuRecByTimestamp) {
            if (stuRecByTimestamp.hasOwnProperty(timestamp)) {
              sumaStuRec = stuRecByTimestamp[timestamp];
              sumaStuRecArray.push(sumaStuRec);
            }
          }

          //Cogeneracion
          // Filtrar y agregar valores a los arrays
          resp3.cogeneracionDel.forEach((medidor: any, index: any) => {
            if (medidor.TipoMedidor === 'Principal' && resp3.cogeneracionRec[index].TipoMedidor === 'Principal') {
              cogPrincipalDelArray.push(medidor.Value);
              cogPrincipalRecArray.push(resp3.cogeneracionRec[index].Value);
            }
            if (medidor.TipoMedidor === 'Respaldo' && resp3.cogeneracionRec[index].TipoMedidor === 'Respaldo') {
              cogRespaldoDelArray.push(medidor.Value);
              cogRespaldoRecArray.push(resp3.cogeneracionRec[index].Value);
            }
          });
          // Verificar si los arrays tienen la misma longitud
          if (cogPrincipalDelArray.length === cogRespaldoDelArray.length) {
            promediosCogDel = cogPrincipalDelArray.map((value, index) => (value + cogRespaldoDelArray[index]) / 2);
            promediosCogRec = cogPrincipalRecArray.map((value, index) => (value + cogRespaldoRecArray[index]) / 2);
            //console.log("promedio ",promedioCogDel)
          } else {
            console.log("Los arreglos no tienen la misma longitud, no se pueden calcular promedios.");
          }

          if (sumaStuDelArray.length === promediosCogDel.length) {

            for (let i = 0; i < sumaStuDelArray.length; i++) {
              const resta = sumaStuDelArray[i] - promediosCogDel[i];
              motoresDelArray.push(resta);
            }
          } else {
            console.log("Los arrays no tienen la misma longitud, no se pueden restar.");
          }

          if (sumaStuRecArray.length === promediosCogRec.length) {

            for (let i = 0; i < sumaStuRecArray.length; i++) {
              const resta = sumaStuRecArray[i] - promediosCogRec[i];
              motoresRecArray.push(resta);
            }

          } else {
            console.log("Los arrays no tienen la misma longitud, no se pueden restar.");
          }
          if (motoresDelArray.length === motoresRecArray.length) {

            for (let i = 0; i < motoresDelArray.length && i < motoresRecArray.length; i++) {
              const diferencia = motoresDelArray[i] - motoresRecArray[i];
              diferenciaMotores.push(diferencia);
            }

            console.log(diferenciaMotores);
          } else {
            console.log("Los arrays no tienen la misma longitud, no se pueden restar.");
          }

        }
        ,
        (error) => {
          console.log('Error en la solicitud HTTP', error);
        }
      );
    } else if (this.tipoReporte === 'Cogeneracion') {
      const doc = new jsPDF();
      let tittle = `LECTURAS DE ENERGIA COGENERACIÓN DEL ${fechaInicioFormateada} AL ${fechaFinFormateada}`;
      let lecturasPrincipalTxt = '1. LECTURAS Y DIFERENCIA DE ENERGIA MEDIDOR PRINCIPAL';
      let lecturasRespaldoTxt = '2. LECTURAS Y DIFERENCIA DE ENERGIA MEDIDOR DE RESPALDO';
      let promedioMedidoresTxt = '3. PROMEDIO Y % ERROR DE ENERGIA';
      let capacidadTxt = '4. CAPACIDAD DE POTENCIA FIRME';
      let horasPuntaPeriodoTxt = 'Horas punta del Período';
      let diasHorasPuntaTxt = 'Días Horas punta';
      let totalKwhPuntaTxt = 'Total kWh punta del Período';
      let potenciaFirmeTxt = 'Potencia Firme (kW) ponderado para\nFacturación = (Total kWh Puntas del\nperiodo/horas punta del Periodo)';
      let energiaNetaTxt = '5. ENERGIA NETA A FACTURA\n(Entregada menos Recibida, kWh(Q14-Q23))';
      let TotalMesTxt = 'TOTAL MES';
      let Principaltxt = 'PRINCIPAL';
      let lecturasCabeceraTxt = 'LECTURAS ENERGIA KWh.\nENTREGADA POR CO GENERADOR';
      let lecturaEneeCabeceraTxt = 'LECTURAS ENERGIA MWh.\nENTREGADA POR ENEE';
      let medidorTxt = 'Medidor';
      let fechaTxt = 'Fecha';
      let puntaTxt = 'Punta';
      let restoTxt = 'Resto';
      let promedioMedidoresTxt1='Promedio entre medidores';
      let totalActivoTxt = 'Total Activo';
      let subTotalTxt = 'Sub Total';
      let diferenciaLecturasTxt = 'DIFERENCIAS DE LAS LECTURAS';
      let porcentajeErrorTxt='Porcentaje de error entre Mediciones';
      let energiaCogeneradorTxt='ENERGIA ENTREGADA POR CO-GENERADOR';
      let energiaEneeTxt='ENERGIA ENTREGADA POR ENEE';
      let promMedidoresTxt = 'Promedio entre medidores kWh (LA)';
      let factorTxt ='Factor';
      let totalTxt='Total';
      let energiaNetaMesTxt='Energía Neta del mes kWh\n= (kWh Entregada Por Co-generador - kWh\nEntregada por ENEE)';
      const firma1 = `Roberto Martínez`;
      const firma2 = `Roldán Bustillo`;
      const firma3 = `Guillermo González`;
      const lineafirma = `________________________`;
      const porEnee = `Por ENEE`;
      const porEnersa = `Por ENERSA`;
      const lugar = `Choloma`
      const fechaGenerada = new Date();

      // Definir una matriz de nombres de meses en español
      const nombresMeses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
      const dia = fechaGenerada.getDate();
      const mes = nombresMeses[fechaGenerada.getMonth()];
      const anio = fechaGenerada.getFullYear();
      const fechaConstancia = lugar + ` ${dia}` + ` ${mes}`+ ` ${anio}`
      //data de medidores enersa
      let dataNombreMedidor = '';
      let dataLecturaPuntaInicialPrincipal = 0;
      let dataLecturaRestoInicialPrincipal = 0;
      let dataLecturaPuntaFinalPrincipal = 0;
      let dataLecturaRestoFinalPrincipal = 0;
      let dataTotalActivoInicialPrincipal = 0;
      let dataTotalActivoFinalPrincipal = 0;
      let dataDiferenciaActivoPrincipal = 0;
      let dataDiferenciaRestoPrincipal = 0
      let dataDiferenciaPuntaPrincipal = 0;
      let dataPromedioPunta=0;
      let dataPromedioResto=0;
      let dataPromedioTotalActivo=0;
      let dataPorcentPunta=0;
      let dataPorcentResto=0;
      let dataPorcentTotalActivo=0;
      let dataFactor=1;
      let dataTotalPunta=0;
      let dataTotalResto=0;
      let dataTotalActivo=0
      let dataLecturaPuntaInicialRespaldo = 0;
      let dataLecturaRestoInicialRespaldo = 0;
      let dataLecturaPuntaFinalRespaldo = 0;
      let dataLecturaRestoFinalRespaldo = 0;
      let dataTotalActivoInicialRespaldo = 0;
      let dataTotalActivoFinalRespaldo = 0;
      let dataDiferenciaActivoRespaldo = 0;
      let dataDiferenciaRestoRespaldo = 0
      let dataDiferenciaPuntaRespaldo = 0;
      let dataSignature = '';
      let dataFechaIncial = '';
      let dataFechaFinal = '';
      let dataHorasPunta=0;
      let dataMultiplicador=0;
      let dataHpuntaPeriodo=0;
      let dataPotenciaFirme=0;

      //data manual enee

      let dataTotalPuntaEnee=0;
      let dataTotalRestoEnee=0;
      let dataPuntaInicialEnee=0;
      let dataRestoInicialEnee=0;
      let dataPuntaFinalEnee=0;
      let dataRestoFinalEnee=0;
      let dataTotalActivoEnee=0;
      let dataTotalActivoInicialEnee=0;
      let dataTotalActivoFinalEnee=0;
      let dataTotalKwPunta=0;
      let dataEnergiaNetaMes=0;
      let dataDiferenciaPuntaEnee=0
      let dataDiferenciaRestoEnee=0;
      let dataDiferenciaActivoEnee=0;

      let dataPuntaRespaldoInicialEnee=0;
      let dataPuntaRespaldoFinalEnee=0;
      let dataRestoRespaldoInicialEnee=0;
      let dataRestoRespaldoFinalEnee=0;
      let dataActivoRespaldoInicialEnee=0;
      let dataActivoRespaldoFinalEnee=0;
      let dataDiferenciaPuntaRespaldoEnee=0;
      let dataDiferenciaRestoRespaldoEnee=0;
      let dataDiferenciaActivoRespaldoEnee=0

      let dataPromedioPuntaEnee=0;
      let dataPromedioRestoEnee=0;
      let dataPromedioActivoEnee=0

      let dataPorcentPuntaEnee=0;
      let dataPorcentRestoEnee=0;
      let dataPorcentActivoEnee = 0;

      this.reportService.getCogeneracion_12(fechaInicialFormatted.toISOString().split('T')[0], fechaFinalFormatted).subscribe(
        (response: any) => {
          console.log("Respuesta 1 ", response);

          if(response){
            dataHorasPunta= response.horaPunta[0].horas;
            dataMultiplicador = response.horaPunta[0].multiplicador;
            dataHpuntaPeriodo = dataHorasPunta * dataMultiplicador;
          }
          //lecturas manuales enee
          if(response){
            for(let i=0; i<response.lecturasEnee.length; i++){
              const horasPuntaInicialEnee=response.lecturasEnee[i].puntaInicial;
              const horasPuntaFinalEnee = response.lecturasEnee[i].puntaFinal
              const horasRestoInicialEnee = response.lecturasEnee[i].restoInicial;
              const horasRestoFinalEnee = response.lecturasEnee[i].restoFinal;

              if(response.lecturasEnee[i].tipoMedidor==='Principal'){
                dataPuntaInicialEnee = horasPuntaInicialEnee;
                dataRestoInicialEnee = horasRestoInicialEnee;
                dataPuntaFinalEnee = horasPuntaFinalEnee;
                dataRestoFinalEnee = horasRestoFinalEnee;

                dataTotalActivoInicialEnee = dataPuntaInicialEnee + dataRestoInicialEnee;
                dataTotalActivoFinalEnee = dataPuntaFinalEnee + dataRestoFinalEnee;

                dataDiferenciaPuntaEnee = dataPuntaFinalEnee - dataPuntaInicialEnee;
                dataDiferenciaPuntaEnee = Number(dataDiferenciaPuntaEnee.toFixed(4))
                dataDiferenciaRestoEnee = dataRestoFinalEnee - dataRestoInicialEnee;
                dataDiferenciaRestoEnee = Number(dataDiferenciaRestoEnee.toFixed(4));
                dataDiferenciaActivoEnee = dataTotalActivoFinalEnee - dataTotalActivoInicialEnee;
                dataDiferenciaActivoEnee = Number(dataDiferenciaActivoEnee.toFixed(4));
                // Definir las coordenadas de inicio para la tabla de generacion Principal
                const startX = 10;
                const startY = 37;
                doc.setFontSize(7)
                //data principal cuadro1
                doc.text(dataPuntaInicialEnee.toString(),10 * startX + 40, startY + 18.5);
                doc.text(dataRestoInicialEnee.toString(),13 * startX + 30, startY + 18.5);
                doc.text(dataTotalActivoInicialEnee.toString(),15 * startX + 33, startY + 18.5);
                doc.text(dataPuntaFinalEnee.toString(),10 * startX + 40, startY + 23.5);
                doc.text(dataRestoFinalEnee.toString(),13 * startX + 30, startY + 23.5);
                doc.text(dataTotalActivoFinalEnee.toString(),15 * startX + 33, startY + 23.5);

                doc.text(dataDiferenciaPuntaEnee.toString(),10 * startX + 40, startY + 33.5);
                doc.text(dataDiferenciaRestoEnee.toString(),13 * startX + 30, startY + 33.5);
                doc.text(dataDiferenciaActivoEnee.toString(),15 * startX + 33, startY + 33.5);

              }else{
                dataPuntaRespaldoInicialEnee = response.lecturasEnee[i].puntaInicial;;
                dataPuntaRespaldoFinalEnee = response.lecturasEnee[i].puntaFinal;
                dataRestoRespaldoInicialEnee = response.lecturasEnee[i].restoInicial;
                dataRestoRespaldoFinalEnee = response.lecturasEnee[i].restoFinal;

                dataActivoRespaldoInicialEnee = dataPuntaRespaldoInicialEnee + dataRestoRespaldoInicialEnee;
                dataActivoRespaldoInicialEnee =Number(dataActivoRespaldoInicialEnee.toFixed(4));
                dataActivoRespaldoFinalEnee = dataPuntaRespaldoFinalEnee + dataRestoRespaldoFinalEnee;
                dataActivoRespaldoFinalEnee = Number(dataActivoRespaldoFinalEnee.toFixed(4));

                dataDiferenciaPuntaRespaldoEnee = dataPuntaRespaldoFinalEnee -dataPuntaRespaldoInicialEnee;
                dataDiferenciaPuntaRespaldoEnee = Number(dataDiferenciaPuntaRespaldoEnee.toFixed(4));
                dataDiferenciaRestoRespaldoEnee = dataRestoRespaldoFinalEnee - dataRestoRespaldoInicialEnee;
                dataDiferenciaRestoRespaldoEnee = Number(dataDiferenciaRestoRespaldoEnee.toFixed(4));
                dataDiferenciaActivoRespaldoEnee = dataActivoRespaldoFinalEnee - dataActivoRespaldoInicialEnee;
                dataDiferenciaActivoRespaldoEnee = Number(dataDiferenciaActivoRespaldoEnee.toFixed(4));

                // Definir las coordenadas de inicio para la tabla de generacion Principal
                const startX = 10;
                const startY = 87;
                doc.setFontSize(7)
                doc.text(dataPuntaRespaldoInicialEnee.toString(),10 * startX + 40, startY + 18.5);
                doc.text(dataRestoRespaldoInicialEnee.toString(),13 * startX + 30, startY + 18.5);
                doc.text(dataActivoRespaldoInicialEnee.toString(),15 * startX + 33, startY + 18.5);

                doc.text(dataPuntaRespaldoFinalEnee.toString(),10 * startX + 40, startY + 23.5);
                doc.text(dataRestoRespaldoFinalEnee.toString(),13 * startX + 30, startY + 23.5);
                doc.text(dataActivoRespaldoFinalEnee.toString(),15 * startX + 33, startY + 23.5);

                doc.text(dataDiferenciaPuntaRespaldoEnee.toString(),10 * startX + 40, startY + 33.5);
                doc.text(dataDiferenciaRestoRespaldoEnee.toString(),13 * startX + 30, startY + 33.5);
                doc.text(dataDiferenciaActivoRespaldoEnee.toString(),15 * startX + 33, startY + 33.5);
              }

              dataPromedioPuntaEnee = (dataDiferenciaPuntaEnee + dataDiferenciaPuntaRespaldoEnee)/2;
              dataPromedioPuntaEnee = Number(dataPromedioPuntaEnee.toFixed(4));
              dataPromedioRestoEnee = (dataDiferenciaRestoEnee + dataDiferenciaRestoRespaldoEnee)/2;
              dataPromedioRestoEnee = Number(dataPromedioRestoEnee.toFixed(4));
              dataPromedioActivoEnee = Number(dataDiferenciaActivoEnee + dataDiferenciaActivoRespaldoEnee)/2;
              dataPromedioActivoEnee = Number(dataPromedioActivoEnee.toFixed(4));

              dataPorcentPuntaEnee =Math.abs((dataDiferenciaPuntaEnee/dataPromedioActivoEnee-1));
              dataPorcentPuntaEnee = Number(dataPorcentPuntaEnee.toFixed(4));
              dataPorcentRestoEnee = Math.abs((dataDiferenciaRestoEnee / dataPromedioRestoEnee-1));
              dataPorcentRestoEnee = Number(dataPorcentRestoEnee.toFixed(4));
              dataPorcentActivoEnee = Math.abs((dataDiferenciaActivoEnee / dataPromedioActivoEnee-1));
              dataPorcentActivoEnee = Number(dataPorcentActivoEnee.toFixed(4));

              dataTotalPuntaEnee = dataPromedioPuntaEnee * dataFactor;
              dataTotalRestoEnee = dataPromedioRestoEnee * dataFactor;
              dataTotalActivoEnee = dataPromedioActivoEnee * dataFactor;

            }
            const startX = 10;
            const startY = 137;

            doc.text(dataPromedioPuntaEnee.toString(), 10 * startX + 42, startY + 18.5);
            doc.text(dataPromedioRestoEnee.toString(), 13 * startX + 30, startY + 18.5);
            doc.text(dataPromedioActivoEnee.toString(), 15 * startX + 33, startY + 18.5);

            doc.text(dataPorcentPuntaEnee.toString() + '%', 10 * startX + 43, startY + 23.5);
            doc.text(dataPorcentRestoEnee.toString()+ '%', 13 * startX + 33, startY + 23.5);
            doc.text(dataPorcentActivoEnee.toString()+ '%', 15 * startX + 35, startY + 23.5);

            doc.text(dataTotalPuntaEnee.toString(), 10 * startX + 43, startY + 38.5);
            doc.text(dataTotalRestoEnee.toString(), 13 * startX + 33, startY + 38.5);
            doc.text(dataTotalActivoEnee.toString(), 15 * startX + 35, startY + 38.5);

          }


          //lectura medidores pme
          if (response) {
            for (let i = 0; i < response.medidoresPuntaInicial.length && i < response.medidoresRestoInicial.length && i < response.medidoresPuntaFinal.length && i < response.medidoresRestoFinal.length; i++) {
              const horasPuntaInicial = response.medidoresPuntaInicial[i]
              const restoInicial = response.medidoresRestoInicial[i];
              const horasPuntaFinal = response.medidoresPuntaFinal[i];
              const restoFinal = response.medidoresRestoFinal[i];

              if (horasPuntaInicial.TipoMedidor === 'Principal' && restoInicial.TipoMedidor === 'Principal' && horasPuntaFinal.TipoMedidor === 'Principal' && restoFinal.TipoMedidor === 'Principal') {
                dataNombreMedidor = horasPuntaInicial.sourceName;
                dataLecturaPuntaInicialPrincipal = horasPuntaInicial.Value;
                dataLecturaRestoInicialPrincipal = restoInicial.Value;
                dataLecturaPuntaFinalPrincipal = horasPuntaFinal.Value;
                dataLecturaRestoFinalPrincipal = restoFinal.Value;
                dataSignature = horasPuntaInicial.Signature;
                dataFechaIncial = horasPuntaInicial.Fecha;
                dataFechaFinal = horasPuntaFinal.Fecha;
                dataDiferenciaPuntaPrincipal = dataLecturaPuntaFinalPrincipal - dataLecturaPuntaInicialPrincipal;
                dataDiferenciaRestoPrincipal = dataLecturaRestoFinalPrincipal - dataLecturaRestoInicialPrincipal;
                dataTotalActivoInicialPrincipal = dataLecturaPuntaInicialPrincipal + dataLecturaRestoInicialPrincipal;
                dataTotalActivoFinalPrincipal = dataLecturaPuntaFinalPrincipal + dataLecturaRestoFinalPrincipal;
                dataDiferenciaActivoPrincipal = dataTotalActivoFinalPrincipal - dataTotalActivoInicialPrincipal;
                // Definir las coordenadas de inicio para la tabla de generacion Principal
                const startX = 10;
                const startY = 37;
                // Definir el ancho y alto de las celdas
                const cellWidth = 40;
                const cellHeight = 10;
                // Dibujar la tabla cabecera
                doc.rect(startX, startY, cellWidth + 10, cellHeight); // Celda 1
                doc.rect(startX + cellWidth + 10, startY, cellWidth + 35, cellHeight); // Celda 2
                doc.rect(startX + 2 * cellWidth + 45, startY, cellWidth + 26, cellHeight); // Celda 3
                //cuadros sub cabecera
                doc.rect(startX, startY + 10, cellWidth - 15, cellHeight - 5); // Celda 1
                doc.rect(startX + cellWidth - 15, startY + 10, cellWidth - 15, cellHeight - 5); // Celda 2
                doc.rect(startX + cellWidth * 2 - 30, startY + 10, cellWidth - 15, cellHeight - 5); // Celda 3
                doc.rect(startX + cellWidth * 3 - 45, startY + 10, cellWidth - 15, cellHeight - 5); // Celda 4
                doc.rect(startX + cellWidth * 4 - 60, startY + 10, cellWidth - 15, cellHeight - 5); // Celda 5
                doc.rect(startX + cellWidth * 5 - 75, startY + 10, cellWidth - 18, cellHeight - 5); // Celda 6
                doc.rect(startX + cellWidth * 6 - 93, startY + 10, cellWidth - 18, cellHeight - 5); // Celda 7
                doc.rect(startX + cellWidth * 7 - 111, startY + 10, cellWidth - 18, cellHeight - 5); // Celda 8
                // Rellenar las celdas cabecera con texto
                doc.setFontSize(10);
                doc.text(Principaltxt, startX + 13, startY + 6); // Ajusta las coordenadas para centrar el texto
                doc.text(lecturasCabeceraTxt, startX + cellWidth + 17, startY + 4); // Ajusta las coordenadas para centrar el texto
                doc.text(lecturaEneeCabeceraTxt, startX + cellWidth + 95, startY + 4); // Ajusta las coordenadas para centrar el texto
                //subceldas cabecera con text
                doc.setFontSize(8);
                doc.text(medidorTxt, startX + 8, startY + 13.5);
                doc.text(fechaTxt, startX + 33, startY + 13.5);
                doc.text(puntaTxt, 2 * startX + 48, startY + 13.5);
                doc.text(restoTxt, 5 * startX + 43, startY + 13.5);
                doc.text(totalActivoTxt, 7 * startX + 45, startY + 13.5);
                doc.text(puntaTxt, 10 * startX + 42, startY + 13.5);
                doc.text(restoTxt, 12 * startX + 42, startY + 13.5);
                doc.text(totalActivoTxt, 14 * startX + 42, startY + 13.5)

                //Cuadros para data
                doc.rect(startX, startY + 15, cellWidth - 15, cellHeight + 10); // Celda 1
                doc.rect(startX + cellWidth - 15, startY + 15, cellWidth - 15, cellHeight - 5); // Celda 2
                doc.rect(startX + cellWidth - 15, startY + 20, cellWidth - 15, cellHeight - 5); // Celda 2
                doc.rect(startX + cellWidth - 15, startY + 25, cellWidth - 15, cellHeight - 5); // Celda 2
                doc.rect(startX + cellWidth - 15, startY + 30, cellWidth - 15, cellHeight - 5); // Celda 2
                doc.rect(startX + cellWidth * 2 - 30, startY + 15, cellWidth - 15, cellHeight - 5); // Celda 3
                doc.rect(startX + cellWidth * 2 - 30, startY + 20, cellWidth - 15, cellHeight - 5); // Celda 3
                doc.rect(startX + cellWidth * 2 - 30, startY + 25, cellWidth + 35, cellHeight - 5); // celda diferencias
                doc.rect(startX + cellWidth * 5 - 75, startY + 25, cellWidth + 26, cellHeight - 5); // celda diferencias
                doc.rect(startX + cellWidth * 2 - 30, startY + 30, cellWidth - 15, cellHeight - 5); // Celda 3
                doc.rect(startX + cellWidth * 3 - 45, startY + 15, cellWidth - 15, cellHeight - 5); // Celda 4
                doc.rect(startX + cellWidth * 3 - 45, startY + 20, cellWidth - 15, cellHeight - 5); // Celda 4
                doc.rect(startX + cellWidth * 3 - 45, startY + 30, cellWidth - 15, cellHeight - 5); // Celda 4
                doc.rect(startX + cellWidth * 4 - 60, startY + 15, cellWidth - 15, cellHeight - 5); // Celda 5
                doc.rect(startX + cellWidth * 4 - 60, startY + 20, cellWidth - 15, cellHeight - 5); // Celda 5
                doc.rect(startX + cellWidth * 4 - 60, startY + 30, cellWidth - 15, cellHeight - 5); // Celda 5
                doc.rect(startX + cellWidth * 5 - 75, startY + 10, cellWidth - 18, cellHeight - 5); // Celda 6
                doc.rect(startX + cellWidth * 5 - 75, startY + 15, cellWidth - 18, cellHeight - 5); // Celda 6
                doc.rect(startX + cellWidth * 5 - 75, startY + 20, cellWidth - 18, cellHeight - 5); // Celda 6
                doc.rect(startX + cellWidth * 5 - 75, startY + 30, cellWidth - 18, cellHeight - 5); // Celda 6
                doc.rect(startX + cellWidth * 6 - 93, startY + 15, cellWidth - 18, cellHeight - 5); // Celda 7
                doc.rect(startX + cellWidth * 6 - 93, startY + 20, cellWidth - 18, cellHeight - 5); // Celda 7
                doc.rect(startX + cellWidth * 6 - 93, startY + 30, cellWidth - 18, cellHeight - 5); // Celda 7
                doc.rect(startX + cellWidth * 7 - 111, startY + 15, cellWidth - 18, cellHeight - 5); // Celda 8
                doc.rect(startX + cellWidth * 7 - 111, startY + 20, cellWidth - 18, cellHeight - 5); // Celda 8
                doc.rect(startX + cellWidth * 7 - 111, startY + 30, cellWidth - 18, cellHeight - 5); // Celda 8

                let fechaInicial = new Date(dataFechaIncial);
                let fechaInicio = fechaInicial.toISOString().split('T')[0];
                let fechaFinal = new Date(dataFechaFinal);
                let fechaFin = fechaFinal.toISOString().split('T')[0];
                //INFO DE LOS MEDIDORES
                doc.setFontSize(5)
                doc.text(dataNombreMedidor, startX + 0.5, startY + 22.5);
                doc.setFontSize(7)
                doc.text(dataSignature, startX + 2.5, startY + 27.5);
                doc.text(fechaInicio + ' 00:00:00', startX + 26.5, startY + 18.5);
                doc.text(fechaFin + ' 00:00:00', startX + 26.5, startY + 23.5);
                doc.text(subTotalTxt, startX + 31, startY + 33.5);
                doc.text(diferenciaLecturasTxt, startX * 2 + cellWidth + 17, startY + 28.5);
                doc.text(diferenciaLecturasTxt, startX * 2 + cellWidth + 17, startY + 28.5);
                doc.text(diferenciaLecturasTxt, startX * 9 + cellWidth + 17, startY + 28.5);
                doc.text(diferenciaLecturasTxt, startX * 9 + cellWidth + 17, startY + 28.5);
                doc.text(dataLecturaPuntaInicialPrincipal.toString(), 2 * startX + 47, startY + 18.5);
                doc.text(dataLecturaPuntaFinalPrincipal.toString(), 2 * startX + 47, startY + 23.5);
                doc.text(dataDiferenciaPuntaPrincipal.toString(), 2 * startX + 47, startY + 33.5);
                doc.text(dataLecturaRestoInicialPrincipal.toString(), 5 * startX + 43, startY + 18.5);
                doc.text(dataLecturaRestoFinalPrincipal.toString(), 5 * startX + 43, startY + 23.5);
                doc.text(dataDiferenciaRestoPrincipal.toString(), 5 * startX + 43, startY + 33.5);
                doc.text(dataTotalActivoInicialPrincipal.toString(), 7 * startX + 45, startY + 18.5);
                doc.text(dataTotalActivoFinalPrincipal.toString(), 7 * startX + 45, startY + 23.5);
                doc.text(dataDiferenciaActivoPrincipal.toString(), 7 * startX + 45, startY + 33.5);

              } else {
                let fechaInicial = new Date(dataFechaIncial);
                let fechaFinal = new Date(dataFechaFinal);
                let fechaInicio = fechaInicial.toISOString().split('T')[0];
                let fechaFin = fechaFinal.toISOString().split('T')[0];
                dataNombreMedidor = horasPuntaInicial.sourceName;
                dataLecturaPuntaInicialRespaldo = horasPuntaInicial.Value;
                dataLecturaRestoInicialRespaldo = restoInicial.Value;
                dataLecturaPuntaFinalRespaldo = horasPuntaFinal.Value;
                dataLecturaRestoFinalRespaldo = restoFinal.Value;
                dataSignature = horasPuntaInicial.Signature;
                dataFechaIncial = horasPuntaInicial.Fecha;
                dataFechaFinal = horasPuntaFinal.Fecha;
                dataDiferenciaPuntaRespaldo = dataLecturaPuntaFinalRespaldo - dataLecturaPuntaInicialRespaldo;
                dataDiferenciaRestoRespaldo = dataLecturaRestoFinalRespaldo - dataLecturaRestoInicialRespaldo;
                dataTotalActivoInicialRespaldo = dataLecturaPuntaInicialRespaldo + dataLecturaRestoInicialRespaldo;
                dataTotalActivoFinalRespaldo = dataLecturaPuntaFinalRespaldo + dataLecturaRestoFinalRespaldo;
                dataDiferenciaActivoRespaldo = dataTotalActivoFinalRespaldo - dataTotalActivoInicialRespaldo;

                // Definir las coordenadas de inicio para la tabla de generacion Respaldo
                const startX1 = 10;
                const startY1 = 87;
                // Definir el ancho y alto de las celdas
                const cellWidth1 = 40;
                const cellHeight1 = 10;
                // Dibujar la tabla cabecera
                doc.rect(startX1, startY1, cellWidth1 + 10, cellHeight1); // Celda 1
                doc.rect(startX1 + cellWidth1 + 10, startY1, cellWidth1 + 35, cellHeight1); // Celda 2
                doc.rect(startX1 + 2 * cellWidth1 + 45, startY1, cellWidth1 + 26, cellHeight1); // Celda 3
                //cuadros sub cabecera
                doc.rect(startX1, startY1 + 10, cellWidth1 - 15, cellHeight1 - 5); // Celda 1
                doc.rect(startX1 + cellWidth1 - 15, startY1 + 10, cellWidth1 - 15, cellHeight1 - 5); // Celda 2
                doc.rect(startX1 + cellWidth1 * 2 - 30, startY1 + 10, cellWidth1 - 15, cellHeight1 - 5); // Celda 3
                doc.rect(startX1 + cellWidth1 * 3 - 45, startY1 + 10, cellWidth1 - 15, cellHeight1 - 5); // Celda 4
                doc.rect(startX1 + cellWidth1 * 4 - 60, startY1 + 10, cellWidth1 - 15, cellHeight1 - 5); // Celda 5
                doc.rect(startX1 + cellWidth1 * 5 - 75, startY1 + 10, cellWidth1 - 18, cellHeight1 - 5); // Celda 6
                doc.rect(startX1 + cellWidth1 * 6 - 93, startY1 + 10, cellWidth1 - 18, cellHeight1 - 5); // Celda 7
                doc.rect(startX1 + cellWidth1 * 7 - 111, startY1 + 10, cellWidth1 - 18, cellHeight1 - 5); // Celda 8
                // Rellenar las celdas cabecera con texto
                doc.setFontSize(10);
                doc.text(Principaltxt, startX1 + 13, startY1 + 6); // Ajusta las coordenadas para centrar el texto
                doc.text(lecturasCabeceraTxt, startX1 + cellWidth1 + 17, startY1 + 4); // Ajusta las coordenadas para centrar el texto
                doc.text(lecturaEneeCabeceraTxt, startX1 + cellWidth1 + 95, startY1 + 4); // Ajusta las coordenadas para centrar el texto
                //subceldas cabecera con text
                doc.setFontSize(8);
                doc.text(medidorTxt, startX1 + 8, startY1 + 13.5);
                doc.text(fechaTxt, startX1 + 33, startY1 + 13.5);
                doc.text(puntaTxt, 2 * startX1 + 48, startY1 + 13.5);
                doc.text(restoTxt, 5 * startX1 + 43, startY1 + 13.5);
                doc.text(totalActivoTxt, 7 * startX1 + 45, startY1 + 13.5);
                doc.text(puntaTxt, 10 * startX1 + 42, startY1 + 13.5);
                doc.text(restoTxt, 12 * startX1 + 42, startY1 + 13.5);
                doc.text(totalActivoTxt, 14 * startX1 + 42, startY1 + 13.5)

                //Cuadros para data
                doc.rect(startX1, startY1 + 15, cellWidth1 - 15, cellHeight1 + 10); // Celda 1
                doc.rect(startX1 + cellWidth1 - 15, startY1 + 15, cellWidth1 - 15, cellHeight1 - 5); // Celda 2
                doc.rect(startX1 + cellWidth1 - 15, startY1 + 20, cellWidth1 - 15, cellHeight1 - 5); // Celda 2
                doc.rect(startX1 + cellWidth1 - 15, startY1 + 25, cellWidth1 - 15, cellHeight1 - 5); // Celda 2
                doc.rect(startX1 + cellWidth1 - 15, startY1 + 30, cellWidth1 - 15, cellHeight1 - 5); // Celda 2
                doc.rect(startX1 + cellWidth1 * 2 - 30, startY1 + 15, cellWidth1 - 15, cellHeight1 - 5); // Celda 3
                doc.rect(startX1 + cellWidth1 * 2 - 30, startY1 + 20, cellWidth1 - 15, cellHeight1 - 5); // Celda 3
                doc.rect(startX1 + cellWidth1 * 2 - 30, startY1 + 25, cellWidth1 + 35, cellHeight1 - 5); // celda diferencias
                doc.rect(startX1 + cellWidth1 * 5 - 75, startY1 + 25, cellWidth1 + 26, cellHeight1 - 5); // celda diferencias
                doc.rect(startX1 + cellWidth1 * 2 - 30, startY1 + 30, cellWidth1 - 15, cellHeight1 - 5); // Celda 3
                doc.rect(startX1 + cellWidth1 * 3 - 45, startY1 + 15, cellWidth1 - 15, cellHeight1 - 5); // Celda 4
                doc.rect(startX1 + cellWidth1 * 3 - 45, startY1 + 20, cellWidth1 - 15, cellHeight1 - 5); // Celda 4
                doc.rect(startX1 + cellWidth1 * 3 - 45, startY1 + 30, cellWidth1 - 15, cellHeight1 - 5); // Celda 4
                doc.rect(startX1 + cellWidth1 * 4 - 60, startY1 + 15, cellWidth1 - 15, cellHeight1 - 5); // Celda 5
                doc.rect(startX1 + cellWidth1 * 4 - 60, startY1 + 20, cellWidth1 - 15, cellHeight1 - 5); // Celda 5
                doc.rect(startX1 + cellWidth1 * 4 - 60, startY1 + 30, cellWidth1 - 15, cellHeight1 - 5); // Celda 5
                doc.rect(startX1 + cellWidth1 * 5 - 75, startY1 + 10, cellWidth1 - 18, cellHeight1 - 5); // Celda 6
                doc.rect(startX1 + cellWidth1 * 5 - 75, startY1 + 15, cellWidth1 - 18, cellHeight1 - 5); // Celda 6
                doc.rect(startX1 + cellWidth1 * 5 - 75, startY1 + 20, cellWidth1 - 18, cellHeight1 - 5); // Celda 6
                doc.rect(startX1 + cellWidth1 * 5 - 75, startY1 + 30, cellWidth1 - 18, cellHeight1 - 5); // Celda 6
                doc.rect(startX1 + cellWidth1 * 6 - 93, startY1 + 15, cellWidth1 - 18, cellHeight1 - 5); // Celda 7
                doc.rect(startX1 + cellWidth1 * 6 - 93, startY1 + 20, cellWidth1 - 18, cellHeight1 - 5); // Celda 7
                doc.rect(startX1 + cellWidth1 * 6 - 93, startY1 + 30, cellWidth1 - 18, cellHeight1 - 5); // Celda 7
                doc.rect(startX1 + cellWidth1 * 7 - 111, startY1 + 15, cellWidth1 - 18, cellHeight1 - 5); // Celda 8
                doc.rect(startX1 + cellWidth1 * 7 - 111, startY1 + 20, cellWidth1 - 18, cellHeight1 - 5); // Celda 8
                doc.rect(startX1 + cellWidth1 * 7 - 111, startY1 + 30, cellWidth1 - 18, cellHeight1 - 5); // Celda 8

                //INFO DE LOS MEDIDORES
                doc.setFontSize(5)
                doc.text(dataNombreMedidor, startX1 + 0.1, startY1 + 22.5);
                doc.setFontSize(7)
                doc.text(dataSignature, startX1 + 2.2, startY1 + 27.5);
                doc.text(fechaInicio + ' 00:00:00', startX1 + 26.5, startY1 + 18.5);
                doc.text(fechaFin + ' 00:00:00', startX1 + 26.5, startY1 + 23.5);
                doc.text(subTotalTxt, startX1 + 31, startY1 + 33.5);
                doc.text(diferenciaLecturasTxt, startX1 * 2 + cellWidth1 + 17, startY1 + 28.5);
                doc.text(diferenciaLecturasTxt, startX1 * 2 + cellWidth1 + 17, startY1 + 28.5);
                doc.text(diferenciaLecturasTxt, startX1 * 9 + cellWidth1 + 17, startY1 + 28.5);
                doc.text(diferenciaLecturasTxt, startX1 * 9 + cellWidth1 + 17, startY1 + 28.5);
                doc.text(dataLecturaPuntaInicialRespaldo.toString(), 2 * startX1 + 47, startY1 + 18.5);
                doc.text(dataLecturaPuntaFinalRespaldo.toString(), 2 * startX1 + 47, startY1 + 23.5);
                doc.text(dataDiferenciaPuntaRespaldo.toString(), 2 * startX1 + 47, startY1 + 33.5);
                doc.text(dataLecturaRestoInicialRespaldo.toString(), 5 * startX1 + 43, startY1 + 18.5);
                doc.text(dataLecturaRestoFinalRespaldo.toString(), 5 * startX1 + 43, startY1 + 23.5);
                doc.text(dataDiferenciaRestoRespaldo.toString(), 5 * startX1 + 43, startY1 + 33.5);
                doc.text(dataTotalActivoInicialRespaldo.toString(), 7 * startX1 + 45, startY1 + 18.5);
                doc.text(dataTotalActivoFinalRespaldo.toString(), 7 * startX1 + 45, startY1 + 23.5);
                doc.text(dataDiferenciaActivoRespaldo.toString(), 7 * startX1 + 45, startY1 + 33.5);
              }

              dataPromedioPunta = (dataDiferenciaPuntaPrincipal + dataDiferenciaPuntaRespaldo)/2;
              dataPromedioResto = (dataDiferenciaRestoPrincipal + dataDiferenciaRestoRespaldo)/2;
              dataPromedioTotalActivo = (dataDiferenciaActivoPrincipal + dataDiferenciaActivoRespaldo)/2

              dataPorcentPunta = Math.abs((dataDiferenciaPuntaPrincipal / dataPromedioPunta) - 1);
              dataPorcentPunta = Number(dataPorcentPunta.toFixed(8));
              dataPorcentResto = Math.abs((dataDiferenciaRestoPrincipal/dataPromedioResto-1));
              dataPorcentResto =Number(dataPorcentResto.toFixed(8));
              dataPorcentTotalActivo = Math.abs((dataDiferenciaActivoPrincipal/dataPromedioTotalActivo-1));
              dataPorcentTotalActivo = Number (dataPorcentTotalActivo.toFixed(8));
              dataTotalPunta = dataPromedioPunta*dataFactor;
              dataTotalResto = dataPromedioResto * dataFactor;
              dataTotalActivo = dataPromedioTotalActivo * dataFactor;

              dataTotalKwPunta = dataTotalPunta - dataTotalPuntaEnee;
              dataPotenciaFirme = dataTotalKwPunta/dataHpuntaPeriodo;
              dataPotenciaFirme= Number(dataPotenciaFirme.toFixed(4));
              dataEnergiaNetaMes = dataTotalActivo - dataTotalActivoEnee;
            }
            // Definir las coordenadas de inicio para la tabla
            const startX = 10;
            const startY = 137;
            // Definir el ancho y alto de las celdas
            const cellWidth = 40;
            const cellHeight = 10;
            // Dibujar la tabla cabecera
            doc.rect(startX, startY+10, cellWidth + 10, cellHeight); // Celda 1
            doc.rect(startX + cellWidth + 10, startY, cellWidth + 35, cellHeight); // Celda 2
            doc.rect(startX + 2 * cellWidth + 45, startY, cellWidth + 26, cellHeight); // Celda 3

            //cuadros sub cabecera
            doc.rect(startX + cellWidth * 2 - 30, startY + 10, cellWidth - 15, cellHeight - 5); // Celda 3
            doc.rect(startX + cellWidth * 3 - 45, startY + 10, cellWidth - 15, cellHeight - 5); // Celda 4
            doc.rect(startX + cellWidth * 4 - 60, startY + 10, cellWidth - 15, cellHeight - 5); // Celda 5
            doc.rect(startX + cellWidth * 5 - 75, startY + 10, cellWidth - 18, cellHeight - 5); // Celda 6
            doc.rect(startX + cellWidth * 6 - 93, startY + 10, cellWidth - 18, cellHeight - 5); // Celda 7
            doc.rect(startX + cellWidth * 7 - 111, startY + 10, cellWidth - 18, cellHeight - 5); // Celda 8
            // Rellenar las celdas cabecera con texto
            doc.setFontSize(10);
            doc.text(diferenciaLecturasTxt, startX + cellWidth + 18, startY + 5); // Ajusta las coordenadas para centrar el texto
            doc.text(diferenciaLecturasTxt, startX + cellWidth + 91, startY + 5); // Ajusta las coordenadas para centrar el texto
            //subceldas cabecera con text
            doc.setFontSize(8);
            doc.text(promedioMedidoresTxt1, startX + 8, startY + 15.5);
            doc.text(porcentajeErrorTxt, startX +1.5, startY + 23.5);
            doc.text(promMedidoresTxt, startX +1.5, startY + 28.5);
            doc.text(factorTxt, 3*startX, startY + 33.5);
            doc.text(totalTxt, 3*startX, startY + 38.5);

            doc.text(puntaTxt, 2 * startX + 48, startY + 13.5);
            doc.text(restoTxt, 5 * startX + 43, startY + 13.5);
            doc.text(totalActivoTxt, 7 * startX + 45, startY + 13.5);
            doc.text(puntaTxt, 10 * startX + 42, startY + 13.5);
            doc.text(restoTxt, 12 * startX + 42, startY + 13.5);
            doc.text(totalActivoTxt, 14 * startX + 42, startY + 13.5)

            //Cuadros para data
            doc.rect(startX, startY + 20, cellWidth + 10, cellHeight -5); // Celda 1.1
            doc.rect(startX, startY + 25, cellWidth + 10, cellHeight - 5);  //celda1.2
            doc.rect(startX, startY + 30, cellWidth + 10, cellHeight - 5);  //celda1.3
            doc.rect(startX, startY + 35, cellWidth + 10, cellHeight - 5);  //celda1.4

            doc.rect(startX + cellWidth * 2 - 30, startY + 15, cellWidth - 15, cellHeight - 5); // Celda 3
            doc.rect(startX + cellWidth * 2 - 30, startY + 20, cellWidth - 15, cellHeight - 5); // Celda 3
            doc.rect(startX + cellWidth * 2 - 30, startY + 25, cellWidth + 35, cellHeight - 5); // celda diferencias
            doc.rect(startX + cellWidth * 5 - 75, startY + 25, cellWidth + 26, cellHeight - 5); // celda diferencias
            doc.rect(startX + cellWidth * 2 - 30, startY + 30, cellWidth - 15, cellHeight - 5); // Celda 3
            doc.rect(startX + cellWidth * 2 - 30, startY + 35, cellWidth - 15, cellHeight - 5); // Celda 3
            doc.rect(startX + cellWidth * 3 - 45, startY + 15, cellWidth - 15, cellHeight - 5); // Celda 4
            doc.rect(startX + cellWidth * 3 - 45, startY + 20, cellWidth - 15, cellHeight - 5); // Celda 4
            doc.rect(startX + cellWidth * 3 - 45, startY + 30, cellWidth - 15, cellHeight - 5); // Celda 4
            doc.rect(startX + cellWidth * 3 - 45, startY + 35, cellWidth - 15, cellHeight - 5); // Celda 4
            doc.rect(startX + cellWidth * 4 - 60, startY + 15, cellWidth - 15, cellHeight - 5); // Celda 5
            doc.rect(startX + cellWidth * 4 - 60, startY + 20, cellWidth - 15, cellHeight - 5); // Celda 5
            doc.rect(startX + cellWidth * 4 - 60, startY + 30, cellWidth - 15, cellHeight - 5); // Celda 5
            doc.rect(startX + cellWidth * 4 - 60, startY + 35, cellWidth - 15, cellHeight - 5); // Celda 5
            doc.rect(startX + cellWidth * 5 - 75, startY + 10, cellWidth - 18, cellHeight - 5); // Celda 6
            doc.rect(startX + cellWidth * 5 - 75, startY + 15, cellWidth - 18, cellHeight - 5); // Celda 6
            doc.rect(startX + cellWidth * 5 - 75, startY + 20, cellWidth - 18, cellHeight - 5); // Celda 6
            doc.rect(startX + cellWidth * 5 - 75, startY + 30, cellWidth - 18, cellHeight - 5); // Celda 6
            doc.rect(startX + cellWidth * 5 - 75, startY + 35, cellWidth - 18, cellHeight - 5); // Celda 6
            doc.rect(startX + cellWidth * 6 - 93, startY + 15, cellWidth - 18, cellHeight - 5); // Celda 7
            doc.rect(startX + cellWidth * 6 - 93, startY + 20, cellWidth - 18, cellHeight - 5); // Celda 7
            doc.rect(startX + cellWidth * 6 - 93, startY + 30, cellWidth - 18, cellHeight - 5); // Celda 7
            doc.rect(startX + cellWidth * 6 - 93, startY + 35, cellWidth - 18, cellHeight - 5); // Celda 7
            doc.rect(startX + cellWidth * 7 - 111, startY + 15, cellWidth - 18, cellHeight - 5); // Celda 8
            doc.rect(startX + cellWidth * 7 - 111, startY + 20, cellWidth - 18, cellHeight - 5); // Celda 8
            doc.rect(startX + cellWidth * 7 - 111, startY + 30, cellWidth - 18, cellHeight - 5); // Celda 8
            doc.rect(startX + cellWidth * 7 - 111, startY + 35, cellWidth - 18, cellHeight - 5); // Celda 8

            //INFO DE LOS MEDIDORES
            doc.setFontSize(7)
            doc.text(energiaCogeneradorTxt, startX * 2 + cellWidth + 10, startY + 28.5);
            doc.text(energiaCogeneradorTxt, startX * 2 + cellWidth + 10, startY + 28.5);
            doc.text(energiaEneeTxt, startX * 9 + cellWidth + 17, startY + 28.5);
            doc.text(energiaEneeTxt, startX * 9 + cellWidth + 17, startY + 28.5);

            doc.text(dataPromedioPunta.toString(), 2 * startX + 47, startY + 18.5);
            doc.text(dataPromedioResto.toString(), 5 * startX + 43, startY + 18.5);
            doc.text(dataPromedioTotalActivo.toString(), 7 * startX + 45, startY + 18.5);

            doc.text(dataPorcentPunta.toString() + ' %', 2 * startX + 47, startY + 23.5);
            doc.text(dataPorcentResto.toString() + ' %', 5 * startX + 43, startY + 23.5);
            doc.text(dataPorcentTotalActivo.toString() + ' %', 7 * startX + 45, startY + 23.5);

            doc.text(dataFactor.toString(), 2 * startX + 50, startY + 33.5);
            doc.text(dataFactor.toString(), 5 * startX + 43, startY + 33.5);
            doc.text(dataFactor.toString(), 7 * startX + 48, startY + 33.5);
            //para enee
            doc.text(dataFactor.toString(), 10 * startX + 45, startY + 33.5);
            doc.text(dataFactor.toString(), 13 * startX + 40, startY + 33.5);
            doc.text(dataFactor.toString(), 15* startX + 40, startY + 33.5);

            doc.text(dataTotalPunta.toString(), 2 * startX + 47, startY + 38.5);
            doc.text(dataTotalResto.toString(), 5 * startX + 43, startY + 38.5);
            doc.text(dataTotalActivo.toString(), 7 * startX + 45, startY + 38.5);

            //cuadro4
             // Definir las coordenadas de inicio para la tabla
             const start_X = 10;
             const start_Y = 186;
             // Definir el ancho y alto de las celdas
             const cellWidth_ = 40;
             const cellHeight_ = 10;
             doc.rect(start_X, start_Y+5, cellWidth_ + 35, cellHeight_ -5); //celda1
             doc.rect(start_X, start_Y+10, cellWidth_ + 35, cellHeight_ -5); //celda1.1
             doc.rect(start_X, start_Y+15, cellWidth_ + 35, cellHeight_ -5); //celda1.2
             doc.rect(start_X, start_Y+20, cellWidth_ + 35, cellHeight_ +5); //celda1.3

             doc.rect(start_X + cellWidth_ + 35, start_Y, cellWidth_+10, cellHeight_ -5);//celda2
             doc.rect(start_X + cellWidth_ + 35, start_Y+5, cellWidth_+10, cellHeight_ -5);//celda2.1
             doc.rect(start_X + cellWidth_ + 35, start_Y+10, cellWidth_+10, cellHeight_ -5);//celda2.2
             doc.rect(start_X + cellWidth_ + 35, start_Y+15, cellWidth_+10, cellHeight_ -5);//celda2.3
             doc.rect(start_X + cellWidth_ + 35, start_Y+15, cellWidth_+10, cellHeight_ +10);//celda2.3
            //DATA
            doc.setFontSize(10);
            doc.text(horasPuntaPeriodoTxt,start_X+20 ,start_Y+8.5); //1.1
            doc.text(diasHorasPuntaTxt,start_X+20 ,start_Y+13.5);//1.2
            doc.text(totalKwhPuntaTxt,start_X+14 ,start_Y+18.5);//1.3
            doc.text(potenciaFirmeTxt,start_X+7 ,start_Y+24.5);//1.4

            doc.text(TotalMesTxt,start_X + cellWidth_ + 48 ,start_Y+3.5);//2.1
            doc.text(dataHpuntaPeriodo.toString(),start_X + cellWidth_ + 55 ,start_Y+8.5);//2.2
            doc.text(dataHorasPunta.toString(),start_X + cellWidth_ + 56 ,start_Y+13.5);//2.3
            doc.text(dataTotalKwPunta.toString(),start_X + cellWidth_ + 50 ,start_Y+19);//2.4
            doc.text(dataPotenciaFirme.toString(),start_X + cellWidth_ + 50 ,start_Y+27.5);//2.4

            //cuadro5
            const startY1 = 226;
            doc.rect(start_X, startY1, cellWidth_ + 35, cellHeight_); //celda1
            doc.rect(start_X, startY1+10, cellWidth_ + 35, cellHeight_+3); //celda1.1
            doc.rect(start_X + cellWidth_ + 35, startY1, cellWidth_+10, cellHeight_); //celda2
            doc.rect(start_X + cellWidth_ + 35, startY1+10, cellWidth_+10, cellHeight_+3); //celda2.1
            //data
            doc.text(energiaNetaMesTxt, startX+1, startY1+14); //celda1.1
            doc.text(TotalMesTxt, start_X + cellWidth_ + 48, startY1+6); //celda2
            doc.text(dataEnergiaNetaMes.toString(), start_X + cellWidth_ + 51, startY1+18); //celda2.2


            // Abrir el PDF en una nueva ventana o descargarlo
            window.open(doc.output('bloburl'));
          } else {
            console.log("No hay mediciones")
          }

        });
      doc.setFontSize(10);
      const pageWidth = doc.internal.pageSize.width;
      // Obtener el ancho del texto
      const textWidth = (doc.getStringUnitWidth(tittle) * 10) / doc.internal.scaleFactor;
      // Calcular la posición X para centrar el texto
      const centerX = (pageWidth - textWidth) / 2;
      doc.text(tittle, centerX, 25);
      doc.text(lecturasPrincipalTxt, 10, 35);
      doc.text(lecturasRespaldoTxt, 10, 85);
      doc.text(promedioMedidoresTxt, 10, 135);
      doc.text(capacidadTxt,10, 190);
      doc.text(energiaNetaTxt,11, 230);
      doc.text(fechaConstancia,11, 255);
      doc.text(lineafirma,11, 270);
      doc.text(lineafirma,77, 270);
      doc.text(lineafirma,151, 270);
      doc.text(firma1,20, 275);
      doc.text(firma2,90, 275);
      doc.text(firma3,160, 275);
      doc.text(porEnee,25, 278);
      doc.text(porEnee,93, 278);
      doc.text(porEnee,168, 278);
    }
  }
}
