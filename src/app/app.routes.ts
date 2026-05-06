import { Routes } from '@angular/router';

function gameRoute(path: string, name: string, folder: string) {
  return {
    path,
    loadComponent: () => import('./game/game').then((m) => m.GameComponent),
    data: { name, assetUrl: `http://localhost:3000/games/${folder}/index.html` },
  };
}

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./games-list/games-list').then((m) => m.GamesListComponent),
  },
  gameRoute('aptobus', 'Aptobus', 'Aptobus'),
  gameRoute('find-the-continent', 'Find the Continent', 'FindTheContinent'),
  gameRoute('fractions', 'Fractions', 'Fractions'),
  gameRoute('kornizka', 'Kornizka', 'Kornizka'),
  gameRoute('line-drower', 'Line Drower', 'LineDrower'),
  gameRoute('memory-puzzle', 'Memory Puzzle', 'MemoryPuzzle'),
  gameRoute('mevatem', 'Mevatem', 'Mevatem'),
  gameRoute('number-merge', 'Number Merge', 'NumberMerge'),
  gameRoute('sliding-puzzle', 'Sliding Puzzle', 'SlidingPuzzle'),
  gameRoute('true-or-false', 'True or False', 'TrueOrFalse'),
  { path: '**', redirectTo: '' },
];
