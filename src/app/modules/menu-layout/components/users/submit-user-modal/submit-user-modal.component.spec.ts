import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitUserModalComponent } from './submit-user-modal.component';

describe('SubmitUserModalComponent', () => {
  let component: SubmitUserModalComponent;
  let fixture: ComponentFixture<SubmitUserModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitUserModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
