import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { ColumnItem } from 'src/Core/interfaces/col-meter-table.interface';
import { InputParamSchema } from 'src/Core/interfaces/input-parameters.interface';
import { EndPointGobalService } from "@shared/services/end-point-gobal.service";
import { ChargesInterface } from 'src/Core/interfaces/charges.interface';

@Component({
  selector: 'app-input-parameters',
  templateUrl: './input-parameters.component.html',
  styleUrls: ['./input-parameters.component.css']
})
export class InputParametersComponent implements OnInit {
  isVisible = false;
  validateForm!: FormGroup;
  listOfData: InputParamSchema[] = [];
  dataPosition: any[] = [];
  ListOfCharges: ChargesInterface[] = [];
  paramIsDisable: boolean = false;

  url = {
    get: 'get-allparameters',
    getcargo: 'tipo-cargos',
    post: 'parametro-tarifas',
    delete: 'parametro-tarifas',
    update: 'parametro-tarifas',
  };

  constructor(
    private globalService: EndPointGobalService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.GetParams(1, false);
    this.GetCargos();
  }


  updateTable(list: InputParamSchema){
    this.listOfData = [...this.listOfData,list]
  }

  

  GetParams(estado: number, switched: boolean){
    if(switched){
      if((!this.paramIsDisable) && estado === 0){
        this.paramIsDisable = true;
      }else{
        this.paramIsDisable = false;
      }
    }

    this.globalService.GetId(this.url.get, estado).subscribe(
      (result:any) => {
        this.listOfData = result;
      }
    );
  }

  GetCargos(){
    this.globalService.Get(this.url.getcargo).subscribe(
      (result: any) => {
        this.ListOfCharges = result;
        
      }
    );
  }


  disableParam(param: InputParamSchema, estado : number){
    let newEstado = Boolean(estado);
    this.globalService.Patch(this.url.update, param.id, {estado: newEstado}).subscribe(
      result => {
        if(!result){
          if(estado === 1){
            this.GetParams(0, false);
          }else{
            this.GetParams(1, false);
          }

        }
      }
    );
  }
  



  
  listOfColumns: ColumnItem[] = [
    {
      name: 'Fecha Inicio',
      sortOrder: 'descend',
      sortFn: (a: InputParamSchema, b: InputParamSchema) => a.fechaInicio.localeCompare(b.fechaInicio),
      sortDirections: ['descend', null],
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true
    },
    {
      name: 'Fecha Final',
      sortOrder: 'descend',
      sortFn: (a: InputParamSchema, b: InputParamSchema) => a.fechaFinal.localeCompare(b.fechaFinal),
      sortDirections: ['descend', null],
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true
    },
    {
      name: 'Observacion',
      sortOrder: 'descend',
      sortFn: (a: InputParamSchema, b: InputParamSchema) => a.fechaFinal.localeCompare(b.fechaFinal),
      sortDirections: ['descend', null],
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true
    },
    {
      name: 'Valor',
      sortOrder: 'descend',
      sortFn: (a: InputParamSchema, b: InputParamSchema) => a.valor - b.valor,
      sortDirections: ['descend', null],
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true
    },
  ];

}
