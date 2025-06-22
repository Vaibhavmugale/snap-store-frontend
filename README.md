
# 🧾 Snapstore - Billing & Inventory Management System

Snapstore is a full-stack web application designed to simplify billing, customer tracking, and inventory management for general stores, supermarkets, or any small-to-medium retail business.
[
https://github.com/user-attachments/assets/cbbfb754-8c5b-4483-8dfe-2316739d949b](https://github-production-user-asset-6210df.s3.amazonaws.com/114973368/457639940-123edbdf-97c1-4794-bbbd-800cacc3d7e9.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250622%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250622T104241Z&X-Amz-Expires=300&X-Amz-Signature=7c8b95b8ce8a2ff09505e0be25643f5e4abed67e41c585a14c3de79832200447&X-Amz-SignedHeaders=host)

---

## 🚀 Features

- 🧍‍♂️ **Customer Management**
  - Add, edit, and manage customers
  - Quick customer creation directly from billing or report screens

- 📦 **Product Management**
  - Add, edit, and view products with stock, expiry tracking
  - Inventory editing directly from product list

- 🧾 **Billing System**
  - Create invoices with real-time GST, discount, total price calculation
  - Supports auto-update of quantity and validations

- 📈 **Reports**
  - Filter by Customer, Product, and Date (From/To)
  - Download Excel reports (formatted and styled)

- 🔐 **User Role Access**
  - Admin can create users
  - Normal users can view only their own data

- 🔍 **Smart Search & Filter**
  - Filter customers/products easily
  - Search using name or barcode

- 📱 **Responsive UI**
  - Works well on mobile, tablet, and desktop

- ⚡ **Real-time Alerts**
  - SweetAlert-based success/failure messages
  - Angular reactive forms with full validation

---

## 🖼 Screenshots

### 📋 Billing Page
![Billing Page](./screenshots/billing-page.png)

### 📦 Product List
![Product List](./screenshots/product-list.png)

### 👤 Customer Form
![Customer Form](./screenshots/customer-form.png)

### 📈 Report Export
![Report Export](./screenshots/report-export.png)

---

## 🛠️ Tech Stack

### Frontend
- Angular 19
- TypeScript
- Bootstrap 5
- ng-select
- SweetAlert2
- xlsx (for Excel exports)

### Backend
- Java 17
- Spring Boot
- REST APIs

### Database
- MySQL 8+

---

## 🏗️ Architecture

- Monolithic backend
- Modular frontend with shared and isolated component structures
- Clean Controller → Service → Repository → Entity layering
- DTOs and request validation

---

## 📁 Folder Structure (Frontend)

```
apps/
├── components/             # All working components (billing, customer, product, report)
│   ├── billing/
│   ├── customer-management/
│   ├── product/
│   └── report/
├── api-configuration/      # All API URL configurations
├── header/                 # Sidebar and topbar components
├── dashboard/              # Dashboard UI
└── app.component.ts        # Entry component
```

---

## 📌 Project Highlights

- ✅ **Admin vs User Roles**
  - Admins can create users
  - Normal users have restricted access to their own data only

- ✅ **Quick Customer Add**
  - Shortcut button to add a new customer from billing or report if not found

- ✅ **Powerful Filtering for Reports**
  - By Customer
  - By Product
  - By From-To date
  - Combination of above
  - Download styled Excel sheets

- ✅ **Inventory System**
  - Manage stock and pricing in product list itself

---

## ⚙️ Setup Instructions

### 🔹 Clone the repository

```bash
git clone https://github.com/Vaibhavmugale/snap-store-frontend
git clone https://github.com/Vaibhavmugale/Snap-store-Backend
```

### 🔹 Frontend Setup

```bash
cd snapstore/frontend
npm install
ng serve
```

Open browser at: [http://localhost:4200](http://localhost:4200)

---

### 🔹 Backend Setup

```bash
cd snapstore/backend
mvn spring-boot:run
```

Spring Boot runs on: [http://localhost:8080](http://localhost:8080)

---

## 📦 Build for Production

```bash
ng build --configuration production
```

Upload the `dist/` folder to any static host like Netlify, Firebase, or custom server.

---

## 📃 License

This project is licensed under the MIT License.  
Feel free to use, extend, and contribute!

---

## 👨‍💻 Author

Developed with ❤️ by **Vaibhav Mugale**  
📧 Email: vaibhavmugale1234@gmail.com 
🔗 GitHub: https://github.com/Vaibhavmugale
