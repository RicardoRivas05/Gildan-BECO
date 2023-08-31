import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitcombustibleModalComponent } from './submit-combustible-modal.component';

describe('SubmitcombustibleModalComponent', () => {
  let component: SubmitcombustibleModalComponent;
  let fixture: ComponentFixture<SubmitcombustibleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitcombustibleModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitcombustibleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
