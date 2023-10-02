import { Component, OnInit } from '@angular/core';
import { ColumnItem } from 'src/Core/interfaces/col-meter-table.interface';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { dollarShema } from 'src/Core/interfaces/dollar.interface';
import { NotificationService } from '@shared/services/notification.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-dollar',
  templateUrl: './dollar.component.html',
  styleUrls: ['./dollar.component.css']
})
export class dollarComponent implements OnInit {
  isVisible = false;
  dollarIsDisable: boolean = false;
  listOfData: dollarShema[] = [];
  validateForm!: FormGroup;
  provider!: dollarShema;

  url = {
    get: 'get-dollar',
    post: 'dollar',
    delete: 'dollar',
    update: 'dollar',
  };
  EmptyForm =this.fb.group({
    fechaInicial: ['', [Validators.required]],
    fechaFinal: ['', [Validators.required]],
    Compra: ['', [Validators.required]],
    Venta:['',[Validators.required]],
  })
  constructor(
    private globalService: EndPointGobalService,
    private fb: FormBuilder,
    private nzMessageService: NzMessageService,
    private notificationService: NotificationService,

  ) { }

  ngOnInit(): void {
    this.Getdollar(1, false);
    this.validateForm = this.EmptyForm;
  }



  updateTable(list: dollarShema) {
    this.listOfData = [...this.listOfData, list];
    console.log("Updated listOfData: ", this.listOfData); // Add this line to check the value of listOfData after the update
  }



  Getdollar(estado: number, switched: boolean) {
    if (switched) {
      if ((!this.dollarIsDisable) && estado === 0) {
        console.log("Deshabilitados")
        this.dollarIsDisable = true;
      } else {
        console.log("habilitados")
        this.dollarIsDisable = false;
      }
    }

    this.globalService.GetId(this.url.get, estado).subscribe(
      (result: any) => {
        console.log("API Response: ", result); // Add this line to check the response
        this.listOfData = result;
      }
    );

  }


  disableClient(dollar: dollarShema, estado : number){
    let newEstado = Boolean(estado);
    this.globalService.Patch(this.url.update, dollar.id, {estado: newEstado}).subscribe(
      result => {
        if(!result){
          if(estado === 1){
            this.Getdollar(0, false);
          }else{
            this.Getdollar(1, false);
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
      sortFn: (a: dollarShema, b: dollarShema) => a.fechaInicial.localeCompare(b.fechaInicial),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: string[], item: dollarShema) => list.some(fechaInicial => item.fechaInicial.indexOf(fechaInicial) !== -1)
    },
    {
      name: 'Fecha Final',
      sortOrder: null,
      sortFn: (a: dollarShema, b: dollarShema) => a.fechaFinal.localeCompare(b.fechaFinal),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: string[], item: dollarShema) => list.some(fechaFinal => item.fechaFinal.indexOf(fechaFinal) !== -1)
    },
    {
      name: 'Compra',
      sortOrder: null,
      sortFn: (a: dollarShema, b: dollarShema) => a.Compra - b.Compra,
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: number[], item: dollarShema) => list.includes(item.Compra)
    },
    {
      name: 'Venta',
      sortOrder: null,
      sortFn: (a: dollarShema, b: dollarShema) => a.Venta - b.Venta,
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: number[], item: dollarShema) => list.includes(item.Venta)
    },

  ];

}
