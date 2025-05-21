import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private alfrescoUrl = 'https://qasgde.ramajudicial.gov.co/alfresco/api/-default-/public/authentication/versions/1/tickets';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    const body = { userId: username, password };
    return this.http.post(this.alfrescoUrl, body);
  }

  saveTicket(ticket: string): void {
    localStorage.setItem('alf_ticket', ticket);
  }

  getTicket(): string | null {
    return localStorage.getItem('alf_ticket');
  }

  logout(): void {
    localStorage.removeItem('alf_ticket');
  }
}
