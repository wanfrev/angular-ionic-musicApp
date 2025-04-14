import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AudioService {
  private audio: HTMLAudioElement = new Audio();
  private currentTrackSubject = new BehaviorSubject<any>(null);
  currentTrack$ = this.currentTrackSubject.asObservable(); // observable para el navbar

  play(trackUrl: string, trackInfo: any) {
    this.audio.src = trackUrl;
    this.audio.load();
    this.audio.play();
    this.currentTrackSubject.next(trackInfo); // notifica al navbar
  }

  pause() {
    this.audio.pause();
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.currentTrackSubject.next(null);
  }
}
