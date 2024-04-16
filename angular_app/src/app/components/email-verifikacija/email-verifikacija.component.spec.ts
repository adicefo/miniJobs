import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailVerifikacijaComponent } from './email-verifikacija.component';

describe('EmailVerifikacijaComponent', () => {
  let component: EmailVerifikacijaComponent;
  let fixture: ComponentFixture<EmailVerifikacijaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailVerifikacijaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailVerifikacijaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
