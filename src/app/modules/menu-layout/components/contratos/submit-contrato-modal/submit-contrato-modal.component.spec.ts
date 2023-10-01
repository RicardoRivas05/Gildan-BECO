import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitvariablesContratoModalComponent } from './submit-contrato-modal.component';

describe('SubmitvariablesContratoModalComponent', () => {
  let component: SubmitvariablesContratoModalComponent;
  let fixture: ComponentFixture<SubmitvariablesContratoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitvariablesContratoModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitvariablesContratoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
