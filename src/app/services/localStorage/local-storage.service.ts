import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class LocalStorageService {
  constructor() {}

  public get(key: string): string {
    return localStorage.getItem(key);
  }

  public set(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  public remove(key: string): void {
    localStorage.removeItem(key);
  }
}
