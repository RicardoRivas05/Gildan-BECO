import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMedidoresComponent } from './modal-medidores.component';

describe('ModalMedidoresComponent', () => {
  let component: ModalMedidoresComponent;
  let fixture: ComponentFixture<ModalMedidoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalMedidoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMedidoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
