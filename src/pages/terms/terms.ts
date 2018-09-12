import {Component} from '@angular/core';
import {ViewController} from "ionic-angular";

@Component({
  selector: 'page-terms',
  templateUrl: 'terms.html'
})
export class Terms {

  constructor(private viewCtrl: ViewController) {}

  onClose() {
    this.viewCtrl.dismiss();
  }

}
