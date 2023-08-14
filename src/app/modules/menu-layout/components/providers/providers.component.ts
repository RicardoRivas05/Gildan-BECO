import { Component, Input, OnInit } from '@angular/core';
import { ActorInterface } from "src/Core/interfaces/actors.interface";
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NotificationService } from '@shared/services/notification.service';
import { FilesService } from '@shared/services/files.service';

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.css']
})
export class ProvidersComponent implements OnInit {
  listOfProviders: ActorInterface[] = [];
  
  disableClients: boolean = false;
  previewVisible = false;
  previewImage: string | undefined = '';


  url = {
    get: 'get-providers',
    post: 'actores',
    delete: 'actores',
    update: 'actores',
  };
  constructor(
    private globalService:EndPointGobalService,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private nzMessageService: NzMessageService,
  ) { }
  ngOnInit(): void {
    this.GetProviders(1, false);
  }
  updateTable(list: ActorInterface){
    
    this.listOfProviders.push(list);
  }

  GetProviders(estado: number, switched: boolean){
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
          this.listOfProviders = result;
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
            this.GetProviders(0, false)
          }else{
            this.GetProviders(1, false);
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
