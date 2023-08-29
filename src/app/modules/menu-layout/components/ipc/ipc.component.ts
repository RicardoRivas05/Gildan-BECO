import { Component, OnInit } from '@angular/core';
import { ColumnItem } from 'src/Core/interfaces/col-meter-table.interface';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { ipcShema } from 'src/Core/interfaces/ipc.interface';
import { NotificationService } from '@shared/services/notification.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-ipc',
  templateUrl: './ipc.component.html',
  styleUrls: ['./ipc.component.css']
})
export class ipcComponent implements OnInit {
  isVisible = false;
  ipcIsDisable: boolean = false;
  listOfData: ipcShema[] = [];
  validateForm!: FormGroup;
  provider!: ipcShema;

  url = {
    get: 'get-ipc',
    post: 'ipc',
    delete: 'ipc',
    update: 'ipc',
  };
  EmptyForm =this.fb.group({
    fechaInicial: ['', [Validators.required]],
    fechaFinal: ['', [Validators.required]],
    ValorUltimoMes: ['', [Validators.required]],
    ValorInicial: ['', [Validators.required]],
    Value: ['', [Validators.required]],
    RelacionInflacion: ['', [Validators.required]],
  })
  constructor(
    private globalService: EndPointGobalService,
    private fb: FormBuilder,
    private nzMessageService: NzMessageService,
    private notificationService: NotificationService,

  ) { }

  ngOnInit(): void {
    this.Getipc(1, false);
    this.validateForm = this.EmptyForm;
  }



  updateTable(list: ipcShema) {
    this.listOfData = [...this.listOfData, list];
    console.log("Updated listOfData: ", this.listOfData); // Add this line to check the value of listOfData after the update
  }



  Getipc(estado: number, switched: boolean) {
    if (switched) {
      if ((!this.ipcIsDisable) && estado === 0) {
        console.log("Deshabilitados")
        this.ipcIsDisable = true;
      } else {
        console.log("habilitados")
        this.ipcIsDisable = false;
      }
    }

    this.globalService.GetId(this.url.get, estado).subscribe(
      (result: any) => {
        console.log("API Response: ", result); // Add this line to check the response
        this.listOfData = result;
      }
    );

  }


  disableClient(ipc: ipcShema, estado : number){
    let newEstado = Boolean(estado);
    this.globalService.Patch(this.url.update, ipc.ID, {estado: newEstado}).subscribe(
      result => {
        if(!result){
          if(estado === 1){
            this.Getipc(0, false);
          }else{
            this.Getipc(1, false);
          }

        }
      }
    );
  }
  cancel(): void {
    this.nzMessageService.info('click cancel');
  }


  listOfColumns: ColumnItem[] = [
    {
      name: 'Fecha Inicial',
      sortOrder: null,
      sortFn: (a: ipcShema, b: ipcShema) => a.fechaInicial.localeCompare(b.fechaInicial),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: string[], item: ipcShema) => list.some(fechaInicial => item.fechaInicial.indexOf(fechaInicial) !== -1)
    },
    {
      name: 'Fecha Final',
      sortOrder: null,
      sortFn: (a: ipcShema, b: ipcShema) => a.fechaFinal.localeCompare(b.fechaFinal),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: string[], item: ipcShema) => list.some(fechaFinal => item.fechaFinal.indexOf(fechaFinal) !== -1)
    },
    {
      name: 'Valor Inicial',
      sortOrder: null,
      sortFn: (a: ipcShema, b: ipcShema) => a.ValorInicial - b.ValorInicial,
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: number[], item: ipcShema) => list.includes(item.ValorInicial)
    },
    {
      name: 'Valor Último Mes',
      sortOrder: null,
      sortFn: (a: ipcShema, b: ipcShema) => a.ValorUltimoMes - b.ValorUltimoMes,
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: number[], item: ipcShema) => list.includes(item.ValorUltimoMes)
    },
    {
      name: 'Valor Actual',
      sortOrder: null,
      sortFn: (a: ipcShema, b: ipcShema) => a.Value - b.Value,
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: number[], item: ipcShema) => list.includes(item.Value)
    },
    {
      name: 'Relacion Inflación',
      sortOrder: null,
      sortFn: (a: ipcShema, b: ipcShema) => a.RelacionInflacion - b.RelacionInflacion,
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: number[], item: ipcShema) => list.includes(item.RelacionInflacion)
    },
  ];

}
