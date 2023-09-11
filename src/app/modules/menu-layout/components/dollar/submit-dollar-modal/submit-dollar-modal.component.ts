import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { NotificationService } from '@shared/services/notification.service';
import { dollarShema } from 'src/Core/interfaces/dollar.interface';


@Component({
  selector: 'app-submit-dollar-modal',
  templateUrl: './submit-dollar-modal.component.html',
  styleUrls: ['./submit-dollar-modal.component.css']
})
export class SubmitdollarModalComponent implements OnInit {
  @Output() DataUpdated: EventEmitter<dollarShema> = new EventEmitter<dollarShema>();
  @Input() dataPosition!: dollarShema;
  @Input() disabled: boolean = false;

  isVisible = false;
  dollarIsDisable: boolean = false;
  listOfData: dollarShema[] = [];
  validateForm!: FormGroup;
  newdollar!: dollarShema;
  fechaInicial: Date = new Date();
  fechaFinal: Date = new Date();

  url = {
    get: 'get-dollar',
    post: 'dollar',
    delete: 'dollar',
    update: 'dollar',
  };
  EmptyForm = this.fb.group({
    fechaInicial: ['', [Validators.required]],
    fechaFinal: ['', [Validators.required]],
    Compra: ['', [Validators.required]],
    Venta:['',[Validators.required]],
  });

  constructor(
    private globalService: EndPointGobalService,
    private fb: FormBuilder,
    private notificationService: NotificationService,

  ) {}

  ngOnInit(): void {this.validateForm = this.fb.group({
    fechaInicial: ['', [Validators.required]],
    fechaFinal: ['', [Validators.required]],
    Compra: ['', [Validators.required]],
    Venta:['',[Validators.required]],

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
      this.newdollar = {
        ...this.validateForm.value,
        estado: true
      };
      this.isVisible = false;
      this.globalService.Post(this.url.post, this.newdollar).subscribe(
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
      this.newdollar = {
        ...this.validateForm.value,
        estado: true
      };
      this.isVisible = false;
      this.globalService
        .Patch(this.url.post, this.dataPosition.id, this.newdollar)
        .subscribe(
          (result: any) => {
            if (!result){
            this.dataPosition.fechaInicial = this.newdollar.fechaInicial;
            this.dataPosition.fechaInicial = this.newdollar.fechaFinal;
            this.dataPosition.Compra = this.newdollar.Compra;
            this.dataPosition.Venta = this.newdollar.Venta;
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

  editableFrom(data: dollarShema): void{
    //console.log(data);
    this.validateForm = this.fb.group({
      fechaInicial: [data.fechaInicial, [Validators.required]],
      fechaFinal: [data.fechaFinal, [Validators.required]],
      Compra:[data.Compra.toString(),[Validators.required]],
      Venta:[data.Venta.toString(),[Validators.required]],
    })
    console.log(this.validateForm.value);
  }

  fullSchema(){
    this.newdollar = {
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
      fechaInicial: ['', [Validators.required]],
      fechaFinal: ['', [Validators.required]],
      Compra: ['', [Validators.required]],
      Venta:['',[Validators.required]],
    })
  }
}
