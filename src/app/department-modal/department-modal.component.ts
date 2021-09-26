import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { departmentList, departmentUpdateResponse } from '../services/department/department.model';
import { departmentService } from '../services/department/department.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BridgeService } from 'src/app/services/bridge.service';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss'

@Component({
  selector: 'app-department-modal',
  templateUrl: './department-modal.component.html',
  styleUrls: ['./department-modal.component.css']
})
export class DepartmentModalComponent implements OnInit {

  departmentInfo: departmentList = {};
  departmentUpdateResponse: departmentUpdateResponse;

  txtName?: string = "";
  updateMode = "";

  departmentForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public modal: NgbActiveModal,
    private departmentService: departmentService,
    private bridgeService: BridgeService,
  ) { }

  ngOnInit(): void {
    this.updateMode = this.departmentInfo?.ID === null || this.departmentInfo?.ID === undefined ? "Add Department" : "Update Department - ";
    this.initialiseForm();
  }

  initialiseForm() {
    if (this.departmentInfo !== undefined) {
      this.departmentForm = this.formBuilder.group({
        Id: [this.departmentInfo.ID],
        Name: [this.departmentInfo.Name, [Validators.required, Validators.minLength(1), Validators.maxLength(100)]]
      });
    }
    else {
      this.departmentForm = this.formBuilder.group({
        Id: [''],
        Name: ['']
      });
    }
  }

  updatedepartment() {

    var requestDept = {
      requestDept: {
        "id": this.departmentInfo?.ID === undefined ? '0' : this.departmentInfo?.ID.toString(),
        "name": this.departmentForm.value.Name,
      }
    }

    var updateResponse = this.departmentService.updateDepartment(requestDept).subscribe(response => {
      this.departmentUpdateResponse = response;

      if (this.departmentUpdateResponse.status === 'true') {

        var sendObject = { type: 'admin', value: this.departmentInfo };
        this.bridgeService.publishData(sendObject);
        this.modal.dismiss();

        Swal.fire({
          icon: 'warning', title: "Status",
          text: 'Department info has been udpated!',
          showCancelButton: false, confirmButtonText: 'Ok'
        });

      }
      else {
        Swal.fire({
          icon: 'error', title: "Status",
          text: this.departmentUpdateResponse.message,
          showCancelButton: false, confirmButtonText: 'Ok'
        });
      }

    },
      (err: HttpErrorResponse) => {

      });
  }
}
