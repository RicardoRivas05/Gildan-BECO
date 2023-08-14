import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualRegistrationModalComponent } from './manual-registration-modal.component';

describe('ManualRegistrationModalComponent', () => {
  let component: ManualRegistrationModalComponent;
  let fixture: ComponentFixture<ManualRegistrationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualRegistrationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualRegistrationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
