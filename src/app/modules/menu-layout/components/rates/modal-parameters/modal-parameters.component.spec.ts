import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalParametersComponent } from './modal-parameters.component';

describe('ModalParametersComponent', () => {
  let component: ModalParametersComponent;
  let fixture: ComponentFixture<ModalParametersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalParametersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
