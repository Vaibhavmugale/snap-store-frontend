export class Product {
  id: number | null;
  productName: string;
  description: string;
  mrp: number;
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

  constructor(product?: Partial<Product>) {
    this.id = product?.id ?? null;
    this.productName = product?.productName || '';
    this.description = product?.description || '';
    this.mrp = product?.mrp || 0;
    this.expireDate = product?.expireDate || '';
    this.manufactureDate = product?.manufactureDate || '';
    this.price = product?.price ?? 0;
    this.discount = product?.discount ?? 0;
    this.gst = product?.gst ?? 0;
    this.remainingQty = product?.remainingQty ?? 0;
    this.totalQty = product?.totalQty ?? 1;
    this.createdBy = product?.createdBy ?? 0;
    this.modifiedBy = product?.modifiedBy ?? 0;
    this.companyId = product?.companyId ?? 0;
    this.createdDate = product?.createdDate || '';
  }
}
