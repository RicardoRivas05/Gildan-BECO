import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitferiadosHnModalComponent } from './submit-feriadosHn-modal.component';

describe('SubmitferiadosHnModalComponent', () => {
  let component: SubmitferiadosHnModalComponent;
  let fixture: ComponentFixture<SubmitferiadosHnModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitferiadosHnModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitferiadosHnModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
