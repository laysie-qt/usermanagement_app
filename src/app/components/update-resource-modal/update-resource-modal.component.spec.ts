import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateResourceModalComponent } from './update-resource-modal.component';
import { SharedModule } from '../../shared/shared.module';
import { of, throwError } from 'rxjs';
import { ResourcesService } from '../../services/resources.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

class MockResourcesService {
  updateResources() {
    return of({ updatedAt: '2024-01-01T00:00:00Z' });
  }
}

// Mock MatDialogRef
class MockMatDialogRef {
  close = jasmine.createSpy('close');
}

describe('UpdateResourceModalComponent', () => {
  let component: UpdateResourceModalComponent;
  let fixture: ComponentFixture<UpdateResourceModalComponent>;
  let resourcesService: MockResourcesService;
  let matDialogRefSpy: MockMatDialogRef;

  const mockDialogData = {
    id: 1,
    name: 'Yellow',
    year: 2024,
    color: '#ffff00',
    pantone_value: 'Pantone 123',
  };

  beforeEach(async () => {
    matDialogRefSpy = new MockMatDialogRef();
    resourcesService = new MockResourcesService();

    await TestBed.configureTestingModule({
      imports: [UpdateResourceModalComponent, SharedModule, BrowserAnimationsModule],
      providers: [
        { provide: ResourcesService, useValue: resourcesService },
        { provide: MatDialogRef, useValue: matDialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        FormBuilder,
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UpdateResourceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with the correct data', () => {
    expect(component.resourceForm.value).toEqual({
      id: 1,
      name: 'Yellow',
      year: 2024,
      color: '#ffff00',
      pantone_value: 'Pantone 123',
      updatedAt: '',
    });
  });

  it('should submit the form successfully', () => {
    component.resourceForm.setValue({
      id: 1,
      name: 'Yellow',
      year: 2025,
      color: 'Blue',
      pantone_value: 'Pantone 456',
      updatedAt: '',
    });

    component.onSubmit();

    expect(matDialogRefSpy.close).toHaveBeenCalledWith({
      id: 1,
      name: 'Yellow',
      year: 2025,
      color: 'Blue',
      pantone_value: 'Pantone 456',
      updatedAt: '2024-01-01',
    });
  });

  it('should handle errors when submitting the form', () => {
    spyOn(resourcesService, 'updateResources').and.returnValue(throwError('Error updating resource'));

    component.resourceForm.setValue({
      id: 1,
      name: 'Yellow',
      year: 2025,
      color: 'Blue',
      pantone_value: 'Pantone 456',
      updatedAt: '',
    });

    component.onSubmit();

    // The dialog should not close because there is an error
    expect(matDialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('should close the dialog when cancel is clicked', () => {
    component.onCancel();
    expect(matDialogRefSpy.close).toHaveBeenCalledWith(false);
  });

  it('should disable submit button if form is invalid', () => {
    component.resourceForm.controls['name'].setValue('');
    expect(component.resourceForm.valid).toBeFalse();
    expect(component.resourceForm.controls['name'].hasError('required')).toBeTrue();
  });
});
