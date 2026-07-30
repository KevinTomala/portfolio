import { Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ProjectContributor {
  name: string;
  githubUrl: string;
}

interface Project {
  title: string;
  description: string;
  technologies: string[];
  siteUrl?: string;
  repoUrl?: string;
  status: 'Listo' | 'En progreso' | 'En mantenimiento';
  category?: string;
  contributors: ProjectContributor[];
  previewLabel?: string;
}

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
})
export class PortfolioComponent implements OnInit, OnDestroy {
  displayedTitle = '';
  fullTitle = 'Proyectos en produccion y en proceso';
  titleTypingSpeed = 60;
  private titleTimeoutId?: ReturnType<typeof setTimeout>;
  private maxParallax = 18;

  projects: Project[] = [
    {
      title: 'ADEMY - Sistema de Administración Academica',
      description: 'Plataforma integral para gestionar matriculas, horarios, diplomas y finanzas en instituciones educativas, con control de acceso granular por roles y modulos.',
      technologies: ['React', 'Node.js', 'MySQL', 'Docker', 'Socket.io'],
      siteUrl: 'https://ademy-theta.vercel.app/',
      repoUrl: 'https://github.com/KevinTomala/ademy',
      status: 'Listo',
      category: 'Web App',
      contributors: [
        { name: 'Kevin Tomala', githubUrl: 'https://github.com/kevintomala' },
        { name: 'SamVp29', githubUrl: 'https://github.com/SamVp29' }
      ]
    },
    {
      title: 'Docco',
      description: 'Motor de verificacion documental con pipeline OCR de 3 capas adaptativas que analiza, extrae, puntua y devuelve resultados via webhook a sistemas externos.',
      technologies: ['Python', 'FastAPI', 'React', 'MySQL', 'Cloudflare R2'],
      siteUrl: 'https://docco-seven.vercel.app/',
      repoUrl: 'https://github.com/KevinTomala/docco',
      status: 'Listo',
      category: 'Web App',
      contributors: [
        { name: 'Kevin Tomala', githubUrl: 'https://github.com/kevintomala' }
      ]
    },
    {
      title: 'EmpleoFácil',
      description: 'Plataforma de empleo que conecta empresas con candidatos verificados por Docco, con mensajeria en tiempo real, pagos integrados y sincronizacion con ADEMY.',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Socket.io'],
      siteUrl: 'https://empleofacil.vercel.app/',
      repoUrl: 'https://github.com/KevinTomala/empleofacil',
      status: 'Listo',
      category: 'Web App',
      contributors: [
        { name: 'Kevin Tomala', githubUrl: 'https://github.com/kevintomala' }
      ]
    },
    {
      title: 'Generador QR',
      description: 'Herramienta web para crear codigos QR personalizables y listos para descargar.',
      technologies: ['Angular', 'TypeScript', 'CSS'],
      siteUrl: 'https://kevintomala.github.io/qr-generate',
      repoUrl: 'https://github.com/KevinTomala/qr-generate',
      status: 'Listo',
      category: 'Web App',
      contributors: [
        { name: 'Kevin Tomala', githubUrl: 'https://github.com/kevintomala' }
      ]
    },
    {
      title: 'Barbershop El Chino',
      description: 'Sitio web para barberia con enfoque en reservas y presencia local.',
      technologies: ['HTML', 'CSS', 'JavaScript'],
      siteUrl: 'https://barbershopelchino.github.io/website/',
      repoUrl: 'https://github.com/BarberShopElChino/website',
      status: 'Listo',
      category: 'Landing',
      contributors: [
        { name: 'Kevin Tomala', githubUrl: 'https://github.com/kevintomala' },
        { name: 'BarberShopElChino', githubUrl: 'https://github.com/BarberShopElChino' }
      ]
    },
    {
      title: 'CENDCAP',
      description: 'Sitio institucional con actualizaciones de contenido y optimizacion.',
      technologies: ['WordPress', 'HTML', 'CSS','JavaScript'],
      siteUrl: 'https://cendcap.com/',
      status: 'Listo',
      category: 'Web',
      contributors: [
        { name: 'Kevin Tomala', githubUrl: 'https://github.com/kevintomala' }
      ]
    },
    {
      title: 'LLESDental',
      description: 'Mantenimiento y mejoras de sitio clinico con acceso privado.',
      technologies: ['Angular', 'Node.js', 'MySQL'],
      siteUrl: 'https://llesdental.cendcap.com/login',
      repoUrl: 'https://github.com/cendcap/llesdental',
      status: 'En mantenimiento',
      category: 'Mantenimiento',
      contributors: [
        { name: 'Kevin Tomala', githubUrl: 'https://github.com/kevintomala' },
        { name: 'cendcap', githubUrl: 'https://github.com/cendcap' }
      ]
    },
    {
      title: 'Aplicacion Movil (sin publicar)',
      description: 'Aplicacion movil construida para gestión de reservaciones. Aun no publicada.',
      technologies: ['Ionic', 'Angular', 'Firebase'],
      status: 'En progreso',
      category: 'Mobile',
      previewLabel: 'App movil sin publicacion',
      contributors: [
        { name: 'Kevin Tomala', githubUrl: 'https://github.com/kevintomala' }
      ]
    },
    {
      title: 'Alpha Technologies',
      description: 'Sitio corporativo con showcase 3D interactivo de los productos propios (ADEMY, Docco y EmpleoFacil) y de los servicios de desarrollo a medida.',
      technologies: ['React', 'Three.js', 'GSAP', 'Vite'],
      siteUrl: 'https://alphatechnologies.vercel.app/',
      status: 'Listo',
      category: 'Web',
      contributors: [
        { name: 'Kevin Tomala', githubUrl: 'https://github.com/kevintomala' }
      ]
    },
  ];

  constructor(private elRef: ElementRef<HTMLElement>, private renderer: Renderer2) {}

  ngOnInit() {
    this.typeTitle();
  }

  ngOnDestroy() {
    if (this.titleTimeoutId) {
      clearTimeout(this.titleTimeoutId);
    }
  }

  getDomain(url?: string): string {
    if (!url) return 'Sin dominio';

    try {
      const domain = new URL(url).hostname;
      return domain.replace(/^www\./, '');
    } catch {
      return url;
    }
  }

  getPreviewImage(url?: string): string | null {
    if (!url) return null;

    const encodedUrl = encodeURIComponent(url);
    return `https://s0.wordpress.com/mshots/v1/${encodedUrl}?w=1200`;
  }

  getRepoLabel(url?: string): string {
    if (!url) return 'Privado';

    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname === 'github.com') {
        return parsedUrl.pathname.replace(/^\//, '');
      }
      return url;
    } catch {
      return url;
    }
  }

  trackByTitle(index: number, project: Project): string {
    return project.title;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const rect = this.elRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const offsetX = ((x / rect.width) - 0.5) * 2 * this.maxParallax;
    const offsetY = ((y / rect.height) - 0.5) * 2 * this.maxParallax;

    this.renderer.setStyle(this.elRef.nativeElement, '--parallax-x', offsetX.toFixed(2));
    this.renderer.setStyle(this.elRef.nativeElement, '--parallax-y', offsetY.toFixed(2));
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.renderer.setStyle(this.elRef.nativeElement, '--parallax-x', '0');
    this.renderer.setStyle(this.elRef.nativeElement, '--parallax-y', '0');
  }

  private typeTitle(index = 0) {
    if (index < this.fullTitle.length) {
      this.displayedTitle += this.fullTitle.charAt(index);
      this.titleTimeoutId = setTimeout(() => this.typeTitle(index + 1), this.titleTypingSpeed);
    }
  }
}
