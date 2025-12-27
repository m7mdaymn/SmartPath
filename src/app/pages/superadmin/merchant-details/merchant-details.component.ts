import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Merchant {
  id: number;
  businessName: string;
  ownerName: string;
  email: string;
  city: string;
  plan: 'basic' | 'pro';
  customers: number;
  customersGrowth: number;
  totalWashes: number;
  joinDate: string;
  status: 'active' | 'inactive' | 'pending';
}

interface Statistics {
  totalBusinesses: number;
  activeBusinesses: number;
  inactiveBusinesses: number;
  totalCustomers: number;
  customerGrowth: number;
  totalWashes: number;
  last30DaysWashes: number;
  avgWashesPerDay: number;
  totalRewards: number;
  redeemedRewards: number;
  basicPlanCount: number;
  proPlanCount: number;
  basicAvgCustomers: number;
  basicAvgWashes: number;
  proAvgCustomers: number;
  proAvgWashes: number;
  activeBusinessesGrowth: number;
  avgWashesPerBusiness: number;
  avgWashesGrowth: number;
}

interface PlatformSettings {
  name: string;
  supportEmail: string;
  supportPhone: string;
  basicPlanPrice: number;
  proPlanPrice: number;
  trialPeriod: number;
  emailNotifications: boolean;
  smsNotifications: boolean;
  renewalReminders: boolean;
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

@Component({
  selector: 'app-merchant-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './merchant-details.component.html',
  styleUrls: ['./merchant-details.component.css']
})
export class MerchantDetailsComponent implements OnInit {
  activeTab: 'merchants' | 'statistics' | 'platform' = 'merchants';
  searchTerm = '';
  isSaving = false;
  
  merchantsData: Merchant[] = [];
  filteredMerchants: Merchant[] = [];
  
  statistics: Statistics = {
    totalBusinesses: 68,
    activeBusinesses: 52,
    inactiveBusinesses: 12,
    totalCustomers: 1245,
    customerGrowth: 15.3,
    totalWashes: 5234,
    last30DaysWashes: 425,
    avgWashesPerDay: 14.2,
    totalRewards: 312,
    redeemedRewards: 189,
    basicPlanCount: 42,
    proPlanCount: 26,
    basicAvgCustomers: 18,
    basicAvgWashes: 95,
    proAvgCustomers: 32,
    proAvgWashes: 165,
    activeBusinessesGrowth: 8.2,
    avgWashesPerBusiness: 77,
    avgWashesGrowth: 12.5
  };
  
  platformSettings: PlatformSettings = {
    name: 'Digital Pass',
    supportEmail: 'support@digitalpass.com',
    supportPhone: '0548290509',
    basicPlanPrice: 99,
    proPlanPrice: 149,
    trialPeriod: 7,
    emailNotifications: true,
    smsNotifications: false,
    renewalReminders: true,
    maintenanceMode: false,
    maintenanceMessage: 'نظام الصيانة قيد التطوير حالياً، سوف نعود قريباً.'
  };

  constructor() {}

  ngOnInit(): void {
    this.loadMerchants();
  }

  loadMerchants(): void {
    // Simulate API call
    setTimeout(() => {
      this.merchantsData = [
        { id: 1, businessName: 'مغسلة النور', ownerName: 'محمد أحمد', email: 'nour@example.com', city: 'الرياض', plan: 'pro', customers: 42, customersGrowth: 15.2, totalWashes: 210, joinDate: '2023-10-15', status: 'active' },
        { id: 2, businessName: 'مغسلة النخبة', ownerName: 'سالم علي', email: 'nokhba@example.com', city: 'جدة', plan: 'pro', customers: 38, customersGrowth: 8.5, totalWashes: 191, joinDate: '2023-11-20', status: 'active' },
        { id: 3, businessName: 'مغسلة الوادي', ownerName: 'خالد محمود', email: 'wadi@example.com', city: 'الدمام', plan: 'basic', customers: 28, customersGrowth: 22.3, totalWashes: 145, joinDate: '2023-08-10', status: 'active' },
        { id: 4, businessName: 'مغسلة الأمل', ownerName: 'نورة سعيد', email: 'amal@example.com', city: 'مكة', plan: 'basic', customers: 22, customersGrowth: 18.9, totalWashes: 120, joinDate: '2024-01-05', status: 'inactive' },
        { id: 5, businessName: 'مغسلة الغد', ownerName: 'فهد راشد', email: 'ghad@example.com', city: 'الطائف', plan: 'basic', customers: 18, customersGrowth: 12.4, totalWashes: 95, joinDate: '2024-02-15', status: 'pending' },
        { id: 6, businessName: 'مغسلة النجوم', ownerName: 'ماجد سلطان', email: 'njoom@example.com', city: 'الجبيل', plan: 'pro', customers: 15, customersGrowth: 7.8, totalWashes: 78, joinDate: '2024-01-25', status: 'active' }
      ];
      this.filteredMerchants = this.merchantsData;
    }, 500);
  }

  setActiveTab(tab: 'merchants' | 'statistics' | 'platform'): void {
    this.activeTab = tab;
  }

  getActiveMerchantsCount(): number {
    return this.merchantsData.filter(m => m.status === 'active').length;
  }

  filterMerchants(): void {
    if (!this.searchTerm.trim()) {
      this.filteredMerchants = this.merchantsData;
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredMerchants = this.merchantsData.filter(merchant =>
      merchant.businessName.toLowerCase().includes(term) ||
      merchant.ownerName.toLowerCase().includes(term) ||
      merchant.email.toLowerCase().includes(term) ||
      merchant.city.toLowerCase().includes(term)
    );
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      case 'pending': return 'بانتظار التفعيل';
      default: return 'غير معروف';
    }
  }

  editMerchant(id: number): void {
    console.log('Editing merchant:', id);
    // Open edit modal or navigate to edit page
    alert(`تعديل المغسلة رقم ${id}`);
  }

  toggleMerchantStatus(id: number): void {
    const merchant = this.merchantsData.find(m => m.id === id);
    if (merchant) {
      if (merchant.status === 'active') {
        merchant.status = 'inactive';
      } else {
        merchant.status = 'active';
      }
      this.filterMerchants();
    }
  }

  addMerchant(): void {
    console.log('Adding new merchant');
    alert('فتح نموذج إضافة مغسلة جديدة');
  }

  exportMerchants(): void {
    console.log('Exporting merchants data');
    alert('جاري تصدير بيانات المتاجر...');
  }

  saveSettings(): void {
    this.isSaving = true;
    // Simulate API call
    setTimeout(() => {
      console.log('Saving settings:', this.platformSettings);
      this.isSaving = false;
      alert('تم حفظ الإعدادات بنجاح!');
    }, 1000);
  }

  loadSettings(): void {
    console.log('Refreshing settings');
    this.loadMerchants();
    // Reload other settings data
  }

  onMaintenanceToggle(): void {
    if (this.platformSettings.maintenanceMode) {
      const confirm = window.confirm('هل أنت متأكد من تفعيل وضع الصيانة؟ سيتوقف النظام مؤقتاً.');
      if (!confirm) {
        this.platformSettings.maintenanceMode = false;
      }
    }
  }
}