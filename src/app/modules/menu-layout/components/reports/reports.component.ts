import { Component, OnInit } from '@angular/core';
import { ReportsService } from './service/reports.service';
import jsPDF from 'jspdf';
import { ReportData } from 'src/Core/interfaces/report.interface';
import { NotificationService } from '@shared/services/notification.service';
import { formatDate } from '@angular/common';
import { constancias } from 'src/Core/interfaces/constancia.interface';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { concatMap } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { startOfWeek, endOfWeek, addDays, addMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ChangeDetectorRef } from '@angular/core';


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

  constructor(private cd: ChangeDetectorRef, private reportService: ReportsService, private notificationService: NotificationService, private nzMessageService: NzMessageService,private datePipe: DatePipe,     private fb: FormBuilder, ) {

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
      if (selectedPeriod === 'hoy') {
        this.fechaInicial = new Date();
        this.fechaFinal = addDays(new Date(), 1);
      }
      if (selectedPeriod === 'ayer') {
        this.fechaInicial = addDays(new Date(), -1);
        this.fechaFinal =  new Date();
      }
       if (selectedPeriod === 'estaSemana') {
        this.fechaInicial = startOfWeek(new Date());
        this.fechaFinal = new Date();
      }
      if (selectedPeriod === 'esteMes') {
        this.fechaInicial = startOfMonth(new Date());
        this.fechaFinal = addDays(endOfMonth(new Date()), 1); // Agrega un día a la fecha final
      }
      if (selectedPeriod === 'mesAnterior') {
        this.fechaInicial = startOfMonth(addMonths(new Date(), -1));
        this.fechaFinal = addDays(endOfMonth(addMonths(new Date(), -1)), 1); // Agrega un día a la fecha final
      }
      if (selectedPeriod === 'rangoFechas') {
        fechaControl.enable(); // Habilita el control de fecha
      } else {
        fechaControl.disable(); // Deshabilita el control de fecha
      }

      fechaControl.setValue([this.fechaInicial, this.fechaFinal]);
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
      periodo: ['seleccionar', [Validators.required]],
      // fecha: [ '', [Validators.required]],
      fecha: [{ value: '', disabled: true }, [Validators.required]],

    });
  }

  submitForm() {
    let isLoading = true;

    this.nzMessageService
      .loading('Acción en progreso', { nzAnimate: isLoading, nzPauseOnHover: isLoading })
      .onClose!.pipe(
        concatMap(() => this.nzMessageService.success('Carga finalizada').onClose!),
        concatMap(() => this.nzMessageService.info('Carga finalizada').onClose!)
      )
      .subscribe(() => {});

    let generateFacturaSchema1 = {
      fechaInicial: '',
    };

    let generateFacturaSchema2 = {
      fechaFinal: '',
    };

    if (this.generateInvoicesForm.value.periodo === 'rangoFechas') {
      generateFacturaSchema1.fechaInicial = this.pipe.transform(new Date(this.generateInvoicesForm.value.fecha[0]), 'yyyy-MM-dd 00:00:00.000', '-0600') ?? '';
      generateFacturaSchema2.fechaFinal = this.pipe.transform(new Date(this.generateInvoicesForm.value.fecha[1]), 'yyyy-MM-dd 00:00:00.000', '-0600') ?? '';
    } else {
      generateFacturaSchema1.fechaInicial = this.pipe.transform(this.fechaInicial, 'yyyy-MM-dd 00:00:00.000', '-0600') ?? '';
      generateFacturaSchema2.fechaFinal = this.pipe.transform(this.fechaFinal, 'yyyy-MM-dd 00:00:00.000', '-0600') ?? '';
    }
    let { fechaInicial } = generateFacturaSchema1;
    let { fechaFinal } = generateFacturaSchema2;

    this.reportService.getDataMedidores(fechaInicial, fechaFinal).subscribe(
      (result: any) => {
        if (result.error) {
          this.notificationService.createNotification('error', 'Falló', `${result.error} 😓`);
          isLoading = false;
        } else {
          this.listOfData = result.dataM || [];
          this.notificationService.createMessage('success', 'La acción se ejecutó con éxito 😎');
          isLoading = false;
          console.log("Este es el resultado", result);
        }
      }
    );
  }

}
