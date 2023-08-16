import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { ColumnItem } from 'src/Core/interfaces/col-meter-table.interface';
import { EndPointGobalService } from "@shared/services/end-point-gobal.service";
import { EspecialChargesInterface } from 'src/Core/interfaces/especial-charges.interface';

@Component({
  selector: 'app-especial-charges',
  templateUrl: './especial-charges.component.html',
  styleUrls: ['./especial-charges.component.css']
})
export class EspecialChargesComponent implements OnInit {
  isVisible = false;
  validateForm!: FormGroup;
  listOfData: EspecialChargesInterface[] = [];
  newECharge!: EspecialChargesInterface;
  url = {
    get: 'get-especial-charges',
    post: 'cargos-facturas',
    delete: 'cargos-facturas',
    update: 'cargos-facturas',
  };


  editIsActive!: EspecialChargesInterface | undefined;
  chargeIsDisable: boolean = false;

  EmptyForm = this.fb.group({
    codigo: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    observacion: ['', [Validators.required]],
  })

  constructor(
    private globalService: EndPointGobalService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.GetCharges(1, false);
    this.validateForm = this.EmptyForm;
  }


  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  updateTable(list: EspecialChargesInterface){
    this.listOfData = [... this.listOfData, list]
  }

  GetCharges(estado: number, switched: boolean){
    if(switched){
      if((!this.chargeIsDisable) && estado === 0){
        this.chargeIsDisable = true;
      }else{
        this.chargeIsDisable = false;
      }
    }

    this.globalService.GetId(this.url.get, estado).subscribe(
      (result:any) => {
        this.listOfData = result;
      }
    );
  }


  disableCharge(charge: EspecialChargesInterface, estado : boolean){

    this.globalService.Patch(this.url.update, charge.id, {estado: estado}).subscribe(
      result => {
        if(!result){
          if(estado === true){
            this.GetCharges(0, false);
          }else{
            this.GetCharges(1, false);
          }

        }
      }
    );

  }


  listOfColumns: ColumnItem[] = [
    {
      name: 'Fecha Inicio',
      sortOrder: null,
      sortFn: (a: EspecialChargesInterface, b: EspecialChargesInterface) => a.fechaInicio.localeCompare(b.fechaInicio),
      sortDirections: [ 'ascend','descend', null],
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true
    },
    {
      name: 'Fecha Final',
      sortOrder: null,
      sortFn: (a: EspecialChargesInterface, b: EspecialChargesInterface) => a.fechaFinal.localeCompare(b.fechaFinal),
      sortDirections: [ 'ascend','descend', null],
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true
    },
    {
      name: 'Total Cargos',
      sortOrder: 'descend',
      sortFn: (a: EspecialChargesInterface, b: EspecialChargesInterface) => a.totalCargos - (b.totalCargos),
      sortDirections: [ 'ascend','descend', null],
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true
    },
  ];

}

