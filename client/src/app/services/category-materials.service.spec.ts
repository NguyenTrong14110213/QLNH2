import { TestBed, inject } from '@angular/core/testing';

import { CategoryMaterialsService } from './category-materials.service';

describe('CategoryMaterialsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategoryMaterialsService]
    });
  });

  it('should be created', inject([CategoryMaterialsService], (service: CategoryMaterialsService) => {
    expect(service).toBeTruthy();
  }));
});
