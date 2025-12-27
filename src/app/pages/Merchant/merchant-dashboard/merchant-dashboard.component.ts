// merchant-dashboard.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';

interface DashboardStats {
  totalCustomers: number;
  newCustomersToday: number;
  washesToday: number;
  lastWashTime: string;
  todayRevenue: number;
  rewardsGiven: number;
  pendingRewards: number;
}

interface Activity {
  type: 'wash' | 'customer' | 'reward' | 'revenue';
  title: string;
  description: string;
  time: string;
}

interface LoyaltySettings {
  rewardName: string;
  washesRequired: number;
  timePeriod: number;
}

@Component({
  selector: 'app-merchant-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './merchant-dashboard.component.html',
  styleUrls: ['./merchant-dashboard.component.css']
})
export class MerchantDashboardComponent implements OnInit, OnDestroy {
  merchantData = {
    businessName: 'مغسلة النور',
    city: 'الرياض',
    plan: 'pro' as 'basic' | 'pro'
  };

  dashboardStats: DashboardStats = {
    totalCustomers: 42,
    newCustomersToday: 3,
    washesToday: 18,
    lastWashTime: '10:30 صباحاً',
    todayRevenue: 540,
    rewardsGiven: 5,
    pendingRewards: 2
  };

  recentActivity: Activity[] = [
    {
      type: 'wash',
      title: 'غسلة جديدة',
      description: 'أحمد محمد - غسلة كاملة',
      time: 'منذ 5 دقائق'
    },
    {
      type: 'customer',
      title: 'عميل جديد',
      description: 'محمود سالم سجل كمغسلة',
      time: 'منذ 15 دقيقة'
    },
    {
      type: 'reward',
      title: 'مكافأة مستحقة',
      description: 'سعيد خالد استحق غسلة مجانية',
      time: 'منذ 30 دقيقة'
    },
    {
      type: 'revenue',
      title: 'دفعة جديدة',
      description: 'تم تحصيل 150 ريال',
      time: 'منذ ساعة'
    }
  ];

  loyaltySettings: LoyaltySettings = {
    rewardName: 'غسلة مجانية',
    washesRequired: 10,
    timePeriod: 30
  };

  private refreshSubscription!: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Refresh data every 30 seconds
    this.refreshSubscription = interval(30000).subscribe(() => {
      this.refreshDashboardData();
    });
  }

  refreshDashboardData(): void {
    // Simulate API call to refresh data
    console.log('Refreshing dashboard data...');
    
    // Update some stats randomly
    this.dashboardStats.washesToday += Math.floor(Math.random() * 3);
    this.dashboardStats.todayRevenue += Math.floor(Math.random() * 50);
  }

  getTimeAgo(timeString: string): string {
    // Simple time formatting
    return `آخر غسلة ${timeString}`;
  }

  scanQR(): void {
    this.router.navigate(['/merchant/scan-qr']);
  }

  navigateTo(route: string): void {
    this.router.navigate([`/merchant/${route}`]);
  }

  addCustomer(): void {
    // Implementation for adding customer
    console.log('Opening add customer modal...');
    this.router.navigate(['/merchant/customers'], { queryParams: { add: 'true' } });
  }

  viewCustomers(): void {
    this.router.navigate(['/merchant/customers']);
  }

  viewReports(): void {
    // Implementation for viewing reports
    console.log('Opening reports...');
  }

  editLoyaltySettings(): void {
    // Implementation for editing loyalty settings
    console.log('Editing loyalty settings...');
  }

  viewAllActivity(): void {
    this.router.navigate(['/merchant/activity-logs']);
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
}