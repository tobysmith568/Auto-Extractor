import { Injectable } from "@angular/core";
import { LogService } from "../log/log.service";

export type StorageKey = "Locations" | "IsRunning";

@Injectable({
  providedIn: "root"
})
export class LocalStorageService {
  constructor(private log: LogService) {}

  public get(key: StorageKey): string {
    this.log.debug("Getting key from local storage", { key });
    return localStorage.getItem(key) ?? "";
  }

  public set(key: StorageKey, value: string): void {
    this.log.debug("Setting key from local storage", { key, value });
    localStorage.setItem(key, value);
  }

  public remove(key: StorageKey): void {
    this.log.debug("Removing key from local storage", { key });
    localStorage.removeItem(key);
  }
}
