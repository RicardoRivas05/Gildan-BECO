import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitZoneModalComponent } from './submit-zone-modal.component';

describe('SubmitZoneModalComponent', () => {
  let component: SubmitZoneModalComponent;
  let fixture: ComponentFixture<SubmitZoneModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitZoneModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitZoneModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
