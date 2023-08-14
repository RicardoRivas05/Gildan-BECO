import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CredentialUserModalComponent } from './credential-user-modal.component';

describe('CredentialUserModalComponent', () => {
  let component: CredentialUserModalComponent;
  let fixture: ComponentFixture<CredentialUserModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CredentialUserModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CredentialUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
