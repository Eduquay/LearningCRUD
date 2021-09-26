import { HttpClient } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap, map, switchMap, filter, shareReplay, scan } from 'rxjs/operators';
import { courseListResponse, departmentListResponse } from './course.model';

@Injectable()
export class courseService {

    RetrieveApi = 'http://localhost:3000/api/v1/course';
    DepartmentApi = 'http://localhost:3000/api/v1/course/department';
    updateCourseApi = 'http://localhost:3000/api/v1/course/update';

    private courseSubect = new Subject<courseListResponse>();
    courseSubect$ = this.courseSubect.asObservable();

    constructor(
        private httpClient: HttpClient,
    ) { }

    populateCourse(): Observable<any> {
        return this.httpClient.get<courseListResponse>(this.RetrieveApi);
    }

    loadDepartment(DepartmentCode: number): Observable<any> {
        return this.httpClient.get<departmentListResponse>(`${this.DepartmentApi}/${DepartmentCode}`);
    }

    updateCourse(courseInfo: any): Observable<any>{
        return this.httpClient.post<object>(this.updateCourseApi, courseInfo);
        this.populateCourse();
    }
}