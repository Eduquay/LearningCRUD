import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BridgeService } from 'src/app/services/bridge.service';
import { AdminList, AdminUpdateResponse } from '../services/admin/admin.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss'
import { AdminService } from '../services/admin/admin.service';

@Component({
  selector: 'app-admin-modal',
  templateUrl: './admin-modal.component.html',
  styleUrls: ['./admin-modal.component.css']
})
export class AdminModalComponent implements OnInit {

  adminInfo: AdminList = {};

  adminUpdateResponse: AdminUpdateResponse;

  userForm: FormGroup;

  updateMode = "Add";


  txtName: string = "";
  txtEmailID: string = "";
  txtMobileNo: string = "";
  txtAddress: string = "";

  constructor(
    public modal: NgbActiveModal,
    private adminService: AdminService,
    private bridgeService: BridgeService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.updateMode = this.adminInfo?.ID === null || this.adminInfo?.ID === undefined ? "Add User" : "Update User - ";
    this.initialiseForm();
  }

  initialiseForm() {
    if (this.adminInfo !== undefined) {
      this.userForm = this.formBuilder.group({
        Id: [this.adminInfo.ID],
        Name: [this.adminInfo.Name, [Validators.required, Validators.minLength(3)]],
        EmailID: [this.adminInfo.EmailID, [Validators.required, Validators.email]],
        MobileNo: [this.adminInfo.MobileNo, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
        Address: [this.adminInfo.Address, [Validators.required]]
      });
    }
    else {
      this.userForm = this.formBuilder.group({
        Id: [''],
        Name: ['', [Validators.required, Validators.minLength(3)]],
        EmailID: ['', [Validators.required, Validators.minLength(3), Validators.email]],
        MobileNo: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
        Address: ['', [Validators.required]]
      });
    }
  }

  saveProduct() {

    var requestInfo = {
      requestInfo: {
        "id": this.adminInfo?.ID === undefined ? '0' : this.adminInfo?.ID.toString(),
        "name": this.userForm.value.Name,
        "emailId": this.userForm.value.EmailID,
        "mobileNo": this.userForm.value.MobileNo,
        "address": this.userForm.value.Address,
      }
    }

    var updateResponse = this.adminService.updateAdmin(requestInfo).subscribe(response => {
      this.adminUpdateResponse = response;

      if (this.adminUpdateResponse.status === 'true') {
          var sendObject = { type: 'admin', requestInfo };
          this.bridgeService.publishData(sendObject);
          this.modal.dismiss();

          Swal.fire({
            icon: 'warning', title: "Status",
            text: 'Admin info has been udpated!',
            showCancelButton: false, confirmButtonText: 'Ok'
          });  
      }
      else {
        Swal.fire({
          icon: 'error', title: "Status",
          text: this.adminUpdateResponse.message,
          showCancelButton: false, confirmButtonText: 'Ok'
        });
      }

    },
      (err: HttpErrorResponse) => {

      });
  }

}
