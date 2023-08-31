import { ComponentFixture, TestBed } from '@angular/core/testing';

import { dollarComponent } from './dollar.component';

describe('dollarComponent', () => {
  let component: dollarComponent;
  let fixture: ComponentFixture<dollarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ dollarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(dollarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
