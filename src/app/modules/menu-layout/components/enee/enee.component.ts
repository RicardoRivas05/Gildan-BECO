import { Component, OnInit } from '@angular/core';
import { ColumnItem } from 'src/Core/interfaces/col-meter-table.interface';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { eneeShema } from 'src/Core/interfaces/enee.interface';
import { NotificationService } from '@shared/services/notification.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-enee',
  templateUrl: './enee.component.html',
  styleUrls: ['./enee.component.css']
})
export class eneeComponent implements OnInit {
  isVisible = false;
  eneeIsDisable: boolean = false;
  listOfData: eneeShema[] = [];
  validateForm!: FormGroup;
  provider!: eneeShema;

  url = {
    get: 'get-lecturasEnee',
    post: 'lecturasEnee',
    delete: 'lecturasEnee',
    update: 'lecturasEnee',
  };
  EmptyForm =this.fb.group({
    fechaInicial: ['', [Validators.required]],
    fechaFinal: ['', [Validators.required]],
    punta: ['', [Validators.required]],
    resto:['',[Validators.required]],
    tipoMedidor: ['', [Validators.required]],
  })
  constructor(
    private globalService: EndPointGobalService,
    private fb: FormBuilder,
    private nzMessageService: NzMessageService,
    private notificationService: NotificationService,

  ) { }

  ngOnInit(): void {
    this.Getenee(1, false);
    this.validateForm = this.EmptyForm;
  }



  updateTable(list: eneeShema) {
    this.listOfData = [...this.listOfData, list];
    console.log("Updated listOfData: ", this.listOfData); // Add this line to check the value of listOfData after the update
  }



  Getenee(estado: number, switched: boolean) {
    if (switched) {
      if ((!this.eneeIsDisable) && estado === 0) {
        console.log("Deshabilitados")
        this.eneeIsDisable = true;
      } else {
        console.log("habilitados")
        this.eneeIsDisable = false;
      }
    }

    this.globalService.GetId(this.url.get, estado).subscribe(
      (result: any) => {
        console.log("API Response: ", result); // Add this line to check the response
        this.listOfData = result;
      }
    );

  }


  disableClient(enee: eneeShema, estado : number){
    let newEstado = Boolean(estado);
    this.globalService.Patch(this.url.update, enee.id, {estado: newEstado}).subscribe(
      result => {
        if(!result){
          if(estado === 1){
            this.Getenee(0, false);
          }else{
            this.Getenee(1, false);
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
      sortFn: (a: eneeShema, b: eneeShema) => a.fechaInicial.localeCompare(b.fechaInicial),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: string[], item: eneeShema) => list.some(fechaInicial => item.fechaInicial.indexOf(fechaInicial) !== -1)
    },
    {
      name: 'Fecha Final',
      sortOrder: null,
      sortFn: (a: eneeShema, b: eneeShema) => a.fechaFinal.localeCompare(b.fechaFinal),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: string[], item: eneeShema) => list.some(fechaFinal => item.fechaFinal.indexOf(fechaFinal) !== -1)
    },
    {
      name: 'Punta Inicial',
      sortOrder: null,
      sortFn: (a: eneeShema, b: eneeShema) => a.puntaInicial- b.puntaInicial,
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: number[], item: eneeShema) => list.includes(item.puntaInicial)
    },
    {
      name: 'Punta Final',
      sortOrder: null,
      sortFn: (a: eneeShema, b: eneeShema) => a.puntaFinal- b.puntaFinal,
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: number[], item: eneeShema) => list.includes(item.puntaFinal)
    },
    {
      name: 'Resto Inicial',
      sortOrder: null,
      sortFn: (a: eneeShema, b: eneeShema) => a.restoInicial - b.restoInicial,
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: number[], item: eneeShema) => list.includes(item.restoInicial)
    },
    {
      name: 'Resto Final',
      sortOrder: null,
      sortFn: (a: eneeShema, b: eneeShema) => a.restoFinal - b.restoFinal,
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: number[], item: eneeShema) => list.includes(item.restoFinal)
    },
    {
      name: 'Medidor',
      sortOrder: null,
      sortFn: (a: eneeShema, b: eneeShema) => a.tipoMedidor - b.tipoMedidor,
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: number[], item: eneeShema) => list.includes(item.tipoMedidor)
    },


  ];

}
