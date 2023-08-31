import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combustibleComponent } from './combustible.component';

describe('combustibleComponent', () => {
  let component: combustibleComponent;
  let fixture: ComponentFixture<combustibleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ combustibleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(combustibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
