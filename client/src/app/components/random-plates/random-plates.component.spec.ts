import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomPlatesComponent } from './random-plates.component';

describe('RandomPlatesComponent', () => {
  let component: RandomPlatesComponent;
  let fixture: ComponentFixture<RandomPlatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RandomPlatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RandomPlatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
