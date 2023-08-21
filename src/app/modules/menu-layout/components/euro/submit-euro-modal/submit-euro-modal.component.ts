import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { NotificationService } from '@shared/services/notification.service';
import { euroShema } from 'src/Core/interfaces/euro.interface';


@Component({
  selector: 'app-submit-euro-modal',
  templateUrl: './submit-euro-modal.component.html',
  styleUrls: ['./submit-euro-modal.component.css']
})
export class SubmiteuroModalComponent implements OnInit {
  @Output() DataUpdated: EventEmitter<euroShema> = new EventEmitter<euroShema>();
  @Input() dataPosition!: euroShema;
  @Input() disabled: boolean = false;

  isVisible = false;
  euroIsDisable: boolean = false;
  listOfData: euroShema[] = [];
  validateForm!: FormGroup;
  neweuro!: euroShema;
  Fecha: Date = new Date();

  url = {
    get: 'get-euro',
    post: 'euro',
    delete: 'euro',
    update: 'euro',
  };
  EmptyForm = this.fb.group({
    Fecha: [null, [Validators.required]],
    Valor: ['', [Validators.required]],

  });

  constructor(
    private globalService: EndPointGobalService,
    private fb: FormBuilder,
    private notificationService: NotificationService,

  ) {}

  ngOnInit(): void {this.validateForm = this.fb.group({
    Fecha: ['', [Validators.required]],
    Valor: ['', [Validators.required, Validators.pattern(/^\d+$/)]],

  });}

  submitForm(): void {
    if (!this.dataPosition) {

      this.submitPostForm();
    } else {

      this.submitUpdateForm();
    }
  }

  submitPostForm() {
    if (this.validateForm.valid) {
      this.neweuro = {
        ...this.validateForm.value,
        estado: true
      };
      this.isVisible = false;
      this.globalService.Post(this.url.post, this.neweuro).subscribe(
        (result: any) => {
          console.log("----------", result);
          if (result) {
            this.DataUpdated.emit(result);
            this.notificationService.createMessage(
              'success',
              'La acción se ejecutó con éxito 😎'
            );
          } else {
            this.notificationService.createMessage(
              'error',
              'La acción falló 😓'
            );
          }
        }
      );
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  submitUpdateForm() {
    if (this.validateForm.valid) {
      this.neweuro = {
        ...this.validateForm.value,
        estado: true
      };
      this.isVisible = false;
      this.globalService
        .Patch(this.url.post, this.dataPosition.id, this.neweuro)
        .subscribe(
          (result: any) => {
            if (!result){
            this.dataPosition.Fecha = this.neweuro.Fecha;
            this.dataPosition.Valor = this.neweuro.Valor;

            this.notificationService.createMessage(
              'success',
              'La acción se ejecutó con éxito 😎'
            );
          } else {
            this.notificationService.createMessage(
              'error',
              'La acción falló 😓'
            );
          }
        }
      );
  } else {
    Object.values(this.validateForm.controls).forEach((control) => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
  }
  }

  editableFrom(data: euroShema): void{
    //console.log(data);
    this.validateForm = this.fb.group({
      Fecha: [data.Fecha, [Validators.required]],
      Valor: [data.Valor, [Validators.required]],
    })
    console.log(this.validateForm.value);
  }

  fullSchema(){
    this.neweuro = {
      ... this.validateForm.value,
      estado: true
    }
  }

  updateMainTable(): void{
    this.dataPosition = {
      id: this.dataPosition.id,
      ... this.validateForm.value,
      estado: this.dataPosition.estado
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
      Fecha: ['', [Validators.required]],
      Valor: ['', [Validators.required]],
    })
  }
}
