import { Injectable } from "@angular/core";
import { ipcRenderer, webFrame, remote } from "electron";
import * as childProcess from "child_process";
import * as fs from "fs";
import * as chokidar from "chokidar";
import { Subject, Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;
  chokidar: typeof chokidar;

  private isRunningSubject: Subject<boolean>;

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  get $isRunning(): Observable<boolean> {
    return this.isRunningSubject.asObservable();
  }

  constructor() {
    this.isRunningSubject = new Subject<boolean>();

    if (this.isElectron) {
      this.ipcRenderer = window.require("electron").ipcRenderer;
      this.webFrame = window.require("electron").webFrame;
      this.remote = window.require("electron").remote;

      this.childProcess = window.require("child_process");
      this.fs = window.require("fs");
      this.chokidar = window.require("chokidar");

      this.ipcRenderer.addListener("start", () => this.isRunningSubject.next(true));
      this.ipcRenderer.addListener("stop", () => this.isRunningSubject.next(false));
    }
  }

  public minimizeWindow(): void {
    if (this.isElectron) {
      this.remote.getCurrentWindow().minimize();
    }
  }
}
