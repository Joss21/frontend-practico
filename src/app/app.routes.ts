import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { EditDocumentComponent } from './components/edit-document/edit-document.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'document-list', component: DocumentListComponent },
  { path: 'edit-document/:id', component: EditDocumentComponent },
  { path: '**', redirectTo: '' }
];
