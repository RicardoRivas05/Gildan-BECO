import { ComponentFixture, TestBed } from '@angular/core/testing';

import { cpiComponent } from './cpi.component';

describe('cpiComponent', () => {
  let component: cpiComponent;
  let fixture: ComponentFixture<cpiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ cpiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(cpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
