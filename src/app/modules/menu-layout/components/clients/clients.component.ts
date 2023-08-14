import { Component, OnInit } from '@angular/core';
import { ActorInterface } from 'src/Core/interfaces/actors.interface';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  listOfClients: ActorInterface[] = [];
  
  disableClients: boolean = false;
  previewVisible = false;
  previewImage: string | undefined = '';
  fileList : any = [];


  url = {
    get: 'get-clients',
    post: 'actores',
    delete: 'actores',
    update: 'actores',
  };
  constructor(
    private globalService:EndPointGobalService,
    private fb: FormBuilder,
    private nzMessageService: NzMessageService,
  ) { }
  ngOnInit(): void {
    this.GetClients(1, false);
  }
  updateTable(list: ActorInterface){
    
    this.listOfClients.push(list);
  }


  GetClients(estado: number, switched: boolean){
    if(switched){
      if((!this.disableClients) && estado === 0){
        this.disableClients = true;
      }else{
        this.disableClients = false;
      }
    }

    this.globalService.GetId(this.url.get, estado).subscribe(
      (result:any) => {
        if(result){
          this.listOfClients = result;
        }
      }
    );
  }
  
  disableProvider(client: ActorInterface, estado : number){
    let newEstado = Boolean(estado);
    this.globalService.Patch(this.url.update, client.id, {estado: newEstado}).subscribe(
      result => {
        
        if(!result){
          if(estado === 1){
            this.GetClients(0, false)
          }else{
            this.GetClients(1, false);
          }

        }
      }
    );
  }
  cancel(): void {
    this.nzMessageService.info('click cancel');
  }

  // handlePreview = async (file: NzUploadFile): Promise<void> => {
  //   if (!file.url && !file.) {
  //     file.preview = await getBase64(file.originFileObj!);
  //   }
  //   this.previewImage = file.url || file.preview;
  //   this.previewVisible = true;
  // };

}
