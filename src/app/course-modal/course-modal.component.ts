import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { courseList, courseUpdateResponse, departmentList, departmentListResponse, } from '../services/course/course.model';
import { courseService } from '../services/course/course.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BridgeService } from 'src/app/services/bridge.service';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss'

@Component({
  selector: 'app-course-modal',
  templateUrl: './course-modal.component.html',
  styleUrls: ['./course-modal.component.css']
})
export class CourseModalComponent implements OnInit {

  courseInfo: courseList = {};
  courseUpdateResponse: courseUpdateResponse;

  departmentListResponse: departmentListResponse;
  departmentList: departmentList[];


  courseForm: FormGroup;

  updateMode = "Add";

  constructor(
    private formBuilder: FormBuilder,
    public modal: NgbActiveModal,
    private courseService: courseService,
    private bridgeService: BridgeService,
  ) { }

  ngOnInit(): void {
    this.loadDepartment();
    this.initialiseForm();
    this.updateMode = this.courseInfo?.ID === null || this.courseInfo?.ID === undefined ? "Add Course" : "Update";
  }

  loadDepartment(){

    this.departmentList = [];

    var categoryResponse = this.courseService.loadDepartment(0).subscribe(response => {
      this.departmentListResponse = response;
      if(this.departmentListResponse.status === 'true'){
        this.departmentList = this.departmentListResponse.result !== undefined ? this.departmentListResponse.result: [];
      }

    },
    (err: HttpErrorResponse) => {

    });
  }

  initialiseForm() {
    if (this.courseInfo !== undefined) {
      this.courseForm = this.formBuilder.group({
        Id: [this.courseInfo.ID],
        Name: [this.courseInfo.Name, [Validators.required, Validators.minLength(3)]],
        ShortName: [this.courseInfo.ShortName, [Validators.required, Validators.minLength(3)]],
        Department: [this.courseInfo.DepartmentCode === undefined ? "0" : this.courseInfo.DepartmentCode.toString(), [Validators.required]],
        CourseStartDate: [this.courseInfo.CSDateFormat, [Validators.required]],
        CourseEndDate: [this.courseInfo.CEDateFormat, [Validators.required]]
      });
    }
    else {
      this.courseForm = this.formBuilder.group({
        Id: [''],
        Name: ['', [Validators.required, Validators.minLength(3)]],
        ShortName: ['', [Validators.required, Validators.minLength(3)]],
        Department: ['0', [Validators.required]],
        CourseStartDate: ['', [Validators.required]],
        CourseEndDate: ['', [Validators.required]]
      });
    }
  }

  saveCourse() {

    var courseInfo = {
      courseInfo: {
        "id": this.courseInfo?.ID === undefined ? '0' : this.courseInfo?.ID.toString(),
        "name": this.courseForm.value.Name,
        "shortname": this.courseForm.value.ShortName,
        "department": this.courseForm.value.Department,
        "startdate": this.courseForm.value.CourseStartDate,
        "enddate": this.courseForm.value.CourseEndDate,
      }
    }

    var updateResponse = this.courseService.updateCourse(courseInfo).subscribe(response => {
      this.courseUpdateResponse = response;

      if (this.courseUpdateResponse.status === 'true') {
          var sendObject = { type: 'admin', courseInfo };
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
          text: this.courseUpdateResponse.message,
          showCancelButton: false, confirmButtonText: 'Ok'
        });
      }

    },
      (err: HttpErrorResponse) => {

      });
  }

}
