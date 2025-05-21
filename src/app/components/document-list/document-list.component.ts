import { Component, OnInit } from '@angular/core';
import { AlfrescoService } from '../../services/alfresco.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-document-list',
  standalone: true,
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css'],
  imports: [CommonModule, RouterModule, FormsModule],
})
export class DocumentListComponent implements OnInit {
  documentos: any[] = [];
  error = '';
  currentNodeId = '-my-';

  showCreateFolderModal = false;
  newFolderName = '';

  showCreateDocModal = false;
  newDocName = '';

  showEditModal = false;
  editDocId = '';
  editDocContent = '';
  isLoading = false;
  parentNodeId: string | null = null;
  selectedFolderId: string = this.currentNodeId;
  success = '';


  constructor(private alfresco: AlfrescoService, private router: Router) { }

  ngOnInit() {
    this.loadFolderContent(this.currentNodeId);
  }

  loadFolderContent(nodeId: string) {
    this.isLoading = true;
    this.alfresco.getNode(nodeId).subscribe({
      next: (nodeResp) => {
        this.parentNodeId = nodeResp.entry.parentId;
        this.alfresco.getChildren(nodeId).subscribe({
          next: (resp) => {
            this.documentos = resp.list.entries;
            this.currentNodeId = nodeId;
          },
          error: () => {
            this.error = 'No se pudieron obtener los documentos.';
          }
        });
      },
      error: () => {
        this.error = 'No se pudo obtener el nodo actual.';
      }
    });
  }

  goBack() {
    if (this.parentNodeId) {
      this.loadFolderContent(this.parentNodeId);
    }
  }

  createFolder() {
    if (!this.newFolderName.trim()) {
      this.error = 'El nombre de la carpeta no puede estar vacío.';
      return;
    }

    this.alfresco.createFolder(this.newFolderName, this.currentNodeId).subscribe({
      next: () => {
        this.loadFolderContent(this.currentNodeId);
        this.newFolderName = '';
        this.showCreateFolderModal = false;
        this.error = '';
        this.success = 'Carpeta creada exitosamente.';

        setTimeout(() => this.success = '', 3000);
      },
      error: () => {
        this.error = 'No se pudo crear la carpeta.';
      }
    });
  }

  createDocument() {
    const destino = this.selectedFolderId || this.currentNodeId;

    if (!this.newDocName.trim()) {
      this.error = 'El nombre del documento no puede estar vacío.';
      return;
    }

    this.alfresco.createTextDocument(this.newDocName, destino).subscribe({
      next: () => {
        this.loadFolderContent(this.currentNodeId);
        this.newDocName = '';
        this.selectedFolderId = '';
        this.showCreateDocModal = false;
        this.success = 'Documento creado exitosamente.';

        setTimeout(() => this.success = '', 3000);
      },
      error: () => {
        this.error = 'No se pudo crear el documento.';
      }
    });
  }

  navigateToFolder(folderId: string) {
    this.loadFolderContent(folderId);
  }

  openEditModal(docId: string) {
    this.editDocId = docId;
    this.editDocContent = '';
    this.showEditModal = true;

    this.alfresco.getDocumentContent(docId).subscribe({
      next: (resp) => {
        this.editDocContent = resp;
      },
      error: () => {
        this.error = 'No se pudo cargar el contenido del documento.';
      }
    });
  }

  saveDocumentContent() {
    this.alfresco.updateDocumentContent(this.editDocId, this.editDocContent).subscribe({
      next: () => {
        this.showEditModal = false;
        alert('Contenido actualizado');
      },
      error: () => {
        this.error = 'No se pudo actualizar el contenido.';
      }
    });
  }

  onLogout(): void {
    this.alfresco.logout().subscribe({
      next: () => {
        localStorage.removeItem('alf_ticket');
        this.router.navigate(['/login']);
      },
      error: () => {
        localStorage.removeItem('alf_ticket');
        this.router.navigate(['/login']);
      }
    });
  }

}
