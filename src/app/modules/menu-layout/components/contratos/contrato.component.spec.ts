import { ComponentFixture, TestBed } from '@angular/core/testing';

import { variablesContratoComponent } from './contratocomponent';

describe('variablesContratoComponent', () => {
  let component: variablesContratoComponent;
  let fixture: ComponentFixture<variablesContratoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ variablesContratoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(variablesContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
