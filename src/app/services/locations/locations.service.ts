import { Injectable } from "@angular/core";
import { ILocation } from "./location.interface";
import { LocalStorageService, StorageKey } from "../localStorage/local-storage.service";
import { Subject, Observable } from "rxjs";
import { LogService } from "../log/log.service";

@Injectable({
  providedIn: "root"
})
export class LocationsService {
  private static readonly LocalStorageKey: StorageKey = "Locations";

  private locationSubject: Subject<ILocation[]> = new Subject<ILocation[]>();

  constructor(private localStorage: LocalStorageService, private log: LogService) {}

  public get $locations(): Observable<ILocation[]> {
    return this.locationSubject.asObservable();
  }

  public getLocations(): ILocation[] {
    const locationData: string = this.localStorage.get(LocationsService.LocalStorageKey);

    if (!locationData || locationData.length === 0) {
      return [];
    }

    return JSON.parse(locationData);
  }

  public upsertLocation(modifiedLocation: ILocation): ILocation {
    const locations = this.getLocations();

    let found: boolean = false;
    for (let i = 0; i < locations.length; i++) {
      if (locations[i].filePath === modifiedLocation.filePath) {
        this.log.info("Updating location", modifiedLocation);
        locations[i] = modifiedLocation;
        found = true;
        break;
      }
    }

    if (!found) {
      this.log.info("Adding new location", modifiedLocation);
      locations.push(modifiedLocation);
    }

    this.localStorage.set(LocationsService.LocalStorageKey, JSON.stringify(locations));
    this.locationSubject.next(this.getLocations());

    return modifiedLocation;
  }

  public removeLocation(locationPath: string): void {
    const locations = this.getLocations();

    for (let i = 0; i < locations.length; i++) {
      if (locations[i].filePath === locationPath) {
        this.log.info("Removing location", locations[i]);
        locations.splice(i, 1);
        break;
      }
    }

    this.localStorage.set(LocationsService.LocalStorageKey, JSON.stringify(locations));
    this.locationSubject.next(this.getLocations());
  }
}
