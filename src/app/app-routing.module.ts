import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { DepartmentComponent } from './department/department.component';
import { CourseComponent } from './course/course.component';

const routes: Routes = [
  {path: 'Home', component:HomeComponent, data:{title: 'Home'}},
  {path: 'Admin', component:AdminComponent, data:{title: 'Admin Master'}},
  {path: 'Department', component:DepartmentComponent, data:{title: 'Department Master'}},
  {path: 'Course', component:CourseComponent, data:{title: 'Course Master'}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const RoutingComponents = [
  AdminComponent,
  DepartmentComponent,
  CourseComponent
];
