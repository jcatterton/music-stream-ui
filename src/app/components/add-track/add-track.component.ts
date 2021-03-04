import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Track, UploadTrackRequest } from "../../models/track";

@Component({
  selector: 'app-add-track',
  templateUrl: './add-track.component.html',
  styleUrls: ['./add-track.component.scss']
})
export class AddTrackComponent implements OnInit {
  form: FormGroup;
  file: File;
  acceptedFormats: string[] = [".mp3"];

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddTrackComponent>
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: "",
      artist: "",
      album: "",
      file: File
    });
  }

  setFile(file: any) {
    this.file = file.target.files.length > 0 ? file.target.files[0] : null;
    this.form.controls["file"].setValue(this.file);
  }

  cancel() {
    this.dialogRef.close(undefined);
  }

  addTrack() {
    const track: UploadTrackRequest = {
      name: this.form.controls["name"].value,
      album: this.form.controls["album"].value,
      artist: this.form.controls["artist"].value,
      audioFile: this.form.controls["file"].value
    };

    this.dialogRef.close(track);
  }
}
