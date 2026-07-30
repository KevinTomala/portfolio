import { Component, ElementRef, OnInit, OnDestroy, AfterViewInit, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { initScrollReveal } from '../shared/scroll-reveal';

interface Technology {
  name: string;
  logo: string;
  color?: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  size?: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedText = '';
  fullText = 'Desarrollador Full Stack';
  typingSpeed = 100;
  
  skills = [
    { icon: '⚙️', title: 'Automatización', description: 'Flujos frontend/backend optimizados' },
    { icon: '📦', title: 'Arquitectura', description: 'Microservicios y módulos escalables' },
    { icon: '🧠', title: 'Soluciones', description: 'Sistemas resilientes para equipos' },
    { icon: '🚀', title: 'Performance', description: 'Optimización y mejores prácticas' }
  ];
  private originalSizes: Map<string, number> = new Map();
  bubbleTechnologies: Technology[] = [
    { name: 'Angular', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/angular.svg', color: '#DD0031', size: 70 },
    { name: 'React', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/react.svg', color: '#61DAFB', size: 75 },
    { name: 'TypeScript', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/typescript.svg', color: '#3178C6', size: 65 },
    { name: 'Node.js', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/nodedotjs.svg', color: '#339933', size: 70 },
    { name: 'Python', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/python.svg', color: '#3776AB', size: 68 },
    { name: 'Docker', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/docker.svg', color: '#2496ED', size: 72 },
    { name: 'MySQL', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/mysql.svg', color: '#4479A1', size: 65 },
    { name: 'MongoDB', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/mongodb.svg', color: '#47A248', size: 70 },
    { name: 'AWS', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/amazonaws.svg', color: '#FF9900', size: 68 },
    { name: 'Google Cloud', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/googlecloud.svg', color: '#4285F4', size: 66 },
    { name: 'Git', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/git.svg', color: '#F05032', size: 64 },
    { name: 'Linux', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linux.svg', color: '#FCC624', size: 70 },
    { name: 'JavaScript', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/javascript.svg', color: '#F7DF1E', size: 65 },
    { name: 'Vue.js', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/vuedotjs.svg', color: '#4FC08D', size: 68 }
  ];

  private revealObserver: IntersectionObserver | null = null;
  private animationId: any;
  private containerWidth = 0;
  private containerHeight = 0;
  private mouseX = -1000;
  private mouseY = -1000;
  private fleeDistance = 180; // Distancia a la que las burbujas huyen
  private fleeForce = 4; // Fuerza de huida
  private friction = 0.98; // Fricción para desacelerar
  private maxSpeed = 6; // Velocidad máxima

  technologies = {
    frontend: [
      { name: 'Angular', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/angular.svg', color: '#DD0031' },
      { name: 'React', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/react.svg', color: '#61DAFB' },
      { name: 'Vue.js', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/vuedotjs.svg', color: '#4FC08D' },
      { name: 'TypeScript', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/typescript.svg', color: '#3178C6' },
      { name: 'JavaScript', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/javascript.svg', color: '#F7DF1E' },
      { name: 'HTML5', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/html5.svg', color: '#E34F26' },
      { name: 'CSS3', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/css3.svg', color: '#1572B6' }
    ],
    backend: [
      { name: 'Node.js', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/nodedotjs.svg', color: '#339933' },
      { name: 'Python', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/python.svg', color: '#3776AB' },
      { name: 'PHP', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/php.svg', color: '#777BB4' },
      { name: 'Express', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/express.svg', color: '#000000' },
      { name: 'Django', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/django.svg', color: '#092E20' },
      { name: 'FastAPI', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/fastapi.svg', color: '#009688' }
    ],
    mobile: [
      { name: 'React Native', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/react.svg', color: '#61DAFB' },
      { name: 'Flutter', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/flutter.svg', color: '#02569B' },
      { name: 'Ionic', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/ionic.svg', color: '#3880FF' },
      { name: 'Kotlin', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/kotlin.svg', color: '#7F52FF' },
      { name: 'Android', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/android.svg', color: '#3DDC84' }
    ],
    database: [
      { name: 'MySQL', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/mysql.svg', color: '#4479A1' },
      { name: 'PostgreSQL', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/postgresql.svg', color: '#4169E1' },
      { name: 'MongoDB', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/mongodb.svg', color: '#47A248' },
      { name: 'Redis', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/redis.svg', color: '#DC382D' },
      { name: 'Firebase', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/firebase.svg', color: '#FFCA28' }
    ],
    tools: [
      { name: 'Docker', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/docker.svg', color: '#2496ED' },
      { name: 'AWS', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/amazonaws.svg', color: '#FF9900' },
      { name: 'Google Cloud', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/googlecloud.svg', color: '#4285F4' },
      { name: 'Git', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/git.svg', color: '#F05032' },
      { name: 'GitHub', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg', color: '#181717' },
      { name: 'Linux', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linux.svg', color: '#FCC624' }
    ]
  };

  stats = [
    { number: '5+', label: 'Años de experiencia' },
    { number: '30+', label: 'Proyectos completados' },
    { number: '15+', label: 'Tecnologías dominadas' }
  ];

  constructor(private elRef: ElementRef<HTMLElement>) {}

  ngOnInit() {
    this.typeWriter();
    this.bubbleTechnologies.forEach(tech => {
      this.originalSizes.set(tech.name, tech.size || 70);
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.adjustBubbleSizes();
      this.initBubbles();
      this.animate();
    }, 100);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.revealObserver = initScrollReveal(this.elRef.nativeElement, reducedMotion);
  }
  adjustBubbleSizes() {
    const screenWidth = window.innerWidth;
    let sizeMultiplier = 1;

    if (screenWidth <= 480) {
      sizeMultiplier = 0.6; // 60% en móviles pequeños
    } else if (screenWidth <= 768) {
      sizeMultiplier = 0.75; // 75% en tablets
    } else if (screenWidth <= 968) {
      sizeMultiplier = 0.85; // 85% en tablets grandes
    }

    this.bubbleTechnologies.forEach(tech => {
      // USAR el tamaño original guardado, no el actual
      const originalSize = this.originalSizes.get(tech.name) || 70;
      tech.size = Math.round(originalSize * sizeMultiplier);
    });
  }
  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.revealObserver?.disconnect();
  }

  // Detectar movimiento del mouse
onMouseMoveContainer(event: MouseEvent) {
  const container = event.currentTarget as HTMLElement;
  const rect = container.getBoundingClientRect();
  this.mouseX = event.clientX - rect.left;
  this.mouseY = event.clientY - rect.top;
}

// Resetear cuando el mouse sale del contenedor
onMouseLeaveContainer() {
  this.mouseX = -1000;
  this.mouseY = -1000;
}

  initBubbles() {
    const container = document.querySelector('.bubble-container') as HTMLElement;
    if (!container) return;

    this.containerWidth = container.offsetWidth;
    this.containerHeight = container.offsetHeight;

    // Inicializar posiciones y velocidades aleatorias
    this.bubbleTechnologies.forEach((tech) => {
      tech.x = Math.random() * (this.containerWidth - (tech.size || 70));
      tech.y = Math.random() * (this.containerHeight - (tech.size || 70));
      tech.vx = (Math.random() - 0.5) * 2;
      tech.vy = (Math.random() - 0.5) * 2;
    });
  }

  animate() {
    this.updateBubbles();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  updateBubbles() {
    this.bubbleTechnologies.forEach((tech) => {
      const size = tech.size || 70;
      const centerX = tech.x! + size / 2;
      const centerY = tech.y! + size / 2;

      // Calcular distancia al mouse
      const dx = centerX - this.mouseX;
      const dy = centerY - this.mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Si el mouse está cerca, huir
      if (distance < this.fleeDistance && distance > 0) {
        const angle = Math.atan2(dy, dx);
        const force = (this.fleeDistance - distance) / this.fleeDistance * this.fleeForce;
        
        tech.vx! += Math.cos(angle) * force;
        tech.vy! += Math.sin(angle) * force;
      }

      // Aplicar fricción
      tech.vx! *= this.friction;
      tech.vy! *= this.friction;

      // Limitar velocidad máxima
      const speed = Math.sqrt(tech.vx! * tech.vx! + tech.vy! * tech.vy!);
      if (speed > this.maxSpeed) {
        tech.vx! = (tech.vx! / speed) * this.maxSpeed;
        tech.vy! = (tech.vy! / speed) * this.maxSpeed;
      }

      // Actualizar posición
      tech.x! += tech.vx!;
      tech.y! += tech.vy!;

      // Rebotar en los bordes
      if (tech.x! <= 0 || tech.x! >= this.containerWidth - size) {
        tech.vx = -tech.vx!;
        tech.x = Math.max(0, Math.min(tech.x!, this.containerWidth - size));
      }

      if (tech.y! <= 0 || tech.y! >= this.containerHeight - size) {
        tech.vy = -tech.vy!;
        tech.y = Math.max(0, Math.min(tech.y!, this.containerHeight - size));
      }

      // Detectar colisiones entre burbujas
      this.bubbleTechnologies.forEach((other) => {
        if (tech !== other) {
          const otherSize = other.size || 70;
          const otherCenterX = other.x! + otherSize / 2;
          const otherCenterY = other.y! + otherSize / 2;
          
          const dx2 = otherCenterX - centerX;
          const dy2 = otherCenterY - centerY;
          const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          const minDistance = (size + otherSize) / 2;

          if (distance2 < minDistance && distance2 > 0) {
            // Colisión detectada
            const angle = Math.atan2(dy2, dx2);
            const overlap = minDistance - distance2;
            
            // Separar las burbujas
            tech.x! -= Math.cos(angle) * overlap / 2;
            tech.y! -= Math.sin(angle) * overlap / 2;
            other.x! += Math.cos(angle) * overlap / 2;
            other.y! += Math.sin(angle) * overlap / 2;

            // Intercambiar velocidades (colisión elástica simplificada)
            const tempVx = tech.vx!;
            const tempVy = tech.vy!;
            tech.vx = other.vx!;
            tech.vy = other.vy!;
            other.vx = tempVx;
            other.vy = tempVy;
          }
        }
      });
    });
  }

  typeWriter(index = 0) {
    if (index < this.fullText.length) {
      this.displayedText += this.fullText.charAt(index);
      setTimeout(() => this.typeWriter(index + 1), this.typingSpeed);
    }
  }

  trackByName(index: number, tech: Technology): string {
    return tech.name;
  }
  @HostListener('window:resize')
  onResize() {
    const container = document.querySelector('.bubble-container') as HTMLElement;
    if (container) {
      this.containerWidth = container.offsetWidth;
      this.containerHeight = container.offsetHeight;
      this.adjustBubbleSizes();
    }
  }
}