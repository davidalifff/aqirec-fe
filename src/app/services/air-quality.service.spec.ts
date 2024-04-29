import { TestBed } from '@angular/core/testing';

import { AirQualityService } from './air-quality.service';

describe('AirQualityService', () => {
  let service: AirQualityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AirQualityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
