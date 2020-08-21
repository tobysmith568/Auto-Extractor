import { Injectable } from "@angular/core";
import { ElectronService } from "../electron/electron.service";
import { Logger, LeveledLogMethod } from "winston";
import * as dailyRotate from "winston-daily-rotate-file";

@Injectable({
  providedIn: "root"
})
export class LogService {
  private winston = this.electronService.winston;
  private logger?: Logger = undefined;

  private static logLevels: any = {
    debug: "DEBUG",
    info: " INFO",
    warn: " WARN",
    error: "ERROR"
  };

  private static dateFormat: () => string = () => {
    return new Date(Date.now()).toISOString();
  };

  constructor(private electronService: ElectronService) {}

  public error(message: string, obj?: any): void {
    this.log(this.logger?.error, console.error, message, obj);
  }

  public warning(message: string, obj?: any): void {
    this.log(this.logger?.warn, console.warn, message, obj);
  }

  public info(message: string, obj?: any): void {
    this.log(this.logger?.info, console.info, message, obj);
  }

  public debug(message: string, obj?: any): void {
    this.log(this.logger?.debug, console.log, message, obj);
  }

  private log(
    loggerCall: LeveledLogMethod,
    consoleCall: (message: string, arg?: any) => void,
    message: any,
    obj?: any
  ) {
    if (this.electronService.isElectron) {
      loggerCall(message, { obj });
      return;
    }

    if (!!obj) {
      consoleCall(message, obj);
      return;
    }

    consoleCall(message);
  }

  public async setUp(isProd: boolean): Promise<void> {
    if (!this.electronService.isElectron) {
      return Promise.resolve();
    }

    const logFolder: string = await this.electronService.logFolder;

    const dailyRotateTransport: dailyRotate = new this.electronService.dailyRotate({
      filename: "%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: false,
      maxSize: "20m",
      maxFiles: "14d",
      dirname: logFolder
    });

    const logFormat: any = this.winston.format.printf(data => {
      let message: string = `[${LogService.dateFormat()}] [${data.thread}] [${LogService.logLevels[data.level]}] ${
        data.message
      }`;

      if (!!data.obj) {
        message += " " + JSON.stringify(data.obj);
      }

      return message;
    });

    this.logger = this.winston.createLogger({
      level: "debug",
      defaultMeta: {
        thread: "Renderer"
      },
      format: logFormat,
      transports: [dailyRotateTransport],
      exitOnError: false
    });

    if (!isProd) {
      this.logger.add(new this.winston.transports.Console());
    }

    this.logger.debug("");
    this.logger.debug("");
    this.logger.debug("Starting Logger");
  }
}
