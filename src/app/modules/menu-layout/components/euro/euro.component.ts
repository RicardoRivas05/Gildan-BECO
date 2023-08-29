import { Component, OnInit } from '@angular/core';
import { ColumnItem } from 'src/Core/interfaces/col-meter-table.interface';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { euroShema } from 'src/Core/interfaces/euro.interface';
import { NotificationService } from '@shared/services/notification.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-euro',
  templateUrl: './euro.component.html',
  styleUrls: ['./euro.component.css']
})
export class euroComponent implements OnInit {
  isVisible = false;
  euroIsDisable: boolean = false;
  listOfData: euroShema[] = [];
  validateForm!: FormGroup;
  provider!: euroShema;

  url = {
    get: 'get-euro',
    post: 'euro',
    delete: 'euro',
    update: 'euro',
  };
  EmptyForm =this.fb.group({
    fechaInicial: ['', [Validators.required]],
    fechaFinal: ['', [Validators.required]],
    ValorInicial: ['', [Validators.required]],
    ValorUltimoMes:['',[Validators.required]],
    Valor: ['', [Validators.required]],
    RelacionInflacion:['',[Validators.required]],
  })
  constructor(
    private globalService: EndPointGobalService,
    private fb: FormBuilder,
    private nzMessageService: NzMessageService,
    private notificationService: NotificationService,

  ) { }

  ngOnInit(): void {
    this.Geteuro(1, false);
    this.validateForm = this.EmptyForm;
  }



  updateTable(list: euroShema) {
    this.listOfData = [...this.listOfData, list];
    console.log("Updated listOfData: ", this.listOfData); // Add this line to check the value of listOfData after the update
  }



  Geteuro(estado: number, switched: boolean) {
    if (switched) {
      if ((!this.euroIsDisable) && estado === 0) {
        console.log("Deshabilitados")
        this.euroIsDisable = true;
      } else {
        console.log("habilitados")
        this.euroIsDisable = false;
      }
    }

    this.globalService.GetId(this.url.get, estado).subscribe(
      (result: any) => {
        console.log("API Response: ", result); // Add this line to check the response
        this.listOfData = result;
      }
    );

  }


  disableClient(euro: euroShema, estado : number){
    let newEstado = Boolean(estado);
    this.globalService.Patch(this.url.update, euro.id, {estado: newEstado}).subscribe(
      result => {
        if(!result){
          if(estado === 1){
            this.Geteuro(0, false);
          }else{
            this.Geteuro(1, false);
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
      sortFn: (a: euroShema, b: euroShema) => a.fechaInicial.getTime() - b.fechaInicial.getTime(),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: Date[], item: euroShema) => list.some(date => date.getTime() === item.fechaInicial.getTime()),
    },
    {
      name: 'Fecha Final',
      sortOrder: null,
      sortFn: (a: euroShema, b: euroShema) => a.fechaFinal.getTime() - b.fechaFinal.getTime(),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: Date[], item: euroShema) => list.some(date => date.getTime() === item.fechaFinal.getTime()),
    },
    {
      name: 'Valor Inicial',
      sortOrder: null,
      sortFn: (a: euroShema, b: euroShema) => a.ValorInicial - b.ValorInicial,
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: number[], item: euroShema) => list.includes(item.ValorInicial)
    },
    {
      name: 'Valor Último Mes',
      sortOrder: null,
      sortFn: (a: euroShema, b: euroShema) => a.ValorUltimoMes - b.ValorUltimoMes,
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: number[], item: euroShema) => list.includes(item.ValorUltimoMes)
    },
    {
      name: 'Valor Actual',
      sortOrder: null,
      sortFn: (a: euroShema, b: euroShema) => a.Valor - b.Valor,
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: number[], item: euroShema) => list.includes(item.Valor)
    },
    {
      name: 'Relacion Inflacion',
      sortOrder: null,
      sortFn: (a: euroShema, b: euroShema) => a.RelacionInflacion - b.RelacionInflacion,
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: number[], item: euroShema) => list.includes(item.RelacionInflacion)
    },

  ];

}
