export interface departmentListResponse {
    status?: string;
    message?: string;
    admin?: departmentList[]
  }
  
  export interface departmentList{
    ID?: number,
    Name?: string
  }
  
  export interface departmentUpdateResponse{
    status?: string;
    message?: string;
    result?: string;
  }