import { Component, OnInit } from '@angular/core';
import { ReportsService } from './service/reports.service';
import jsPDF from 'jspdf';
import { ReportData } from 'src/Core/interfaces/report.interface';
import { NotificationService } from '@shared/services/notification.service';
import { formatDate } from '@angular/common';
import { endOfMonth } from 'date-fns';
import { constancias } from 'src/Core/interfaces/constancia.interface';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { concatMap } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  fechaInicial: Date = new Date();
  fechaFinal: Date = new Date();
  resp: ReportData | null = null;
  listOfData: ReportData[] = [];
  validateError: boolean = false;
  generateInvoicesForm!: FormGroup;
  pipe = new DatePipe('en-US');
  isLoading: boolean = false;
  dates:{from: any, to: any} = {from: '', to: ''};
  initialDate = new Date(formatDate((new Date()).toISOString(), 'yyyy-MM-dd 00:00:00.000', 'en-US', 'GMT'));
  ranges = { Today: [this.initialDate, this.initialDate], 'This Month': [this.initialDate, endOfMonth(new Date())] };
  showFechaPicker: boolean = false;
  pdfData: string = '';

  constructor(private reportService: ReportsService,private notificationService: NotificationService, private nzMessageService: NzMessageService,private datePipe: DatePipe,     private fb: FormBuilder, ) {

  }
  ngOnInit(): void {

    this.GenerateInvoicesCleanForm();

    this.generateInvoicesForm.get('periodo')!.valueChanges.subscribe((selectedPeriod) => {
      this.onPeriodChange(selectedPeriod);
   });
  }

  onPeriodChange(selectedPeriod: string): void {
    this.showFechaPicker = selectedPeriod === 'rangoFechas';
    const fechaControl = this.generateInvoicesForm.get('fecha');

    if (fechaControl) {
      if (selectedPeriod === 'rangoFechas') {
        fechaControl.enable();  // Habilita el control de fecha
      } else {
        fechaControl.enable();  // Deshabilita el control de fecha
      }
    }
  }


  onChange(result: Date[]): void {
    this.dates = {
      from: result[0],
      to: result[1]
    }
  }

  GenerateInvoicesCleanForm(){
    this.generateInvoicesForm = this.fb.group({
      periodo: ['hoy', [Validators.required]],
      // fecha: [ '', [Validators.required]],
      fecha: [{ value: '', disabled: true }, [Validators.required]],

    });
  }

  submitForm() {
    let isLoading = true;

    this.nzMessageService
      .loading('Action in progress', { nzAnimate: isLoading, nzPauseOnHover: isLoading })
      .onClose!.pipe(
        concatMap(() => this.nzMessageService.success('Loading finished').onClose!),
        concatMap(() => this.nzMessageService.info('Loading finished').onClose!)
      )
      .subscribe(() => {});

    let generateFacturaSchema1 = {
      fechaInicial: this.pipe.transform(new Date(this.generateInvoicesForm.value.fecha[0]), 'yyyy-MM-dd 00:00:00.000', '-0600') ?? '',
    };

    let generateFacturaSchema2 = {
      fechaFinal: this.pipe.transform(new Date(this.generateInvoicesForm.value.fecha[1]), 'yyyy-MM-dd 00:00:00.000', '-0600') ?? '',
    };

    let { fechaInicial } = generateFacturaSchema1;
    let { fechaFinal } = generateFacturaSchema2;

    this.reportService.getDataMedidores(fechaInicial, fechaFinal).subscribe(
      (result: any) => {
        if (result.error) {
          this.notificationService.createNotification('error', 'Falló', `${result.error} 😓`);
          isLoading = false;
        } else {
          // Asigna directamente el array dentro del objeto al listOfData
          this.listOfData = result.dataM || [];
          this.notificationService.createMessage('success', 'La acción se ejecutó con éxito 😎');
          isLoading = false;
          console.log("este es result", result);
        }
      }
    );
  }

}
