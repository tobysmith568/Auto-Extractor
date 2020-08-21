import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { ElectronService } from "../electron/electron.service";
import { LogService } from "../log/log.service";

@Injectable({
  providedIn: "root"
})
export class DirectoryService {
  constructor(private electronService: ElectronService, private log: LogService) {}

  public watchForNewZips(location: string): Observable<string> {
    const subject: Subject<string> = new Subject<string>();

    if (this.electronService.isElectron) {
      this.electronService.chokidar
        .watch(location, {
          ignoreInitial: true
        })
        .addListener("add", path => {
          if (!path.endsWith(".zip")) {
            return;
          }

          this.log.debug("Detected new zip", { path });
          subject.next(path);
        });
    }

    return subject.asObservable();
  }
}
