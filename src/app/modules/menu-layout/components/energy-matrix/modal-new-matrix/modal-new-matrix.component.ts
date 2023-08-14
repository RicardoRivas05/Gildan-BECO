import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { ColumnItem } from 'src/Core/interfaces/col-meter-table.interface';
import { ContractInterface } from 'src/Core/interfaces/contracts.interface';



@Component({
  selector: 'app-modal-new-matrix',
  templateUrl: './modal-new-matrix.component.html',
  styleUrls: ['./modal-new-matrix.component.css']
})
export class ModalNewMatrixComponent implements OnInit {
  isVisible = false;
  validateForm!: FormGroup;
  listOfData: any[] = [];
  url = {
    get: 'get-zones',
    post: 'zonas',
    delete: 'zonas',
    update: '',
  };

  constructor(
    private globalService: EndPointGobalService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.GetRates();
    
    this.validateForm = this.fb.group({
      codigo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      observacion: ['', [Validators.required]],
    })
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
  GetRates(){
    this.globalService.Get(this.url.get).subscribe( 
      (result:any) => {
        result.Id = Number(result.Id);
        this.listOfData = result;
      }
    );
  }
  Post(): void{
    if (this.validateForm.valid) {
      const provider = {
        codigo: this.validateForm.value.codigo,
        descripcion: this.validateForm.value.descripcion,
        observacion: this.validateForm.value.observacion,
      }
      this.isVisible = false;
      this.globalService.Post(this.url.post, provider).subscribe(
        (result:any) => {
          if(result){
            this.GetRates();
            
          }
          
        }
      );
      
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }

  }
  DeleteRate(Id: any){
    Id = Number(Id);
    this.globalService.Delete(this.url.delete, Id).subscribe(
      result => {
        this.GetRates();
      }
    );
  }
}