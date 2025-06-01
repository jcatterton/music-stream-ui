import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup } from "@angular/forms";
import { YoutubeRequest } from "../../models/track";

@Component({
  selector: 'app-add-track-from-youtube',
  templateUrl: './add-track-from-youtube.component.html',
  styleUrls: ['./add-track-from-youtube.component.scss']
})
export class AddTrackFromYoutubeComponent implements OnInit {
  form: FormGroup;
  file: File;
  link: string;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddTrackFromYoutubeComponent>
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: "",
      artist: "",
      album: "",
      link: this.link ?? ""
    });
  }

  cancel() {
    this.dialogRef.close(undefined);
  }

  addTrack() {
    const track: YoutubeRequest = {
      name: this.form.controls["name"].value,
      album: this.form.controls["album"].value,
      artist: this.form.controls["artist"].value,
      youtubeLink: this.form.controls["link"].value
    };

    this.dialogRef.close(track);
  }
}
