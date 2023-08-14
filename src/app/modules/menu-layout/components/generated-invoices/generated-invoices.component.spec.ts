import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratedInvoicesComponent } from './generated-invoices.component';

describe('GeneratedInvoicesComponent', () => {
  let component: GeneratedInvoicesComponent;
  let fixture: ComponentFixture<GeneratedInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneratedInvoicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratedInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
