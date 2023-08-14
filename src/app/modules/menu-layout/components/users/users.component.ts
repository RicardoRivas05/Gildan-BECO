import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { NotificationService } from '@shared/services/notification.service';
import { NzPlacementType } from 'ng-zorro-antd/dropdown';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ColumnItem } from 'src/Core/interfaces/col-meter-table.interface';
import { roleShema, userSchema } from 'src/Core/interfaces/user.interface';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnChanges {
  listOfPosition: NzPlacementType[] = ['bottomLeft', 'bottomCenter', 'bottomRight', 'topLeft', 'topCenter', 'topRight'];
  isVisible = false;
  IsDisable: boolean = false;
  listOfData: userSchema[] = [];
  listOfDataAux: userSchema[] = [];
  listOfRoles: roleShema[] = [];
  dataPosition!: userSchema;
  validateForm!: FormGroup;
  provider!: userSchema;
  
  url = {
    get: 'usuarios',
    post: 'usuarios',
    delete: 'usuarios',
    update: 'usuarios',
  };
  EmptyForm = this.fb.group({
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
    this.getUsers();
    this.filterUsers(true, false);
    this.getRoles();
    this.validateForm = this.EmptyForm; 
  }
  
  ngOnChanges(changes: SimpleChanges): void {
      this.listOfData = [ ... this.listOfData ]
    
    
  }
  updateTable(list: userSchema){
    this.listOfData = [... this.listOfData, list];
  }

  getUsers(){
    this.globalService.Get(this.url.get).subscribe(
      (result:any) => {
        if(result){
          this.listOfDataAux = result;
          this.filterUsers(!this.IsDisable, false);
          
        }
      }
    );

  }

  getRoles(){
    this.globalService.Get('roles').subscribe(
      (result:any) => {
        if(result){
          this.listOfRoles = result;
        }
      }
    );
  }


  filterUsers(estado: boolean, switched: boolean){
    if(switched){
      if((!this.IsDisable) && estado === false){
        this.IsDisable = true;
      }else{
        this.IsDisable = false;
      }
    }

    this.listOfData.length = 0;
    for(let i = 0; i < this.listOfDataAux.length; i++){
      if(this.listOfDataAux[i].estado === estado){
        this.listOfData = [... this.listOfData, this.listOfDataAux[i]];
      }
    }
    this.listOfData = [... this.listOfData];  
  }
  
  disableClient(user: userSchema, estado : boolean){
    this.globalService.Patch(this.url.update, user.id, {estado: estado}).subscribe(
      result => {
        if(!result){
          for(let i = 0; i < this.listOfDataAux.length; i++){
            if(this.listOfDataAux[i].id == user.id){
              this.listOfDataAux[i].estado = !user.estado;
            }
          }
          if(estado === true){
            this.filterUsers(false, false);
          }else{
            this.filterUsers(true, false);
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
      name: 'Propietario',
      sortOrder: null,
      sortFn: (a: userSchema, b: userSchema) => a.nombre.localeCompare(b.nombre),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: string[], item: userSchema) => list.some(codigo => item.nombre.indexOf(codigo) !== -1)
    },
    {
      name: 'Correo',
      sortOrder: null,
      sortFn: (a: userSchema, b: userSchema) => a.correo.localeCompare(b.correo),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: string[], item: userSchema) => list.some(codigo => item.correo.indexOf(codigo) !== -1)
    },
    {
      name: 'Clasificación',
      sortOrder: null,
      sortFn: (a: userSchema, b: userSchema) => a.rolid - (b.rolid),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: null
    },
  ];

}