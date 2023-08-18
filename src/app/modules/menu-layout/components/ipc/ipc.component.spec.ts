import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ipcComponent } from './ipc.component';

describe('ipcComponent', () => {
  let component: ipcComponent;
  let fixture: ComponentFixture<ipcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ipcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ipcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
