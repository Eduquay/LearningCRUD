import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EMPTY, Subject, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BridgeService } from 'src/app/services/bridge.service';
import { AdminList, AdminListResponse } from '../services/admin/admin.model';
import { AdminService } from '../services/admin/admin.service';
import Swal from 'sweetalert2';
import { AdminModalComponent } from '../admin-modal/admin-modal.component';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  sub: Subscription = new Subscription();

  AdminList: AdminList[] = []; // binder - comunicator to view
  AdminSearchedList: AdminList[] = []; // search
  AdminReceivedList: AdminList[] = [];

  AdminListResponse: AdminListResponse = {};

  errorMessage: any = "";
  alertType = "alert-danger";
  searchText = "";
  limit: number = 30;

  // Error messages
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  constructor(
    private AdminService: AdminService,
    private modalService: NgbModal,
    private bridgeService: BridgeService
  ) { }

  ngOnInit(): void {
    this.populateAdminList();
    this.watchEvent();
  }

  populateAdminList() {
    this.errorMessage = '';
    var response = this.AdminService.populateAdmin()
      .subscribe(httpResponse => {
        this.AdminListResponse = httpResponse;
        if (this.AdminListResponse.status === 'true') {
          this.AdminReceivedList = this.AdminListResponse.admin !== undefined ? this.AdminListResponse.admin : []; // 240
          this.AdminList = this.AdminListResponse.admin !== undefined ? this.AdminListResponse.admin.slice(0,  this.limit) : []; // 30
        }
        else {
          this.errorMessage = this.AdminListResponse.message;
          this.alertType = "alert-danger";
        }
      },
        (err: HttpErrorResponse) => {
          console.log(err);
        });
  }

  updateAdmin : AdminList = {};
  watchEvent(){
    this.bridgeService.receiveData().subscribe(response => {
      this.updateAdmin = response;
      console.log(this.updateAdmin);

      if(response.type !== 'admin') {return;}

      var selectedItem = this.AdminList.find(item => item.ID === this.updateAdmin.ID);

      this.populateAdminList();

    });
  }

  insertAdmin() {
    var modalOptions = {
      centered: true,
      size: 'lg',
      scrollable: true,
      ariaLabelledBy: 'modal-basic-title'
    };
    var modalRef = this.modalService.open(AdminModalComponent, modalOptions);
  }

  editAdmin(itemObject: AdminList) {
    var modalOptions = {
      centered: true,
      size: 'lg',
      scrollable: true,
      ariaLabelledBy: 'modal-basic-title'
    };
    var modalRef = this.modalService.open(AdminModalComponent, modalOptions);
    modalRef.componentInstance.adminInfo = itemObject; // admin information

  }

  async removeProduct(item: AdminList) {

    var confirm = await Swal.fire({
      title: 'Are you sure to delete admin details?',
      text: "You won't be able to revert this!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '$success',
      cancelButtonColor: '$danger',
      confirmButtonText: 'Confirm'
    }).then((result) => {
      return new Promise((resolve, reject) => {
        if (result.value) {
          resolve('true');
        } else {
          resolve('false');
        }
      });
    });

    if (confirm === 'false') { 
      return; 
    }

    var requestInfo = {
      "id": item.ID
    }

    var updateResponse = this.AdminService.deleteAdmin(requestInfo).subscribe(response => {
      this.AdminListResponse = response;

      if (this.AdminListResponse.status === 'true') {

        var sendObject = { type: 'admin', requestInfo };
        this.bridgeService.publishData(sendObject);
        this.populateAdminList();

        Swal.fire({
          icon: 'warning', title: "Status",
          text: 'Admin info has been deleted!',
          showCancelButton: false, confirmButtonText: 'Ok'
        });

      }
      else {
        Swal.fire({
          icon: 'error', title: "Status",
          text: this.AdminListResponse.message,
          showCancelButton: false, confirmButtonText: 'Ok'
        });
      }
    },
      (err: HttpErrorResponse) => {

      });
  }


  fineGrained(){
    this.errorMessage = '';
    this.AdminSearchedList = [];
    if(this.searchText !== ''){
    this.AdminSearchedList = this.AdminReceivedList.filter(
      adm => adm.Name !==undefined && adm.Name?.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0
      || adm.EmailID !==undefined && adm.EmailID?.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0
      || adm.MobileNo?.toString().substr(0, this.searchText.length) === this.searchText.toLowerCase()
      || adm.Address !==undefined && adm.Address?.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0
      );
      if(this.AdminSearchedList.length <= 0){
        this.errorMessage = "Oops!, No Data Exists";
        this.alertType = "alert-warning";
      }
      this.AdminList = this.AdminSearchedList.length > 0 ? this.AdminSearchedList.slice(0, this.limit): [];
    }
    else{
      this.AdminList = this.AdminReceivedList.slice(0, this.limit);
    }
  }

  
  onScroll() {
    console.log('Event');
    if (this.searchText.length <= 0) {
      if (this.AdminList.length < this.AdminReceivedList.length) {
        var len = this.AdminList.length;
        var actualLimit = this.AdminReceivedList.length - len > this.limit ? this.limit : this.AdminReceivedList.length - len;
        for (let index = len; index < len + actualLimit; index++) {
          this.AdminList.push(this.AdminReceivedList[index]);
        }
      }
    }
    else{
      if(this.AdminList.length < this.AdminSearchedList.length){
        var len = this.AdminList.length;
        var actualLimit = this.AdminSearchedList.length - len > this.limit ? this.limit : this.AdminSearchedList.length - len;
        for (let index = len; index < len + actualLimit; index++) {
          this.AdminList.push(this.AdminSearchedList[index]);
        }
      }
    }
  }
}

