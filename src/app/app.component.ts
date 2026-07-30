import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Agrega FormsModule
import { Subscription, filter } from 'rxjs';
import { VideoScrubService } from './shared/video-scrub.service';

interface MenuItem {
  id: string;
  icon: string;
  label: string;
  route?: string;
  subitems?: SubMenuItem[];
  link?: boolean;
}

interface SubMenuItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, FormsModule], // Agrega FormsModule
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('siteVideo') siteVideoRef?: ElementRef<HTMLVideoElement>;

  private routerSub?: Subscription;

  constructor(private router: Router, private videoScrub: VideoScrubService) {}

  ngAfterViewInit() {
    if (this.siteVideoRef) {
      this.videoScrub.setVideoElement(this.siteVideoRef.nativeElement);
    }
    this.videoScrub.setRoute(this.router.url);

    this.routerSub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.videoScrub.setRoute(event.urlAfterRedirects));

    this.onScroll();
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
  }

  @HostListener('window:scroll')
  onScroll() {
    const doc = document.documentElement;
    const scrollTop = window.scrollY || doc.scrollTop;
    const maxScroll = doc.scrollHeight - doc.clientHeight;
    const ratio = maxScroll > 0 ? scrollTop / maxScroll : 0;
    this.videoScrub.setScrollRatio(ratio);
  }

  get scrollProgress$() {
    return this.videoScrub.scrollProgress$;
  }

  isSidebarOpen = false;
  isProfileMenuOpen = false;
  isSearchActive = false;
  searchQuery = '';
  openSections: { [key: string]: boolean } = {};
  userName = 'Kevin Tomala';
  email = 'kevintomala.27@gmail.com';

  menuItems: MenuItem[] = [
    {
      id: 'home',
      icon: '🏠',
      label: 'Inicio',
      route: '/',
      link: true
    },
    {
      id: 'portfolio',
      icon: '💼',
      label: 'Portfolio',
      route: '/portfolio',
      link: true
    },
    {
      id: 'contact',
      icon: '📞',
      label: 'Contacto',
      route: '/contact',
      link: true
    },
    {
      id: 'about',
      icon: 'ℹ️',
      label: 'Sobre mí',
      route: '/about',
      link: true
    }
  ];

  perfilItems: MenuItem[] = [
    {
      id: 'email',
      icon: '📧',
      label: 'kevintomala.27@gmail.com'
    },
    {
      id: 'configuration',
      icon: '⚙️',
      label: 'Ajustes',
      route: '/configuration'
    },
    {
      id: 'Logout',
      icon: '🚪',
      label: 'Cerrar sesión',
      link: true
    }
  ];

  // Detectar Ctrl+K para activar búsqueda
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      this.toggleSearch();
    }
    // ESC para cerrar búsqueda
    if (event.key === 'Escape' && this.isSearchActive) {
      this.closeSearch();
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  toggleSection(sectionId: string) {
    this.openSections[sectionId] = !this.openSections[sectionId];
  }

  toggleSearch() {
    this.isSearchActive = !this.isSearchActive;
    if (this.isSearchActive) {
      // Enfocar el input después de un pequeño delay para la animación
      setTimeout(() => {
        const searchInput = document.querySelector('.search-input-field') as HTMLInputElement;
        searchInput?.focus();
      }, 100);
    }
  }

  closeSearch() {
    this.isSearchActive = false;
    this.searchQuery = '';
  }

  handleSearch() {
    if (this.searchQuery.trim()) {
      console.log('Buscando:', this.searchQuery);
      // Aquí puedes implementar la lógica de búsqueda
      // Por ejemplo, filtrar menuItems o navegar a resultados
    }
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  closeProfileMenu() {
    this.isProfileMenuOpen = false;
  }

  handleProfileAction(itemId: string) {
    console.log('Acción:', itemId);
    if (itemId === 'Logout') {
      console.log('Cerrar sesión...');
    } else if (itemId === 'configuration') {
      console.log('Abrir ajustes...');
    }
    this.closeProfileMenu();
  }

  // Filtrar resultados de búsqueda
  get searchResults() {
    if (!this.searchQuery.trim()) {
      return this.menuItems;
    }
    return this.menuItems.filter(item => 
      item.label.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}