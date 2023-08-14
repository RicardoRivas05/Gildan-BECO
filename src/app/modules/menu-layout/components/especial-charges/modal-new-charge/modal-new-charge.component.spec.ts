import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewChargeComponent } from './modal-new-charge.component';

describe('ModalNewChargeComponent', () => {
  let component: ModalNewChargeComponent;
  let fixture: ComponentFixture<ModalNewChargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalNewChargeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNewChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
