import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomerManagementService } from '../customer-management/customer-management.service';
import { ProductService } from '../product/product.service';
import { ReportService } from './report.service';
import { NgSelectModule } from '@ng-select/ng-select';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  reportForm!: FormGroup;
  customers: any[] = [];
  products: any[] = [];

  constructor(
    private fb: FormBuilder,
    private getCustomerService: CustomerManagementService,
    private productService: ProductService,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.reportForm = this.fb.group({
      fromDate: [],
      toDate: [],
      customerId: [],
      productId: []
    });

    this.getCustomerService.fetchCustomer().subscribe(resp => {
      this.customers = resp;
    });

    this.productService.fetchProducts().subscribe(resp => {
      this.products = resp;
    });
  }

  generateReport(): void {
    const { fromDate, toDate, customerId, productId } = this.reportForm.value;
    const data = this.reportForm.value;

    const isFromDateSet = !!fromDate;
    const isToDateSet = !!toDate;
    const isCustomerSet = !!customerId;
    const isProductSet = !!productId;

    let filledCount = 0;
    if (isFromDateSet) filledCount++;
    if (isToDateSet) filledCount++;
    if (isCustomerSet) filledCount++;
    if (isProductSet) filledCount++;

    if (!isFromDateSet && !isToDateSet && !isCustomerSet && !isProductSet) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Filters',
        text: 'Please fill at least one filter to generate the report.',
      });
      return;
    }

    if ((isFromDateSet && !isToDateSet) || (!isFromDateSet && isToDateSet)) {
      Swal.fire({
        icon: 'error',
        title: 'Incomplete Date Range',
        text: 'Please select both From Date and To Date.',
      });
      return;
    }

    if (filledCount >= 3 && (!isFromDateSet || !isToDateSet)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Filter Combination',
        text: 'From Date and To Date are required when 3 or more filters are used.',
      });
      return;
    }

    Swal.fire({
      icon: 'info',
      title: 'Generating Report...',
      text: 'Your filters look good. Preparing the report...',
      timer: 1000,
      showConfirmButton: false,
    });

    this.reportService.generateReport(data).subscribe({
      next: (response) => {
        if (!response || response.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'No Data Available',
            text: 'No records found for the selected filters.',
          });
          return;
        }

        this.exportToExcel(response);
      },
      error: (error) => {
        console.error("Error generating report:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to generate report. Please try again.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  exportToExcel(response: any[]): void {
    const formattedData = response.map((item: any) => ({
      'Customer Name': item.customerName || '',
      'Customer Email': item.customerEmail || '',
      'Customer Phone': item.customerPhone || '',
      'Product Name': item.productName || '',
      'Price': item.price || 0,
      'Discount': item.discount || 0,
      'Gst': item.gst || 0,
      'Quantity': item.totalQty || 0,
      'Total Amount': item.total || 0,
      'Date': item.createdDate ? new Date(item.createdDate).toLocaleDateString() : ''
    }));

    const headers = Object.keys(formattedData[0]);
    const colCount = headers.length;

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);

    // Add title and merge it across columns
    XLSX.utils.sheet_add_aoa(worksheet, [['Consumption Report']], { origin: 'A1' });
    worksheet['!merges'] = [{
      s: { r: 0, c: 0 },
      e: { r: 0, c: colCount - 1 }
    }];

    // Add formatted data starting from row 3 (A3)
    XLSX.utils.sheet_add_json(worksheet, formattedData, { origin: 'A3' });

    // Center the title and add borders to all cells
    const range = XLSX.utils.decode_range(worksheet['!ref']!);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = worksheet[cellRef];
        if (cell) {
          if (!cell.s) cell.s = {};
          cell.s.alignment = { horizontal: R === 0 ? 'center' : 'left', vertical: 'center' };
          cell.s.border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' }
          };
          if (R === 0) {
            cell.s.font = { bold: true, sz: 14 };
          }
        }
      }
    }

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Report': worksheet },
      SheetNames: ['Report']
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
      cellStyles: true
    });

    const fileName = `Report_${new Date().toISOString().slice(0, 10)}.xlsx`;
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, fileName);
  }
}
