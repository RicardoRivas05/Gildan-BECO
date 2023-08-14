import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualMeterModalComponent } from './virtual-meter-modal.component';

describe('VirtualMeterModalComponent', () => {
  let component: VirtualMeterModalComponent;
  let fixture: ComponentFixture<VirtualMeterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VirtualMeterModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualMeterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
