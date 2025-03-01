export class User {
    id: number | null;
    userName: string;
    password: string;
    password2: string;
    emailId: string;
    mobileNo: string;
    whatsappNo: string;
    companyName: string;
    usertype: number;
    createdBy: number;
    modifiedBy: number;
    createdDate: string;
    userStatus: number;
  
    constructor(user?: Partial<User>) {
      this.id = user?.id ?? null;
      this.userName = user?.userName || '';
      this.password = user?.password || '';
      this.password2 = user?.password2 || '';
      this.emailId = user?.emailId || '';
      this.mobileNo = user?.mobileNo || '';
      this.whatsappNo = user?.whatsappNo || '';
      this.companyName = user?.companyName ?? '';
      this.usertype = user?.usertype ?? 0;
      this.createdBy = user?.createdBy ?? 0;
      this.modifiedBy = user?.modifiedBy ?? 0;
      this.userStatus = user?.userStatus ?? 0;
      this.createdDate = user?.createdDate || '';
    }
  }
  