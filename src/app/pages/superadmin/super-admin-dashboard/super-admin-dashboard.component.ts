// super-admin-dashboard.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './super-admin-dashboard.component.html', // تأكد من الاسم الصحيح هنا
  styleUrls: ['./super-admin-dashboard.component.css'],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class SuperAdminDashboardComponent implements OnInit, OnDestroy {
  currentTime = '';
  private timeSubscription!: Subscription;
  
  systemData = {
    totalCustomers: 1245,
    totalMerchants: 68,
    totalRevenue: 245800,
    activeWashes: 42,
    stats: {
      monthlyGrowth: 23.5,
      systemUptime: 99.8,
      avgTransactionValue: 47.50,
      totalTransactions: 5234
    }
  };
  
  recentActivity = [
    {
      icon: '👥',
      type: 'success',
      title: 'مستخدم جديد مسجل',
      description: 'محمد أحمد سجل كمغسلة سيارات',
      time: 'منذ 5 دقائق',
      status: 'success',
      statusText: 'مكتمل'
    },
    {
      icon: '💰',
      type: 'info',
      title: 'تجديد اشتراك',
      description: 'مغسلة النور جددت اشتراك Pro',
      time: 'منذ 15 دقيقة',
      status: 'success',
      statusText: 'مكتمل'
    },
    {
      icon: '🚗',
      type: 'warning',
      title: 'بطاقة جديدة',
      description: 'تم إنشاء بطاقة ولاء جديدة',
      time: 'منذ 30 دقيقة',
      status: 'pending',
      statusText: 'قيد المعالجة'
    },
    {
      icon: '📊',
      type: 'info',
      title: 'تقرير شهري',
      description: 'تم إنشاء تقرير الإيرادات لشهر ديسمبر',
      time: 'منذ ساعة',
      status: 'success',
      statusText: 'مكتمل'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateTime();
    this.timeSubscription = interval(60000).subscribe(() => {
      this.updateTime();
    });
  }

  private updateTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([`/superadmin/${route}`]);
  }

  openSettings(): void {
    console.log('Opening settings...');
  }

  viewAllActivity(): void {
    this.router.navigate(['/superadmin/activity-logs']);
  }

  ngOnDestroy(): void {
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
  }
}