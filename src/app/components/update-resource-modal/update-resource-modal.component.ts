import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResourcesService } from '../../services/resources.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-update-resource-modal',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './update-resource-modal.component.html',
  styleUrl: './update-resource-modal.component.scss'
})
export class UpdateResourceModalComponent {
  resourceForm!: FormGroup;
  isLoading = false;
  errorMessage: string = '';
  formErrors = { name: '', description: '' };

  constructor(
    private fb: FormBuilder,
    private resourceService: ResourcesService,
    public dialogRef: MatDialogRef<UpdateResourceModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.resourceForm = this.fb.group({
      id: this.data.id,
      name: [this.data.name, [Validators.required, Validators.maxLength(100)]],
      year: [this.data.year, [Validators.required]],
      color: [this.data.color, [Validators.required]],
      pantone_value: [this.data.pantone_value, [Validators.required]],
      updatedAt: [''],
    });
  }

  onSubmit(): void {
    if (this.resourceForm.valid) {
      const updatedResource = { ...this.data, ...this.resourceForm.value };
      this.resourceService.updateResources(this.data.id, updatedResource).subscribe({
        next: (response) => {
          updatedResource['updatedAt'] = response.updatedAt.split('T')[0];
          this.dialogRef.close(updatedResource);
        },
        error: (error) => {
          console.error('Error updating resource:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
