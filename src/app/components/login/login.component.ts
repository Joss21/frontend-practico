import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  errorMsg = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      contrasena: ['', Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    const { usuario, contrasena } = this.loginForm.value;

    this.auth.login(usuario, contrasena).subscribe({
      next: (response) => {
        const ticket = response.entry?.id;
        if (ticket) {
          this.auth.saveTicket(ticket);
          this.router.navigate(['/document-list']);
        } else {
          this.errorMsg = 'No se pudo obtener el ticket de sesión.';
        }
      },
      error: () => {
        this.errorMsg = 'Credenciales incorrectas';
      }
    });
  }
}
