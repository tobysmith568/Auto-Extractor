import { Component, OnInit } from "@angular/core";
import { ElectronService } from "../../services/electron/electron.service";

@Component({
  selector: "app-titlebar",
  templateUrl: "./titlebar.component.html",
  styleUrls: ["./titlebar.component.scss"]
})
export class TitlebarComponent implements OnInit {
  constructor(private electronService: ElectronService) {}

  ngOnInit(): void {
    this.electronService.$isRunning.subscribe({
      next: running => console.log("Is running:", running)
    });
  }

  public toggleRunning(): void {}

  public close(): void {
    this.electronService.minimizeWindow();
  }
}
