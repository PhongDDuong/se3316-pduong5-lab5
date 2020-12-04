import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseSearchBasicComponent } from './course-search-basic.component';

describe('CourseSearchBasicComponent', () => {
  let component: CourseSearchBasicComponent;
  let fixture: ComponentFixture<CourseSearchBasicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseSearchBasicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseSearchBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
