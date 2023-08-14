import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalInvoiceComponent } from './digital-invoice.component';

describe('DigitalInvoiceComponent', () => {
  let component: DigitalInvoiceComponent;
  let fixture: ComponentFixture<DigitalInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DigitalInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
