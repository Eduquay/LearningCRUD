import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EMPTY, Subject, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import { courseList, courseListResponse } from '../services/course/course.model';
import { courseService } from '../services/course/course.service';
import { BridgeService } from 'src/app/services/bridge.service';
import { CourseModalComponent } from '../course-modal/course-modal.component';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  courseForm?: FormGroup;
  sub: Subscription = new Subscription();

  courseList: courseList[] = [];
  searchedCourseList: courseList[] = [];
  courseListResponse: courseListResponse = {};

  searchText = "";
  alertType = "";

  errorMessage: any = "";
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  constructor(
    private formBuilder: FormBuilder,
    private courseService: courseService,
    private bridgeService: BridgeService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.populateCourseList();
  }

  populateCourseList() {
    this.errorMessage = '';
    var response = this.courseService.populateCourse()
      .subscribe(httpResponse => {
        this.courseListResponse = httpResponse;
        if (this.courseListResponse.status === 'true') {
          this.courseList = this.searchedCourseList = this.courseListResponse.course !== undefined ? this.courseListResponse.course : [];
        }
        else {
          this.errorMessage = this.courseListResponse.message;
          this.alertType = "alert-danger";
        }
      },
        (err: HttpErrorResponse) => {
          console.log(err);
        });
  }

  insertCourse() {
    var modalOptions = {
      centered: true,
      size: 'lg',
      scrollable: true,
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'right'
    };
    var modalRef = this.modalService.open(CourseModalComponent, modalOptions);
  }

  editCourse(itemObject: courseList) {
    var modalOptions = {
      centered: true,
      size: 'lg',
      scrollable: true,
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'right'
    };
    var modalRef = this.modalService.open(CourseModalComponent, modalOptions);
    modalRef.componentInstance.courseInfo = itemObject; // admin information

  }

  searchedText() {
    this.errorMessage = '';

    if(this.searchText !== ''){
    this.searchedCourseList = this.courseList.filter(
      crs => crs.Name !==undefined && crs.Name?.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0
      || crs.ShortName !==undefined && crs.ShortName?.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0
      || crs.Department !==undefined && crs.Department?.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0
      );
      if(this.searchedCourseList.length <= 0){
        this.errorMessage = "Oops!, No Data Exists";
        this.alertType = "alert-warning";
      }
      
    }
    else{
      this.searchedCourseList = this.courseList;
    }
  }

}
