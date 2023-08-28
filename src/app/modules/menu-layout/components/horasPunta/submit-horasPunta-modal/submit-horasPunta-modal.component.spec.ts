import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmithorasPuntaModalComponent } from './submit-horasPunta-modal.component';

describe('SubmithorasPuntaModalComponent', () => {
  let component: SubmithorasPuntaModalComponent;
  let fixture: ComponentFixture<SubmithorasPuntaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmithorasPuntaModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmithorasPuntaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
