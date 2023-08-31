import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { NotificationService } from '@shared/services/notification.service';
import { combustibleShema } from 'src/Core/interfaces/combustible.interface';


@Component({
  selector: 'app-submit-combustible-modal',
  templateUrl: './submit-combustible-modal.component.html',
  styleUrls: ['./submit-combustible-modal.component.css']
})
export class SubmitcombustibleModalComponent implements OnInit {
  @Output() DataUpdated: EventEmitter<combustibleShema> = new EventEmitter<combustibleShema>();
  @Input() dataPosition!: combustibleShema;
  @Input() disabled: boolean = false;

  isVisible = false;
  combustibleIsDisable: boolean = false;
  listOfData: combustibleShema[] = [];
  validateForm!: FormGroup;
  newcombustible!: combustibleShema;
  fechaInicial: Date = new Date();
  fechaFinal: Date = new Date();

  url = {
    get: 'get-combustible',
    post: 'combustible',
    delete: 'combustible',
    update: 'combustible',
  };
  EmptyForm = this.fb.group({
    fechaInicial: ['', [Validators.required]],
    fechaFinal: ['', [Validators.required]],
    precioBase: ['', [Validators.required]],
    precioBajo: ['', [Validators.required]],
    precioAlto:['',[Validators.required]],
  });

  constructor(
    private globalService: EndPointGobalService,
    private fb: FormBuilder,
    private notificationService: NotificationService,

  ) {}

  ngOnInit(): void {this.validateForm = this.fb.group({
    fechaInicial: ['', [Validators.required]],
    fechaFinal: ['', [Validators.required]],
    precioBase: ['', [Validators.required]],
    precioBajo: ['', [Validators.required]],
    precioAlto:['',[Validators.required]],

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
      this.newcombustible = {
        ...this.validateForm.value,
        estado: true
      };
      this.isVisible = false;
      this.globalService.Post(this.url.post, this.newcombustible).subscribe(
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
      this.newcombustible = {
        ...this.validateForm.value,
        estado: true
      };
      this.isVisible = false;
      this.globalService
        .Patch(this.url.post, this.dataPosition.id, this.newcombustible)
        .subscribe(
          (result: any) => {
            if (!result){
            this.dataPosition.fechaInicial = this.newcombustible.fechaInicial;
            this.dataPosition.fechaInicial = this.newcombustible.fechaFinal;
            this.dataPosition.precioBase = this.newcombustible.precioBase;
            this.dataPosition.precioBajo = this.newcombustible.precioBajo;
            this.dataPosition.precioAlto = this.newcombustible.precioAlto;
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

  editableFrom(data: combustibleShema): void{
    //console.log(data);
    this.validateForm = this.fb.group({
      fechaInicial: [data.fechaInicial, [Validators.required]],
      fechaFinal: [data.fechaFinal, [Validators.required]],
      precioBase:[data.precioBase.toString(),[Validators.required]],
      precioBajo:[data.precioBajo.toString(),[Validators.required]],
      precioAlto:[data.precioAlto,[Validators.required]],
    })
  }

  fullSchema(){
    this.newcombustible = {
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
      precioBase: ['', [Validators.required]],
      precioBajo: ['', [Validators.required]],
      precioAlto:['',[Validators.required]],
    })
  }
}
