import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlfrescoService {
  private apiUrl = 'https://qasgde.ramajudicial.gov.co/alfresco/api/-default-/public/alfresco/versions/1';
  baseUrl: any;

  constructor(private http: HttpClient) { }

  private getAuthParam(): string {
    const ticket = localStorage.getItem('alf_ticket');
    return ticket ? `?alf_ticket=${ticket}` : '';
  }

  getChildren(nodeId: string = '-root-'): Observable<any> {
    const url = `${this.apiUrl}/nodes/${nodeId}/children${this.getAuthParam()}`;
    return this.http.get(url);
  }

  getNode(nodeId: string): Observable<any> {
    const url = `${this.apiUrl}/nodes/${nodeId}${this.getAuthParam()}`;
    return this.http.get(url);
  }

  renameNode(nodeId: string, newName: string): Observable<any> {
    const url = `${this.apiUrl}/nodes/${nodeId}${this.getAuthParam()}`;
    const body = { name: newName };
    return this.http.put(url, body);
  }

  createFolder(name: string, parentNodeId: string = '-root-'): Observable<any> {
    const url = `${this.apiUrl}/nodes/${parentNodeId}/children${this.getAuthParam()}`;
    const body = {
      name,
      nodeType: 'cm:folder'
    };
    return this.http.post(url, body);
  }

  createTextDocument(name: string, parentNodeId: string): Observable<any> {
    const url = `${this.apiUrl}/nodes/${parentNodeId}/children${this.getAuthParam()}`;
    const body = {
      name,
      nodeType: 'cm:content'
    };
    return this.http.post(url, body);
  }

  updateDocumentContent(nodeId: string, content: string): Observable<any> {
    const url = `${this.apiUrl}/nodes/${nodeId}/content${this.getAuthParam()}`;
    const headers = new HttpHeaders({ 'Content-Type': 'text/plain' });
    return this.http.put(url, content, { headers, responseType: 'json' });
  }

  getDocumentContent(nodeId: string) {
    const ticket = localStorage.getItem('alf_ticket');
    const url = `${this.baseUrl}/alfresco/api/-default-/public/alfresco/versions/1/nodes/${nodeId}/content?alf_ticket=${ticket}`;
    return this.http.get(url, { responseType: 'text' }); 
  }

  logout(): Observable<any> {
    const ticket = localStorage.getItem('alf_ticket');
    const url = `${this.apiUrl}/tickets/-me-?alf_ticket=${ticket}`;
    return this.http.delete(url);
  }

}
