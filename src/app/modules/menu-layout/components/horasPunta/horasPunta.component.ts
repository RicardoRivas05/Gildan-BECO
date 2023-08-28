import { Component, OnInit } from '@angular/core';
import { ColumnItem } from 'src/Core/interfaces/col-meter-table.interface';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { horasPuntaShema } from 'src/Core/interfaces/horasPunta.interface';
import { NotificationService } from '@shared/services/notification.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-horasPunta',
  templateUrl: './horasPunta.component.html',
  styleUrls: ['./horasPunta.component.css']
})
export class horasPuntaComponent implements OnInit {
  isVisible = false;
  horasPuntaIsDisable: boolean = false;
  listOfData: horasPuntaShema[] = [];
  validateForm!: FormGroup;
  provider!: horasPuntaShema;

  url = {
    get: 'get-horasPunta',
    post: 'horasPunta',
    delete: 'horasPunta',
    update: 'horasPunta',
  };
  EmptyForm =this.fb.group({
    fechaInicial: ['', [Validators.required]],
    fechaFinal: ['', [Validators.required]],
    valor: ['', [Validators.required]],
  })
  constructor(
    private globalService: EndPointGobalService,
    private fb: FormBuilder,
    private nzMessageService: NzMessageService,
    private notificationService: NotificationService,

  ) { }

  ngOnInit(): void {
    this.GethorasPunta(1, false);
    this.validateForm = this.EmptyForm;
  }



  updateTable(list: horasPuntaShema) {
    this.listOfData = [...this.listOfData, list];
    console.log("Updated listOfData: ", this.listOfData); // Add this line to check the value of listOfData after the update
  }



  GethorasPunta(Estado: number, switched: boolean) {
    if (switched) {
      if ((!this.horasPuntaIsDisable) && Estado === 0) {
        console.log("Deshabilitados")
        this.horasPuntaIsDisable = true;
      } else {
        console.log("habilitados")
        this.horasPuntaIsDisable = false;
      }
    }

    this.globalService.GetId(this.url.get, Estado).subscribe(
      (result: any) => {
        console.log("API Response: ", result); // Add this line to check the response

        this.listOfData = result;
      }
    );

  }


  disableClient(horasPunta: horasPuntaShema, Estado : number){
    let newEstado = Boolean(Estado);
    this.globalService.Patch(this.url.update, horasPunta.Id, {Estado: newEstado}).subscribe(
      result => {
        if(!result){
          if(Estado === 1){
            this.GethorasPunta(0, false);
          }else{
            this.GethorasPunta(1, false);
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
      sortFn: (a: horasPuntaShema, b: horasPuntaShema) => a.fechaInicial.localeCompare(b.fechaInicial),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: string[], item: horasPuntaShema) => list.some(fechaInicial => item.fechaInicial.indexOf(fechaInicial) !== -1)
    },
    {
      name: 'Fecha Final',
      sortOrder: null,
      sortFn: (a: horasPuntaShema, b: horasPuntaShema) => a.fechaFinal.localeCompare(b.fechaFinal),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: string[], item: horasPuntaShema) => list.some(fechaFinal => item.fechaFinal.indexOf(fechaFinal) !== -1)
    },

    {
      name: 'Valor',
      sortOrder: null,
      sortFn: (a: horasPuntaShema, b: horasPuntaShema) => a.valor - b.valor,
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: number[], item: horasPuntaShema) => list.includes(item.valor)
    }
  ];

}
