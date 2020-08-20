import { Injectable } from "@angular/core";
import { ElectronService } from "../electron/electron.service";

@Injectable({
  providedIn: "root"
})
export class ZipService {
  constructor(private electronService: ElectronService) {}

  public async unzip(location: string): Promise<void> {
    if (!this.electronService.isElectron) {
      return;
    }

    const target = this.electronService.path.dirname(location);

    try {
      await this.electronService.extractZip(location, { dir: target });
      console.log("Extraction complete");
    } catch (err) {
      console.error(err); // TODO
    }
  }
}
