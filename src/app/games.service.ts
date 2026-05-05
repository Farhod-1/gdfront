import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Game {
  id: string;
  name: string;
  path: string;
  description: string;
  assetUrl: string;
}

@Injectable({ providedIn: 'root' })
export class GamesService {
  private http = inject(HttpClient);

  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>('http://localhost:3000/games');
  }
}
