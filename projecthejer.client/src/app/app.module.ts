import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CustomerLeadManagerComponent } from './components/customer-lead-manager.component';
import { ImageGalleryComponent } from './components/image-gallery.component';

@NgModule({
  declarations: [
    AppComponent,
    CustomerLeadManagerComponent,
    ImageGalleryComponent
  ],
  imports: [
    BrowserModule, 
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
