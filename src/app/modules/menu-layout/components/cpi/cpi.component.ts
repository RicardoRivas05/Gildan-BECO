import { Component, OnInit } from '@angular/core';
import { ColumnItem } from 'src/Core/interfaces/col-meter-table.interface';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { cpiShema } from 'src/Core/interfaces/cpi.interface';
import { NotificationService } from '@shared/services/notification.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-cpi',
  templateUrl: './cpi.component.html',
  styleUrls: ['./cpi.component.css']
})
export class cpiComponent implements OnInit {
  isVisible = false;
  CPIIsDisable: boolean = false;
  listOfData: cpiShema[] = [];
  validateForm!: FormGroup;
  provider!: cpiShema;

  url = {
    get: 'get-cpi',
    post: 'cpi',
    delete: 'cpi',
    update: 'cpi',
  };
  EmptyForm =this.fb.group({
    fechaInicial: ['', [Validators.required]],
    fechaFinal: ['', [Validators.required]],
    Value: ['', [Validators.required]],
  })
  constructor(
    private globalService: EndPointGobalService,
    private fb: FormBuilder,
    private nzMessageService: NzMessageService,
    private notificationService: NotificationService,

  ) { }

  ngOnInit(): void {
    this.Getcpi(1, false);
    this.validateForm = this.EmptyForm;
  }



  updateTable(list: cpiShema) {
    this.listOfData = [...this.listOfData, list];
    console.log("Updated listOfData: ", this.listOfData); // Add this line to check the value of listOfData after the update
  }



  Getcpi(estado: number, switched: boolean) {
    if (switched) {
      if ((!this.CPIIsDisable) && estado === 0) {
        console.log("Deshabilitados")
        this.CPIIsDisable = true;
      } else {
        console.log("habilitados")
        this.CPIIsDisable = false;
      }
    }

    this.globalService.GetId(this.url.get, estado).subscribe(
      (result: any) => {
        console.log("API Response: ", result); // Add this line to check the response
        this.listOfData = result;
      }
    );

  }


  disableClient(CPI: cpiShema, estado : number){
    let newEstado = Boolean(estado);
    this.globalService.Patch(this.url.update, CPI.ID, {estado: newEstado}).subscribe(
      result => {
        if(!result){
          if(estado === 1){
            this.Getcpi(0, false);
          }else{
            this.Getcpi(1, false);
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
      sortFn: (a: cpiShema, b: cpiShema) => a.fechaInicial.localeCompare(b.fechaInicial),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: string[], item: cpiShema) => list.some(fechaInicial => item.fechaInicial.indexOf(fechaInicial) !== -1)
    },
    {
      name: 'Fecha Final',
      sortOrder: null,
      sortFn: (a: cpiShema, b: cpiShema) => a.fechaFinal.localeCompare(b.fechaFinal),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: string[], item: cpiShema) => list.some(fechaFinal => item.fechaFinal.indexOf(fechaFinal) !== -1)
    },
    {
      name: 'Valor',
      sortOrder: null,
      sortFn: (a: cpiShema, b: cpiShema) => a.Value - b.Value,
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: number[], item: cpiShema) => list.includes(item.Value)
    }
  ];

}
