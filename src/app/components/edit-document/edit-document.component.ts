import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlfrescoService } from '../../services/alfresco.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-edit-document',
  standalone: true,
  templateUrl: './edit-document.component.html',
  styleUrls: ['./edit-document.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class EditDocumentComponent implements OnInit {
  form!: FormGroup;
  nodeId!: string;
  errorMsg = '';
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alfresco: AlfrescoService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.nodeId = this.route.snapshot.paramMap.get('id') || '';
    this.form = this.fb.group({
      name: ['', Validators.required],
    });

    this.alfresco.getNode(this.nodeId).subscribe({
      next: (resp) => {
        this.form.patchValue({ name: resp.entry.name });
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'No se pudo cargar el documento.';
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const newName = this.form.value.name;
    console.log('Renombrando nodeId:', this.nodeId, 'a:', newName);

    this.alfresco.renameNode(this.nodeId, newName).subscribe({
      next: () => {
        alert('Nombre actualizado con éxito.');
        this.router.navigate(['/document-list']);
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        this.errorMsg = err.error?.error?.message || 'Error al actualizar el nombre del documento.';
      },
    });
  }

}
