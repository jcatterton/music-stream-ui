import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef} from "@angular/material/dialog";
import { Playlist } from "../../models/playlist";

@Component({
  selector: 'app-add-track-to-playlist',
  templateUrl: './add-track-to-playlist.component.html',
  styleUrls: ['./add-track-to-playlist.component.scss']
})
export class AddTrackToPlaylistComponent implements OnInit {
  @Input() playlists: Playlist[];
  form: FormGroup;
  trackName: string;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddTrackToPlaylistComponent>
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: ""
    });
  }

  onOk(): void {
    this.dialogRef.close(this.form.controls["id"].value);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
