import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewMatrixComponent } from './modal-new-matrix.component';

describe('ModalNewMatrixComponent', () => {
  let component: ModalNewMatrixComponent;
  let fixture: ComponentFixture<ModalNewMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalNewMatrixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNewMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
