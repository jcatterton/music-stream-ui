import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MusicPlayerComponent } from './components/music-player/music-player.component';
import { MaterialModule } from "./material.module";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AddTrackComponent } from "./components/add-track/add-track.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { OverlayModule } from "@angular/cdk/overlay";
import { ConfirmationDialogComponent } from "./components/confirmation-dialog/confirmation-dialog.component";
import { AddPlaylistComponent } from "./components/add-playlist/add-playlist.component";
import { AddTrackToPlaylistComponent } from "./components/add-track-to-playlist/add-track-to-playlist.component";
import { PlaylistInfoComponent } from "./components/playlist-info/playlist-info.component";
import { AlbumInfoComponent } from "./components/album-info/album-info.component";
import { ArtistInfoComponent } from "./components/artist-info/artist-info.component";

@NgModule({
  declarations: [
    AppComponent,
    MusicPlayerComponent,
    AddTrackComponent,
    ConfirmationDialogComponent,
    AddPlaylistComponent,
    AddTrackToPlaylistComponent,
    PlaylistInfoComponent,
    AlbumInfoComponent,
    ArtistInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    OverlayModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
