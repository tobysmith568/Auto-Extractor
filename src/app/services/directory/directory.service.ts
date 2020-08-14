import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { ElectronService } from "../electron/electron.service";

@Injectable({
  providedIn: "root"
})
export class DirectoryService {
  constructor(private electronService: ElectronService) {}

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

          subject.next(path);
        });
    }

    return subject.asObservable();
  }
}
