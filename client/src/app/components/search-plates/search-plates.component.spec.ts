import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPlatesComponent } from './search-plates.component';

describe('SearchPlatesComponent', () => {
  let component: SearchPlatesComponent;
  let fixture: ComponentFixture<SearchPlatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchPlatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPlatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
