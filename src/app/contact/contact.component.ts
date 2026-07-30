import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit, AfterViewInit, OnDestroy {
  contactForm: FormGroup;
  scrollProgress = 0;

  private observer?: IntersectionObserver;
  private reducedMotion = false;

  constructor(
    private fb: FormBuilder,
    private elRef: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit() {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  ngAfterViewInit() {
    const revealEls = this.elRef.nativeElement.querySelectorAll('.reveal');

    if (this.reducedMotion) {
      revealEls.forEach((el) => el.classList.add('in-view'));
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle('in-view', entry.isIntersecting);
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );
    revealEls.forEach((el) => this.observer!.observe(el));

    this.updateHeroTransform();
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  @HostListener('window:scroll')
  onScroll() {
    const doc = document.documentElement;
    const scrollTop = window.scrollY || doc.scrollTop;
    const maxScroll = doc.scrollHeight - doc.clientHeight;
    this.scrollProgress = maxScroll > 0 ? Math.min(100, (scrollTop / maxScroll) * 100) : 0;

    if (!this.reducedMotion) {
      this.updateHeroTransform();
    }
  }

  private updateHeroTransform() {
    const hero = this.elRef.nativeElement.querySelector<HTMLElement>('.contact-hero');
    if (!hero) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const heroHeight = hero.offsetHeight || 1;
    const ratio = Math.min(1, Math.max(0, scrollTop / heroHeight));

    this.renderer.setStyle(this.elRef.nativeElement, '--hero-shift', `${(ratio * 60).toFixed(1)}px`);
    this.renderer.setStyle(this.elRef.nativeElement, '--hero-scale', `${(1 + ratio * 0.12).toFixed(3)}`);
    this.renderer.setStyle(this.elRef.nativeElement, '--hero-fade', `${(1 - ratio * 1.15).toFixed(3)}`);
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Mensaje enviado:', this.contactForm.value);
      alert('¡Gracias por tu mensaje! Te responderé pronto.');
      this.contactForm.reset();
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}
