import { Component, OnInit } from "@angular/core";
import { LocationsService } from "app/services/locations/locations.service";
import { ILocation } from "app/services/locations/location.interface";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"]
})
export class MainComponent implements OnInit {
  public newLocation: string;
  public locations: ILocation[] = [];

  constructor(private locationService: LocationsService) {}

  ngOnInit(): void {
    this.locationService.$locations.subscribe({
      next: locations => (this.locations = locations)
    });
    this.locations = this.locationService.getLocations();
  }

  public addLocation(): void {
    this.locationService.upsertLocation({
      filePath: this.newLocation,
      isEnabled: true
    });
    this.newLocation = "";
  }
}
