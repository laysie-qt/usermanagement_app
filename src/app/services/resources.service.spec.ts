import { TestBed } from '@angular/core/testing';

import { ResourcesService } from './resources.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
describe('ResourcesService', () => {
  let service: ResourcesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ResourcesService]});
    service = TestBed.inject(ResourcesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
