import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { Pay } from "../pay/pay";
import { BarcodeScanner } from 'ionic-native';

/*
  Generated class for the Users page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
  styles:['ion-content button {background-color: #f27e11;}']
})
export class Users {
  phone: string;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController) {
    this.phone = "787-123-1234";
  }

  openQRScan(){
    BarcodeScanner.scan().then((barcodeData) => {
      // Success! Barcode data is here
      //alert(JSON.stringify(barcodeData));
      var data = JSON.parse(barcodeData.text);

      if(barcodeData.cancelled === 0 || !barcodeData.cancelled) {
        var xhr = new XMLHttpRequest();
        var url = "http://api.salaera.com/receipts";
        var params = "bundle="+ data.bundleId +"&auth_key="+ data.auth_key +"&transaction="+ data.transaction;
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = (function(self, json) {
          return function() {
           // alert(xhr.readyState + " " + xhr.status + " " + self.phone);
            if (xhr.readyState == 4 && xhr.status == 200) {
              //alert(json);
              json.qr = true;
              json.phone = self.phone;

              let modal = self.modalCtrl.create(Pay, {data: json});
              modal.present();
            }
          }
        })(this, data);
        xhr.send(params);
      }

    }, (err) => {
      // An error occurred
      alert(err);
    });
  }

}
