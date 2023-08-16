import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { NotificationService } from '@shared/services/notification.service';
import { cpiShema } from 'src/Core/interfaces/cpi.interface';

@Component({
  selector: 'app-submit-CPI-modal',
  templateUrl: './submit-CPI-modal.component.html',
  styleUrls: ['./submit-CPI-modal.component.css']
})
export class SubmitcpiModalComponent implements OnInit {
  @Output() DataUpdated : EventEmitter<cpiShema> = new EventEmitter<cpiShema>();
  @Input() dataPosition!: cpiShema;

  isVisible = false;
  CPIIsDisable: boolean = false;
  listOfData: cpiShema[] = [];
  validateForm!: FormGroup;
  newcpi!: cpiShema;

  url = {
    get: 'get-cpi',
    post: 'cpi',
    delete: 'cpi',
    update: 'cpi',
  };
  EmptyForm = this.fb.group({
    month: ['', [Validators.required]],
    year: ['', [Validators.required]],
    value: ['', [Validators.required]],
  })

  constructor(
    private globalService: EndPointGobalService,
    private fb: FormBuilder,
    private notificationService: NotificationService
    ) { }

  ngOnInit(): void {
  }

  submitForm(): void{
    if(!this.dataPosition){
      this.submitPostForm();
    }else{
      this.submitUpdateForm();
    }
  }

  submitPostForm(){
    if (this.validateForm.valid) {
      this.newcpi = {
        ... this.validateForm.value,
        estado: true
      }
      //console.log(this.newcpi);
      this.isVisible = false;
      this.globalService.Post(this.url.post, this.newcpi).subscribe(
        (result:any) => {
          if(result){
            this.DataUpdated.emit(result);

            this.notificationService.createMessage('success', 'La acción se ejecuto con exito 😎');
          }else{
            this.notificationService.createMessage('error', 'La accion fallo 😓');
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

  submitUpdateForm(){
    if (this.validateForm.valid) {
      this.newcpi = {
        ... this.validateForm.value,
        estado: true
      }
      //console.log(this.newcpi);
      this.isVisible = false;
      this.globalService.Patch(this.url.post, this.dataPosition.id, this.newcpi).subscribe(
        (result:any) => {
          if(!result){
            this.dataPosition.month = this.newcpi.month;
            this.dataPosition.year = this.newcpi.year;
            this.dataPosition.value = this.newcpi.value;

            this.notificationService.createMessage('success', 'La acción se ejecuto con exito 😎');
          }else{
            this.notificationService.createMessage('error', 'La accion fallo 😓');
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

  editableFrom(data: cpiShema): void{
    //console.log(data);
    this.validateForm = this.fb.group({
      month: [data.month, [Validators.required]],
      year: [data.year, [Validators.required]],
      value: [data.value, [Validators.required]],
    })

    //console.log(this.validateForm.value);

  }

  fullSchema(){

    this.newcpi = {
      ... this.validateForm.value,
      estado: true
    }
  }

  updateMainTable(): void{
    this.dataPosition = {
      id: this.dataPosition.id,
      ... this.validateForm.value
    }
  }


  showModal(): void {
    this.isVisible = true;
    if(!this.dataPosition){
      this.CleanForm();

    }else{
      this.editableFrom(this.dataPosition);
    }
  }

  handleOk(): void {
    //console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    //console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  CleanForm(){
    this.validateForm = this.fb.group({
      month: ['', [Validators.required]],
      year: ['', [Validators.required]],
      value: ['', [Validators.required]],
    })
  }



}
