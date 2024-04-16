import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoslodavacComponent } from './poslodavac.component';

describe('PoslodavacComponent', () => {
  let component: PoslodavacComponent;
  let fixture: ComponentFixture<PoslodavacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoslodavacComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoslodavacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
