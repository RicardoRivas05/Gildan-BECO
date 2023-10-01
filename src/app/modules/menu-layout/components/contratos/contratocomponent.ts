import { Component, OnInit } from '@angular/core';
import { ColumnItem } from 'src/Core/interfaces/col-meter-table.interface';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { variablesContratoShema } from 'src/Core/interfaces/variablesContrato.interface';
import { NotificationService } from '@shared/services/notification.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-variablesContrato',
  templateUrl: './contrato.component.html',
  styleUrls: ['./contrato.component.css']
})
export class variablesContratoComponent implements OnInit {
  isVisible = false;
  variablesContratoIsDisable: boolean = false;
  listOfData: variablesContratoShema[] = [];
  validateForm!: FormGroup;
  provider!: variablesContratoShema;

  url = {
    get: 'get-variablesContratos',
    post: 'variablesContratos',
    delete: 'variablesContratos',
    update: 'variablesContratos',
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
    this.GetvariablesContrato(1, false);
    this.validateForm = this.EmptyForm;
  }



  updateTable(list: variablesContratoShema) {
    this.listOfData = [...this.listOfData, list];
    console.log("Updated listOfData: ", this.listOfData); // Add this line to check the value of listOfData after the update
  }



  GetvariablesContrato(Estado: number, switched: boolean) {
    if (switched) {
      if ((!this.variablesContratoIsDisable) && Estado === 0) {
        console.log("Deshabilitados")
        this.variablesContratoIsDisable = true;
      } else {
        console.log("habilitados")
        this.variablesContratoIsDisable = false;
      }
    }

    this.globalService.GetId(this.url.get, Estado).subscribe(
      (result: any) => {
        console.log("API Response: ", result); // Add this line to check the response

        this.listOfData = result;
      }
    );

  }


  disableClient(variablesContrato: variablesContratoShema, Estado : number){
    let newEstado = Boolean(Estado);
    this.globalService.Patch(this.url.update, variablesContrato.id, {Estado: newEstado}).subscribe(
      result => {
        if(!result){
          if(Estado === 1){
            this.GetvariablesContrato(0, false);
          }else{
            this.GetvariablesContrato(1, false);
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
      sortFn: (a: variablesContratoShema, b: variablesContratoShema) => a.fechaInicial.localeCompare(b.fechaInicial),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: string[], item: variablesContratoShema) => list.some(fechaInicial => item.fechaInicial.indexOf(fechaInicial) !== -1)
    },
    {
      name: 'Fecha Final',
      sortOrder: null,
      sortFn: (a: variablesContratoShema, b: variablesContratoShema) => a.fechaFinal.localeCompare(b.fechaFinal),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: string[], item: variablesContratoShema) => list.some(fechaFinal => item.fechaFinal.indexOf(fechaFinal) !== -1)
    },

    {
      name: 'Nombre Contrato',
      sortOrder: null,
      sortFn: (a: variablesContratoShema, b: variablesContratoShema) => a.nombreContrato.localeCompare(b.nombreContrato),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: string[], item: variablesContratoShema) => list.includes(item.nombreContrato)

    },

    {
      name: 'CPCF',
      sortOrder: null,
      sortFn: (a: variablesContratoShema, b: variablesContratoShema) => a.cpcf - b.cpcf,
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: number[], item: variablesContratoShema) => list.includes(item.cpcf)
    },
    {
      name: 'CFC',
      sortOrder: null,
      sortFn: (a: variablesContratoShema, b: variablesContratoShema) => a.cfc- b.cfc,
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: number[], item: variablesContratoShema) => list.includes(item.cfc)
    },

    {
      name: 'FDR %',
      sortOrder: null,
      sortFn: (a: variablesContratoShema, b: variablesContratoShema) => a.fdr- b.fdr,
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: number[], item: variablesContratoShema) => list.includes(item.fdr)
    },
    {
      name: 'COMD',
      sortOrder: null,
      sortFn: (a: variablesContratoShema, b: variablesContratoShema) => a.cpomD- b.cpomD,
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: number[], item: variablesContratoShema) => list.includes(item.cpomD)
    },
    {
      name: 'COML',
      sortOrder: null,
      sortFn: (a: variablesContratoShema, b: variablesContratoShema) => a.cpomL- b.cpomL,
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: number[], item: variablesContratoShema) => list.includes(item.cpomL)
    },

    {
      name: 'CVCi',
      sortOrder: null,
      sortFn: (a: variablesContratoShema, b: variablesContratoShema) => a.cvci- b.cvci,
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: number[], item: variablesContratoShema) => list.includes(item.cvci)
    },

    {
      name: 'CVO&M1',
      sortOrder: null,
      sortFn: (a: variablesContratoShema, b: variablesContratoShema) => a.cvco1- b.cvco1,
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: number[], item: variablesContratoShema) => list.includes(item.cvco1)
    },
    {
      name: 'CVO&M2',
      sortOrder: null,
      sortFn: (a: variablesContratoShema, b: variablesContratoShema) => a.cvco2- b.cvco2,
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: number[], item: variablesContratoShema) => list.includes(item.cvco2)
    },

    {
      name: 'Otros Cargos',
      sortOrder: null,
      sortFn: (a: variablesContratoShema, b: variablesContratoShema) => a.otrosCargos- b.otrosCargos,
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: number[], item: variablesContratoShema) => list.includes(item.otrosCargos)
    },

  ];

}
