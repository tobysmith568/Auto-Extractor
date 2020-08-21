import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { ipcRenderer, webFrame, remote } from "electron";
import * as childProcess from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as chokidar from "chokidar";
import * as extractZip from "extract-zip";
import * as winston from "winston";
import * as dailyRotate from "winston-daily-rotate-file";

@Injectable({
  providedIn: "root"
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;

  childProcess: typeof childProcess;
  fs: typeof fs;
  path: typeof path;
  chokidar: typeof chokidar;
  extractZip: typeof extractZip;
  winston: typeof winston;
  dailyRotate: typeof dailyRotate;

  private isRunningSubject: Subject<boolean>;

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  get $isRunning(): Observable<boolean> {
    return this.isRunningSubject.asObservable();
  }

  get logFolder(): Promise<string> {
    return this.ipcRenderer.invoke("app_getPath", "logs");
  }

  constructor() {
    this.isRunningSubject = new Subject<boolean>();

    if (this.isElectron) {
      this.ipcRenderer = window.require("electron").ipcRenderer;
      this.webFrame = window.require("electron").webFrame;
      this.remote = window.require("electron").remote;

      this.childProcess = window.require("child_process");
      this.fs = window.require("fs");
      this.path = window.require("path");
      this.chokidar = window.require("chokidar");
      this.extractZip = window.require("extract-zip");
      this.winston = window.require("winston");
      this.dailyRotate = window.require("winston-daily-rotate-file");

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
