import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewParameterComponent } from './modal-new-parameter.component';

describe('ModalNewParameterComponent', () => {
  let component: ModalNewParameterComponent;
  let fixture: ComponentFixture<ModalNewParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalNewParameterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNewParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
