import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitcpiModalComponent } from './submit-cpi-modal.component';

describe('SubmitcpiModalComponent', () => {
  let component: SubmitcpiModalComponent;
  let fixture: ComponentFixture<SubmitcpiModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitcpiModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitcpiModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
