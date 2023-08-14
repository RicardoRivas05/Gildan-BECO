import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { ColumnItem } from 'src/Core/interfaces/col-meter-table.interface';
import { ContractInterface, ContractSchema } from 'src/Core/interfaces/contracts.interface';
import { EndPointGobalService } from "@shared/services/end-point-gobal.service";
import { ActorInterface } from 'src/Core/interfaces/actors.interface';
import { ZoneShema } from 'src/Core/interfaces/zones.interface';
import { RatesInterface } from 'src/Core/interfaces/Rates.interface';
import { MeterSchema } from 'src/Core/interfaces/meter.interface';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.css']
})
export class ContractsComponent implements OnInit{
  isVisible = false;
  constractsIsDisable: boolean = false;
  IsLoading: boolean = false;
  validateForm!: FormGroup;
  ListOfData: ContractInterface[] = [];
  ListOfClients: ActorInterface[] = [];
  listOfZones: ZoneShema[] = [];
  listOfRates: RatesInterface[] = [];
  listOfMeters: MeterSchema[] = [];
  listOfOption: Array<{ label: string; value: string }> = [];
  listOfTagOptions = [];

  url = {
    get: 'get-contracts',
    getClients: 'get-clients',
    getRates: 'get-pt-detail',
    getMeters: 'medidors',
    getZones: 'zonas',
    getActores: 'actores',
    post: 'contratos',
    delete: 'contratos',
    update: 'contratos',
  };

  constructor(
    private fb: FormBuilder,
    private globalService: EndPointGobalService,
    private nzMessageService: NzMessageService,
  ) { }

  ngOnInit(): void {
    const children: Array<{ label: string; value: string }> = [];
    for (let i = 10; i < 36; i++) {
      children.push({ label: i.toString(36) + i, value: i.toString(36) + i });
    }
    this.listOfOption = children;

    this.GetContracts(1, false);
    this.GetClients();
    this.GetRatess();
    this.GetZoness();
    this.GetMeters();
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
  GetClients(){
    this.globalService.Get(this.url.getActores).subscribe(
      (result: any) => {
        this.ListOfClients = result;
      }
    
    );
  }

  
  GetContracts(estado: number, switched: boolean){
    if(switched){
      if((!this.constractsIsDisable) && estado === 0){
        this.constractsIsDisable = true;
      }else{
        this.constractsIsDisable = false;
      }
    }

    this.globalService.GetId(this.url.get, estado).subscribe(
      (result:any) => {
        this.ListOfData = result;
      }
    );
  }

  
  GetZones(estado: number, switched: boolean){
    if(switched){
      if((!this.constractsIsDisable) && estado === 0){
        this.constractsIsDisable = true;
      }else{
        this.constractsIsDisable = false;
      }
    }

    this.globalService.GetId(this.url.get, estado).subscribe(
      (result:any) => {
        this.ListOfData = result;
      }
    );
  }

  
  GetRates(estado: number, switched: boolean){
    if(switched){
      if((!this.constractsIsDisable) && estado === 0){
        this.constractsIsDisable = true;
      }else{
        this.constractsIsDisable = false;
      }
    }

    this.globalService.GetId(this.url.get, estado).subscribe(
      (result:any) => {
        this.ListOfData = result;
      }
    );
  }
  
  GetRatess(){

    this.globalService.GetId(this.url.getRates, 1).subscribe(
      (result:any) => {
        this.listOfRates = result;
      }
    );
    
  }
  
  
  GetMeters(){

    this.globalService.Get(this.url.getMeters).subscribe(
      (result:any) => {
        for(let i=0; i< result.length; i++){
          if(result[i].estado === true){
            this.listOfMeters = [... this.listOfMeters, result[i]];
          }
        }
      }
    );
  }

  GetZoness(){

    this.globalService.Get(this.url.getZones).subscribe(
      (result:any) => {
        for(let i=0; i< result.length; i++){
          if(result[i].estado === true){
            this.listOfZones = [... this.listOfZones, result[i]];
          }
        }
      }
    );
  }


  disableContract(constract: ContractInterface, estado : number){
    this.IsLoading = true;
    let newEstado = Boolean(estado);
    this.globalService.Patch(this.url.update, constract.id, {estado: newEstado}).subscribe(
      result => {
        if(!result){
          if(estado === 1){
            this.GetContracts(0, false);
          }else{
            this.GetContracts(1, false);
          }

        }
        
      this.IsLoading = false;
      }
    );
  }

  TablaUpdated(list: any){
    this.ListOfData = [...this.ListOfData,list]
  }

  SelectFilterEvent(option: any): void{
    
  }

  cancel(): void {
    this.nzMessageService.info('click cancel');
  }


  
  listOfColumns: ColumnItem[] = [
    {
      name: 'Codigo',
      sortOrder: null,
      sortFn: (a: ContractInterface, b: ContractInterface) => a.codigo.localeCompare(b.codigo),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: string[], item: ContractInterface) => list.some(codigo => item.codigo.indexOf(codigo) !== -1)
    },
    {
      name: 'Descripcion',
      sortOrder: null,
      sortFn: (a: ContractInterface, b: ContractInterface) => a.descripcion.localeCompare(b.descripcion),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: string[], item: ContractInterface) => list.some(codigo => item.descripcion.indexOf(codigo) !== -1)
    },
    {
      name: 'Cliente',
      sortOrder: null,
      sortFn: (a: ContractInterface, b: ContractInterface) => a.nombre.localeCompare(b.nombre),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: string[], item: ContractInterface) => list.some(nombre => item.nombre.indexOf(nombre) !== -1)
    },
    {
      name: 'Creacion',
      sortOrder: null,
      sortFn: (a: ContractInterface, b: ContractInterface) => a.fechaCreacion.localeCompare(b.fechaCreacion),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: string[], item: ContractInterface) => list.some(codigo => item.fechaCreacion.indexOf(codigo) !== -1)
    },
    {
      name: 'Vencimiento',
      sortOrder: null,
      sortFn: (a: ContractInterface, b: ContractInterface) => a.fechaVenc.localeCompare(b.fechaVenc),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: string[], item: ContractInterface) => list.some(codigo => item.fechaVenc.indexOf(codigo) !== -1)
    }
  ];

}
