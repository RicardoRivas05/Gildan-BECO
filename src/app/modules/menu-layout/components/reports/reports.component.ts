import { Component, OnInit } from '@angular/core';
import { ReportsService } from './service/reports.service';
import jsPDF from 'jspdf';
import { ReportData } from 'src/Core/interfaces/report.interface';
import { NotificationService } from '@shared/services/notification.service';
interface AsignacionPorDia {
  dia: string;
  nombreDiaSemana: string;
  registros: any[]; // Cambia 'any' por el tipo real de tus registros
}
interface eficiencia {
  dia: string;
  nombreDiaSemana: string;
  sumaEnergy: number;
}

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
  storedData: any;
  validateError: boolean = false;
  resp3: any;
  resp4: any;

  pdfData: string = '';

  constructor(private reportService: ReportsService, private notification: NotificationService,) {
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

  // Función para obtener los días del mes a partir de una fecha
  getDiasDelMes(fecha: any) {
    const year = fecha.getFullYear();
    const month = fecha.getMonth();


    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);



    const diasDelMes = [];
    for (let dia = firstDay; dia <= lastDay; dia.setDate(dia.getDate() + 1)) {
      diasDelMes.push(new Date(dia));
    }

    return diasDelMes;
  }

  obtenerCantidadDiasMes(fecha: any) {
    const month = fecha.getMonth() + 1; // Sumamos 1 porque los meses en JavaScript son indexados desde 0
    const year = fecha.getFullYear();

    const cantidadDias = new Date(year, month, 0).getDate();

    return cantidadDias;
  }

  obtenerNombreDiaDeSemana(fecha: any) {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const diaSemana = fecha.getDay();
    return diasSemana[diaSemana];
  }

  generateLocalTime(date: Date): Date[] {
    const result: Date[] = [];
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    let currentDate = startOfMonth;

    while (currentDate <= endOfMonth) {
      // Generar tiempos en intervalos de 5 minutos desde las 12:00 AM
      for (let hours = 0; hours < 24; hours++) {
        for (let minutes = 0; minutes < 60; minutes += 5) {
          const newDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            hours, // Horas
            minutes // Minutos
          );
          result.push(newDate);
        }
      }

      // Avanzar al siguiente día
      currentDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + 1
      );
    }
    return result;
  }

  crearPDF() {
    let fechaInicioFormateada = this.fechaInicial.toLocaleDateString();
    let fechaFinal = new Date(this.fechaFinal);
    let fechaFinal1 = new Date(this.fechaFinal);
    fechaFinal.setDate(fechaFinal.getDate() - 1);
    let fechaFinFormateada = fechaFinal.toLocaleDateString();
    console.log("mmmmmmmm", fechaFinal1)
    let fechaInicialFormatted = new Date(this.fechaInicial);
    fechaInicialFormatted.setHours(0, 0, 0, 0);
    let fechaFinalFormatted = fechaFinal1.toISOString().split('T')[0];
    const diasDelMesInicial = this.getDiasDelMes(this.fechaInicial);
    // console.log("DIA EN MES ", diasDelMesInicial);
    const fechaLocalTime = new Date(this.fechaInicial);
    const localTimes = this.generateLocalTime(fechaLocalTime);
    const cantidadDias = this.obtenerCantidadDiasMes(this.fechaInicial)
    console.log("diaaas ", cantidadDias)

    let sumaB1primaria = 0;
    let sumaB2Primaria = 0;
    let sumaB1Respaldo = 0;
    let sumaB2Respaldo = 0;

    let totalSumPrimaria = 0;
    let totalSumRespaldo = 0;
    let sumPrimariaRespaldo = 0;

    let sumTotalHpunta = 0;
    let sumFueraHpunta = 0;
    let totalSumHpunta = 0;

    if (this.tipoReporte == 'Energia Sumistrada') {
      const doc = new jsPDF();
      const img = new Image();
      const img2 = new Image();
      const img3 = new Image();
      img.src = 'assets/Images/enee1.png';
      img2.src = 'assets/Images/enee2.png';
      img3.src = 'assets/Images/pie.png';


      img.onload = () => {
        doc.addImage(img, 10, 10, 35, 10);
      };

      img2.onload = () => {
        doc.addImage(img2, 170, 10, 25, 10);
      };

      img3.onload = () => {
        doc.addImage(img3, 10, 250, 185, 20);
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
      const formatoHn = (number: any) => {
        const exp = /(\d)(?=(\d{3})+(?!\d))/g;
        const rep = '$1,';
        return number.toString().replace(exp, rep);
      }
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
                    let dataLecturaAnteriorF = formatoHn(dataLecturaAnterior);
                    let dataLecturaActualF = formatoHn(dataLecturaActual);
                    let dataDiferenciaF = formatoHn(dataDiferencia);
                    let dataEnergiaNetaAnteriorF = formatoHn(dataEnergiaNetaAnterior);
                    let dataenergiaNetaActualF = formatoHn(dataenergiaNetaActual);
                    let dataDiferenciaEnergiaNetaF = formatoHn(dataDiferenciaEnergiaNeta);
                    doc.text(dataLecturaAnteriorF.toString(), xPosLegend1 + 2, 45 + i * 15);
                    doc.text(dataLecturaActualF.toString(), xPosLegend1 + 25, 45 + i * 15);
                    doc.text(dataDiferenciaF.toString(), xPosLegend1 + 48, 45 + i * 15);
                    doc.text(dataEnergiaNetaAnteriorF.toString(), xPosLegend1 + 2, 57 + i * 15);
                    doc.text(dataenergiaNetaActualF.toString(), xPosLegend1 + 25, 57 + i * 15);
                    doc.text(dataDiferenciaEnergiaNetaF.toString(), xPosLegend1 + 47, 57 + i * 15);
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
                    let dataLecturaAnteriorF = formatoHn(dataLecturaAnterior);
                    let dataLecturaActualF = formatoHn(dataLecturaActual);
                    let dataDiferenciaF = formatoHn(dataDiferencia);
                    let dataEnergiaNetaAnteriorF = formatoHn(dataEnergiaNetaAnterior)
                    let dataenergiaNetaActualF = formatoHn(dataenergiaNetaActual);
                    let dataDiferenciaEnergiaNetaF = formatoHn(dataDiferenciaEnergiaNeta);
                    doc.text(dataLecturaAnteriorF.toString(), xPosLegend2 + 2, 30 + i * 15);
                    doc.text(dataLecturaActualF.toString(), xPosLegend2 + 25, 30 + i * 15);
                    doc.text(dataDiferenciaF.toString(), xPosLegend2 + 48, 30 + i * 15);
                    doc.text(dataEnergiaNetaAnteriorF.toString(), xPosLegend2 + 2, 42 + i * 15);
                    doc.text(dataenergiaNetaActualF.toString(), xPosLegend2 + 25, 42 + i * 15);
                    doc.text(dataDiferenciaEnergiaNetaF.toString(), xPosLegend2 + 47, 42 + i * 15);

                  }
                  doc.setFontSize(10);
                }
              }
              else {
                console.log('this.resp es null para el servicio 129');
                this.validateError = true;
                this.notification.createNotification('error', 'Falló', `${resp129.content} 😓`);


              }
              porcentajeTotales = Number(((sumMedPrimarios - sumMedSecundarios) / sumMedPrimarios).toFixed(4));
              doc.setFontSize(6);
              doc.text(subtitle1, xPosLegend1 - 21, 185.5)
              doc.text(subtitle2, xPosLegend2 - 21, 185.5)
              doc.setFontSize(7);
              let sumMedPrimariosF = formatoHn(sumMedPrimarios);
              let sumMedSecundariosF = formatoHn(sumMedSecundarios);
              doc.text(sumMedPrimariosF.toString(), 76, 185.5);
              doc.text(sumMedSecundariosF.toString(), xPosLegend2 + 45, 185.5)
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
                    let dataLecturaAnteriorRecF = formatoHn(dataLecturaAnteriorRec);
                    let dataLecturaActualRecF = formatoHn(dataLecturaActualRec);
                    let dataDiferenciaRecF = formatoHn(dataDiferenciaRec);
                    doc.text(dataLecturaAnteriorRecF.toString(), xPosLegend1 + 5, 49 + j * 15);
                    doc.text(dataLecturaActualRecF.toString(), xPosLegend1 + 28, 49 + j * 15);
                    doc.text(dataDiferenciaRecF.toString(), xPosLegend1 + 48, 49 + j * 15);
                  } else {
                    //labels para medidores de respaldo
                    let dataDiferenciaRec = dataLecturaActualRec - dataLecturaAnteriorRec;
                    dataDiferenciaRec = Number(dataDiferenciaRec.toFixed(2));

                    //data
                    let dataLecturaAnteriorRecF = formatoHn(dataLecturaAnteriorRec);
                    let dataLecturaActualRecF = formatoHn(dataLecturaActualRec);
                    let dataDiferenciaRecF = formatoHn(dataDiferenciaRec);
                    doc.text(dataLecturaAnteriorRecF.toString(), xPosLegend2 + 3, 34 + j * 15);
                    doc.text(dataLecturaActualRecF.toString(), xPosLegend2 + 28, 34 + j * 15);
                    doc.text(dataDiferenciaRecF.toString(), xPosLegend2 + 48, 34 + j * 15);
                  }
                  // doc.setFontSize(10);
                  //window.open(doc.output('bloburl'))
                }
              } else {
                console.log('this.resp es null para el servicio 139');
                this.validateError = true;
                this.notification.createNotification('error', 'Falló', `${resp139.content} 😓`);
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
      const formatoHn = (number: any) => {
        const exp = /(\d)(?=(\d{3})+(?!\d))/g;
        const rep = '$1,';
        return number.toString().replace(exp, rep);
      }
      const doc = new jsPDF();
      const asignacionPorDia: AsignacionPorDia[] = [];
      let dia = 1;
      let contador = 0;
      let stuDel = 0;
      let stuRec = 0;
      let diferencia = 0;
      let cogPrincipalDelArray: number[] = [];
      let cogRespaldoDelArray: number[] = [];
      let cogPrincipalRecArray: number[] = [];
      let cogRespaldoRecArray: number[] = [];
      let promediosCogDel: number[] = [];
      let promediosCogRec: number[] = [];
      let diferenciaPromediosCogeneracion: number[] = [];
      let motoresDelArray: number[] = [];
      let motoresRecArray: number[] = [];
      let diferenciaMotores: number[] = [];
      let energiaHorariaMotores: number[] = [];
      let energiaRespaldo: number[] = [];
      let energiaprimaria: number[] = [];
      let respaldo06: number[] = [];
      let respaldo622: number[] = [];
      let respaldo2224: number[] = [];

      let primario06: number[] = [];
      let primario622: number[] = [];
      let primario2224: number[] = [];

      let sumaRespaldos: number[] = [];
      let sumaPrimarios: number[] = [];

      let energiaHorariaPromedioCogeneracion: number[] = [];
      let PequMW: number[] = [];
      let B1: number[] = [];
      let B2: number[] = [];
      const respaldoB1: number[] = [];
      const respaldoB2: number[] = [];
      const totalB: number[] = [];
      let mediasHoras1030_11: number[] = [];
      let mediasHoras12_1230: number[] = [];
      let cuartoHoras1745_1800: number[] = [];
      let tresCuartosHoras2000_2045: number[] = [];
      const totalEnergiaMedidaKwh: eficiencia[] = [];
      const totalEnergiaMedidaKwh1: number[] = [];
      const fueraHorasPunta: number[] = [];

      //let energiaPrimaria: number[] = [];
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

      let posicionInicial = 11;
      let posicionInicial2 = 13;
      let posicionInicial3 = 20;
      let posicionInicial4 = 23;
      let intervaloInsercion = 25;
      let intervaloInsercion2 = 26;
      let intervaloInsercion3 = 27;
      let intervaloInsercion4 = 28;
      const feriadosHn: string[] = [];

      const u288: number[] = [];



      const bloque1Primaria: number[] = [];
      const bloque2Primaria: number[] = [];
      const sumaBloquesPrimaria: number[] = [];

      const bloque1Respaldo: number[] = [];
      const bloque2Respaldo: number[] = [];
      const sumaBloquesRespaldo: number[] = [];

      this.reportService.getCogeneracion(fechaInicialFormatted.toISOString().split('T')[0], fechaFinalFormatted).subscribe(
        (resp3: any) => {
          console.log("Respuesta 1 ", resp3);
          if (resp3) {
            for (let i = 0; i < resp3.feriadosHn.length; i++) {
              const fechaString = resp3.feriadosHn[i].fecha;
              const fechaSinHora = fechaString.substr(0, 10); // Tomar los primeros 10 caracteres (AAAA-MM-DD)
              feriadosHn.push(fechaSinHora);
            }

            console.log("Fechas de feriados:", feriadosHn);

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

            console.log("deeeel array ", cogPrincipalDelArray);
            // Verificar si los arrays tienen la misma longitud
            if (cogPrincipalDelArray.length === cogRespaldoDelArray.length) {
              promediosCogDel = cogPrincipalDelArray.map((value, index) => (value + cogRespaldoDelArray[index]) / 2);
              promediosCogRec = cogPrincipalRecArray.map((value, index) => (value + cogRespaldoRecArray[index]) / 2);
              //console.log("promedio ",promedioCogDel)
            } else {
              console.log("Los arreglos no tienen la misma longitud, no se pueden calcular promedios.");
            }

            if (promediosCogDel.length === promediosCogRec.length) {
              for (let i = 0; i < promediosCogDel.length && i < promediosCogRec.length; i++) {
                const diferenciaPromedios = promediosCogDel[i] - promediosCogRec[i];
                diferenciaPromediosCogeneracion.push(diferenciaPromedios);
              }

            }
            //console.log("--------------------", diferenciaPromediosCogeneracion);

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

              //console.log(diferenciaMotores);
            } else {
              console.log("Los arrays no tienen la misma longitud, no se pueden restar.");
            }

            //cogeneracion horaria evaluada en promedio
            for (let i = 12; i < diferenciaPromediosCogeneracion.length; i += 12) {
              energiaHorariaPromedioCogeneracion.push((diferenciaPromediosCogeneracion[i] - diferenciaPromediosCogeneracion[i - 12]) / 1000);
            }

            //console.log("*****************", energiaHorariaPromedioCogeneracion);

            //calculando array para intervalos de 15,30 y 45 minutos para eficiencia energetica
            let intervalo = 288
            for (let i = 126, j = 132; j < diferenciaPromediosCogeneracion.length; i += intervalo, j += intervalo) {
              mediasHoras1030_11.push((diferenciaPromediosCogeneracion[j] - diferenciaPromediosCogeneracion[i]) / 1000);
            }

            for (let i = 144, j = 150; j < diferenciaPromediosCogeneracion.length; i += intervalo, j += intervalo) {
              mediasHoras12_1230.push((diferenciaPromediosCogeneracion[j] - diferenciaPromediosCogeneracion[i]) / 1000);
            }

            for (let i = 213, j = 216; j < diferenciaPromediosCogeneracion.length; i += intervalo, j += intervalo) {
              cuartoHoras1745_1800.push((diferenciaPromediosCogeneracion[j] - diferenciaPromediosCogeneracion[i]) / 1000);
            }
            for (let i = 240, j = 249; j < diferenciaPromediosCogeneracion.length; i += intervalo, j += intervalo) {
              tresCuartosHoras2000_2045.push((diferenciaPromediosCogeneracion[j] - diferenciaPromediosCogeneracion[i]) / 1000);
            }

            //creando arraay de eficiencia energetica
            let eficienciaEnergetica = [...energiaHorariaPromedioCogeneracion];
            for (let i = 0; i < mediasHoras1030_11.length; i++) {
              eficienciaEnergetica.splice(posicionInicial, 0, mediasHoras1030_11[i]);
              eficienciaEnergetica[posicionInicial - 1] = eficienciaEnergetica[posicionInicial + 1] - eficienciaEnergetica[posicionInicial];
              posicionInicial += intervaloInsercion;
            }
            for (let i = 0; i < mediasHoras12_1230.length; i++) {
              eficienciaEnergetica.splice(posicionInicial2, 0, mediasHoras12_1230[i]);
              eficienciaEnergetica[posicionInicial2 + 1] = eficienciaEnergetica[posicionInicial2 + 1] - eficienciaEnergetica[posicionInicial2];
              posicionInicial2 += intervaloInsercion2;

            }
            for (let i = 0; i < cuartoHoras1745_1800.length; i++) {
              eficienciaEnergetica.splice(posicionInicial3, 0, cuartoHoras1745_1800[i]);
              eficienciaEnergetica[posicionInicial3 - 1] = eficienciaEnergetica[posicionInicial3 + 1] - eficienciaEnergetica[posicionInicial3];
              posicionInicial3 += intervaloInsercion3;
            }
            for (let i = 0; i < tresCuartosHoras2000_2045.length; i++) {
              eficienciaEnergetica.splice(posicionInicial4, 0, tresCuartosHoras2000_2045[i]);
              eficienciaEnergetica[posicionInicial4 + 1] = eficienciaEnergetica[posicionInicial4 + 1] - eficienciaEnergetica[posicionInicial4];
              posicionInicial4 += intervaloInsercion4;

            }
            //console.log("eficiencia,", eficienciaEnergetica);

            // Suma de eficiencia energética
            for (const dia of diasDelMesInicial) {
              const registrosEsteDia = eficienciaEnergetica.splice(0, 28); // Tomar los primeros 28 registros
              const sumaEnergiaDia = registrosEsteDia.reduce((total, valor) => total + valor * 1000, 0); // Calcular la suma de registrosEsteDia
              const nombreDiaSemana = this.obtenerNombreDiaDeSemana(dia);

              // Formatear la fecha a "YYYY-MM-DD"
              const fechaFormateada = dia.toISOString().split('T')[0];
              totalEnergiaMedidaKwh1.push(sumaEnergiaDia);
              asignacionPorDia.push({ dia: fechaFormateada, nombreDiaSemana, registros: registrosEsteDia });
              totalEnergiaMedidaKwh.push({ dia: fechaFormateada, nombreDiaSemana, sumaEnergy: sumaEnergiaDia });
            }
            //console.log("Asignacion por dia ", asignacionPorDia);
            //console.log("sumaaa energia ", totalEnergiaMedidaKwh);
            //total cogeneracion
            let sumaTotalCogeneracion = 0
            for (let i = 0; i < totalEnergiaMedidaKwh.length; i++) {
              let totalCogeneracion = totalEnergiaMedidaKwh[i].sumaEnergy;
              totalCogeneracion = Number(totalCogeneracion.toFixed(2));
              sumaTotalCogeneracion += totalCogeneracion;
              sumaTotalCogeneracion = Number(sumaTotalCogeneracion.toFixed(2));
              doc.setFontSize(6);
              let totalCogeneracionF = formatoHn(totalCogeneracion);
              doc.text(totalCogeneracionF.toString(), 158, 38.5 + i * 5);
              doc.setFontSize(7);
            }

            //horas punta
            let horasPunta = asignacionPorDia.map(asignacion => {
              let fechaAsignacion = new Date(asignacion.dia + "T00:00");
              let diaSemana = fechaAsignacion.getDay();
              let dia = fechaAsignacion.getDate();
              let esFeriado = feriadosHn.some(feriado => new Date(feriado + "T00:00").getTime() === fechaAsignacion.getTime());

              if (diaSemana === 0 || diaSemana === 6 || esFeriado) {
                console.log("Es feriado ", esFeriado);
                return { dia: dia, resultado: 0 };
              } else {
                let posiciones = [11, 12, 13, 20, 21, 22, 23];
                let suma = posiciones.reduce((total, pos) => total + asignacion.registros[pos], 0);
                return { dia: dia, resultado: suma * 1000 };
              }
            });
            for (let i = 0; i < horasPunta.length; i++) {
              let hPunta = horasPunta[i].resultado;
              hPunta = Number(hPunta.toFixed(2))
              sumTotalHpunta += hPunta;
              sumTotalHpunta = Number(sumTotalHpunta.toFixed(2));
              doc.setFontSize(6);
              let hPuntaF = formatoHn(hPunta);
              doc.text(hPuntaF.toString(), 123, 38.5 + i * 5);
              doc.setFontSize(7);
            }

            //fuera de horas punta
            if (totalEnergiaMedidaKwh.length === horasPunta.length) {
              for (let i = 0; i < totalEnergiaMedidaKwh.length && horasPunta.length; i++) {
                let resultado = totalEnergiaMedidaKwh[i].sumaEnergy - horasPunta[i].resultado
                fueraHorasPunta.push(resultado);
              }

            } else {
              console.log("La suma de la energia de eficiencia energetica y las horas punta no se pueden restar");
            }

            for (let i = 0; i < fueraHorasPunta.length; i++) {
              let fHpunta = fueraHorasPunta[i];
              fHpunta = Number(fHpunta.toFixed(2));
              sumFueraHpunta += fHpunta;
              sumFueraHpunta = Number(sumFueraHpunta.toFixed(2));
              let fHpuntaF = formatoHn(fHpunta.toFixed(2));
              doc.setFontSize(6);
              doc.text(fHpuntaF.toString(), 138, 38.5 + i * 5);
              doc.setFontSize(7);
            }
            //PequMW
            for (let i = 1; i < diferenciaMotores.length; i += 1) {
              PequMW.push(((diferenciaMotores[i] - diferenciaMotores[i - 1]) / (5 / 60)) / 1000);
            }

            // los bloques de motores
            localTimes.forEach((time, i) => {
              const result = PequMW[i]; // Usar el elemento actual de PequMW
              const minutes = time.getHours() + Math.ceil(time.getMinutes() / 60); // Convertir la hora en minutos
              if (result <= 227) {
                if (minutes <= 6 || minutes >= 23) {
                  B1.push(result)
                } else {
                  B1.push(0)
                }
              } else {
                if (minutes <= 6 || minutes >= 23) {
                  B1.push(227);
                } else {
                  B1.push(0)
                }

              }
            });


            localTimes.forEach((time, i) => {
              const result = PequMW[i]; // Usar el elemento actual de PequMW
              const minutes = time.getHours() + Math.ceil(time.getMinutes() / 60); // Convertir la hora en minutos

              if (result <= 227 && (minutes > 6 && minutes < 23)) {
                B2.push(result)
              } else if (result > 227 && (minutes > 6 && minutes < 23)) {
                B2.push(227)
              } else {
                B2.push(0)
              }
            });

            localTimes.forEach((time, i) => {
              const result = PequMW[i]; // Usar el elemento actual de PequMW
              const minutes = time.getHours() + Math.ceil(time.getMinutes() / 60);

              if (result > 227 && (minutes <= 6 || minutes >= 23)) {
                respaldoB1.push(result - 227);
              } else {
                respaldoB1.push(0);
              }

            });

            console.log("B1 ", B1)

            localTimes.forEach((time, i) => {
              const result = PequMW[i]; // Usar el elemento actual de PequMW
              const minutes = time.getHours() + Math.ceil(time.getMinutes() / 60);

              if (result > 227 && minutes > 6 && minutes < 23) {
                respaldoB2.push(result - 227);
              } else {
                respaldoB2.push(0);
              }
            });
            console.log("B1 ", B2)

            if (B1.length === respaldoB1.length && B2.length === respaldoB2.length) {
              for (let i = 0; i < respaldoB1.length && i < B1.length && i < B2.length && i < respaldoB2.length; i++) {
                let result = B1[i] + respaldoB1[i] + B2[i] + respaldoB2[i];
                totalB.push(result)
              }
            } else {
              console.log("respaldo b1 y B1 no son iguales")
            }

            console.log("total ", totalB)

            // generacion horaria de motores
            for (let i = 12; i < diferenciaMotores.length; i += 12) {
              energiaHorariaMotores.push((diferenciaMotores[i] - diferenciaMotores[i - 12]) / 1000);
              //console.log("ENERGIA HORARIA ", energiaHoraria);
            }
            console.log("energia horaria ", energiaHorariaMotores)
            const ofertaEnergia = new Array(energiaHorariaMotores.length).fill(0);
            //console.log("ENERGIA HORARIA ", energiaHorariaMotores);
            //console.log("oferta energia ", ofertaEnergia);


            for (let i = 0; i < cantidadDias; i++) {
              u288.push(0 + i * 288);
            }


            for (let dia = 0; dia < cantidadDias; dia++) {
              for (let hora = 0; hora <= 23; hora++) {
                // Calcular el índice
                const indice = u288[dia] + 12 * hora;
                // Realizar la comprobación y cálculos
                if (energiaHorariaMotores[hora] === ofertaEnergia[hora]) {
                  energiaRespaldo.push(0);
                } else {
                  const sumaB1 = sumarRango(respaldoB1, indice);
                  const sumaB2 = sumarRango(respaldoB2, indice);
                  energiaRespaldo.push((sumaB1 / 12) + (sumaB2 / 12));
                }
              }
            }

            console.log("ENERGIA Respaldo", energiaRespaldo);

            function sumarRango(arreglo: any, indice: any) {
              let suma = 0;
              for (let i = indice; i < indice + 12; i++) {
                if (typeof arreglo[i] === 'number') {
                  suma += arreglo[i];
                } else {
                  console.log("************************* error")
                }
              }
              return suma;
            }

            for (let i = 0; i < energiaRespaldo.length; i += 24) {
              // Extraer los primeros 6 elementos de cada ciclo y sumarlos
              const primeros6 = energiaRespaldo.slice(i, i + 6);
              const sumaPrimeros6 = primeros6.reduce((total, elemento) => total + elemento, 0);
              const promedioPrimeros6 = (sumaPrimeros6 / primeros6.length) * 6;
              respaldo06.push(promedioPrimeros6);

              // Extraer los elementos del 7 al 22 de cada ciclo y sumarlos
              const elementos622 = energiaRespaldo.slice(i + 6, i + 22);
              const sumaElementos622 = elementos622.reduce((total, elemento) => total + elemento, 0);
              const promedioElementos622 = (sumaElementos622 / elementos622.length) * 16;
              respaldo622.push(promedioElementos622);

              // Extraer los elementos del 23 al 24 de cada ciclo y sumarlos
              const elementos2224 = energiaRespaldo.slice(i + 22, i + 24);
              const sumaElementos2224 = elementos2224.reduce((total, elemento) => total + elemento, 0);
              const promedioElementos2224 = (sumaElementos2224 / elementos2224.length) * 2;
              respaldo2224.push(promedioElementos2224);
            }

            respaldo06.map((elemento, index) => {
              const suma = elemento + respaldo622[index] + respaldo2224[index];
              sumaRespaldos[index] = suma;
            });

            console.log("suma respaldos ", sumaRespaldos);


            //ENERGIA PRIMARIA
            for (let dia = 0; dia < cantidadDias; dia++) {
              for (let hora = 0; hora <= 23; hora++) {
                // Calcular el índice
                const indice = u288[dia] + 12 * hora;
                // Realizar la comprobación y cálculos
                if (energiaHorariaMotores[hora] < 0) {
                  energiaprimaria.push(energiaHorariaMotores[hora]);
                } else if (energiaHorariaMotores[hora] === ofertaEnergia[hora]) {
                  energiaprimaria.push(0);

                } else if (ofertaEnergia[hora] > 0) {
                  energiaprimaria.push(ofertaEnergia[hora] - energiaHorariaMotores[hora] - energiaRespaldo[hora])
                } else {
                  const sumaB1 = sumarRangoPrimaria(B1, indice);
                  const sumaB2 = sumarRangoPrimaria(B2, indice);
                  energiaprimaria.push((sumaB1 / 12) + (sumaB2 / 12));
                }
              }
            }

            console.log("energiaprimaria", energiaprimaria);

            function sumarRangoPrimaria(arreglo: any, indice: any) {
              let suma = 0;
              for (let i = indice; i < indice + 12; i++) {
                if (typeof arreglo[i] === 'number') {
                  suma += arreglo[i];
                } else {
                  console.log("************************* error")
                }
              }
              return suma;
            }

            for (let i = 0; i < energiaprimaria.length; i += 24) {
              // Extraer los primeros 6 elementos de cada ciclo y sumarlos
              const primeros6 = energiaprimaria.slice(i, i + 6);
              const sumaPrimeros6 = primeros6.reduce((total, elemento) => total + elemento, 0);
              const promedioPrimeros6 = (sumaPrimeros6 / primeros6.length) * 6;
              primario06.push(promedioPrimeros6);

              // Extraer los elementos del 7 al 22 de cada ciclo y sumarlos
              const elementos622 = energiaprimaria.slice(i + 6, i + 22);
              const sumaElementos622 = elementos622.reduce((total, elemento) => total + elemento, 0);
              const promedioElementos622 = (sumaElementos622 / elementos622.length) * 16;
              primario622.push(promedioElementos622);

              // Extraer los elementos del 23 al 24 de cada ciclo y sumarlos
              const elementos2224 = energiaprimaria.slice(i + 22, i + 24);
              const sumaElementos2224 = elementos2224.reduce((total, elemento) => total + elemento, 0);
              const promedioElementos2224 = (sumaElementos2224 / elementos2224.length) * 2;
              primario2224.push(promedioElementos2224);
            }

            primario06.map((elemento, index) => {
              const suma = elemento + primario622[index] + primario2224[index];
              sumaPrimarios[index] = suma;
            });

            console.log("suma primarios ", sumaPrimarios);

            if (primario06.length === primario2224.length) {
              for (let i = 0; i < primario06.length && i < primario2224.length; i++) {
                let bloque1Prim = primario06[i] + primario2224[i];
                bloque1Prim = bloque1Prim * 1000;
                bloque1Prim = Number(bloque1Prim.toFixed(2));
                sumaB1primaria += (primario06[i] + primario2224[i]) * 1000;
                sumaB1primaria = Number(sumaB1primaria.toFixed(2));
                localStorage.setItem('primariaB1', JSON.stringify(sumaB1primaria));
                let bloque2Prim = primario622[i] * 1000;
                bloque2Prim = Number(bloque2Prim.toFixed(2));
                sumaB2Primaria += bloque2Prim;
                sumaB2Primaria = Number(sumaB2Primaria.toFixed(2));
                localStorage.setItem('primariaB2', JSON.stringify(sumaB2Primaria));
                bloque1Primaria.push(bloque1Prim);
                bloque2Primaria.push(bloque2Prim);
                let totalBPrimaria = bloque1Primaria[i] + bloque2Primaria[i];
                totalBPrimaria = Number(totalBPrimaria.toFixed(2));
                totalSumPrimaria += totalBPrimaria;
                totalSumPrimaria = Number(totalSumPrimaria.toFixed(2));
                sumaBloquesPrimaria.push(totalBPrimaria)
                doc.setFontSize(6);
                let bloque1PrimF = formatoHn(bloque1Prim);
                let bloque2PrimF = formatoHn(bloque2Prim);
                let totalBPrimariaF = formatoHn(totalBPrimaria);
                doc.text(bloque1PrimF.toString(), 25.5, 38.5 + i * 5);
                doc.text(bloque2PrimF.toString(), 41, 38.5 + i * 5);
                doc.text(totalBPrimariaF.toString(), 56, 38.5 + i * 5);


              }

            } else {
              console.log("La suma de la energia primaria 06+22:24 no puede ser procesada")
            }

            if (respaldo06.length === respaldo2224.length) {
              for (let i = 0; i < respaldo06.length; i++) {
                let suma = (respaldo06[i] + respaldo2224[i]) * 1000;
                suma = Number(suma.toFixed(2));
                let bloque2resp = respaldo622[i] * 1000;
                bloque2resp = Number(bloque2resp.toFixed(2));
                sumaB1Respaldo += suma;
                sumaB1Respaldo = Number(sumaB1Respaldo.toFixed(2));
                localStorage.setItem('respaldoB1', JSON.stringify(sumaB1Respaldo));
                sumaB2Respaldo += bloque2resp;
                sumaB2Respaldo = Number(sumaB2Respaldo.toFixed(2));
                localStorage.setItem('respaldoB2', JSON.stringify(sumaB2Respaldo));
                bloque1Respaldo.push(suma);
                bloque2Respaldo.push(bloque2resp);

                let totalBRespaldo = bloque1Respaldo[i] + bloque2Respaldo[i];
                totalBRespaldo = Number(totalBRespaldo.toFixed(2));
                totalSumRespaldo += totalBRespaldo;
                totalSumRespaldo = Number(totalSumRespaldo.toFixed(2));
                sumaBloquesRespaldo.push(totalBRespaldo);

                doc.setFontSize(6);
                let sumaF = formatoHn(suma);
                let bloque2respF = formatoHn(bloque2resp)
                let totalBRespaldoF = formatoHn(totalBRespaldo);
                doc.text(sumaF.toString(), 75, 38.5 + i * 5);
                doc.text(bloque2respF.toString(), 90, 38.5 + i * 5);
                doc.text(totalBRespaldoF.toString(), 105, 38.5 + i * 5);
              }

              console.log("SSSSUMMM", sumaB1primaria);
              //total entregado
              let sumTotalEntregado = 0;
              if (sumaBloquesPrimaria.length === sumaBloquesRespaldo.length || sumaBloquesPrimaria.length === totalEnergiaMedidaKwh.length) {
                for (let i = 0; i < sumaBloquesPrimaria.length && i < sumaBloquesRespaldo.length && i < totalEnergiaMedidaKwh.length; i++) {
                  let totalEntregado = sumaBloquesPrimaria[i] + sumaBloquesRespaldo[i] + totalEnergiaMedidaKwh[i].sumaEnergy;
                  totalEntregado = Number(totalEntregado.toFixed(2));
                  sumTotalEntregado += totalEntregado;
                  sumTotalEntregado = Number(sumTotalEntregado.toFixed(2));
                  doc.setFontSize(6);
                  let totalEntregadoF = formatoHn(totalEntregado);
                  doc.text(totalEntregadoF.toString(), 180, 38.5 + i * 5);
                  doc.setFontSize(7);
                }
              } else {
                console.log("la suma de primario, respaldo y cogeneracion no se puede efecttuar");
              }

              for (let i = 0; i < cantidadDias - 1; i++) {
                const startX = 25;
                const startY = 35;
                const cellWidth = 15;
                const cellHeight = 10;

                doc.rect(startX - 5, startY + i * 5, 5, cellHeight);//dia
                doc.rect(startX, startY + i * 5, cellWidth, cellHeight);
                doc.rect(startX * 2 - 10, startY + i * 5, cellWidth, cellHeight);
                doc.rect(startX * 3 - 20, startY + i * 5, cellWidth + 3, cellHeight);

                doc.rect(startX * 3 - 2, startY + i * 5, cellWidth, cellHeight);
                doc.rect(startX * 3 + 13, startY + i * 5, cellWidth, cellHeight);
                doc.rect(startX * 3 + 28, startY + i * 5, cellWidth + 3, cellHeight);

                doc.rect(startX * 4 + 21, startY + i * 5, cellWidth, cellHeight);
                doc.rect(startX * 4 + 36, startY + i * 5, cellWidth + 5, cellHeight);
                doc.rect(startX * 4 + 56, startY + i * 5, cellWidth + 8, cellHeight);

                doc.rect(startX * 7 + 4, startY + i * 5, cellWidth, cellHeight);

              }
              let dia
              for (let i = 0; i < horasPunta.length; i++) {
                dia = horasPunta[i].dia;
                doc.text(dia.toString(), 21.5, 38.5 + i * 5)
              }


              const startX = 25;
              const startY = 25;
              const cellWidth = 48;
              const cellHeight = 5;
              doc.rect(startX, startY, cellWidth, cellHeight);//cabecera primaria
              doc.rect(startX - 5, startY + 5, 5, cellHeight);//dia
              doc.rect(startX, startY + 5, 15, cellHeight);//bloque1
              doc.rect(startX * 2 - 10, startY + 5, 15, cellHeight);//bloque2
              doc.rect(startX * 3 - 20, startY + 5, 18, cellHeight);//total bloque
              doc.setFont("helvetica", "bold");
              doc.text("ENERGÍA PRIMARIA (kWh)", 35, 28.5);
              doc.text("Dia", 20.5, 33.5);
              doc.text("Bloque I", 28, 33.5);
              doc.text("Bloque II", 43, 33.5);
              doc.text("Total Primaria", 56, 33.5);

              //respaldo
              doc.rect(startX * 3 - 2, startY, cellWidth, cellHeight);//cabecera respaldo
              doc.rect(startX * 3 - 2, startY + 5, 15, cellHeight);//bloque1
              doc.rect(startX * 3 + 13, startY + 5, 15, cellHeight);//bloque2
              doc.rect(startX * 4 + 3, startY + 5, 18, cellHeight);//total bloque


              doc.text("ENERGÍA RESPALDO (kWh)", 28 * 3 - 2, 28.5);
              doc.text("Bloque I", 23 * 3 + 7, 33.5);
              doc.text("Bloque II", 23 * 3 + 21, 33.5);
              doc.text("Total Respaldo", 23 * 3 + 34.2, 33.5);


              //Eficiencia
              doc.rect(startX * 4 + 21, startY, cellWidth + 10, cellHeight)//cabecera eficiencia
              doc.rect(startX * 4 + 21, startY + 5, 15, cellHeight)//horas punta
              doc.rect(startX * 4 + 36, startY + 5, 20, cellHeight)//fuera punta
              doc.rect(startX * 4 + 56, startY + 5, 23, cellHeight)//total cogeneracion

              doc.text("Eficiencia energética (kWh)", 28 * 4 + 20, 28.5);
              doc.text("Hrs Punta", 28 * 4 + 11, 33.5);
              doc.text("Fuera Hrs Punta", 28 * 4 + 24.5, 33.5);
              doc.text("Total cogeneración", 28 * 4 + 44.3, 33.5);


              doc.rect(startX * 7 + 4, startY, 15, cellHeight)//cabecera total
              doc.rect(startX * 7 + 4, startY + 5, 15, cellHeight)//entregado
              doc.text("Total", 28 * 6 + 15, 28.5);
              doc.text("Entregado", 28 * 6 + 13, 33.5);
              doc.setFont("helvetica", "normal");


              if (primario06.length === 31) {
                doc.setFillColor(247, 205, 89);
                doc.rect(startX, startY * 7 + 15.5, 169, cellHeight, 'F');

                doc.setFontSize(5)
                doc.setFont("helvetica", "bold");

                let sumaB1primariaF = formatoHn(sumaB1primaria);
                let sumaB2PrimariaF = formatoHn(sumaB2Primaria)
                let totalSumPrimariaF = formatoHn(totalSumPrimaria);
                let sumaB1RespaldoF = formatoHn(sumaB1Respaldo);
                let sumaB2RespaldoF = formatoHn(sumaB2Respaldo);
                let totalSumRespaldoF = formatoHn(totalSumRespaldo);
                let sumTotalHpuntaF = formatoHn(sumTotalHpunta);
                let sumFueraHpuntaF = formatoHn(sumFueraHpunta);
                let sumTotalCogeneracionF = formatoHn(sumaTotalCogeneracion);
                let sumaTotalEntregadoF = formatoHn(sumTotalEntregado);

                doc.text(sumaB1primariaF.toString(), startX + 1, startY * 7 + 18.5);
                doc.text(sumaB2PrimariaF.toString(), startX + 16, startY * 7 + 18.5);
                doc.text(totalSumPrimariaF.toString(), startX + 31, startY * 7 + 18.5);


                doc.text(sumaB1RespaldoF.toString(), startX + 50, startY * 7 + 18.5);
                doc.text(sumaB2RespaldoF.toString(), startX + 65, startY * 7 + 18.5);
                doc.text(totalSumRespaldoF.toString(), startX + 80, startY * 7 + 18.5);
                doc.text(sumTotalHpuntaF.toString(), startX + 98, startY * 7 + 18.5);
                doc.text(sumFueraHpuntaF.toString(), startX + 113, startY * 7 + 18.5);
                doc.text(sumTotalCogeneracionF.toString(), startX + 133, startY * 7 + 18.5);
                doc.text(sumaTotalEntregadoF.toString(), startX + 155, startY * 7 + 18.5);

              }
              if (primario06.length === 30) {
                doc.setFillColor(247, 205, 89);
                doc.rect(startX, startY * 7 + 10.5, 169, cellHeight, 'F');

                doc.setFontSize(5)
                doc.setFont("helvetica", "bold");

                let sumaB1primariaF = formatoHn(sumaB1primaria);
                let sumaB2PrimariaF = formatoHn(sumaB2Primaria)
                let totalSumPrimariaF = formatoHn(totalSumPrimaria);
                let sumaB1RespaldoF = formatoHn(sumaB1Respaldo);
                let sumaB2RespaldoF = formatoHn(sumaB2Respaldo);
                let totalSumRespaldoF = formatoHn(totalSumRespaldo);
                let sumTotalHpuntaF = formatoHn(sumTotalHpunta);
                let sumFueraHpuntaF = formatoHn(sumFueraHpunta);
                let sumTotalCogeneracionF = formatoHn(sumaTotalCogeneracion);
                let sumaTotalEntregadoF = formatoHn(sumTotalEntregado);

                doc.text(sumaB1primariaF.toString(), startX + 1, startY * 7 + 13.5);
                doc.text(sumaB2PrimariaF.toString(), startX + 16, startY * 7 + 13.5);
                doc.text(totalSumPrimariaF.toString(), startX + 31, startY * 7 + 13.5);


                doc.text(sumaB1RespaldoF.toString(), startX + 50, startY * 7 + 13.5);
                doc.text(sumaB2RespaldoF.toString(), startX + 65, startY * 7 + 13.5);
                doc.text(totalSumRespaldoF.toString(), startX + 80, startY * 7 + 13.5);
                doc.text(sumTotalHpuntaF.toString(), startX + 98, startY * 7 + 13.5);
                doc.text(sumFueraHpuntaF.toString(), startX + 113, startY * 7 + 13.5);
                doc.text(sumTotalCogeneracionF.toString(), startX + 133, startY * 7 + 13.5);
                doc.text(sumaTotalEntregadoF.toString(), startX + 155, startY * 7 + 13.5);


              }
              if (primario06.length === 29) {
                doc.setFillColor(247, 205, 89);
                doc.rect(startX, startY * 7 + 5.5, 169, cellHeight, 'F');

                doc.setFontSize(5)
                doc.setFont("helvetica", "bold");

                let sumaB1primariaF = formatoHn(sumaB1primaria);
                let sumaB2PrimariaF = formatoHn(sumaB2Primaria)
                let totalSumPrimariaF = formatoHn(totalSumPrimaria);
                let sumaB1RespaldoF = formatoHn(sumaB1Respaldo);
                let sumaB2RespaldoF = formatoHn(sumaB2Respaldo);
                let totalSumRespaldoF = formatoHn(totalSumRespaldo);
                let sumTotalHpuntaF = formatoHn(sumTotalHpunta);
                let sumFueraHpuntaF = formatoHn(sumFueraHpunta);
                let sumTotalCogeneracionF = formatoHn(sumaTotalCogeneracion);
                let sumaTotalEntregadoF = formatoHn(sumTotalEntregado);

                doc.text(sumaB1primariaF.toString(), startX + 1, startY * 7 + 8.5);
                doc.text(sumaB2PrimariaF.toString(), startX + 16, startY * 7 + 8.5);
                doc.text(totalSumPrimariaF.toString(), startX + 31, startY * 7 + 8.5);


                doc.text(sumaB1RespaldoF.toString(), startX + 50, startY * 7 + 8.5);
                doc.text(sumaB2RespaldoF.toString(), startX + 65, startY * 7 + 8.5);
                doc.text(totalSumRespaldoF.toString(), startX + 80, startY * 7 + 8.5);
                doc.text(sumTotalHpuntaF.toString(), startX + 98, startY * 7 + 8.5);
                doc.text(sumFueraHpuntaF.toString(), startX + 113, startY * 7 + 8.5);
                doc.text(sumTotalCogeneracionF.toString(), startX + 133, startY * 7 + 8.5);
                doc.text(sumaTotalEntregadoF.toString(), startX + 155, startY * 7 + 8.5);
              }
              if (primario06.length === 28) {
                doc.setFillColor(247, 205, 89);
                doc.rect(startX, startY * 7, 169, cellHeight, 'F');

                doc.setFontSize(5)
                doc.setFont("helvetica", "bold");

                let sumaB1primariaF = formatoHn(sumaB1primaria);
                let sumaB2PrimariaF = formatoHn(sumaB2Primaria)
                let totalSumPrimariaF = formatoHn(totalSumPrimaria);
                let sumaB1RespaldoF = formatoHn(sumaB1Respaldo);
                let sumaB2RespaldoF = formatoHn(sumaB2Respaldo);
                let totalSumRespaldoF = formatoHn(totalSumRespaldo);
                let sumTotalHpuntaF = formatoHn(sumTotalHpunta);
                let sumFueraHpuntaF = formatoHn(sumFueraHpunta);
                let sumTotalCogeneracionF = formatoHn(sumaTotalCogeneracion);
                let sumaTotalEntregadoF = formatoHn(sumTotalEntregado);

                doc.text(sumaB1primariaF.toString(), startX + 1, startY * 7 + 3.5);
                doc.text(sumaB2PrimariaF.toString(), startX + 16, startY * 7 + 3.5);
                doc.text(totalSumPrimariaF.toString(), startX + 31, startY * 7 + 3.5);


                doc.text(sumaB1RespaldoF.toString(), startX + 50, startY * 7 + 3.5);
                doc.text(sumaB2RespaldoF.toString(), startX + 65, startY * 7 + 3.5);
                doc.text(totalSumRespaldoF.toString(), startX + 80, startY * 7 + 3.5);
                doc.text(sumTotalHpuntaF.toString(), startX + 98, startY * 7 + 3.5);
                doc.text(sumFueraHpuntaF.toString(), startX + 113, startY * 7 + 3.5);
                doc.text(sumTotalCogeneracionF.toString(), startX + 133, startY * 7 + 3.5);
                doc.text(sumaTotalEntregadoF.toString(), startX + 155, startY * 7 + 3.5);
              }
              doc.setFontSize(7)



              //cuadro penultimo
              doc.rect(startX + 15, startY * 8 + 10, 16, cellHeight + 15);//enersa cuadro
              doc.text("ENERSA 227", startX + 15.5, startY * 8 + 21.5);
              doc.rect(startX + 31, startY * 8 + 10, 15, cellHeight);//cuadro primaria
              doc.setFont("helvetica", "bold");
              doc.text("Primaria", startX + 33, startY * 8 + 13.5);
              doc.rect(startX + 31, startY * 8 + 15, 15, cellHeight);//cuadro secundaria
              doc.text("Secundaria", startX + 32, startY * 8 + 18.5);
              doc.rect(startX + 31, startY * 8 + 20, 15, cellHeight);//cuadro respaldo
              doc.text("Respaldo", startX + 33, startY * 8 + 23.5);
              doc.rect(startX + 31, startY * 8 + 25, 15, cellHeight);//cuadro Total
              doc.text("Total", startX + 35, startY * 8 + 28.5);

              //data penultimo cuadro
              sumPrimariaRespaldo = totalSumPrimaria + totalSumRespaldo;
              sumPrimariaRespaldo = Number(sumPrimariaRespaldo.toFixed(2));
              let totalSumPrimariaF = formatoHn(totalSumPrimaria);
              let totalSumRespaldoF = formatoHn(totalSumRespaldo);
              let sumPrimariaRespaldoF = formatoHn(sumPrimariaRespaldo);
              doc.rect(startX * 3 - 4, startY * 8 + 10, 25, cellHeight);//1
              doc.text(totalSumPrimariaF.toString() + " Kwh", startX * 3 - 3, startY * 8 + 13.5);
              doc.rect(startX * 3 - 4, startY * 8 + 15, 25, cellHeight);//2
              doc.text("0", startX * 3 - 3, startY * 8 + 18.5);
              doc.rect(startX * 3 - 4, startY * 8 + 20, 25, cellHeight);//3
              doc.text(totalSumRespaldoF.toString() + " Kwh", startX * 3 - 3, startY * 8 + 23.5);
              doc.rect(startX * 3 - 4, startY * 8 + 25, 25, cellHeight);//4
              doc.text(sumPrimariaRespaldoF.toString() + " Kwh", startX * 3 - 3, startY * 8 + 28.5);
              doc.setFont("helvetica", "normal");




              //cuadro ultimo
              doc.rect(startX + 15, startY * 9 + 15, 16, cellHeight + 10);//cogeneracion cuadro
              doc.text("Cogeneración", startX + 15.5, startY * 9 + 23.5);
              doc.rect(startX + 31, startY * 9 + 15, 20, cellHeight);//cuadro hpunta
              doc.setFont("helvetica", "bold");
              doc.text("Hrs Punta", startX + 33, startY * 9 + 18.5);
              doc.rect(startX + 31, startY * 9 + 20, 20, cellHeight);//cuadro fuera
              doc.text("Fuera Hrs Punta", startX + 32, startY * 9 + 23.5);
              doc.rect(startX + 31, startY * 9 + 25, 20, cellHeight);//cuadro total hpunta
              doc.text("Total", startX + 33, startY * 9 + 28.5);


              //data ultimo cuadro
              totalSumHpunta = sumTotalHpunta + sumFueraHpunta;
              totalSumHpunta = Number(totalSumHpunta.toFixed(2));

              let sumTotalHpuntaF = formatoHn(sumTotalHpunta);
              let sumFueraHpuntaF = formatoHn(sumFueraHpunta);
              let totalSumHpuntaF = formatoHn(totalSumHpunta);
              doc.setFontSize(6.5);
              doc.rect(startX * 3 + 1, startY * 9 + 15, 20, cellHeight);//1
              doc.text(sumTotalHpuntaF.toString() + " Kwh", startX * 3 + 2, startY * 9 + 18.5);
              doc.rect(startX * 3 + 1, startY * 9 + 20, 20, cellHeight);//2
              doc.text(sumFueraHpuntaF.toString() + ' Kwh', startX * 3 + 2, startY * 9 + 23.5);
              doc.rect(startX * 3 + 1, startY * 9 + 25, 20, cellHeight);//3
              doc.text(totalSumHpuntaF.toString() + " Kwh", startX * 3 + 2, startY * 9 + 28.5);
              doc.setFont("helvetica", "normal");





              window.open(doc.output('bloburl'));

            } else {
              console.log("La suma de la energía respaldo 06+22:24 no puede ser procesada");
            }
            console.log("Bloque 1 ", sumaBloquesRespaldo);

          } else {
            console.log("no data for resumen")
          }
        }

        ,
        (error) => {
          console.log('Error en la solicitud HTTP', error);
        }
      );
    } else if (this.tipoReporte === 'Cogeneracion') {
      const doc = new jsPDF();

      const img = new Image();
      const img2 = new Image();
      const img3 = new Image();
      img.src = 'assets/Images/enee1.png';
      img2.src = 'assets/Images/enee2.png';
      img3.src = 'assets/Images/pie.png';


      img.onload = () => {
        doc.addImage(img, 10, 10, 35, 15);
      };

      img2.onload = () => {
        doc.addImage(img2, 170, 10, 35, 15);
      };

      img3.onload = () => {
        doc.addImage(img3, 10, 280, 193, 15);
      };
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
      let Respaldotxt = 'RESPALDO';
      let lecturasCabeceraTxt = 'LECTURAS ENERGIA KWh.\nENTREGADA POR CO GENERADOR';
      let lecturaEneeCabeceraTxt = 'LECTURAS ENERGIA MWh.\nENTREGADA POR ENEE';
      let medidorTxt = 'Medidor';
      let fechaTxt = 'Fecha';
      let puntaTxt = 'Punta';
      let restoTxt = 'Resto';
      let promedioMedidoresTxt1 = 'Promedio entre medidores';
      let totalActivoTxt = 'Total Activo';
      let subTotalTxt = 'Sub Total';
      let diferenciaLecturasTxt = 'DIFERENCIAS DE LAS LECTURAS';
      let porcentajeErrorTxt = 'Porcentaje de error entre Mediciones';
      let energiaCogeneradorTxt = 'ENERGIA ENTREGADA POR CO-GENERADOR';
      let energiaEneeTxt = 'ENERGIA ENTREGADA POR ENEE';
      let promMedidoresTxt = 'Promedio entre medidores kWh (LA)';
      let factorTxt = 'Factor';
      let totalTxt = 'Total';
      let energiaNetaMesTxt = 'Energía Neta del mes kWh\n= (kWh Entregada Por Co-generador - kWh\nEntregada por ENEE)';
      const firma1 = `Roberto Martínez`;
      const firma2 = `Roldán Bustillo`;
      const firma3 = `Guillermo González`;
      const lineafirma = `________________________`;
      const porEnee = `Por ENEE`;
      const porEnersa = `Por ENERSA`;
      const lugar = `Choloma`
      const fechaGenerada = new Date();

      const nombresMeses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
      const dia = fechaGenerada.getDate();
      const mes = nombresMeses[fechaGenerada.getMonth()];
      const anio = fechaGenerada.getFullYear();
      const fechaConstancia = lugar + ` ${dia}` + ` ${mes}` + ` ${anio}`
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
      let dataPromedioPunta = 0;
      let dataPromedioResto = 0;
      let dataPromedioTotalActivo = 0;
      let dataPorcentPunta = 0;
      let dataPorcentResto = 0;
      let dataPorcentTotalActivo = 0;
      let dataFactor = 1;
      let dataTotalPunta = 0;
      let dataTotalResto = 0;
      let dataTotalActivo = 0
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
      let dataHorasPunta = 0;
      let dataMultiplicador = 0;
      let dataHpuntaPeriodo = 0;
      let dataPotenciaFirme = 0;

      //data manual enee
      let dataTotalPuntaEnee = 0;
      let dataTotalRestoEnee = 0;
      let dataPuntaInicialEnee = 0;
      let dataRestoInicialEnee = 0;
      let dataPuntaFinalEnee = 0;
      let dataRestoFinalEnee = 0;
      let dataTotalActivoEnee = 0;
      let dataTotalActivoInicialEnee = 0;
      let dataTotalActivoFinalEnee = 0;
      let dataTotalKwPunta = 0;
      let dataEnergiaNetaMes = 0;
      let dataDiferenciaPuntaEnee = 0
      let dataDiferenciaRestoEnee = 0;
      let dataDiferenciaActivoEnee = 0;

      let dataPuntaRespaldoInicialEnee = 0;
      let dataPuntaRespaldoFinalEnee = 0;
      let dataRestoRespaldoInicialEnee = 0;
      let dataRestoRespaldoFinalEnee = 0;
      let dataActivoRespaldoInicialEnee = 0;
      let dataActivoRespaldoFinalEnee = 0;
      let dataDiferenciaPuntaRespaldoEnee = 0;
      let dataDiferenciaRestoRespaldoEnee = 0;
      let dataDiferenciaActivoRespaldoEnee = 0

      let dataPromedioPuntaEnee = 0;
      let dataPromedioRestoEnee = 0;
      let dataPromedioActivoEnee = 0

      let dataPorcentPuntaEnee = 0;
      let dataPorcentRestoEnee = 0;
      let dataPorcentActivoEnee = 0;


      const formatoHn = (number: any) => {
        const exp = /(\d)(?=(\d{3})+(?!\d))/g;
        const rep = '$1,';
        return number.toString().replace(exp, rep);
      }

      this.reportService.getCogeneracion_12(fechaInicialFormatted.toISOString().split('T')[0], fechaFinalFormatted).subscribe(
        (response: any) => {
          console.log("Respuesta 1 ", response);

          if (response) {
            dataHorasPunta = response.horaPunta[0].horas;
            dataMultiplicador = response.horaPunta[0].multiplicador;
            dataHpuntaPeriodo = dataHorasPunta * dataMultiplicador;
          }
          //lecturas manuales enee
          if (response) {
            for (let i = 0; i < response.lecturasEnee.length; i++) {
              const horasPuntaInicialEnee = response.lecturasEnee[i].puntaInicial;
              const horasPuntaFinalEnee = response.lecturasEnee[i].puntaFinal
              const horasRestoInicialEnee = response.lecturasEnee[i].restoInicial;
              const horasRestoFinalEnee = response.lecturasEnee[i].restoFinal;

              if (response.lecturasEnee[i].tipoMedidor === 'Principal') {
                dataPuntaInicialEnee = horasPuntaInicialEnee;
                dataRestoInicialEnee = horasRestoInicialEnee;
                dataPuntaFinalEnee = horasPuntaFinalEnee;
                dataRestoFinalEnee = horasRestoFinalEnee;
                dataTotalActivoInicialEnee = dataPuntaInicialEnee + dataRestoInicialEnee;
                dataTotalActivoFinalEnee = dataPuntaFinalEnee + dataRestoFinalEnee;
                dataDiferenciaPuntaEnee = dataPuntaFinalEnee - dataPuntaInicialEnee;
                dataDiferenciaPuntaEnee = Number(dataDiferenciaPuntaEnee.toFixed(2))
                dataDiferenciaRestoEnee = dataRestoFinalEnee - dataRestoInicialEnee;
                dataDiferenciaRestoEnee = Number(dataDiferenciaRestoEnee.toFixed(2));
                dataDiferenciaActivoEnee = dataTotalActivoFinalEnee - dataTotalActivoInicialEnee;
                dataDiferenciaActivoEnee = Number(dataDiferenciaActivoEnee.toFixed(2));
                // Definir las coordenadas de inicio para la tabla de generacion Principal
                const startX = 10;
                const startY = 37;
                doc.setFontSize(7)
                //data principal cuadro1
                let dataPuntaInicialEneeF = formatoHn(dataPuntaInicialEnee);
                let dataRestoInicialEneeF = formatoHn(dataRestoInicialEnee);
                let dataTotalActivoInicialEneeF = formatoHn(dataTotalActivoInicialEnee);
                let dataPuntaFinalEneeF = formatoHn(dataPuntaFinalEnee);
                let dataRestoFinalEneeF = formatoHn(dataRestoFinalEnee);
                let dataTotalActivoFinalEneeF = formatoHn(dataTotalActivoFinalEnee);
                let dataDiferenciaPuntaEneeF = formatoHn(dataDiferenciaPuntaEnee);
                let dataDiferenciaRestoEneeF = formatoHn(dataDiferenciaRestoEnee);
                let dataDiferenciaActivoEneeF = formatoHn(dataDiferenciaActivoEnee);

                doc.text(dataPuntaInicialEneeF.toString(), 10 * startX + 40, startY + 18.5);
                doc.text(dataRestoInicialEneeF.toString(), 13 * startX + 30, startY + 18.5);
                doc.text(dataTotalActivoInicialEneeF.toString(), 15 * startX + 33, startY + 18.5);
                doc.text(dataPuntaFinalEneeF.toString(), 10 * startX + 40, startY + 23.5);
                doc.text(dataRestoFinalEneeF.toString(), 13 * startX + 30, startY + 23.5);
                doc.text(dataTotalActivoFinalEneeF.toString(), 15 * startX + 33, startY + 23.5);
                doc.text(dataDiferenciaPuntaEneeF.toString(), 10 * startX + 40, startY + 33.5);
                doc.text(dataDiferenciaRestoEneeF.toString(), 13 * startX + 30, startY + 33.5);
                doc.text(dataDiferenciaActivoEneeF.toString(), 15 * startX + 33, startY + 33.5);

              } else {
                dataPuntaRespaldoInicialEnee = response.lecturasEnee[i].puntaInicial;;
                dataPuntaRespaldoFinalEnee = response.lecturasEnee[i].puntaFinal;
                dataRestoRespaldoInicialEnee = response.lecturasEnee[i].restoInicial;
                dataRestoRespaldoFinalEnee = response.lecturasEnee[i].restoFinal;

                dataActivoRespaldoInicialEnee = dataPuntaRespaldoInicialEnee + dataRestoRespaldoInicialEnee;
                dataActivoRespaldoInicialEnee = Number(dataActivoRespaldoInicialEnee.toFixed(2));
                dataActivoRespaldoFinalEnee = dataPuntaRespaldoFinalEnee + dataRestoRespaldoFinalEnee;
                dataActivoRespaldoFinalEnee = Number(dataActivoRespaldoFinalEnee.toFixed(2));

                dataDiferenciaPuntaRespaldoEnee = dataPuntaRespaldoFinalEnee - dataPuntaRespaldoInicialEnee;
                dataDiferenciaPuntaRespaldoEnee = Number(dataDiferenciaPuntaRespaldoEnee.toFixed(2));
                dataDiferenciaRestoRespaldoEnee = dataRestoRespaldoFinalEnee - dataRestoRespaldoInicialEnee;
                dataDiferenciaRestoRespaldoEnee = Number(dataDiferenciaRestoRespaldoEnee.toFixed(2));
                dataDiferenciaActivoRespaldoEnee = dataActivoRespaldoFinalEnee - dataActivoRespaldoInicialEnee;
                dataDiferenciaActivoRespaldoEnee = Number(dataDiferenciaActivoRespaldoEnee.toFixed(2));

                // Definir las coordenadas de inicio para la tabla de generacion Principal
                const startX = 10;
                const startY = 87;
                doc.setFontSize(7)
                let dataPuntaRespaldoInicialEneeF = formatoHn(dataPuntaRespaldoInicialEnee);
                let dataRestoRespaldoInicialEneeF = formatoHn(dataRestoRespaldoInicialEnee);
                let dataActivoRespaldoInicialEneeF = formatoHn(dataActivoRespaldoInicialEnee);
                let dataPuntaRespaldoFinalEneeF = formatoHn(dataPuntaRespaldoFinalEnee);
                let dataRestoRespaldoFinalEneeF = formatoHn(dataRestoRespaldoFinalEnee);
                let dataActivoRespaldoFinalEneeF = formatoHn(dataActivoRespaldoFinalEnee);
                let dataDiferenciaRestoRespaldoEneeF = formatoHn(dataDiferenciaRestoRespaldoEnee);
                let dataDiferenciaPuntaRespaldoEneeF = formatoHn(dataDiferenciaPuntaRespaldoEnee);
                let dataDiferenciaActivoRespaldoEneeF = formatoHn(dataDiferenciaActivoRespaldoEnee);

                doc.text(dataPuntaRespaldoInicialEneeF.toString(), 10 * startX + 40, startY + 18.5);
                doc.text(dataRestoRespaldoInicialEneeF.toString(), 13 * startX + 30, startY + 18.5);
                doc.text(dataActivoRespaldoInicialEneeF.toString(), 15 * startX + 33, startY + 18.5);

                doc.text(dataPuntaRespaldoFinalEneeF.toString(), 10 * startX + 40, startY + 23.5);
                doc.text(dataRestoRespaldoFinalEneeF.toString(), 13 * startX + 30, startY + 23.5);
                doc.text(dataActivoRespaldoFinalEneeF.toString(), 15 * startX + 33, startY + 23.5);

                doc.text(dataDiferenciaPuntaRespaldoEneeF.toString(), 10 * startX + 40, startY + 33.5);
                doc.text(dataDiferenciaRestoRespaldoEneeF.toString(), 13 * startX + 30, startY + 33.5);
                doc.text(dataDiferenciaActivoRespaldoEneeF.toString(), 15 * startX + 33, startY + 33.5);
              }

              dataPromedioPuntaEnee = (dataDiferenciaPuntaEnee + dataDiferenciaPuntaRespaldoEnee) / 2;
              dataPromedioPuntaEnee = Number(dataPromedioPuntaEnee.toFixed(2));
              dataPromedioRestoEnee = (dataDiferenciaRestoEnee + dataDiferenciaRestoRespaldoEnee) / 2;
              dataPromedioRestoEnee = Number(dataPromedioRestoEnee.toFixed(2));
              dataPromedioActivoEnee = Number(dataDiferenciaActivoEnee + dataDiferenciaActivoRespaldoEnee) / 2;
              dataPromedioActivoEnee = Number(dataPromedioActivoEnee.toFixed(2));

              dataPorcentPuntaEnee = Math.abs((dataDiferenciaPuntaEnee / dataPromedioActivoEnee - 1));
              dataPorcentPuntaEnee = Number(dataPorcentPuntaEnee.toFixed(4));
              dataPorcentRestoEnee = Math.abs((dataDiferenciaRestoEnee / dataPromedioRestoEnee - 1));
              dataPorcentRestoEnee = Number(dataPorcentRestoEnee.toFixed(4));
              dataPorcentActivoEnee = Math.abs((dataDiferenciaActivoEnee / dataPromedioActivoEnee - 1));
              dataPorcentActivoEnee = Number(dataPorcentActivoEnee.toFixed(4));

              dataTotalPuntaEnee = dataPromedioPuntaEnee * dataFactor;
              dataTotalPuntaEnee = Number(dataTotalPuntaEnee);
              dataTotalRestoEnee = dataPromedioRestoEnee * dataFactor;
              dataTotalRestoEnee = Number(dataTotalRestoEnee);
              dataTotalActivoEnee = dataPromedioActivoEnee * dataFactor;
              dataTotalActivoEnee = Number(dataTotalActivoEnee);

            }
            const startX = 10;
            const startY = 137;

            let dataPromedioPuntaEneeF = formatoHn(dataPromedioPuntaEnee);
            let dataPromedioRestoEneeF = formatoHn(dataPromedioRestoEnee);
            let dataPromedioActivoEneeF = formatoHn(dataPromedioActivoEnee);
            let dataPorcentPuntaEneeF = formatoHn(dataPorcentPuntaEnee);
            let dataPorcentRestoEneeF = formatoHn(dataPorcentRestoEnee);
            let dataPorcentActivoEneeF = formatoHn(dataPorcentActivoEnee);
            let dataTotalPuntaEneeF = formatoHn(dataTotalPuntaEnee);
            let dataTotalRestoEneeF = formatoHn(dataTotalRestoEnee);
            let dataTotalActivoEneeF = formatoHn(dataTotalActivoEnee);

            doc.text(dataPromedioPuntaEneeF.toString(), 10 * startX + 42, startY + 18.5);
            doc.text(dataPromedioRestoEneeF.toString(), 13 * startX + 30, startY + 18.5);
            doc.text(dataPromedioActivoEneeF.toString(), 15 * startX + 33, startY + 18.5);

            doc.text(dataPorcentPuntaEneeF.toString() + '%', 10 * startX + 43, startY + 23.5);
            doc.text(dataPorcentRestoEneeF.toString() + '%', 13 * startX + 33, startY + 23.5);
            doc.text(dataPorcentActivoEneeF.toString() + '%', 15 * startX + 35, startY + 23.5);

            doc.text(dataTotalPuntaEneeF.toString(), 10 * startX + 43, startY + 38.5);
            doc.text(dataTotalRestoEneeF.toString(), 13 * startX + 33, startY + 38.5);
            doc.text(dataTotalActivoEneeF.toString(), 15 * startX + 35, startY + 38.5);

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


                let dataLecturaPuntaInicialPrincipalF = formatoHn(dataLecturaPuntaInicialPrincipal);
                let dataLecturaPuntaFinalPrincipalF = formatoHn(dataLecturaPuntaFinalPrincipal);
                let dataDiferenciaPuntaPrincipalF = formatoHn(dataDiferenciaPuntaPrincipal);
                let dataLecturaRestoInicialPrincipalF = formatoHn(dataLecturaRestoInicialPrincipal);
                let dataLecturaRestoFinalPrincipalF = formatoHn(dataLecturaRestoFinalPrincipal);
                let dataDiferenciaRestoPrincipalF = formatoHn(dataDiferenciaRestoPrincipal);
                let dataTotalActivoInicialPrincipalF = formatoHn(dataTotalActivoInicialPrincipal);
                let dataTotalActivoFinalPrincipalF = formatoHn(dataTotalActivoFinalPrincipal);
                let dataDiferenciaActivoPrincipalF = formatoHn(dataDiferenciaActivoPrincipal);
                doc.text(dataLecturaPuntaInicialPrincipalF.toString(), 2 * startX + 47, startY + 18.5);
                doc.text(dataLecturaPuntaFinalPrincipalF.toString(), 2 * startX + 47, startY + 23.5);
                doc.text(dataDiferenciaPuntaPrincipalF.toString(), 2 * startX + 47, startY + 33.5);
                doc.text(dataLecturaRestoInicialPrincipalF.toString(), 5 * startX + 43, startY + 18.5);
                doc.text(dataLecturaRestoFinalPrincipalF.toString(), 5 * startX + 43, startY + 23.5);
                doc.text(dataDiferenciaRestoPrincipalF.toString(), 5 * startX + 43, startY + 33.5);
                doc.text(dataTotalActivoInicialPrincipalF.toString(), 7 * startX + 45, startY + 18.5);
                doc.text(dataTotalActivoFinalPrincipalF.toString(), 7 * startX + 45, startY + 23.5);
                doc.text(dataDiferenciaActivoPrincipalF.toString(), 7 * startX + 45, startY + 33.5);

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
                dataDiferenciaPuntaRespaldo = Number(dataDiferenciaPuntaRespaldo.toFixed(2));
                dataDiferenciaRestoRespaldo = dataLecturaRestoFinalRespaldo - dataLecturaRestoInicialRespaldo;
                dataDiferenciaRestoRespaldo = Number(dataDiferenciaRestoRespaldo.toFixed(2));
                dataTotalActivoInicialRespaldo = dataLecturaPuntaInicialRespaldo + dataLecturaRestoInicialRespaldo;
                dataTotalActivoInicialRespaldo = Number(dataTotalActivoInicialRespaldo.toFixed(2));
                dataTotalActivoFinalRespaldo = dataLecturaPuntaFinalRespaldo + dataLecturaRestoFinalRespaldo;
                dataTotalActivoFinalRespaldo = Number(dataTotalActivoFinalRespaldo.toFixed(2));
                dataDiferenciaActivoRespaldo = dataTotalActivoFinalRespaldo - dataTotalActivoInicialRespaldo;
                dataDiferenciaActivoRespaldo = Number(dataDiferenciaActivoRespaldo.toFixed(2));
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
                doc.text(Respaldotxt, startX1 + 13, startY1 + 6); // Ajusta las coordenadas para centrar el texto
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

                let dataLecturaPuntaInicialRespaldoF = formatoHn(dataLecturaPuntaInicialRespaldo);
                let dataLecturaPuntaFinalRespaldoF = formatoHn(dataLecturaPuntaFinalRespaldo);
                let dataDiferenciaPuntaRespaldoF = formatoHn(dataDiferenciaPuntaRespaldo);
                let dataLecturaRestoInicialRespaldoF = formatoHn(dataLecturaRestoInicialRespaldo);
                let dataLecturaRestoFinalRespaldoF = formatoHn(dataLecturaRestoFinalRespaldo);
                let dataDiferenciaRestoRespaldoF = formatoHn(dataDiferenciaRestoRespaldo);
                let dataTotalActivoInicialRespaldoF = formatoHn(dataTotalActivoInicialRespaldo);
                let dataTotalActivoFinalRespaldoF = formatoHn(dataTotalActivoFinalRespaldo);
                let dataDiferenciaActivoRespaldoF = formatoHn(dataDiferenciaActivoRespaldo);
                doc.text(dataLecturaPuntaInicialRespaldoF.toString(), 2 * startX1 + 47, startY1 + 18.5);
                doc.text(dataLecturaPuntaFinalRespaldoF.toString(), 2 * startX1 + 47, startY1 + 23.5);
                doc.text(dataDiferenciaPuntaRespaldoF.toString(), 2 * startX1 + 47, startY1 + 33.5);
                doc.text(dataLecturaRestoInicialRespaldoF.toString(), 5 * startX1 + 43, startY1 + 18.5);
                doc.text(dataLecturaRestoFinalRespaldoF.toString(), 5 * startX1 + 43, startY1 + 23.5);
                doc.text(dataDiferenciaRestoRespaldoF.toString(), 5 * startX1 + 43, startY1 + 33.5);
                doc.text(dataTotalActivoInicialRespaldoF.toString(), 7 * startX1 + 45, startY1 + 18.5);
                doc.text(dataTotalActivoFinalRespaldoF.toString(), 7 * startX1 + 45, startY1 + 23.5);
                doc.text(dataDiferenciaActivoRespaldoF.toString(), 7 * startX1 + 45, startY1 + 33.5);
              }

              dataPromedioPunta = (dataDiferenciaPuntaPrincipal + dataDiferenciaPuntaRespaldo) / 2;
              dataPromedioPunta = Number(dataPromedioPunta.toFixed(2));
              dataPromedioResto = (dataDiferenciaRestoPrincipal + dataDiferenciaRestoRespaldo) / 2;
              dataPromedioResto = Number(dataPromedioResto.toFixed(2));
              dataPromedioTotalActivo = (dataDiferenciaActivoPrincipal + dataDiferenciaActivoRespaldo) / 2
              dataPromedioTotalActivo = Number(dataPromedioTotalActivo.toFixed(2));
              dataPorcentPunta = Math.abs((dataDiferenciaPuntaPrincipal / dataPromedioPunta) - 1);
              dataPorcentPunta = Number(dataPorcentPunta.toFixed(8));
              dataPorcentResto = Math.abs((dataDiferenciaRestoPrincipal / dataPromedioResto - 1));
              dataPorcentResto = Number(dataPorcentResto.toFixed(8));
              dataPorcentTotalActivo = Math.abs((dataDiferenciaActivoPrincipal / dataPromedioTotalActivo - 1));
              dataPorcentTotalActivo = Number(dataPorcentTotalActivo.toFixed(8));
              dataTotalPunta = dataPromedioPunta * dataFactor;
              dataTotalPunta = Number(dataTotalPunta.toFixed(2));
              dataTotalResto = dataPromedioResto * dataFactor;
              dataTotalResto = Number(dataTotalResto.toFixed(2));
              dataTotalActivo = dataPromedioTotalActivo * dataFactor;
              dataTotalActivo = Number(dataTotalActivo.toFixed(2));
              dataTotalKwPunta = dataTotalPunta - dataTotalPuntaEnee;
              dataTotalKwPunta = Number(dataTotalKwPunta.toFixed(2));
              dataPotenciaFirme = dataTotalKwPunta / dataHpuntaPeriodo;
              dataPotenciaFirme = Number(dataPotenciaFirme.toFixed(2));
              dataEnergiaNetaMes = dataTotalActivo - dataTotalActivoEnee;
              dataEnergiaNetaMes = Number(dataEnergiaNetaMes.toFixed(2));
            }
            // Definir las coordenadas de inicio para la tabla
            const startX = 10;
            const startY = 137;
            // Definir el ancho y alto de las celdas
            const cellWidth = 40;
            const cellHeight = 10;
            // Dibujar la tabla cabecera
            doc.rect(startX, startY + 10, cellWidth + 10, cellHeight); // Celda 1
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
            doc.text(porcentajeErrorTxt, startX + 1.5, startY + 23.5);
            doc.text(promMedidoresTxt, startX + 1.5, startY + 28.5);
            doc.text(factorTxt, 3 * startX, startY + 33.5);
            doc.text(totalTxt, 3 * startX, startY + 38.5);

            doc.text(puntaTxt, 2 * startX + 48, startY + 13.5);
            doc.text(restoTxt, 5 * startX + 43, startY + 13.5);
            doc.text(totalActivoTxt, 7 * startX + 45, startY + 13.5);
            doc.text(puntaTxt, 10 * startX + 42, startY + 13.5);
            doc.text(restoTxt, 12 * startX + 42, startY + 13.5);
            doc.text(totalActivoTxt, 14 * startX + 42, startY + 13.5)

            //Cuadros para data
            doc.rect(startX, startY + 20, cellWidth + 10, cellHeight - 5); // Celda 1.1
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

            let dataPromedioPuntaF = formatoHn(dataPromedioPunta);
            let dataPromedioRestoF = formatoHn(dataPromedioResto);
            let dataPromedioTotalActivoF = formatoHn(dataPromedioTotalActivo);
            doc.text(dataPromedioPuntaF.toString(), 2 * startX + 47, startY + 18.5);
            doc.text(dataPromedioRestoF.toString(), 5 * startX + 43, startY + 18.5);
            doc.text(dataPromedioTotalActivoF.toString(), 7 * startX + 45, startY + 18.5);


            doc.text(dataPorcentPunta.toString() + ' %', 2 * startX + 47, startY + 23.5);
            doc.text(dataPorcentResto.toString() + ' %', 5 * startX + 43, startY + 23.5);
            doc.text(dataPorcentTotalActivo.toString() + ' %', 7 * startX + 45, startY + 23.5);

            doc.text(dataFactor.toString(), 2 * startX + 50, startY + 33.5);
            doc.text(dataFactor.toString(), 5 * startX + 43, startY + 33.5);
            doc.text(dataFactor.toString(), 7 * startX + 48, startY + 33.5);
            //para enee
            doc.text(dataFactor.toString(), 10 * startX + 45, startY + 33.5);
            doc.text(dataFactor.toString(), 13 * startX + 40, startY + 33.5);
            doc.text(dataFactor.toString(), 15 * startX + 40, startY + 33.5);

            let dataTotalPuntaF = formatoHn(dataTotalPunta);
            let dataTotalRestoF = formatoHn(dataTotalResto);
            let dataTotalActivoF = formatoHn(dataTotalActivo);
            doc.text(dataTotalPuntaF.toString(), 2 * startX + 47, startY + 38.5);
            doc.text(dataTotalRestoF.toString(), 5 * startX + 43, startY + 38.5);
            doc.text(dataTotalActivoF.toString(), 7 * startX + 45, startY + 38.5);

            //cuadro4
            // Definir las coordenadas de inicio para la tabla
            const start_X = 10;
            const start_Y = 186;
            // Definir el ancho y alto de las celdas
            const cellWidth_ = 40;
            const cellHeight_ = 10;
            doc.rect(start_X, start_Y + 5, cellWidth_ + 35, cellHeight_ - 5); //celda1
            doc.rect(start_X, start_Y + 10, cellWidth_ + 35, cellHeight_ - 5); //celda1.1
            doc.rect(start_X, start_Y + 15, cellWidth_ + 35, cellHeight_ - 5); //celda1.2
            doc.rect(start_X, start_Y + 20, cellWidth_ + 35, cellHeight_ + 5); //celda1.3

            doc.rect(start_X + cellWidth_ + 35, start_Y, cellWidth_ + 10, cellHeight_ - 5);//celda2
            doc.rect(start_X + cellWidth_ + 35, start_Y + 5, cellWidth_ + 10, cellHeight_ - 5);//celda2.1
            doc.rect(start_X + cellWidth_ + 35, start_Y + 10, cellWidth_ + 10, cellHeight_ - 5);//celda2.2
            doc.rect(start_X + cellWidth_ + 35, start_Y + 15, cellWidth_ + 10, cellHeight_ - 5);//celda2.3
            doc.rect(start_X + cellWidth_ + 35, start_Y + 15, cellWidth_ + 10, cellHeight_ + 10);//celda2.3
            //DATA
            doc.setFontSize(10);
            doc.text(horasPuntaPeriodoTxt, start_X + 20, start_Y + 8.5); //1.1
            doc.text(diasHorasPuntaTxt, start_X + 20, start_Y + 13.5);//1.2
            doc.text(totalKwhPuntaTxt, start_X + 14, start_Y + 18.5);//1.3
            doc.text(potenciaFirmeTxt, start_X + 7, start_Y + 24.5);//1.4

            let dataHpuntaPeriodoF = formatoHn(dataHpuntaPeriodo);
            let dataHorasPuntaF = formatoHn(dataHorasPunta);
            let dataTotalKwPuntaF = formatoHn(dataTotalKwPunta);
            let dataPotenciaFirmeF = formatoHn(dataPotenciaFirme);
            doc.text(TotalMesTxt, start_X + cellWidth_ + 48, start_Y + 3.5);//2.1
            doc.text(dataHpuntaPeriodoF.toString(), start_X + cellWidth_ + 55, start_Y + 8.5);//2.2
            doc.text(dataHorasPuntaF.toString(), start_X + cellWidth_ + 56, start_Y + 13.5);//2.3
            doc.text(dataTotalKwPuntaF.toString(), start_X + cellWidth_ + 50, start_Y + 19);//2.4
            doc.text(dataPotenciaFirmeF.toString(), start_X + cellWidth_ + 54, start_Y + 27.5);//2.4

            //cuadro5
            const startY1 = 226;
            doc.rect(start_X, startY1, cellWidth_ + 35, cellHeight_); //celda1
            doc.rect(start_X, startY1 + 10, cellWidth_ + 35, cellHeight_ + 3); //celda1.1
            doc.rect(start_X + cellWidth_ + 35, startY1, cellWidth_ + 10, cellHeight_); //celda2
            doc.rect(start_X + cellWidth_ + 35, startY1 + 10, cellWidth_ + 10, cellHeight_ + 3); //celda2.1
            //data

            let dataEnergiaNetaMesF = formatoHn(dataEnergiaNetaMes);
            doc.text(energiaNetaMesTxt, startX + 1, startY1 + 14); //celda1.1
            doc.text(TotalMesTxt, start_X + cellWidth_ + 48, startY1 + 6); //celda2
            doc.text(dataEnergiaNetaMesF.toString(), start_X + cellWidth_ + 51, startY1 + 18); //celda2.2


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
      doc.text(capacidadTxt, 10, 190);
      doc.text(energiaNetaTxt, 11, 230);
      doc.text(fechaConstancia, 11, 255);
      doc.text(lineafirma, 11, 270);
      doc.text(lineafirma, 77, 270);
      doc.text(lineafirma, 151, 270);
      doc.text(firma1, 20, 275);
      doc.text(firma2, 90, 275);
      doc.text(firma3, 160, 275);
      doc.text(porEnee, 25, 278);
      doc.text(porEnee, 93, 278);
      doc.text(porEnee, 168, 278);

    } else if (this.tipoReporte === 'FACTURA 227') {

      let cargoCapacidadFijo = 0;
      let capacidadFirmeComprometida = 0;
      let fdr = 0;
      let correlativo = 0
      let nombreContrato = "";
      let cpiRelacionInfalcion = 0;
      let relacionInflacion = 0;
      let cvi = 0;
      let cvOyM = 0;
      let cvOyM2 = 0;
      let otrosCargos = 0;
      let cargoOperacionDolares = 0;
      let cargoOperacionLempiras = 0;
      let tasaDolar = 0;
      let indiceCombustible = 0
      let euro = 0;
      let totalPagoCapacidad = 0

      let totalA = 0
      let totalB = 0;
      let totalC = 0;

      const fechaGenerada = new Date();

      const nombresMeses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
      const dia = fechaGenerada.getDate();
      const Mes = nombresMeses[fechaGenerada.getMonth()];
      const Anio = fechaGenerada.getFullYear();
      const fechaConstancia = ` ${dia}` + ` ${Mes}` + ` ${Anio}`

      const doc = new jsPDF();
      const img = new Image();
      img.src = 'assets/Images/Logo.jpeg';
      img.onload = () => {
        doc.addImage(img, 10, 15, 40, 10);
      };


      function obtenerAnioYNombreMes(fecha: any) {
        const meses = [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre"
        ];

        const anio = fecha.getFullYear();
        const mes = fecha.getMonth();
        const nombreMes = meses[mes];

        return {
          anio,
          nombreMes
        };
      }
      console.log(fechaInicialFormatted)
      const fecha = new Date(fechaInicialFormatted);
      const resultado = obtenerAnioYNombreMes(fecha);
      let anio = resultado.anio;
      let mes = resultado.nombreMes;


      const formatoHn = (number: any) => {
        const exp = /(\d)(?=(\d{3})+(?!\d))/g;
        const rep = '$1,';
        return number.toString().replace(exp, rep);
      }



      this.reportService.getEnersa227(fechaInicialFormatted.toISOString().split('T')[0], fechaFinalFormatted).subscribe(
        (response: any) => {
          console.log("this es..", response);

          if (response) {
            for (let i = 0; i < response.contrato.length; i++) {
              cargoCapacidadFijo = response.contrato[i].cpcf;
              capacidadFirmeComprometida = response.contrato[i].cfc;
              cargoOperacionDolares = response.contrato[i].cpomD;
              cargoOperacionLempiras = response.contrato[i].cpomL;
              fdr = response.contrato[i].fdr;
              cvi = response.contrato[i].cvci;
              cvOyM = response.contrato[i].cvco1;
              cvOyM2 = response.contrato[i].cvco2;
              otrosCargos = response.contrato[i].otrosCargos;
              nombreContrato = response.contrato[i].nombreContrato;
            }
            for (let i = 0; i < response.correlativo.length; i++) {
              correlativo = response.correlativo[i].Correlativo;

            }
            for (let i = 0; i < response.cpi.length; i++) {
              cpiRelacionInfalcion = response.cpi[i].RelacionInflacion;
            }
            for (let i = 0; i < response.ipc.length; i++) {
              relacionInflacion = response.ipc[i].RelacionInflacion;
            }

            for (let i = 0; i < response.combustible.length; i++) {
              indiceCombustible = response.combustible[i].indiceCombustible;
            }

            for (let i = 0; i < response.cambioDolar.length; i++) {
              tasaDolar = response.cambioDolar[i].Venta;
            }
            for (let i = 0; i < response.euro.length; i++) {
              euro = response.euro[i].RelacionInflacion;
            }

            let capacidadFirmeComprometidaf = formatoHn(capacidadFirmeComprometida);


            // Definir las coordenadas de inicio para la tabla
            const startX = 10;
            const startY = 20;
            // Definir el ancho y alto de las celdas
            const cellWidth = 80;
            const cellHeight = 5;

            doc.setFontSize(10);
            doc.text("CENTRAL TERMOELÉCTRICA CHOLOMA III - HONDURAS", startX, startY + 10);
            doc.text("Contrato No. " + nombreContrato, startX, startY + 15);
            doc.text("Periodo de Facturación: " + mes + " " + anio, startX, startY * 2);
            doc.text("FACTURA No.  " + correlativo, startX * 16, startY + 10);

            //cuadros descripcion
            doc.setFillColor(247, 205, 89); // Establece el color de relleno
            doc.rect(startX, startY * 3 - 10, cellWidth, cellHeight, 'F');
            for (let i = 0; i < 14; i++) {
              doc.rect(startX, startY * 3 - 5 + i * 5, cellWidth, cellHeight);

            }
            doc.rect(startX, startY * 6 + 5, cellWidth + 45, cellHeight);
            doc.rect(startX, startY * 6 + 10, cellWidth + 69, cellHeight);

            //cuadros enersa 227
            doc.rect(startY * 3 + 4 * startX - 10, startY * 3 - 10, cellWidth - 11, cellHeight, 'F');
            doc.rect(startY * 3 + 4 * startX - 10, startY * 3 - 5, cellWidth - 11, cellHeight);
            doc.rect(startY * 3 + 4 * startX - 10, startY * 3, cellWidth - 11, cellHeight * 15);

            for (let i = 0; i < 13; i++) {
              doc.rect(startY * 3 + 4 * startX - 10, startY * 3 + i * 5, cellWidth - 60, cellHeight);
              doc.rect(startY * 3 + 4 * startX - 10, startY * 3 + i * 5, cellWidth - 35, cellHeight);
            }


            //cuadros totales
            doc.rect(startY * 3 + 10 * startX - 1, startY * 3 - 10, cellWidth - 36, cellHeight, 'F');
            doc.rect(startY * 3 + 10 * startX - 1, startY * 3 - 5, cellWidth - 36, cellHeight * 4);
            doc.rect(startY * 3 + 10 * startX - 1, startY * 4 - 5, cellWidth - 66, cellHeight);
            doc.rect(startY * 3 + 10 * startX - 1, startY * 4 - 5, cellWidth - 36, cellHeight);
            doc.rect(startY * 3 + 10 * startX - 1, startY * 4, cellWidth - 36, cellHeight * 3);
            doc.rect(startY * 3 + 10 * startX - 1, startY * 5 - 5, cellWidth - 66, cellHeight);
            doc.rect(startY * 3 + 10 * startX - 1, startY * 5 - 5, cellWidth - 36, cellHeight);
            doc.rect(startY * 3 + 10 * startX - 1, startY * 5, cellWidth - 36, cellHeight * 5);
            doc.rect(startY * 3 + 10 * startX - 1, startY * 6 + 5, cellWidth - 66, cellHeight);
            doc.rect(startY * 3 + 10 * startX - 1, startY * 6 + 5, cellWidth - 36, cellHeight);
            doc.rect(startY * 3 + 10 * startX - 1, startY * 6 + 10, cellWidth - 66, cellHeight);
            doc.rect(startY * 3 + 10 * startX - 1, startY * 6 + 10, cellWidth - 36, cellHeight);


            //operaciones
            let resultado = 0;
            if (fdr > 100) {
              resultado = cargoOperacionLempiras * capacidadFirmeComprometida * relacionInflacion;
              resultado = Number(resultado.toFixed(2));
            } else {
              resultado = cargoOperacionLempiras * capacidadFirmeComprometida * relacionInflacion * (fdr / 100);
              resultado = Number(resultado.toFixed(2));
            }
            let resultadoF = formatoHn(resultado);

            if (fdr > 100) {
              totalA = cargoCapacidadFijo * capacidadFirmeComprometida;
              totalA = Number(totalA.toFixed(2));
              totalB = cargoOperacionDolares * capacidadFirmeComprometida * cpiRelacionInfalcion;
              totalB = Number(totalB.toFixed(2));
            } else {
              totalA = cargoCapacidadFijo * capacidadFirmeComprometida * (fdr / 100);
              totalA = Number(totalA.toFixed(2));
              totalB = cargoOperacionDolares * capacidadFirmeComprometida * cpiRelacionInfalcion * (fdr / 100);
              totalB = Number(totalB.toFixed(2));
            }

            totalC = resultado / tasaDolar;
            totalC = Number(totalC.toFixed(2));

            totalPagoCapacidad = totalA + totalB + totalC;
            totalPagoCapacidad = Number(totalPagoCapacidad.toFixed(2));


            //data

            doc.setFont("helvetica", "bold");
            //parte descripcion
            doc.text("DESCRIPCIÓN", startY + 2 * startX - 2, startY * 3 - 6);
            doc.text("A. Cargo por Capacidad.", startX + 2, startY * 3 - 1.5);
            doc.setFont("helvetica", "normal");
            doc.text("Cargo por capacidad fijo.", startX + 8, startY * 3 + 4);
            doc.text("Capacidad Firme Comprometida.", startX + 8, startY * 3 + 9);
            doc.text("Factor de Disponibilidad Real (FDR).", startX + 8, startY * 3 + 14);
            doc.setFont("helvetica", "bold");
            doc.text("B. Cargo por Operación y Mantenimiento ($).", startX + 2, startY * 3 + 19);
            doc.setFont("helvetica", "normal");
            doc.text("Capacidad Firme Comprometida.", startX + 8, startY * 3 + 24);
            doc.text("Relación de Inflación USA, (CPI).", startX + 8, startY * 3 + 29);
            doc.text("Factor de Disponibilidad Real (FDR).", startX + 8, startY * 3 + 34);
            doc.setFont("helvetica", "bold");
            doc.text("C. Cargo por Operación y Mantenimiento (L).", startX + 2, startY * 3 + 39);
            doc.setFont("helvetica", "normal");
            doc.text("Capacidad Firme Comprometida.", startX + 8, startY * 3 + 44);
            doc.text("Relación de Inflación Honduras, (IPC).", startX + 8, startY * 3 + 49);
            doc.text("Factor de Disponibilidad Real (FDR).", startX + 8, startY * 3 + 54);
            doc.text("Total Lempiras.", startX + 8, startY * 3 + 59);
            doc.text("Tasa de Cambio al cierre del mes.", startX + 8, startY * 3 + 64);
            doc.text("Equivalente en dólares del cargo en lempiras.", startX + 8, startY * 3 + 69);
            doc.setFont("helvetica", "bold");
            doc.text("Total Pago por Capacidad (PPC) en dolares.", startX + 2, startY * 3 + 74);
            doc.setFont("helvetica", "bold");


            //columna enersa
            doc.setFont("helvetica", "bold");
            doc.text("ENERSA 227 MW", startY * 3 + 4.5 * startX, startY * 3 - 6);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.text("US$/kW-mes", startY * 3 + 4.5 * startX - 14, startY * 3 + 4);
            doc.text("kW", startY * 3 + 4.5 * startX - 8, startY * 3 + 9);
            doc.text(cargoCapacidadFijo.toString(), startY * 4 + 3 * startX + 2, startY * 3 + 4);
            doc.text(capacidadFirmeComprometidaf.toString(), startY * 4 + 3 * startX + 2, startY * 3 + 9);
            doc.text(fdr.toString() + " %", startY * 4 + 3 * startX + 2, startY * 3 + 14);
            doc.text("US$/kW-mes", startY * 3 + 4.5 * startX - 14, startY * 3 + 19);
            doc.text("kW", startY * 3 + 4.5 * startX - 8, startY * 3 + 24);
            doc.text(cargoOperacionDolares.toString(), startY * 4 + 3 * startX + 2, startY * 3 + 19);
            doc.text(capacidadFirmeComprometidaf.toString(), startY * 4 + 3 * startX + 2, startY * 3 + 24);
            doc.text(cpiRelacionInfalcion.toString(), startY * 4 + 3 * startX + 2, startY * 3 + 29);
            doc.text(fdr.toString() + " %", startY * 4 + 3 * startX + 2, startY * 3 + 34);
            doc.text("L/kW-mes", startY * 3 + 4.5 * startX - 14, startY * 3 + 39);
            doc.text("kW", startY * 3 + 4.5 * startX - 8, startY * 3 + 44);
            doc.text(cargoOperacionLempiras.toString(), startY * 4 + 3 * startX + 2, startY * 3 + 39);
            doc.text(capacidadFirmeComprometidaf.toString(), startY * 4 + 3 * startX + 2, startY * 3 + 44);
            doc.text(relacionInflacion.toString(), startY * 4 + 3 * startX + 2, startY * 3 + 49);
            doc.text(fdr.toString() + " %", startY * 4 + 3 * startX + 2, startY * 3 + 54);

            doc.text(resultadoF.toString(), startY * 4 + 3 * startX + 2, startY * 3 + 59);
            doc.text(tasaDolar.toString(), startY * 4 + 3 * startX + 2, startY * 3 + 64);
            doc.text("L", startY * 3 + 4.5 * startX - 8, startY * 3 + 59);
            doc.text("L/$", startY * 3 + 4.5 * startX - 8, startY * 3 + 64);


            doc.setFontSize(10);
            //columna totales
            doc.setFont("helvetica", "bold");
            doc.text("TOTALES", startY * 4.5 + 8 * startX - 2, startY * 3 - 6);
            doc.setFont("helvetica", "normal");
            doc.text("US$", startY * 3 + 10 * startX + 2, startY * 4 - 1);
            doc.text("US$", startY * 3 + 10 * startX + 2, startY * 5 - 1);
            doc.text("US$", startY * 3 + 10 * startX + 2, startY * 6 + 9);
            doc.text("US$", startY * 3 + 10 * startX + 2, startY * 6 + 14);
            let totalPagoCapacidadF = formatoHn(totalPagoCapacidad);
            let totalAf = formatoHn(totalA);
            let totalBf = formatoHn(totalB);
            let totalCf = formatoHn(totalC);
            doc.text(totalAf.toString(), startY * 4 + 10 * startX - 5, startY * 4 - 1);
            doc.text(totalBf.toString(), startY * 4 + 10 * startX - 5, startY * 5 - 1);
            doc.text(totalCf.toString(), startY * 4 + 10 * startX - 5, startY * 6 + 9);
            doc.setFont("helvetica", "bold");
            doc.text(totalPagoCapacidadF.toString(), startY * 4 + 10 * startX - 5, startY * 6 + 14);
            doc.setFont("helvetica", "normal");
            //cuadro2
            doc.rect(startX, startY * 7 - 5, cellWidth * 2 + 33, cellHeight - 4)
            doc.rect(startX, startY * 7 - 4, cellWidth * 2 + 33, cellHeight)

            doc.rect(startX * 16, startY * 7 - 4, cellWidth - 37, cellHeight * 14);

            for (let i = 0; i < 4; i++) {
              //descripcion
              doc.rect(startX, startY * 7 + 1 + i * 5, cellWidth, cellHeight)
              //enersa
              doc.rect(startY * 3 + 4 * startX - 10, startY * 7 + 1 + i * 5, cellWidth - 60, cellHeight);
              doc.rect(startY * 3 + 4 * startX - 10, startY * 7 + 1 + i * 5, cellWidth - 35, cellHeight);
              doc.rect(startY * 3 + 4 * startX - 10, startY * 7 + 1 + i * 5, cellWidth - 10, cellHeight);
            }

            doc.rect(startX, startY * 7 + 1 + 20, cellWidth * 2 - 10, cellHeight)

            for (let i = 0; i < 9; i++) {
              doc.rect(startX, startY * 7 + 1 + 25 + i * 5, cellWidth, cellHeight)
            }

            doc.rect(startY * 3 + 4 * startX - 10, startY * 7 + 1 + 25, cellWidth - 60, cellHeight);
            doc.rect(startY * 3 + 4 * startX - 10, startY * 7 + 1 + 40, cellWidth - 60, cellHeight);
            doc.rect(startY * 3 + 4 * startX - 10, startY * 7 + 1 + 60, cellWidth - 60, cellHeight);
            doc.rect(startY * 3 + 4 * startX - 10, startY * 7 + 1 + 65, cellWidth - 60, cellHeight);
            doc.rect(startY * 3 + 4 * startX - 10, startY * 7 + 1 + 70, cellWidth - 60, cellHeight);

            //total
            for (let i = 0; i < 9; i++) {
              doc.rect(startY * 3 + 4 * startX + 10, startY * 7 + 1 + 25 + i * 5, cellWidth - 55, cellHeight);
              doc.rect(startY * 3 + 4 * startX + 10, startY * 7 + 1 + 25 + i * 5, cellWidth - 30, cellHeight);

            }
            doc.rect(startY * 6 + 4 * startX, startY * 7 + 66, cellWidth - 37, cellHeight);
            doc.rect(startY * 6 + 4 * startX, startY * 7 + 66, cellWidth - 65, cellHeight);
            doc.rect(startY * 6 + 4 * startX, startY * 7 + 71, cellWidth - 37, cellHeight);
            doc.rect(startY * 4 + 3 * startX, startY * 7 + 71, cellWidth - 30, cellHeight);
            doc.rect(startX, startY * 7 + 71, cellWidth, cellHeight);

            doc.rect(startX, startY * 7 + 76, cellWidth * 2 - 10, cellHeight);
            doc.rect(startY * 6 + 4 * startX, startY * 7 + 76, cellWidth - 37, cellHeight);
            doc.rect(startY * 6 + 4 * startX, startY * 7 + 76, cellWidth - 65, cellHeight);

            doc.rect(startX, startY * 7 + 81, cellWidth * 2 - 10, cellHeight);
            doc.rect(startY * 6 + 4 * startX, startY * 7 + 81, cellWidth - 37, cellHeight);
            doc.rect(startY * 6 + 4 * startX, startY * 7 + 81, cellWidth - 65, cellHeight);

            doc.rect(startX, startY * 7 + 86, cellWidth * 2 - 10, cellHeight);
            doc.rect(startY * 6 + 4 * startX, startY * 7 + 86, cellWidth - 37, cellHeight);
            doc.rect(startY * 6 + 4 * startX, startY * 7 + 86, cellWidth - 65, cellHeight);

            doc.rect(startX, startY * 7 + 91, cellWidth * 2 - 10, cellHeight);
            doc.rect(startY * 6 + 4 * startX, startY * 7 + 91, cellWidth - 37, cellHeight);
            doc.rect(startY * 6 + 4 * startX, startY * 7 + 91, cellWidth - 65, cellHeight);


            //data
            doc.setFont("helvetica", "bold");
            doc.text("D. Cargo Variable Contractual", startX + 2, startY * 7);
            doc.setFont("helvetica", "normal");
            doc.text("Producción Mensual de Energía Primaria", startX + 8, startY * 7 + 10);
            doc.text("Producción Mensual de Energía Respaldo", startX + 8, startY * 7 + 15);
            doc.setFont("helvetica", "bold");
            doc.text("Total energía Primaria + Respaldo", startX + 8, startY * 7 + 20);
            doc.setFont("helvetica", "normal");
            doc.text("1. Cargo Variable por Energía", startX + 2, startY * 7 + 25);
            doc.text("a. Cargo Variable de Combustible (CVCi)", startX + 4, startY * 7 + 30);
            doc.text("Relación de Combustible", startX + 8, startY * 7 + 35);
            doc.setFontSize(9.3);
            doc.text("Cargo Variable de Combustible del mes (CVCn)", startX + 8, startY * 7 + 40);
            doc.text("b. Cargo Variable de O&M (CVO&M1i y CVO&M2i)", startX + 4, startY * 7 + 45);
            doc.setFontSize(10);
            doc.text("Relación Euro (50% del CVO&M)", startX + 3, startY * 7 + 50);
            doc.text("Relación inflación CPI", startX + 3, startY * 7 + 55);
            doc.setFontSize(9.3);
            doc.text("Cargo Variable de O&M (CVO&M1n y CVO&M2n)", startX + 3, startY * 7 + 60);
            doc.setFontSize(10);
            doc.text("Cargo variable contractual", startX + 4, startY * 7 + 65);

            doc.text("Total Cargo Variable Energía", startX + 4, startY * 7 + 70);
            doc.setFont("helvetica", "bold");
            doc.text("2. Total Energía Suministrada", startX + 2, startY * 7 + 75);
            doc.setFont("helvetica", "normal");


            doc.text("kWh", startX * 9 + 6, startY * 7 + 10);
            doc.text("kWh", startX * 9 + 6, startY * 7 + 15);
            doc.text("kWh", startX * 9 + 6, startY * 7 + 20);
            doc.text("US$/kWh", startX * 9 + 3, startY * 7 + 30);
            doc.text("US$/kWh", startX * 9 + 3, startY * 7 + 45);
            doc.text("US$/kWh", startX * 9 + 3, startY * 7 + 65);
            doc.text("US$", startX * 9 + 6, startY * 7 + 70);
            doc.text("kWh", startX * 9 + 6, startY * 7 + 75);



            let primariaB1 = JSON.parse(localStorage.getItem('primariaB1') || '{}');
            let primariaB2 = JSON.parse(localStorage.getItem('primariaB2') || '{}');
            let respaldoB1 = JSON.parse(localStorage.getItem('respaldoB1') || '{}');
            let respaldoB2 = JSON.parse(localStorage.getItem('respaldoB2') || '{}');

            let sumaCVE1 = 0;
            let sumaCVE2 = 0;
            let CVCn = 0;
            let CVCn2 = 0;
            let CVOyM1 = 0;
            let CVOyM2 = 0;
            let cvc = 0;
            let cvc2 = 0;
            let totalCargoEnergia1 = 0
            let totalCargoEnergia2 = 0
            let totalCargoVariableEnergia = 0;
            let totalEnergiaSuministrada = 0;

            let cargoVariableOfertado = 0.0693;
            let cargoVariableOperacionMantenimientoOfertado = 0.0146;
            let cargoReferencia = 13.25;

            let precioEnergiaSuministrada = 0;
            let precioCapacidadSuministrada = 0;
            let totalFacturar = 0;

            sumaCVE1 = primariaB1 + respaldoB1;
            sumaCVE1 = Number(sumaCVE1.toFixed(2));
            sumaCVE2 = primariaB2 + respaldoB2;
            sumaCVE2 = Number(sumaCVE2.toFixed(2));
            CVCn = cvi * indiceCombustible;
            CVCn = Number(CVCn.toFixed(8));
            CVOyM1 = 0.50 * cvOyM * cpiRelacionInfalcion + 0.50 * cvOyM * euro * cpiRelacionInfalcion;
            CVOyM1 = Number(CVOyM1.toFixed(8));
            CVOyM2 = 0.50 * cvOyM2 * cpiRelacionInfalcion + 0.50 * cvOyM2 * euro * cpiRelacionInfalcion;
            CVOyM2 = Number(CVOyM2.toFixed(8));
            cvc = CVCn + CVOyM1;
            cvc = Number(cvc.toFixed(8));
            cvc2 = CVCn + CVOyM2;
            cvc2 = Number(cvc2.toFixed(8));
            totalCargoEnergia1 = sumaCVE1 * cvc;
            totalCargoEnergia1 = Number(totalCargoEnergia1.toFixed(2));
            let totalCargoEnergia1F = formatoHn(totalCargoEnergia1);
            totalCargoEnergia2 = sumaCVE2 * cvc2;
            totalCargoEnergia2 = Number(totalCargoEnergia2.toFixed(2));
            let totalCargoEnergia2F = formatoHn(totalCargoEnergia2);
            totalEnergiaSuministrada = sumaCVE1 + sumaCVE2;
            totalEnergiaSuministrada = Number(totalEnergiaSuministrada.toFixed(2));
            totalCargoVariableEnergia = totalCargoEnergia1 + totalCargoEnergia2;
            totalCargoVariableEnergia = Number(totalCargoVariableEnergia.toFixed(2));
            let totalCargoVariableEnergiaF = formatoHn(totalCargoVariableEnergia);
            let cargoVariableCombustible = 0;
            cargoVariableCombustible = cargoVariableOfertado * indiceCombustible;
            let cargoVariableOperacionMantenimiento = cpiRelacionInfalcion * cargoVariableOperacionMantenimientoOfertado;
            let cargoVariableMes = 0;
            cargoVariableMes = cargoVariableCombustible + cargoVariableOperacionMantenimiento;
            precioEnergiaSuministrada = totalEnergiaSuministrada * cargoVariableMes
            precioEnergiaSuministrada = Number(precioEnergiaSuministrada.toFixed(2));
            console.log("****************************** ", precioEnergiaSuministrada);
            precioCapacidadSuministrada = capacidadFirmeComprometida * (fdr / 100) * cargoReferencia;
            precioCapacidadSuministrada = Number(precioCapacidadSuministrada.toFixed(2));
            totalFacturar = precioEnergiaSuministrada + precioCapacidadSuministrada;
            totalFacturar = Number(totalFacturar.toFixed(2));

            let sumaCargos = 0
            sumaCargos = totalPagoCapacidad + totalCargoVariableEnergia + otrosCargos;
            let totalPagarDolares = 0
            if (sumaCargos > totalFacturar) {
              totalPagarDolares = totalFacturar;
            } else {
              totalPagarDolares = sumaCargos;
            }
            totalPagarDolares = Number(totalPagarDolares.toFixed(2));
            let totalPagarDolaresFormatted = formatoHn(totalPagarDolares);

            let primariaB1F = formatoHn(primariaB1);
            let primariaB2F = formatoHn(primariaB2);
            let respaldoB1F = formatoHn(respaldoB1);
            let respaldoB2F = formatoHn(respaldoB2)
            let sumaCVE1f = formatoHn(sumaCVE1);
            let sumaCVE2f = formatoHn(sumaCVE2);


            doc.setFont("helvetica", "bold");
            doc.text("CVE1", startX * 12 - 2, startY * 7 + 5);
            doc.setFontSize(9);
            doc.text(primariaB1F.toString(), startX * 12 - 8, startY * 7 + 10);
            doc.text(respaldoB1F.toString(), startX * 12 - 8, startY * 7 + 15);
            doc.text(sumaCVE1f.toString(), startX * 12 - 8, startY * 7 + 20);
            doc.setFont("helvetica", "normal");

            doc.text(cvi.toString(), startX * 12 - 8, startY * 7 + 30);
            doc.text(indiceCombustible.toString(), startX * 12 - 8, startY * 7 + 35);
            doc.text(CVCn.toString(), startX * 12 - 8, startY * 7 + 40);
            doc.text(cvOyM.toString(), startX * 12 - 8, startY * 7 + 45);
            doc.text(euro.toString(), startX * 12 - 8, startY * 7 + 50);
            doc.text(cpiRelacionInfalcion.toString(), startX * 12 - 8, startY * 7 + 55);
            doc.text(CVOyM1.toString(), startX * 12 - 8, startY * 7 + 60);
            doc.text(cvc.toString(), startX * 12 - 8, startY * 7 + 65);
            doc.setFont("helvetica", "bold");
            doc.text(totalCargoEnergia1F.toString(), startX * 12 - 8, startY * 7 + 70);
            doc.setFont("helvetica", "normal");

            doc.setFont("helvetica", "bold");
            doc.text("CVE2", startX * 13 + 12, startY * 7 + 5);
            doc.text(primariaB2F.toString(), startX * 13 + 7, startY * 7 + 10);
            doc.text(respaldoB2F.toString(), startX * 13 + 7, startY * 7 + 15);
            doc.text(sumaCVE2f.toString(), startX * 13 + 7, startY * 7 + 20);
            doc.setFont("helvetica", "normal");
            doc.text(cvi.toString(), startX * 13 + 7, startY * 7 + 30);
            doc.text(indiceCombustible.toString(), startX * 13 + 7, startY * 7 + 35);
            doc.text(CVCn.toString(), startX * 13 + 7, startY * 7 + 40);
            doc.text(cvOyM2.toString(), startX * 13 + 7, startY * 7 + 45);
            doc.text(euro.toString(), startX * 13 + 7, startY * 7 + 50);
            doc.text(cpiRelacionInfalcion.toString(), startX * 13 + 7, startY * 7 + 55);
            doc.text(CVOyM2.toString(), startX * 13 + 7, startY * 7 + 60);
            doc.text(cvc2.toString(), startX * 13 + 7, startY * 7 + 65);
            doc.setFont("helvetica", "bold");
            doc.text(totalCargoEnergia2F.toString(), startX * 13 + 7, startY * 7 + 70);


            //total
            let totalEnergiaSuministradaF = formatoHn(totalEnergiaSuministrada);
            doc.text(totalEnergiaSuministradaF.toString(), startX * 12 + 5, startY * 7 + 75);
            doc.setFont("helvetica", "normal");


            doc.text("US$", startX * 16 + 4, startY * 7 + 70);
            doc.setFont("helvetica", "bold");
            doc.text(totalCargoVariableEnergiaF.toString(), startX * 18, startY * 7 + 70);
            doc.setFont("helvetica", "bold");
            doc.text("TOTAL A PAGAR POR CARGOS DE ENERGÍA, DÓLARES DE EEUU ($)", startX + 12, startY * 7 + 80);
            doc.text(totalCargoVariableEnergiaF.toString(), startX * 18, startY * 7 + 80);
            doc.text("US$", startX * 16 + 4, startY * 7 + 80);
            doc.text("TOTAL OTROS CARGOS O CRÉDITOS, en Lempiras (L)", startX + 2, startY * 7 + 85);
            doc.setFont("helvetica", "bold");
            doc.text(otrosCargos.toString(), startX * 18, startY * 7 + 85);
            doc.text("L", startX * 16 + 6, startY * 7 + 85);
            doc.text("TOTAL OTROS CARGOS", startX + 2, startY * 7 + 90);
            doc.setFont("helvetica", "bold");
            doc.text(otrosCargos.toString(), startX * 18, startY * 7 + 90);
            doc.text("US$", startX * 16 + 4, startY * 7 + 90);

            doc.setFont("helvetica", "bold");
            doc.text("TOTAL A PAGAR EN DOLARES DE EEUU($).", startX * 5, startY * 7 + 95);
            doc.text(totalPagarDolaresFormatted.toString(), startX * 18, startY * 7 + 95);

            doc.text("US$", startX * 16 + 4, startY * 7 + 95);
            doc.setFont("helvetica", "normal");
            doc.setFont("helvetica", "bold");
            doc.text("Nota 1: Emitir cheque certificado o transferencia bancaria a favor de ENERSA S. A.", startX + 2, startY * 7 + 105);
            doc.text("Nota 2: El retraso en el pago de esta factura dará lugar a un recargo de intereses por pago tardío", startX + 2, startY * 7 + 110);
            doc.text("aplicado sobre la facturación, según el Contrato No. " + nombreContrato, startX + 2, startY * 7 + 115);
            doc.text("__________________________________________", startX + 8, startY * 7 + 130);
            doc.text("Firma y Sello", startX * 5, startY * 7 + 135);
            doc.text(fechaConstancia, startX * 14, startY * 7 + 128);
            doc.text("__________________________________________", startX * 12, startY * 7 + 130);
            doc.text("Fecha", startX * 15 + 5, startY * 7 + 135);
            window.open(doc.output('bloburl'));
          } else { console.log("NO DATA FOR FACTURA...") }
        });
    }
  }
}
