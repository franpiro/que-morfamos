import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JudgeSuggestionComponent } from './judge-suggestion.component';

describe('JudgeSuggestionComponent', () => {
  let component: JudgeSuggestionComponent;
  let fixture: ComponentFixture<JudgeSuggestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JudgeSuggestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JudgeSuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
