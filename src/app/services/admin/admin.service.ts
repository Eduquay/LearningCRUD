
import { HttpClient } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap, map, switchMap, filter, shareReplay, scan } from 'rxjs/operators';
import { AdminListResponse } from './admin.model';

@Injectable()
export class AdminService {

    adminApi = 'http://localhost:3000/api/v1/admin';
    updateAdminApi = 'http://localhost:3000/api/v1/admin/update';
    deleteAdminApi = 'http://localhost:3000/api/v1/admin/delete';

    private AdminSubject = new Subject<AdminListResponse>();
    AdminSubject$ = this.AdminSubject.asObservable();

    constructor(
        private httpClient: HttpClient,
    ) { }

    populateAdmin(): Observable<any> {
        return this.httpClient.get<AdminListResponse>(this.adminApi);
    }

    updateAdmin(requestInfo: any): Observable<any>{
        return this.httpClient.post<object>(this.updateAdminApi, requestInfo)
        this.populateAdmin();
    }

    deleteAdmin(requestInfo: any): Observable<any>{
        return this.httpClient.post<object>(this.deleteAdminApi, requestInfo)
        this.populateAdmin();
    }

    private handleError(err: any): Observable<never> {
        return throwError(err);
    }


}
