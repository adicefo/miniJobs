import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoslodavacPosloviComponent } from './poslodavac-poslovi.component';

describe('PoslodavacPosloviComponent', () => {
  let component: PoslodavacPosloviComponent;
  let fixture: ComponentFixture<PoslodavacPosloviComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoslodavacPosloviComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoslodavacPosloviComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
