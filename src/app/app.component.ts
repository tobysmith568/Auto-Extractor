import { Component } from "@angular/core";
import { ElectronService } from "./services/electron/electron.service";
import { TranslateService } from "@ngx-translate/core";
import { AppConfig } from "../environments/environment";
import { LogService } from "./services/log/log.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  constructor(private electronService: ElectronService, private translate: TranslateService, private log: LogService) {
    this.translate.setDefaultLang("en");
    log.debug("AppConfig", AppConfig);

    if (electronService.isElectron) {
      log.debug("ENV", { ENV: process.env });
      log.debug("Running in electron");
      log.debug("Electron ipcRenderer", this.electronService.ipcRenderer);
      log.debug("NodeJS childProcess", this.electronService.childProcess);
    } else {
      log.debug("Running in browser");
    }
  }
}
