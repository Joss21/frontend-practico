import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { EditDocumentComponent } from './components/edit-document/edit-document.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'documents', component: DocumentListComponent },
  { path: 'edit/:id', component: EditDocumentComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
