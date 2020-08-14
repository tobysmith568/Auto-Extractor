import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { DirectoryService } from "app/services/directory/directory.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"]
})
export class MainComponent implements OnInit {
  public newestFile: string;
  private newZipObserver: Observable<string>;

  constructor(private directoryService: DirectoryService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.newZipObserver = this.directoryService.watchForNewZips("D:\\Users\\tobys\\Desktop\\New folder (2)");

    this.newZipObserver.subscribe({
      next: file => {
        this.newestFile = file;
        this.cdr.detectChanges();
      }
    });
  }
}
