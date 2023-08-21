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

  ngOnInit(): void {}

  onFechaInicialChange(value: Date): void {
    this.fechaInicial = value;
  }

  onFechaFinalChange(value: Date): void {
    this.fechaFinal = value;
  }

  generarReporte(): void {
    this.mostrarTabla = true;
    if (this.tipoReporte === '1') {
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
    if (this.tipoReporte == '1' && this.resp) {
      const doc = new jsPDF();
      const fechaInicioFormateada = this.fechaInicial.toLocaleDateString();
      const fechaFinFormateada = this.fechaFinal.toLocaleDateString();

      const fechaInicialFormatted = new Date(this.fechaInicial);
      fechaInicialFormatted.setHours(0, 0, 0, 0);
      const fechaFinalFormatted = this.fechaFinal.toISOString().split('T')[0];
      let dataLecturaAnterior=0;
      let dataLecturaActual =0;
      let dataDiferencia =0;
      let calibracion = 0;
      let energiaNetaActual = 0;
      let energiaNetaAnterior=0;
      let diferenciaEnergiaNeta=0;

      //service entregada
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
            doc.setFontSize(12);
            const title = `PERIODO DE FACTURACIÓN DEL ${fechaInicioFormateada} AL ${fechaFinFormateada}`;
            const subtitle = `ENERGÍA ELÉCTRICA SUMINISTRADA`;
            const pageWidth = doc.internal.pageSize.getWidth();
            const fontSize = 12;

            // Calcular el ancho del título
            const titleWidth =
              (doc.getStringUnitWidth(title) * fontSize) /
              doc.internal.scaleFactor;
            const xPosTitle = (pageWidth - titleWidth) / 2;

            // Calcular el ancho del subtítulo
            const subtitleWidth =
              (doc.getStringUnitWidth(subtitle) * fontSize) /
              doc.internal.scaleFactor;
            const xPosSubtitle = (pageWidth - subtitleWidth) / 2;

            // Configurar leyenda 1 a la izquierda
            const legend1 = `MEDIDORES PRINCIPALES`;
            const fontSize2 = 10;
            const legend1Width =
              (doc.getStringUnitWidth(legend1) * fontSize2) /
              doc.internal.scaleFactor;
            const xPosLegend1 = pageWidth / 4 - legend1Width / 2;


            console.log("este es", resp.inicial.length);

            for (let i = 0; i < resp.inicial.length; i++) {
              console.log("aveeer", i);
              const elemento = resp.inicial[i];
              doc.setFontSize(12);
              const fonSize = 12
              const LAnterior = "Lectura Anterior (A) kwh";
              dataLecturaAnterior = elemento.Value;

              const diferencia = "Difertencia (A-B) kwh";
              const dataDiferencia = elemento.Value[0] - elemento.Value[1];
              const EnergiaEnviada = "Energia Enviada ";
              const EnergiaRecibida = "Energia Recibida";
              const calibracion = "Calibracion";
              const EnergiNeta = "Energia Neta"


              // Accede a otras propiedades según sea necesario
            }
            for (let i = 0; i < resp.final.length; i++) {
              console.log("aveeer2", i);
              const elemento = resp.final[i];
              console.log("FECHA2:", elemento.TimestampUTC);
              // Accede a otras propiedades según sea necesario

              const LActual = "Lectura Actual (B) kwh";
              dataLecturaActual =  elemento.Value;
            }

            // Configurar leyenda 2 a la derecha
            const legend2 = `MEDIDORES DE RESPALDO`;
            const legend2Width =
              (doc.getStringUnitWidth(legend2) * fontSize2) /
              doc.internal.scaleFactor;
            const xPosLegend2 = (pageWidth * 3) / 4 - legend2Width / 2;





            // Establecer el título, subtítulo y leyendas en el documento
            doc.text(title, xPosTitle, 10);
            doc.text(subtitle, xPosSubtitle, 25);
            doc.text(legend1, xPosLegend1, 45);
            doc.rect(xPosLegend1, 40, legend1Width + 10, 10); // Añadí 5 unidades a cada lado del ancho
            doc.text(legend2, xPosLegend2, 45);
            doc.rect(xPosLegend2, 40, legend2Width + 10, 10); // Añadí 5 unidades a cada lado del ancho






            doc.save('reporte.pdf');
          } else {
            console.log('this.resp es null');
          }

        });
    }
  }
}
