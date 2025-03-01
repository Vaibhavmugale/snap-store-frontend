export class Customer {
    id: number | null;
    customerName: string;
    emailId: string;
    mobileNo: string;
    whatsappNo: string;
    createdBy: number;
    modifiedBy: number;
    createdDate: string;
  
    constructor(customer?: Partial<Customer>) {
      this.id = customer?.id ?? null;
      this.customerName = customer?.customerName || '';
      this.emailId = customer?.emailId || '';
      this.mobileNo = customer?.whatsappNo || '';
      this.whatsappNo = customer?.whatsappNo || '';
      this.createdBy = customer?.createdBy ?? 0;
      this.modifiedBy = customer?.modifiedBy ?? 0;
      this.createdDate = customer?.createdDate || '';
    }
  }
  