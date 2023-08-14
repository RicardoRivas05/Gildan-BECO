import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitClientModalComponent } from './submit-client-modal.component';

describe('SubmitClientModalComponent', () => {
  let component: SubmitClientModalComponent;
  let fixture: ComponentFixture<SubmitClientModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitClientModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitClientModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
