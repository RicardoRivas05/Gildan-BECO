import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCargosEehComponent } from './modal-cargos-eeh.component';

describe('ModalCargosEehComponent', () => {
  let component: ModalCargosEehComponent;
  let fixture: ComponentFixture<ModalCargosEehComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCargosEehComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCargosEehComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
