import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
})
export class AudioPlayerComponent implements OnInit {
  currentTrack: any = null;

  constructor(private audioService: AudioService) {}

  ngOnInit() {
    this.audioService.currentTrack$.subscribe(track => {
      this.currentTrack = track;
    });
  }

  pause() {
    this.audioService.pause();
  }

  stop() {
    this.audioService.stop();
  }
}
