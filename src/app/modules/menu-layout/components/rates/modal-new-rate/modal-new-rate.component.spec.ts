import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewRateComponent } from './modal-new-rate.component';

describe('ModalNewRateComponent', () => {
  let component: ModalNewRateComponent;
  let fixture: ComponentFixture<ModalNewRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalNewRateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNewRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
