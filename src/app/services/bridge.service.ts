import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BridgeService {

  private subject = new Subject<any>();

  constructor() { }

  publishData(message: any){
    this.subject.next(message);
  }

  receiveData(): Observable<any>{
    return this.subject.asObservable();
  }

  clearData(){
    this.subject.next();
  }


}
