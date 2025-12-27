import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface RevenueMerchant {
  name: string;
  city: string;
  plan: 'basic' | 'pro';
  revenue: number;
  customers: number;
  washes: number;
  avgValue: number;
  growth: number;
}

interface TopMerchant {
  name: string;
  plan: 'basic' | 'pro';
  revenue: number;
  growth: number;
}

interface ChartData {
  label: string;
  value: number;
}

@Component({
  selector: 'app-system-revenue',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './system-revenue.component.html',
  styleUrls: ['./system-revenue.component.css']
})
export class SystemRevenueComponent implements OnInit {
  selectedPeriod: 'today' | 'week' | 'month' | 'year' = 'month';
  chartType: 'monthly' | 'yearly' = 'monthly';
  
  revenueData = {
    totalRevenue: 2458000,
    monthlyRevenue: 124500,
    growthRate: 12.5,
    monthlyTargetProgress: 75,
    avgTransaction: 47.5,
    totalTransactions: 5234,
    planRevenue: 198000,
    basicPlanRevenue: 78000,
    proPlanRevenue: 120000
  };
  
  topMerchants: TopMerchant[] = [
    { name: 'مغسلة النور', plan: 'pro', revenue: 45200, growth: 15.2 },
    { name: 'مغسلة النخبة', plan: 'pro', revenue: 38200, growth: 8.5 },
    { name: 'مغسلة الوادي', plan: 'basic', revenue: 21500, growth: 22.3 },
    { name: 'مغسلة الرياض', plan: 'pro', revenue: 19800, growth: 5.7 },
    { name: 'مغسلة الأمل', plan: 'basic', revenue: 12500, growth: 18.9 }
  ];
  
  revenueMerchants: RevenueMerchant[] = [
    { name: 'مغسلة النور', city: 'الرياض', plan: 'pro', revenue: 45200, customers: 42, washes: 210, avgValue: 215, growth: 15.2 },
    { name: 'مغسلة النخبة', city: 'جدة', plan: 'pro', revenue: 38200, customers: 38, washes: 191, avgValue: 200, growth: 8.5 },
    { name: 'مغسلة الوادي', city: 'الدمام', plan: 'basic', revenue: 21500, customers: 28, washes: 145, avgValue: 148, growth: 22.3 },
    { name: 'مغسلة الرياض', city: 'الرياض', plan: 'pro', revenue: 19800, customers: 35, washes: 180, avgValue: 110, growth: 5.7 },
    { name: 'مغسلة الأمل', city: 'مكة', plan: 'basic', revenue: 12500, customers: 22, washes: 120, avgValue: 104, growth: 18.9 },
    { name: 'مغسلة الغد', city: 'الطائف', plan: 'basic', revenue: 9800, customers: 18, washes: 95, avgValue: 103, growth: 12.4 },
    { name: 'مغسلة النجوم', city: 'الجبيل', plan: 'pro', revenue: 8500, customers: 15, washes: 78, avgValue: 109, growth: 7.8 },
    { name: 'مغسلة النهضة', city: 'الأحساء', plan: 'basic', revenue: 7200, customers: 14, washes: 68, avgValue: 106, growth: 14.2 }
  ];
  
  chartData: ChartData[] = [
    { label: 'يناير', value: 85 },
    { label: 'فبراير', value: 92 },
    { label: 'مارس', value: 78 },
    { label: 'أبريل', value: 95 },
    { label: 'مايو', value: 88 },
    { label: 'يونيو', value: 105 },
    { label: 'يوليو', value: 98 },
    { label: 'أغسطس', value: 112 },
    { label: 'سبتمبر', value: 125 },
    { label: 'أكتوبر', value: 118 },
    { label: 'نوفمبر', value: 132 },
    { label: 'ديسمبر', value: 142 }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadRevenueData();
  }

  loadRevenueData(): void {
    // In a real app, this would fetch data from an API
    console.log('Loading revenue data...');
  }

  selectPeriod(period: 'today' | 'week' | 'month' | 'year'): void {
    this.selectedPeriod = period;
    this.loadRevenueData();
  }

  getDateRangeText(): string {
    const now = new Date();
    switch (this.selectedPeriod) {
      case 'today':
        return now.toLocaleDateString('ar-SA', { weekday: 'long', day: 'numeric', month: 'long' });
      case 'week':
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        return `${weekStart.toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' })} - ${weekEnd.toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' })}`;
      case 'month':
        return now.toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' });
      case 'year':
        return now.toLocaleDateString('ar-SA', { year: 'numeric' });
      default:
        return now.toLocaleDateString('ar-SA');
    }
  }

  changeChartType(type: 'monthly' | 'yearly'): void {
    this.chartType = type;
    // Update chart data based on type
    if (type === 'yearly') {
      this.chartData = [
        { label: '2019', value: 85 },
        { label: '2020', value: 92 },
        { label: '2021', value: 105 },
        { label: '2022', value: 132 },
        { label: '2023', value: 185 },
        { label: '2024', value: 245 }
      ];
    } else {
      this.chartData = [
        { label: 'يناير', value: 85 },
        { label: 'فبراير', value: 92 },
        { label: 'مارس', value: 78 },
        { label: 'أبريل', value: 95 },
        { label: 'مايو', value: 88 },
        { label: 'يونيو', value: 105 },
        { label: 'يوليو', value: 98 },
        { label: 'أغسطس', value: 112 },
        { label: 'سبتمبر', value: 125 },
        { label: 'أكتوبر', value: 118 },
        { label: 'نوفمبر', value: 132 },
        { label: 'ديسمبر', value: 142 }
      ];
    }
  }

  viewTopMerchants(): void {
    this.router.navigate(['/superadmin/merchant-details']);
  }

  exportRevenueData(): void {
    // In a real app, this would trigger a file download
    console.log('Exporting revenue data...');
    alert('جاري تصدير بيانات الإيرادات...');
  }
}