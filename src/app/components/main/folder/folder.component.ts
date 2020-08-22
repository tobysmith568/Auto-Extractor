import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { DirectoryService } from "app/services/directory/directory.service";
import { LocationsService } from "app/services/locations/locations.service";
import { ZipService } from "app/services/zip/zip.service";
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

  constructor(
    private directoryService: DirectoryService,
    private locationsService: LocationsService,
    private zipService: ZipService
  ) {}

  ngOnInit(): void {
    this.newZipSubscription = this.directoryService.watchForNewZips(this.folder.filePath).subscribe({
      next: file => {
        if (this.folder.isEnabled) {
          this.zipService.unzip(file);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.newZipSubscription.unsubscribe();
  }

  public remove(): void {
    this.locationsService.removeLocation(this.folder.filePath);
  }

  public toggleRunning(): void {
    this.folder = this.locationsService.upsertLocation({
      ...this.folder,
      isEnabled: !this.folder.isEnabled
    });
  }
}
