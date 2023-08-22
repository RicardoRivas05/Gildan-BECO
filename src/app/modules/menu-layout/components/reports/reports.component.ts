import { Component, OnInit } from '@angular/core';
import { ReportsService } from './service/reports.service';
import jsPDF from 'jspdf';
import { ReportData } from 'src/Core/interfaces/report.interface';
import { NotificationService } from '@shared/services/notification.service';

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
    notificationService: NotificationService;
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
              console.log('Esto trae el backend', resp);
              this.resp = resp.inicial[0]; // Asigna el primer objeto de "inicial" a this.resp
              if (this.resp) {
                // console.log('para pdf', this.resp.sourceName);
              } else {
                console.log('this.resp es null');
              }
              // Accede a sourceName aquí
            },
            (error) => {
              console.log('Error en la solicitud HTTP', error);
            }
          );
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
            // console.log('Esto trae el backend', resp);
            this.resp = resp.inicial[0]; // Asigna el primer objeto de "inicial" a this.resp
            if (this.resp) {
              // console.log('para pdf', this.resp.sourceName);
            } else {
              console.log('this.resp es null');
            }
            // Accede a sourceName aquí
          });
      }
    }
    // Puedes agregar más condiciones para los otros tipos de reportes aquí
  }

  generarPDF() {
    if (this.tipoReporte == 'Energia Sumistrada' && this.resp) {
      const doc = new jsPDF();
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
      let kwh= 'kwh';
      let EnergiNeta = '';
      let dataLecturaAnterior = 0;
      let dataLecturaActual = 0;
      let dataNombreMedidor = '';
      let serieMedidor = '';
      let dataSerieMedidor = '';
      let pageWidth = doc.internal.pageSize.getWidth();
      let LAnterior = '';
      let LActual ='';
      let dataDiferencia = 0;
      let calibracion = '';
      let energiaNetaActual = 0;
      let energiaNetaAnterior = 0;
      let diferenciaEnergiaNeta = 0;
      doc.setFontSize(10);
      const title = `PERIODO DE FACTURACIÓN DEL ${fechaInicioFormateada} AL ${fechaFinFormateada}`;
      const subtitle = `ENERGÍA ELÉCTRICA SUMINISTRADA`;
      pageWidth = doc.internal.pageSize.getWidth();
      fontSize = 10;

      // Calcular el ancho del título
      const titleWidth =
        (doc.getStringUnitWidth(title) * fontSize) / doc.internal.scaleFactor;
      const xPosTitle = (pageWidth - titleWidth) / 2;

      // Calcular el ancho del subtítulo
      const subtitleWidth =
        (doc.getStringUnitWidth(subtitle) * fontSize) /
        doc.internal.scaleFactor;
      const xPosSubtitle = (pageWidth - subtitleWidth) / 2;

      // Configurar leyenda 1 a la izquierda

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

      //service energia enviada
      this.reportService
        .getConsumoMedidores(
          129,
          fechaInicialFormatted.toISOString().split('T')[0],
          fechaFinalFormatted
        )
        .subscribe((resp: any) => {
          console.log('Esto trae el backend', resp);

          if (this.resp) {
            // Configurar título y fuente

            for (let i = 0; i < resp.inicial.length; i++) {
              const elementoInicial = resp.inicial[i];
              const elementoFinal = resp.final[i];

              // Obtén las lecturas inicial y final
              let dataLecturaAnterior = elementoInicial.Value;
              let dataLecturaActual = elementoFinal.Value;

              // Calcula la diferencia


              // Configura las etiquetas y los datos
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
              diferencia='Diferencia(A-B)';

              // Imprime los datos para cada elemento
              doc.setFontSize(7);

              if (elementoInicial.TipoMedidor === 'Principal') {
                let dataDiferencia = dataLecturaActual - dataLecturaAnterior;
                //labels
                doc.text(dataNombreMedidor, xPosLegend1, 60 + i * 20);
                doc.text(dataSerieMedidor, xPosLegend1 + 40, 60 + i * 20);
                doc.text(LAnterior, xPosLegend1, 65 + i * 20);
                doc.text(LActual, xPosLegend1+23, 65 + i * 20);
                doc.text(kwh,xPosLegend1+7,67 +i*20)
                doc.text(kwh,xPosLegend1+29,67 +i*20)
                doc.text(kwh,xPosLegend1+49,67 +i*20)

                doc.text(diferencia.toString(),xPosLegend1+44,65 + i*20);

                doc.text(EnergiaEnviada, 10, 70 + i * 20);
                doc.text(EnergiaRecibida, 10, 75 + i * 20);
                doc.text(calibracion, 10, 80 + i * 20);
                doc.text(EnergiNeta, 10, 85 + i * 20);

                //data
                doc.text(dataLecturaAnterior.toString(), xPosLegend1+3, 70 + i * 20);
                doc.text(dataLecturaActual.toString(), xPosLegend1+26,70 + i *20);
                doc.text(dataDiferencia.toString(),xPosLegend1+46,70 +i *20);
              } else {
                //labels para medidores de respaldo
                let dataDiferencia = dataLecturaActual - dataLecturaAnterior;
                doc.text(dataNombreMedidor, xPosLegend2, 40 + i * 20);
                doc.text(dataSerieMedidor, xPosLegend2 + 40, 40 + i * 20);
                doc.text(LAnterior, xPosLegend2, 45 + i * 20);
                doc.text(LActual, xPosLegend2+23, 45 + i * 20);
                doc.text(kwh, xPosLegend2+7,47 + i *20);
                doc.text(kwh, xPosLegend2+29,47 + i *20);
                doc.text(kwh, xPosLegend2+49,47 + i *20);
                doc.text(diferencia.toString(),xPosLegend2+44,45 + i*20);
                doc.text(EnergiaEnviada, xPosLegend2 - 20, 50 + i * 20);
                doc.text(EnergiaRecibida, xPosLegend2 - 20, 55 + i * 20);
                doc.text(calibracion, xPosLegend2 - 20, 60 + i * 20);
                doc.text(EnergiNeta, xPosLegend2 - 20, 65 + i * 20);

                //data
                doc.text(dataLecturaAnterior.toString(),xPosLegend2+3,50 + i * 20);
                doc.text(dataLecturaActual.toString(), xPosLegend2+27, 50 +i*20);
                doc.text(dataDiferencia.toString(),xPosLegend2+46,50 +i *20);
              }
              doc.setFontSize(10);
            }

            doc.save('reporte.pdf');


          } else {
            console.log('this.resp es null');
          }
        });

      doc.text(title, xPosTitle, 10);
      doc.text(subtitle, xPosSubtitle, 25);
      doc.text(legend1, xPosLegend1, 45);
      doc.rect(xPosLegend1, 40, legend1Width + 1, 10);
      doc.text(legend2, xPosLegend2, 45);
      doc.rect(xPosLegend2, 40, legend2Width + 1, 10);
    }
  }
}
