export interface AdminListResponse {
    status?: string;
    message?: string;
    admin?: AdminList[]
  }
  
  export interface AdminList{
    ID?: number,
    Name?: string,
    EmailID?: string,
    MobileNo?: string,
    Address?: string
  }

  export interface AdminUpdateResponse{
    status?: string;
    message?: string;
    result?: string;
  }
  
  