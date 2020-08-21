import { Injectable } from "@angular/core";

export type StorageKey = "Locations" | "IsRunning";

@Injectable({
  providedIn: "root"
})
export class LocalStorageService {
  constructor() {}

  public get(key: StorageKey): string {
    return localStorage.getItem(key);
  }

  public set(key: StorageKey, value: string): void {
    localStorage.setItem(key, value);
  }

  public remove(key: StorageKey): void {
    localStorage.removeItem(key);
  }
}
