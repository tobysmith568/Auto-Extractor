import { Component, OnInit } from "@angular/core";
import { ElectronService } from "../../services/electron/electron.service";
import { LocalStorageService } from "app/services/localStorage/local-storage.service";

@Component({
  selector: "app-titlebar",
  templateUrl: "./titlebar.component.html",
  styleUrls: ["./titlebar.component.scss"]
})
export class TitlebarComponent implements OnInit {
  public isRunning: boolean;

  constructor(private electronService: ElectronService, private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.electronService.$isRunning.subscribe({
      next: running => console.log("Is running:", running)
    });
  }

  public toggleRunning(): void {
    const isCurrentlyRunning: string = this.localStorageService.get("IsRunning").toLowerCase();

    if (isCurrentlyRunning === "true") {
      this.isRunning = false;
      this.localStorageService.set("IsRunning", "false");
      return;
    }

    this.isRunning = true;
    this.localStorageService.set("IsRunning", "true");
  }

  public close(): void {
    this.electronService.minimizeWindow();
  }
}
