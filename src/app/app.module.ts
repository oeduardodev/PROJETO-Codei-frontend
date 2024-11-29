import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxTypedJsModule } from 'ngx-typed-js';
import { TeximateModule } from 'ngx-teximate';


@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxTypedJsModule, 
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
