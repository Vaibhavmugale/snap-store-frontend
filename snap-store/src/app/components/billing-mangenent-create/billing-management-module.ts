export class Billing {
  id: number | null;
  totalAmount: number;
  totalGst: number;
  totalDisc: number;
  selectedCustomer: any;
  quantity: string;
  price: number;
   userId: number;
  remainingQty: number;
  totalQty: number;
  createdBy: number;
  modifiedBy: number;
  companyId: number;
  createdDate: string;
  selectedProducts: any;

  constructor(billing?: Partial<Billing>) {
    this.id = billing?.id ?? null;
    this.totalAmount = billing?.totalAmount ?? 0;
    this.totalGst = billing?.totalGst ?? 0;
    this.totalDisc = billing?.totalDisc ?? 0;
    this.selectedCustomer = billing?.selectedCustomer ?? null;
    this.quantity = billing?.quantity ?? '';
    this.price = billing?.price ?? 0;
    this.userId = billing?.userId ?? 0;
    this.remainingQty = billing?.remainingQty ?? 0;
    this.totalQty = billing?.totalQty ?? 1;
    this.createdBy = billing?.createdBy ?? 1;
    this.modifiedBy = billing?.modifiedBy ?? 1;
    this.companyId = billing?.companyId ?? 1;
    this.createdDate = billing?.createdDate ?? '';
    this.selectedProducts = billing?.selectedProducts ?? null;
  }
}
