import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MusicService } from '../services/music.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common'; // Para navegación hacia atrás
import { IonicModule } from '@ionic/angular';
import ColorThief from 'color-thief-browser';

@Component({
  selector: 'app-song-detail',
  templateUrl: './song-detail.page.html',
  styleUrls: ['./song-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, // Incluye todos los componentes de Ionic
  ],
})
export class SongDetailPage implements OnInit {
  song: any; // Detalles de la canción
  artistNames: string = ''; // Nombres de los artistas como cadena
  backgroundColor: string = 'black'; // Color de fondo por defecto

  @ViewChild('albumImage', { static: false }) albumImage!: ElementRef; // Referencia a la imagen del álbum
  @ViewChild('audioPlayer', { static: false }) audioPlayer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private musicService: MusicService,
    private location: Location // Para manejar la navegación hacia atrás
  ) {}

  ngOnInit() {
    const songId = this.route.snapshot.paramMap.get('id'); // Obtén el ID de la canción
    if (songId) {
      this.loadSongDetail(songId);
    } else {
      console.error('Song ID is null');
    }
  }

  loadSongDetail(songId: string) {
    this.musicService.getSongById(songId).subscribe((response) => {
      this.song = response;

      if (this.song.artists && Array.isArray(this.song.artists)) {
        this.artistNames = this.song.artists.join(', ');
      } else {
        this.artistNames = 'Artista desconocido';
      }
    });
  }

  onImageLoad() {
    if (this.albumImage && this.albumImage.nativeElement) {
      const img = this.albumImage.nativeElement as HTMLImageElement;

      const colorThief = new ColorThief();
      const dominantColor = colorThief.getColor(img);
      this.backgroundColor = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`;
    } else {
      console.error('La referencia a la imagen no está disponible.');
    }
  }

  formatDuration(durationMs: number): string {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  playPreview() {
    const audio: HTMLAudioElement = this.audioPlayer.nativeElement;
    audio.play();
  }

  pausePreview() {
    const audio: HTMLAudioElement = this.audioPlayer.nativeElement;
    audio.pause();
  }

  goBack() {
    this.location.back(); // Navega hacia la página anterior
  }

  addToPlaylist() {
    console.log('Agregar a Playlist'); // Implementa la lógica para agregar a la playlist
  }
}