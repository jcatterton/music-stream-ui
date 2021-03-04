import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup } from "@angular/forms";
import {Track, UploadTrackRequest} from "../../models/track";

@Component({
  selector: 'app-add-track',
  templateUrl: './add-playlist.component.html',
  styleUrls: ['./add-playlist.component.scss']
})
export class AddPlaylistComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddPlaylistComponent>
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ""
    });
  }

  addPlaylist() {
    this.dialogRef.close(this.form.controls["name"].value);
  }

  cancel() {
    this.dialogRef.close();
  }
}
