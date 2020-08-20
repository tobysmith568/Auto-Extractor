import { Component, OnInit, Input } from "@angular/core";
import { Observable } from "rxjs";
import { DirectoryService } from "app/services/directory/directory.service";
import { LocationsService } from "app/services/locations/locations.service";
import { ILocation } from "app/services/locations/location.interface";

@Component({
  selector: "app-folder",
  templateUrl: "./folder.component.html",
  styleUrls: ["./folder.component.scss"]
})
export class FolderComponent implements OnInit {
  private newZipObserver: Observable<string>;

  @Input()
  public folder: ILocation;

  constructor(private directoryService: DirectoryService, private locationsService: LocationsService) {}

  ngOnInit(): void {
    this.newZipObserver = this.directoryService.watchForNewZips(this.folder.filePath);

    this.newZipObserver.subscribe({
      next: file => {
        console.log("New Zip: " + file);
      }
    });
  }

  public remove(): void {
    this.locationsService.removeLocation(this.folder.filePath);
  }
}
