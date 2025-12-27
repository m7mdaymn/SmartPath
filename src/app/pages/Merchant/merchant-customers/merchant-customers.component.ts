// merchant-customers.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Customer {
  id: number;
  name: string;
  phone: string;
  carPhoto: string | null;
  joinDate: string;
  currentWashes: number;
  totalWashesRequired: number;
  daysLeft: number;
  status: 'active' | 'inactive' | 'pending';
}

@Component({
  selector: 'app-merchant-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './merchant-customers.component.html',
  styleUrls: ['./merchant-customers.component.css']
})
export class MerchantCustomersComponent implements OnInit {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  searchTerm = '';
  
  totalCustomers = 0;
  activeCustomers = 0;
  pendingRewards = 0;

  constructor() {}

  ngOnInit(): void {
    this.loadCustomers();
    this.calculateStats();
  }

  loadCustomers(): void {
    this.customers = [
      {
        id: 1,
        name: 'أحمد محمد',
        phone: '0551234567',
        carPhoto: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&h=300&fit=crop',
        joinDate: '15 يناير',
        currentWashes: 8,
        totalWashesRequired: 10,
        daysLeft: 15,
        status: 'active'
      },
      {
        id: 2,
        name: 'سعيد خالد',
        phone: '0552345678',
        carPhoto: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&h=300&fit=crop',
        joinDate: '10 يناير',
        currentWashes: 10,
        totalWashesRequired: 10,
        daysLeft: 5,
        status: 'pending'
      },
      {
        id: 3,
        name: 'فهد علي',
        phone: '0553456789',
        carPhoto: null,
        joinDate: '5 يناير',
        currentWashes: 3,
        totalWashesRequired: 10,
        daysLeft: 25,
        status: 'active'
      },
      {
        id: 4,
        name: 'محمود سالم',
        phone: '0554567890',
        carPhoto: null,
        joinDate: '20 ديسمبر',
        currentWashes: 0,
        totalWashesRequired: 10,
        daysLeft: 0,
        status: 'inactive'
      }
    ];

    this.filteredCustomers = [...this.customers];
  }

  calculateStats(): void {
    this.totalCustomers = this.customers.length;
    this.activeCustomers = this.customers.filter(c => c.status === 'active').length;
    this.pendingRewards = this.customers.filter(c => c.status === 'pending').length;
  }

  filterCustomers(): void {
    if (!this.searchTerm.trim()) {
      this.filteredCustomers = [...this.customers];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredCustomers = this.customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTermLower) ||
      customer.phone.includes(searchTermLower)
    );
  }

  getProgress(customer: Customer): number {
    return (customer.currentWashes / customer.totalWashesRequired) * 100;
  }

  getTimeClass(daysLeft: number): string {
    if (daysLeft <= 5) return 'danger';
    if (daysLeft <= 15) return 'warning';
    return 'normal';
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'active': 'نشط',
      'inactive': 'غير نشط',
      'pending': 'قيد الانتظار'
    };
    return statusMap[status] || status;
  }

  openAddCustomerModal(): void {
    console.log('Opening add customer modal...');
    alert('ميزة إضافة عميل جديدة - قيد التطوير');
  }

  viewCustomer(customer: Customer): void {
    console.log('Viewing customer:', customer);
    alert(`عرض تفاصيل العميل: ${customer.name}`);
  }

  recordWash(customer: Customer): void {
    console.log('Recording wash for:', customer);
    alert(`تسجيل غسلة للعميل: ${customer.name}`);
  }
}