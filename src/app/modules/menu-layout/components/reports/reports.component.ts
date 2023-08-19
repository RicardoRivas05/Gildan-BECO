import { Component, OnInit } from '@angular/core';
import { ReportsService } from './service/reports.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  fechaInicial: Date = new Date();
  fechaFinal: Date = new Date();
  tipoReporte: string;
  energiaEntregada: boolean = false;
  energiaGenerada: boolean = false;

  constructor(private reportService: ReportsService) {
    this.tipoReporte = '';
  }

  ngOnInit(): void {}

  onFechaInicialChange(value: Date): void {
    this.fechaInicial = value;
  }

  onFechaFinalChange(value: Date): void {
    this.fechaFinal = value;
  }

  generarReporte(): void {
    console.log(this.fechaInicial, this.fechaFinal, this.tipoReporte, this.energiaEntregada, this.energiaGenerada);
    if (this.tipoReporte === '1') {
      if (this.energiaEntregada) {
        const fechaInicialFormatted = this.fechaInicial.toISOString().split('T')[0];
        const fechaFinalFormatted = this.fechaFinal.toISOString().split('T')[0];
        this.reportService.getConsumoMedidores(129, fechaInicialFormatted, fechaFinalFormatted).subscribe(
          (resp) => {
            console.log("Esto trae el backend", resp);
          },
          (error) => {
            console.log("Error en la solicitud HTTP", error);
          }
        );
      }
      if (this.energiaGenerada) {
        const fechaInicialFormatted = this.fechaInicial.toISOString().split('T')[0];
        const fechaFinalFormatted = this.fechaFinal.toISOString().split('T')[0];
        this.reportService.getConsumoMedidores(91, fechaInicialFormatted, fechaFinalFormatted).subscribe(
          (resp) => {
            console.log("Esto trae el backend", resp);
          },
          (error) => {
            console.log("Error en la solicitud HTTP", error);
          }
        );
      }
    }
    // Aquí puedes agregar más condiciones para los otros tipos de reportes
  }
}
