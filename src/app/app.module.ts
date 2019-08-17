import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent, FormInModalComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HlcClrFormModule } from '@ng-holistic/clr-forms'
import { HlcClrModalModule } from '@ng-holistic/clr-common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



// CLARITY ICONS DEPENDENCY: THIS REQUIRED ONLY IN STACKBLITZ SEE #700
import '@clr/icons';
import '@clr/icons/shapes/all-shapes';
//


@NgModule({
  imports: [ BrowserModule, BrowserAnimationsModule, HttpClientModule,  HlcClrFormModule.forRoot(), HlcClrModalModule ],
  declarations: [ AppComponent, FormInModalComponent ],
  bootstrap:    [ AppComponent ],
  providers: [],
  entryComponents: [ FormInModalComponent ]
})
export class AppModule { }
