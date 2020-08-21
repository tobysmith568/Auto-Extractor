import { Injectable } from "@angular/core";
import { ElectronService } from "../electron/electron.service";
import { LogService } from "../log/log.service";

@Injectable({
  providedIn: "root"
})
export class ZipService {
  constructor(private electronService: ElectronService, private log: LogService) {}

  public unzip(location: string): void {
    if (!this.electronService.isElectron) {
      this.log.debug("Skipping zip extraction. Not running as Electron", { location });
      return;
    }

    const target = this.electronService.path.dirname(location);

    this.electronService
      .extractZip(location, { dir: target })
      .then(() => this.log.info("Extraction complete", { location, target }))
      .catch(error => this.log.error("Failed to extract zip", { error, location, target }));
  }
}
