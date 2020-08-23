import "reflect-metadata";
import "../polyfills";

import { BrowserModule } from "@angular/platform-browser";
import { NgModule, APP_INITIALIZER } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { SharedModule } from "./shared/shared.module";
import { AppRoutingModule } from "./app-routing.module";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { AppComponent } from "./app.component";
import { MainComponent } from "./components/main/main.component";
import { CommonModule } from "@angular/common";
import { TitlebarComponent } from "./components/titlebar/titlebar.component";
import { FolderComponent } from "./components/main/folder/folder.component";
import { LogService } from "./services/log/log.service";
import { InlineSVGModule } from "ng-inline-svg";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [AppComponent, MainComponent, TitlebarComponent, FolderComponent],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    SharedModule,
    AppRoutingModule,
    InlineSVGModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (log: LogService) => {
        return async () => {
          await log.setUp(process.env.NODE_ENV === "production");
        };
      },
      deps: [LogService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
