
# 🧾 Snapstore - Billing & Inventory Management System

Snapstore is a full-stack web application designed to simplify billing, customer tracking, and inventory management for general stores, supermarkets, or any small-to-medium retail business.
<img width="1710" alt="Screenshot 2025-06-22 at 3 59 12 PM" src="https://github.com/user-attachments/assets/de2b5b18-1c2b-4465-86bb-2ba99efc605b" />

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
<img width="1710" alt="Screenshot 2025-06-22 at 4 01 43 PM" src="https://github.com/user-attachments/assets/ca582f83-36ec-4958-9773-7b18e282965f" />
<img width="1710" alt="Screenshot 2025-06-22 at 4 02 16 PM" src="https://github.com/user-attachments/assets/6a186e3d-3c95-4b49-a76a-dfaac5fbc71b" />
<img width="1710" alt="Screenshot 2025-06-22 at 4 02 28 PM" src="https://github.com/user-attachments/assets/f4306835-7562-41cf-9724-546d3127f2c3" />
<img width="1710" alt="Screenshot 2025-06-22 at 4 02 55 PM" src="https://github.com/user-attachments/assets/c90e95de-bacb-4c59-a3ef-6320df304fc6" />
<img width="1710" alt="Screenshot 2025-06-22 at 4 03 10 PM" src="https://github.com/user-attachments/assets/e8fd964d-d0dd-4a9e-9ec4-04d1f766fa51" />


### 📦 Product List
<img width="1710" alt="Screenshot 2025-06-22 at 3 59 22 PM" src="https://github.com/user-attachments/assets/6c8bd030-f524-4dbc-a983-c0d2d28c2309" />
<img width="1710" alt="Screenshot 2025-06-22 at 3 59 34 PM" src="https://github.com/user-attachments/assets/888b0583-9794-429d-9ad1-8f73899bb6c4" />
<img width="1710" alt="Screenshot 2025-06-22 at 3 59 44 PM" src="https://github.com/user-attachments/assets/85259f9c-18a5-4b6b-a062-f36c4caf1b2e" />


### 👤 Customer Form
<img width="1710" alt="Screenshot 2025-06-22 at 4 00 33 PM" src="https://github.com/user-attachments/assets/3cd081a7-d3a4-4282-8020-22e6942a54e7" />
<img width="1710" alt="Screenshot 2025-06-22 at 4 01 11 PM" src="https://github.com/user-attachments/assets/55141b86-7651-441d-8c26-cc79defb6647" />
<img width="1710" alt="Screenshot 2025-06-22 at 4 01 24 PM" src="https://github.com/user-attachments/assets/946bd5fe-2231-46cd-b31d-6d222396a372" />
<img width="1710" alt="Screenshot 2025-06-22 at 4 02 02 PM" src="https://github.com/user-attachments/assets/82304b7a-6225-4a45-9938-d3564c0d9ea2" />



### 📈 Report Export
<img width="1710" alt="Screenshot 2025-06-22 at 4 03 20 PM" src="https://github.com/user-attachments/assets/08d6e49e-3547-4290-9756-5dabff006fac" />
<img width="1302" alt="Screenshot 2025-06-22 at 4 05 17 PM" src="https://github.com/user-attachments/assets/3c477566-f114-42f3-b7c4-55f52e1c0c89" />

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
