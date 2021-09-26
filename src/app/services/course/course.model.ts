export interface courseListResponse {
    status?: string;
    message?: string;
    course?: courseList[]
  }
  
  export interface courseList{
    ID?: number,
    Name?: string,
    ShortName?: string,
    DepartmentCode?: string,
    Department?: string,
    CSDate?: string,
    CEDate?: string,
    CEDateFormat?: string,
    CSDateFormat?: string,
  }
  
  export interface courseUpdateResponse{
    status?: string;
    message?: string;
    result?: string;
  }

  export interface departmentListResponse {
    status?: string;
    message?: string;
    result?: departmentList[]
  }
  
  export interface departmentList{
    ID?: number,
    Name?: string,  
  }