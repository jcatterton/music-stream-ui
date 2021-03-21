import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MusicPlayerComponent } from "./components/music-player/music-player.component";
import {AppComponent} from "./app.component";


const routes: Routes = [
  {
    path: "",
    component: AppComponent
  },
  {
    path: "music-player",
    component: MusicPlayerComponent
  },
  {
    path: "**", redirectTo: "music-player", pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
