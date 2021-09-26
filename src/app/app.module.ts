import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule, RoutingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { AdminComponent } from './admin/admin.component';
import { AdminService } from './services/admin/admin.service';
import { AdminModalComponent } from './admin-modal/admin-modal.component';

import { DepartmentComponent } from './department/department.component';
import { departmentService } from './services/department/department.service';
import { DepartmentModalComponent } from './department-modal/department-modal.component';

import { CourseComponent } from './course/course.component';
import { courseService } from './services/course/course.service';
import { CourseModalComponent } from './course-modal/course-modal.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';



@NgModule({
  declarations: [
    AppComponent,
    RoutingComponents,
    HomeComponent,
    AdminComponent,
    AdminModalComponent,
    DepartmentComponent,
    DepartmentModalComponent,
    CourseComponent,    
    CourseModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule
  ],
  providers: [AdminService, departmentService, courseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
