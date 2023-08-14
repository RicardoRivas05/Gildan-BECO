import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewInvoicesComponent } from './modal-new-invoices.component';

describe('ModalNewInvoicesComponent', () => {
  let component: ModalNewInvoicesComponent;
  let fixture: ComponentFixture<ModalNewInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalNewInvoicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNewInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
