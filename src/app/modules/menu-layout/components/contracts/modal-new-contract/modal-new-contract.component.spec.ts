import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewContractComponent } from './modal-new-contract.component';

describe('ModalNewContractComponent', () => {
  let component: ModalNewContractComponent;
  let fixture: ComponentFixture<ModalNewContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalNewContractComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNewContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
