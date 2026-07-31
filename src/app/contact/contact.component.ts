import { AfterViewInit, Component, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { initScrollReveal } from '../shared/scroll-reveal';

const CONTACT_ENDPOINT = 'https://alphatechnologies.vercel.app/api/contacto';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements AfterViewInit, OnDestroy {
  contactForm: FormGroup;
  submitted = false;
  sending = false;
  errorMessage = '';

  private revealObserver: IntersectionObserver | null = null;

  constructor(private fb: FormBuilder, private elRef: ElementRef<HTMLElement>) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngAfterViewInit() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.revealObserver = initScrollReveal(this.elRef.nativeElement, reducedMotion);
  }

  ngOnDestroy() {
    this.revealObserver?.disconnect();
  }

  async onSubmit() {
    if (!this.contactForm.valid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.sending = true;
    this.errorMessage = '';

    const { name, email, message } = this.contactForm.value;

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: name, email, mensaje: message }),
      });

      if (!response.ok) {
        throw new Error('CONTACT_EMAIL_SEND_FAILED');
      }

      this.contactForm.reset();
      this.submitted = true;
    } catch {
      this.errorMessage = 'No se pudo enviar tu mensaje. Intenta de nuevo o escríbeme directo a kevintomala.27@gmail.com.';
    } finally {
      this.sending = false;
    }
  }

  sendAnother() {
    this.submitted = false;
    this.errorMessage = '';
  }
}
