import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaEHHComponent } from './factura-ehh.component';

describe('FacturaEHHComponent', () => {
  let component: FacturaEHHComponent;
  let fixture: ComponentFixture<FacturaEHHComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacturaEHHComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturaEHHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
