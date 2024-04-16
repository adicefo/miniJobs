import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpremljeniPosloviComponent } from './spremljeni-poslovi.component';

describe('SpremljeniPosloviComponent', () => {
  let component: SpremljeniPosloviComponent;
  let fixture: ComponentFixture<SpremljeniPosloviComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpremljeniPosloviComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpremljeniPosloviComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
