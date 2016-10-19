import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

import { Users } from '../pages/users/users';
import { Pay } from '../pages/pay/pay';

@NgModule({
  declarations: [
    MyApp,
    Users,
    Pay
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Users,
    Pay
  ],
  providers: []
})
export class AppModule {}
