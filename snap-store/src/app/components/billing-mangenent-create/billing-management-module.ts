export class Billing {
    id: number | null;
    billingName: string;
    description: string;
    barcode: string;
    expireDate: string;
    manufactureDate: string;
    price: number;
    discount: number;
    gst: number;
    remainingQty: number;
    totalQty: number;
    createdBy: number;
    modifiedBy: number;
    companyId: number;
    createdDate: string;
  
    constructor(billing?: Partial<Billing>) {
      this.id = billing?.id ?? null;
      this.billingName = billing?.billingName || '';
      this.description = billing?.description || '';
      this.barcode = billing?.barcode || '';
      this.expireDate = billing?.expireDate || '';
      this.manufactureDate = billing?.manufactureDate || '';
      this.price = billing?.price ?? 0;
      this.discount = billing?.discount ?? 0;
      this.gst = billing?.gst ?? 0;
      this.remainingQty = billing?.remainingQty ?? 0;
      this.totalQty = billing?.totalQty ?? 1;
      this.createdBy = billing?.createdBy ?? 0;
      this.modifiedBy = billing?.modifiedBy ?? 0;
      this.companyId = billing?.companyId ?? 0;
      this.createdDate = billing?.createdDate || '';
    }
  }
  