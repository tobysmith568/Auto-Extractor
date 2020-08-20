import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { DirectoryService } from "app/services/directory/directory.service";
import { LocationsService } from "app/services/locations/locations.service";
import { ILocation } from "app/services/locations/location.interface";

@Component({
  selector: "app-folder",
  templateUrl: "./folder.component.html",
  styleUrls: ["./folder.component.scss"]
})
export class FolderComponent implements OnInit, OnDestroy {
  private newZipSubscription: Subscription;

  @Input()
  public folder: ILocation;

  constructor(private directoryService: DirectoryService, private locationsService: LocationsService) {}

  ngOnInit(): void {
    this.directoryService.watchForNewZips(this.folder.filePath).subscribe({
      next: file => {
        console.log("New Zip: " + file);
      }
    });
  }

  ngOnDestroy(): void {
    this.newZipSubscription.unsubscribe();
  }

  public remove(): void {
    this.locationsService.removeLocation(this.folder.filePath);
  }
}
