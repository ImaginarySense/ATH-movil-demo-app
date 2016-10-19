import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

/*
  Generated class for the Pay page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-pay',
  templateUrl: 'pay.html',
  styles:['ion-content button {background-color: #f27e11;}']
})
export class Pay {
  public amount: string;
  public phoneNumber: string;
  public data: any;

  constructor(params: NavParams, public navCtrl: NavController) {
    this.data = params.get("data");
    this.amount = "$"+this.data.amount;
    this.phoneNumber = this.data.storeName;
  }

  pay(){

    if(this.data.qr){
      this.payWeb();
    }else{
      this.payApp();
    }
  }

  payWeb(){
    var xhr = new XMLHttpRequest();
    var url = "http://athmapi.westus.cloudapp.azure.com/athm/requestPayment";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");

    xhr.onreadystatechange = (function(self, http) {
      return function() {
      if (http.readyState == 4 && http.status == 200) {
        var response = JSON.parse(http.responseText);

        var xhr = new XMLHttpRequest();
        var params = "bundle="+ self.data.bundleId +"&auth_key="+ self.data.auth_key +"&transaction="+ self.data.transaction+"&status=2&data="+JSON.stringify(response);
        xhr.open("POST", "http://api.salaera.com/receipts", true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange =  (function(self2, http2) {
          return function() {
            if (http2.readyState == 4 && http2.status == 200) {
              self2.dismiss();
            }
          }
        })(self, xhr);

        xhr.send(params);
      }
      }
    })(this, xhr);

    var data = JSON.stringify({"token":this.data.token,"phone":this.data.phone,"amount":this.data.amount});
    xhr.send(data);
  }

  payApp(){

  }

  dismiss(){
    this.navCtrl.pop();
  }

}
