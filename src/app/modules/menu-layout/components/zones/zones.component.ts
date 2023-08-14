import { Component, OnInit } from '@angular/core';
import { ColumnItem } from 'src/Core/interfaces/col-meter-table.interface';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { ZoneShema } from 'src/Core/interfaces/zones.interface';
import { NotificationService } from '@shared/services/notification.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-zones',
  templateUrl: './zones.component.html',
  styleUrls: ['./zones.component.css']
})
export class ZonesComponent implements OnInit {
  isVisible = false;
  zonaIsDisable: boolean = false;
  listOfData: ZoneShema[] = [];
  validateForm!: FormGroup;
  provider!: ZoneShema;
  
  url = {
    get: 'get-zones',
    post: 'zonas',
    delete: 'zonas',
    update: 'zonas',
  };
  EmptyForm =this.fb.group({
    codigo: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    observacion: ['', [Validators.required]],
  })
  constructor(
    private globalService: EndPointGobalService,
    private fb: FormBuilder,
    private nzMessageService: NzMessageService,
    private notificationService: NotificationService,

  ) { }

  ngOnInit(): void {
    this.GetZones(1, false);
    this.validateForm = this.EmptyForm;
  }
  

  updateTable(list: ZoneShema){
    this.listOfData = [... this.listOfData, list];
  }


  GetZones(estado: number, switched: boolean){
    if(switched){
      if((!this.zonaIsDisable) && estado === 0){
        this.zonaIsDisable = true;
      }else{
        this.zonaIsDisable = false;
      }
    }

    this.globalService.GetId(this.url.get, estado).subscribe(
      (result:any) => {
        this.listOfData = result;
      }
    );
  }
  
  disableClient(zone: ZoneShema, estado : number){
    let newEstado = Boolean(estado);
    this.globalService.Patch(this.url.update, zone.id, {estado: newEstado}).subscribe(
      result => {
        if(!result){
          if(estado === 1){
            this.GetZones(0, false);
          }else{
            this.GetZones(1, false);
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
      name: 'Codigo',
      sortOrder: null,
      sortFn: (a: ZoneShema, b: ZoneShema) => a.codigo.localeCompare(b.codigo),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: string[], item: ZoneShema) => list.some(codigo => item.codigo.indexOf(codigo) !== -1)
    },
    {
      name: 'Descripcion',
      sortOrder: null,
      sortFn: (a: ZoneShema, b: ZoneShema) => a.descripcion.localeCompare(b.descripcion),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: string[], item: ZoneShema) => list.some(codigo => item.descripcion.indexOf(codigo) !== -1)
    },
    {
      name: 'Observacion',
      sortOrder: null,
      sortFn: (a: ZoneShema, b: ZoneShema) => a.observacion.localeCompare(b.observacion),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: string[], item: ZoneShema) => list.some(codigo => item.observacion.indexOf(codigo) !== -1)
    }
  ];

}
