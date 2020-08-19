import { Injectable } from "@angular/core";
import { ILocation } from "./location.interface";
import { LocalStorageService } from "../localStorage/local-storage.service";

@Injectable({
  providedIn: "root"
})
export class LocationsService {
  private static readonly LocalStorageKey = "LOCATIONS";

  constructor(private localStorage: LocalStorageService) {}

  public getLocations(): ILocation[] {
    const locationData: string = this.localStorage.get(LocationsService.LocalStorageKey);

    if (!locationData || locationData.length === 0) {
      return [];
    }

    return JSON.parse(locationData);
  }

  public upsertLocation(modifiedLocation: ILocation): void {
    const locations = this.getLocations();

    let found: boolean = false;
    for (let i = 0; i < locations.length; i++) {
      if (locations[i].filePath === modifiedLocation.filePath) {
        locations[i] = modifiedLocation;
        found = true;
        break;
      }
    }

    if (!found) {
      locations.push(modifiedLocation);
    }

    this.localStorage.set(LocationsService.LocalStorageKey, JSON.stringify(locations));
  }

  public removeLocation(locationPath: string): void {
    const locations = this.getLocations();

    for (let i = 0; i < locations.length; i++) {
      if (locations[i].filePath === locationPath) {
        locations.splice(i, 1);
        break;
      }
    }

    this.localStorage.set(LocationsService.LocalStorageKey, JSON.stringify(locations));
  }
}
