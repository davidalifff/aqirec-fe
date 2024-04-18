import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordedDataComponent } from './recorded-data.component';

describe('RecordedDataComponent', () => {
  let component: RecordedDataComponent;
  let fixture: ComponentFixture<RecordedDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordedDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordedDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
