import { HttpClient } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap, map, switchMap, filter, shareReplay, scan } from 'rxjs/operators';
import { departmentListResponse } from './department.model';

@Injectable()
export class departmentService {

    departmentApi = 'http://localhost:3000/api/v1/department';
    updatedepartmentApi = 'http://localhost:3000/api/v1/department/update';
    deletedepartmentApi = 'http://localhost:3000/api/v1/department/delete';

    private departmentSubject = new Subject<departmentListResponse>();
    departmentSubject$ = this.departmentSubject.asObservable();

    constructor(
        private httpClient: HttpClient,
    ) { }

    populateDepartment(): Observable<any> {
        return this.httpClient.get<departmentListResponse>(this.departmentApi);
    }

    updateDepartment(requestDept: any): Observable<any>{
        return this.httpClient.post<object>(this.updatedepartmentApi, requestDept)
    }

    deleteDepartment(requestInfo: any): Observable<any>{
        return this.httpClient.post<object>(this.deletedepartmentApi, requestInfo)
    }
}