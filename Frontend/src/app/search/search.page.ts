import { Component, Input } from '@angular/core';
import { Router } from '@angular/router'; // Importa el Router
import { MusicService } from '../services/music.service';
import { TrackService } from '../services/track.service'; // Importa el servicio
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClient } from '@angular/common/http'; // Importa HttpClient
import { ModalController } from '@ionic/angular'; // Importa ModalController
import { PlaylistPage } from '../playlist/playlist.page'; // Importa la página de selección de playlist
import { AudioPlayerComponent } from '../audio-player/audio-player.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    NavbarComponent,
    AudioPlayerComponent
  ]
})
export class SearchPage {
  @Input() isModal: boolean = false; // Determina si el componente se usa como modal
  searchQuery: string = '';
  artistResults: any[] = [];
  musicResults: any[] = [];
  filteredMusicResults: any[] = [];
  selectedDuration: string = '';
  selectedSort: string = ''; // Nuevo filtro para ordenar por título
  savedTracks: Set<string> = new Set(); // Inicializa el conjunto para guardar IDs de canciones

  constructor(
    private musicService: MusicService,
    private router: Router,
    private trackService: TrackService, // Inyecta el servicio
    private http: HttpClient, // Inyecta HttpClient
    private modalController: ModalController // Inyecta ModalController
  ) {}

  search(query: string) {
    if (!query.trim()) {
      this.musicResults = [];
      this.filteredMusicResults = [];
      return;
    }

    this.musicService.searchMusic(query).subscribe((response) => {
      this.musicResults = response.tracks;
      this.applyFilters(); // Aplica los filtros después de obtener los resultados
    });
  }

  applyFilters() {
    // Filtrar por duración
    this.filteredMusicResults = this.musicResults.filter((track) => {
      const durationMinutes = track.durationMs / 60000;

      return (
        !this.selectedDuration ||
        (this.selectedDuration === 'short' && durationMinutes < 3) ||
        (this.selectedDuration === 'medium' &&
          durationMinutes >= 3 &&
          durationMinutes <= 5) ||
        (this.selectedDuration === 'long' && durationMinutes > 5)
      );
    });

    // Ordenar por título
    if (this.selectedSort === 'asc') {
      this.filteredMusicResults = [...this.filteredMusicResults].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    } else if (this.selectedSort === 'desc') {
      this.filteredMusicResults = [...this.filteredMusicResults].sort((a, b) =>
        b.name.localeCompare(a.name)
      );
    }
  }

  formatDuration(durationMs: number): string {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  async addToPlaylist(track: any) {
    if (this.savedTracks.has(track.id)) {
      this.savedTracks.delete(track.id);
      console.log(`Canción eliminada de la playlist: ${track.name}`);
    } else {
      this.savedTracks.add(track.id);
      console.log(`Canción guardada en la playlist: ${track.name}`);
    }

    this.router.navigate(['/playlist'], {
      queryParams: {
        trackId: track.id,
        trackName: track.name,
      },
    });
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
