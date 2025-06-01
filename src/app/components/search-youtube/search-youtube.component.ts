import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackBarPanelClass, SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import * as youtubeSearch from "youtube-search";

@Component({
  selector: 'app-search-youtube',
  templateUrl: './search-youtube.component.html',
  styleUrls: ['./search-youtube.component.scss']
})
export class SearchYoutubeComponent implements OnInit {
  searchForm: FormGroup;
  searchResults: any[] = [];
  key = "AIzaSyCew0suT1NMnoHl_ytZ54OV7OjS8eY_QNM";

  constructor(
    private formBuilder: FormBuilder,
    private snackBarService: SnackbarService,
    private dialogRef: MatDialogRef<SearchYoutubeComponent>
  ) { }

  ngOnInit(): void {
    this.setUpSearchForm();
  }

  setUpSearchForm(): void {
    this.searchForm = this.formBuilder.group({
      query: ['', Validators.required]
    });
  }

  search(): void {
    const opts: youtubeSearch.YouTubeSearchOptions = {
      maxResults: 10,
      key: this.key
    };

    youtubeSearch(this.searchForm.controls['query'].value, opts, (err, results) => {
      if (!err) {
        this.searchResults = results;
        console.log(this.searchResults)
      } else {
        this.snackBarService.showMessage("Error searching youtube.", SnackBarPanelClass.fail);
      }
    });
  }

  select($event): void {
    this.dialogRef.close($event.link);
  }
}
