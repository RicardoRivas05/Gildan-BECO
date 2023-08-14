import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyMatrixComponent } from './energy-matrix.component';

describe('EnergyMatrixComponent', () => {
  let component: EnergyMatrixComponent;
  let fixture: ComponentFixture<EnergyMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnergyMatrixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnergyMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
