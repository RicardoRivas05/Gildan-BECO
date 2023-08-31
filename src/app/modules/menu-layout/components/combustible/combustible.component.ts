import { Component, OnInit } from '@angular/core';
import { ColumnItem } from 'src/Core/interfaces/col-meter-table.interface';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { combustibleShema } from 'src/Core/interfaces/combustible.interface';
import { NotificationService } from '@shared/services/notification.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-combustible',
  templateUrl: './combustible.component.html',
  styleUrls: ['./combustible.component.css']
})
export class combustibleComponent implements OnInit {
  isVisible = false;
  combustibleIsDisable: boolean = false;
  listOfData: combustibleShema[] = [];
  validateForm!: FormGroup;
  provider!: combustibleShema;
  promedio : number;


  url = {
    get: 'get-combustible',
    post: 'combustible',
    delete: 'combustible',
    update: 'combustible',
  };
  EmptyForm =this.fb.group({
    fechaInicial: ['', [Validators.required]],
    fechaFinal: ['', [Validators.required]],
    precioBase: ['', [Validators.required]],
    precioBajo: ['', [Validators.required]],
    precioAlto:['',[Validators.required]],
  })
  constructor(
    private globalService: EndPointGobalService,
    private fb: FormBuilder,
    private nzMessageService: NzMessageService,
    private notificationService: NotificationService,

  ) { this.promedio =0; }

  ngOnInit(): void {
    this.Getcombustible(1, false);
    this.validateForm = this.EmptyForm;
  }

  updateTable(list: combustibleShema) {
    this.listOfData = [...this.listOfData, list];
    console.log("Updated listOfData: ", this.listOfData); // Add this line to check the value of listOfData after the update
  }


  Getcombustible(estado: number, switched: boolean) {
    if (switched) {
      if ((!this.combustibleIsDisable) && estado === 0) {
        console.log("Deshabilitados")
        this.combustibleIsDisable = true;
      } else {
        console.log("habilitados")
        this.combustibleIsDisable = false;
      }
    }

    this.globalService.GetId(this.url.get, estado).subscribe(
      (result: any) => {
        console.log("API Response: ", result); // Add this line to check the response
        this.listOfData = result;
      }
    );

  }


  disableClient(combustible: combustibleShema, estado : number){
    let newEstado = Boolean(estado);
    this.globalService.Patch(this.url.update, combustible.id, {estado: newEstado}).subscribe(
      result => {
        if(!result){
          if(estado === 1){
            this.Getcombustible(0, false);
          }else{
            this.Getcombustible(1, false);
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
      sortFn: (a: combustibleShema, b: combustibleShema) => a.fechaInicial.getTime() - b.fechaInicial.getTime(),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: Date[], item: combustibleShema) => list.some(date => date.getTime() === item.fechaInicial.getTime()),
    },
    {
      name: 'Fecha Final',
      sortOrder: null,
      sortFn: (a: combustibleShema, b: combustibleShema) => a.fechaFinal.getTime() - b.fechaFinal.getTime(),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: Date[], item: combustibleShema) => list.some(date => date.getTime() === item.fechaFinal.getTime()),
    },
    {
      name: 'Precio Base',
      sortOrder: null,
      sortFn: (a: combustibleShema, b: combustibleShema) => a.precioBase- b.precioBase,
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: number[], item: combustibleShema) => list.includes(item.precioBase)
    },
    {
      name: 'Precio Bajo',
      sortOrder: null,
      sortFn: (a: combustibleShema, b: combustibleShema) => a.precioBajo - b.precioBajo,
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: number[], item: combustibleShema) => list.includes(item.precioBajo)
    },
    {
      name: 'Precio Alto',
      sortOrder: null,
      sortFn: (a: combustibleShema, b: combustibleShema) => a.precioAlto - b.precioAlto,
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: number[], item: combustibleShema) => list.includes(item.precioAlto)
    },

    {
      name: 'Promedio',
      sortOrder: null,
      sortFn: (a: combustibleShema, b: combustibleShema) => a.promedio - b.promedio,
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: number[], item: combustibleShema) => list.includes(item.promedio)
    },

  ];

}
