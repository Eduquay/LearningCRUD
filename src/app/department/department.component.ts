import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EMPTY, Subject, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BridgeService } from 'src/app/services/bridge.service';
import { departmentList, departmentListResponse } from '../services/department/department.model';
import { departmentService } from '../services/department/department.service';
import { DepartmentModalComponent } from '../department-modal/department-modal.component';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {

  departmentForm?: FormGroup;
  sub: Subscription = new Subscription();

  departmentList: departmentList[] = [];
  departmentSearchedList: departmentList[] = [];
  departmentListResponse: departmentListResponse = {};

  errorMessage: any = "";
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  searchText="";
  alertType="";

  constructor(
    private formBuilder: FormBuilder,
    private departmentService: departmentService,
    private bridgeService: BridgeService,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.populateDepartmentList();
    this.watchEvent();
  }

  updateDepartment : departmentList = {};
  watchEvent(){
    this.bridgeService.receiveData().subscribe(response => {
      this.updateDepartment = response;
      console.log(this.updateDepartment);

      if(response.type !== 'admin') {return;}

      var selectedItem = this.departmentList.find(item => item.ID === this.updateDepartment.ID);

      this.populateDepartmentList();

    });
  }

  populateDepartmentList() {
    this.errorMessage = '';
    var response = this.departmentService.populateDepartment()
      .subscribe(httpResponse => {
        this.departmentListResponse = httpResponse;
        if (this.departmentListResponse.status === 'true') {
          this.departmentList = this.departmentSearchedList = this.departmentListResponse.admin !== undefined ? this.departmentListResponse.admin : [];
        }
        else {
          this.errorMessage = this.departmentListResponse.message;
          this.alertType = "alert-danger";
        }
      },
        (err: HttpErrorResponse) => {
          console.log(err);
        });
  }

  insertDepartment() {
    var modalOptions = {
      centered: true,
      size: 'lg',
      scrollable: true,
      ariaLabelledBy: 'modal-basic-title'
    };
   var modalRef = this.modalService.open(DepartmentModalComponent, modalOptions);
  }

  editDepartment(itemObject: departmentList){
    var modalOptions = {
      centered: true,
      size: 'lg',
      scrollable: true,
      ariaLabelledBy: 'modal-basic-title'
    };
    var modalRef = this.modalService.open(DepartmentModalComponent, modalOptions);
    modalRef.componentInstance.departmentInfo = itemObject; // Department Information

  }

  async removeDepartment(item: departmentList) {

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

    var updateResponse = this.departmentService.deleteDepartment(requestInfo).subscribe(response => {
      this.departmentListResponse = response;

      if (this.departmentListResponse.status === 'true') {

        var sendObject = { type: 'admin', requestInfo };
        this.bridgeService.publishData(sendObject);

        Swal.fire({
          icon: 'warning', title: "Status",
          text: 'Department info has been deleted!',
          showCancelButton: false, confirmButtonText: 'Ok'
        });

      }
      else {
        Swal.fire({
          icon: 'error', title: "Status",
          text: this.departmentListResponse.message,
          showCancelButton: false, confirmButtonText: 'Ok'
        });
      }
    },
      (err: HttpErrorResponse) => {

      });
  }

  searchedText()
  {
    this.errorMessage = '';

    if(this.searchText !== ''){
    this.departmentSearchedList = this.departmentList.filter(
      dept => dept.Name !==undefined && dept.Name?.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0
      );
      if(this.departmentSearchedList.length <= 0){
        this.errorMessage = "Oops!, No Data Exists";
        this.alertType = "alert-warning";
      }
      
    }
    else{
      this.departmentSearchedList = this.departmentList;
    }
  }

}
