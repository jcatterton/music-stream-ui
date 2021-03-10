import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { Track } from "../../models/track";

@Component({
  selector: 'app-update-track',
  templateUrl: './update-track.component.html',
  styleUrls: ['./update-track.component.scss']
})
export class UpdateTrackComponent implements OnInit {
  track: Track;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<UpdateTrackComponent>
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: this.track?.name,
      artist: this.track?.artist,
      album: this.track?.album
    });
  }

  cancel() {
    this.dialogRef.close(undefined);
  }

  updateTrack() {
    const track = {
      name: this.form.controls["name"].value,
      album: this.form.controls["album"].value,
      artist: this.form.controls["artist"].value,
    };

    this.dialogRef.close(track);
  }
}
