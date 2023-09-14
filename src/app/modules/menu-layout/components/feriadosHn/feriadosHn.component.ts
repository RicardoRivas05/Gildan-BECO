import { Component, OnInit } from '@angular/core';
import { ColumnItem } from 'src/Core/interfaces/col-meter-table.interface';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { feriadosHnShema } from 'src/Core/interfaces/feriadosHn.interface';
import { NotificationService } from '@shared/services/notification.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-feriadosHn',
  templateUrl: './feriadosHn.component.html',
  styleUrls: ['./feriadosHn.component.css']
})
export class feriadosHnComponent implements OnInit {
  isVisible = false;
  feriadosHnIsDisable: boolean = false;
  listOfData: feriadosHnShema[] = [];
  validateForm!: FormGroup;
  provider!: feriadosHnShema;

  url = {
    get: 'get-feriadosHn',
    post: 'feriadosHn',
    delete: 'feriadosHn',
    update: 'feriadosHn',
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
    this.GetferiadosHn(1, false);
    this.validateForm = this.EmptyForm;
  }



  updateTable(list: feriadosHnShema) {
    this.listOfData = [...this.listOfData, list];
    console.log("Updated listOfData: ", this.listOfData); // Add this line to check the value of listOfData after the update
  }



  GetferiadosHn(estado: number, switched: boolean) {
    if (switched) {
      if ((!this.feriadosHnIsDisable) && estado === 0) {
        console.log("Deshabilitados")
        this.feriadosHnIsDisable = true;
      } else {
        console.log("habilitados")
        this.feriadosHnIsDisable = false;
      }
    }

    this.globalService.GetId(this.url.get, estado).subscribe(
      (result: any) => {
        console.log("API Response: ", result); // Add this line to check the response
        this.listOfData = result;
      }
    );

  }


  disableClient(feriadosHn: feriadosHnShema, estado : number){
    let newEstado = Boolean(estado);
    this.globalService.Patch(this.url.update, feriadosHn.id, {estado: newEstado}).subscribe(
      result => {
        if(!result){
          if(estado === 1){
            this.GetferiadosHn(0, false);
          }else{
            this.GetferiadosHn(1, false);
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
      name: 'Fecha',
      sortOrder: null,
      sortFn: (a: feriadosHnShema, b: feriadosHnShema) => a.fecha.getTime() - b.fecha.getTime(),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: Date[], item: feriadosHnShema) => list.some(date => date.getTime() === item.fecha.getTime()),
    },


    {
      name: 'Descripción',
      sortOrder: null,
      sortFn: (a: feriadosHnShema, b: feriadosHnShema) => a.descripcion.localeCompare(b.descripcion),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: string[], item: feriadosHnShema) => list.some(descripcion => item.descripcion.indexOf(descripcion) !== -1)
    },
  ];

}
