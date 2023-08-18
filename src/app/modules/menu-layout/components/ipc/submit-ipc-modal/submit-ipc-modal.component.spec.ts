import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitipcModalComponent } from './submit-ipc-modal.component';

describe('SubmitipcModalComponent', () => {
  let component: SubmitipcModalComponent;
  let fixture: ComponentFixture<SubmitipcModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitipcModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitipcModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
