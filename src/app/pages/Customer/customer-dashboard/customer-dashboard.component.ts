// customer-dashboard.component.ts (المحدث)
import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { ToastService } from '../../../core/services/toast.service';

interface Wash {
  id: number;
  date: string;
  time: string;
  type: string;
  location: string;
  status: 'completed' | 'pending' | 'cancelled';
  price: number;
  carType: string;
}

interface Reward {
  id: number;
  name: string;
  description: string;
  pointsRequired: number;
  currentPoints: number;
  merchant: string;
  expiryDate: string;
  icon: string;
}

interface WalletTransaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  balance: number;
}

interface LoyaltyCard {
  merchant: string;
  washesCompleted: number;
  washesRequired: number;
  expiryDate: string;
  progress: number;
  qrCode: string;
  cardColor: string;
}

interface QuickAction {
  icon: string;
  label: string;
  description: string;
  route: string;
  color: string;
}

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9) translateY(30px)' }),
        animate('0.5s 0.2s cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
      ])
    ]),
    trigger('modalAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(50px) scale(0.95)' }),
        animate('0.4s cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ]),
      transition(':leave', [
        animate('0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 0, transform: 'translateY(50px) scale(0.95)' }))
      ])
    ])
  ]
})
export class CustomerDashboardComponent implements OnInit {
  user: any = {
    name: 'محمد أحمد',
    email: 'customer@example.com',
    phone: '0551234567',
    avatar: 'https://ui-avatars.com/api/?name=محمد+أحمد&background=3B82F6&color=fff&size=128'
  };

  stats = {
    totalWashes: 24,
    totalSpent: 1200,
    rewardsEarned: 1500,
    favoriteMerchant: 'مغسلة النور'
  };

  wallet = {
    balance: 450,
    currency: 'ريال'
  };

  recentWashes: Wash[] = [];
  availableRewards: Reward[] = [];
  walletTransactions: WalletTransaction[] = [];
  loyaltyCards: LoyaltyCard[] = [];
  
  quickActions: QuickAction[] = [
    { 
      icon: '💳', 
      label: 'إضافة رصيد', 
      description: 'أضف رصيد إلى محفظتك الرقمية',
      route: '/customer/wallet/add', 
      color: '#10B981' 
    },
    { 
      icon: '🏆', 
      label: 'المكافآت', 
      description: 'استبدل نقاطك بمكافآت حصرية',
      route: '/customer/rewards', 
      color: '#F59E0B' 
    },
    { 
      icon: '🔔', 
      label: 'الإشعارات', 
      description: 'راجع إشعاراتك وتحديثاتك',
      route: '/customer/notifications', 
      color: '#6366F1' 
    }
  ];

  selectedCard: LoyaltyCard | null = null;
  showQRModal = false;
  isLoading = false;

  constructor(
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  // 🔹 1. دالة التنقل الأساسية لجميع الصفحات
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  // 🔹 2. دالة التنقل لصفحة المحفظة
  navigateToWallet(): void {
    this.navigateTo('/customer/wallet');
  }

  // 🔹 3. دالة التنقل لصفحة المكافآت
  navigateToRewards(): void {
    this.navigateTo('/customer/rewards');
  }

  // 🔹 4. دالة التنقل لصفحة الغسلات
  navigateToWashes(): void {
    this.navigateTo('/customer/washes');
  }

  // 🔹 5. دالة التنقل لصفحة الإشعارات
  navigateToNotifications(): void {
    this.navigateTo('/customer/notifications');
  }

  // 🔹 6. دالة التنقل لصفحة الملف الشخصي
  navigateToProfile(): void {
    this.navigateTo('/customer/profile');
  }

  // 🔹 7. دالة التنقل لصفحة إضافة رصيد
  navigateToAddBalance(): void {
    this.navigateTo('/customer/wallet/add');
  }

  // 🔹 8. دالة التنقل لصفحة بطاقات الولاء
  navigateToLoyaltyCards(): void {
    this.navigateTo('/customer/loyalty-cards');
  }

  // 🔹 9. دالة التنقل لصفحة التقارير
  navigateToReports(): void {
    this.navigateTo('/customer/reports');
  }

  // 🔹 10. دالة لتصفح تفاصيل الغسلة
  navigateToWashDetails(washId: number): void {
    this.navigateTo(`/customer/washes/${washId}`);
  }

  // 🔹 11. دالة لتفعيل المكافأة والتنقل
  navigateToRedeemReward(rewardId: number): void {
    this.navigateTo(`/customer/rewards/redeem/${rewardId}`);
  }

  // 🔹 12. دالة لنسخ كود الولاء والتنقل
  navigateToLoyaltyCardDetails(merchantName: string): void {
    this.navigateTo(`/customer/loyalty-cards/${this.sanitizeRouteParam(merchantName)}`);
  }

  // 🔹 13. دالة للمسار العكسي (الرجوع)
  navigateBack(): void {
    this.router.navigate(['/customer']);
  }

  // 🔹 14. دالة للخروج من التطبيق
  navigateToLogout(): void {
    this.router.navigate(['/auth/signin']);
    this.toastService.showSuccess('تم تسجيل الخروج بنجاح');
  }

  // 🔹 15. دالة التنقل الرئيسية في الـ Header
  navigateToMainSection(section: string): void {
    switch(section) {
      case 'dashboard':
        this.navigateTo('/customer/dashboard');
        break;
      case 'wallet':
        this.navigateTo('/customer/wallet');
        break;
      case 'rewards':
        this.navigateTo('/customer/rewards');
        break;
      case 'washes':
        this.navigateTo('/customer/washes');
        break;
      case 'profile':
        this.navigateTo('/customer/profile');
        break;
      case 'notifications':
        this.navigateTo('/customer/notifications');
        break;
    }
  }

  // 🔹 16. دالة المساعدة لتنظيف معالم المسار
  private sanitizeRouteParam(param: string): string {
    return param
      .replace(/[^a-zA-Z0-9\s\u0600-\u06FF]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase();
  }

  // 🔹 17. دالة لمحاكاة التنقل مع مؤشر التحميل
  navigateWithLoader(route: string, message?: string): void {
    this.isLoading = true;
    this.toastService.showInfo(message || 'جاري التحميل...');
    
    setTimeout(() => {
      this.navigateTo(route);
      this.isLoading = false;
    }, 800);
  }

  // 🔹 18. دالة للتنقل السريع مع تأكيد
  navigateWithConfirmation(route: string, confirmMessage: string): void {
    if (confirm(confirmMessage)) {
      this.navigateTo(route);
    }
  }

  // 🔹 19. دالة للتنقل وإظهار الرسالة
  navigateAndShowMessage(route: string, message: string, type: 'success' | 'info' | 'warning' = 'info'): void {
    this.navigateTo(route);
    
    switch(type) {
      case 'success':
        this.toastService.showSuccess(message);
        break;
      case 'info':
        this.toastService.showInfo(message);
        break;
      case 'warning':
        this.toastService.showWarning(message);
        break;
    }
  }

  // ------------------------------------------------------------
  // باقي الدوال الموجودة مسبقاً مع تعديلات طفيفة
  // ------------------------------------------------------------

  loadDashboardData(): void {
    this.isLoading = true;

    setTimeout(() => {
      this.loadSampleData();
      this.isLoading = false;
      this.toastService.showSuccess('مرحباً بك في حسابك!');
    }, 1500);
  }

  private loadSampleData(): void {
    // Recent Washes
    this.recentWashes = [
      {
        id: 1,
        date: '15 يناير',
        time: '14:30',
        type: 'غسلة كاملة',
        location: 'مغسلة النور - الرياض',
        status: 'completed',
        price: 50,
        carType: 'تويوتا كامري 2022'
      },
      {
        id: 2,
        date: '14 يناير',
        time: '11:15',
        type: 'غسلة خارجية',
        location: 'مغسلة الهدى - الرياض',
        status: 'completed',
        price: 30,
        carType: 'تويوتا كامري 2022'
      },
      {
        id: 3,
        date: '13 يناير',
        time: '16:45',
        type: 'تلميع',
        location: 'مغسلة النور - الرياض',
        status: 'pending',
        price: 120,
        carType: 'تويوتا كامري 2022'
      }
    ];

    // Available Rewards
    this.availableRewards = [
      {
        id: 1,
        name: 'غسلة مجانية',
        description: 'احصل على غسلة مجانية بعد إكمال 10 غسلات',
        pointsRequired: 1000,
        currentPoints: 850,
        merchant: 'مغسلة النور',
        expiryDate: '15 مارس 2024',
        icon: '🚗'
      },
      {
        id: 2,
        name: 'تخفيض 25%',
        description: 'تخفيض 25% على خدمة التلميع',
        pointsRequired: 500,
        currentPoints: 320,
        merchant: 'مغسلة الهدى',
        expiryDate: '28 فبراير 2024',
        icon: '✨'
      },
      {
        id: 3,
        name: 'كوبون 50 ريال',
        description: 'كوبون بقيمة 50 ريال للغسلة القادمة',
        pointsRequired: 800,
        currentPoints: 800,
        merchant: 'مغسلة المستقبل',
        expiryDate: '10 أبريل 2024',
        icon: '🎫'
      }
    ];

    // Wallet Transactions
    this.walletTransactions = [
      {
        id: 1,
        date: '15 يناير',
        description: 'إضافة رصيد عبر البطاقة',
        amount: 200,
        type: 'credit',
        balance: 650
      },
      {
        id: 2,
        date: '14 يناير',
        description: 'دفع غسلة - مغسلة النور',
        amount: 50,
        type: 'debit',
        balance: 450
      },
      {
        id: 3,
        date: '12 يناير',
        description: 'إضافة رصيد عبر STC Pay',
        amount: 300,
        type: 'credit',
        balance: 500
      }
    ];

    // Loyalty Cards
    this.loyaltyCards = [
      {
        merchant: 'مغسلة النور',
        washesCompleted: 8,
        washesRequired: 10,
        expiryDate: '28 فبراير 2024',
        progress: 80,
        qrCode: 'DP-CUST-001-مغسلة النور',
        cardColor: 'linear-gradient(135deg, #3B82F6, #2563EB)'
      },
      {
        merchant: 'مغسلة الهدى',
        washesCompleted: 5,
        washesRequired: 8,
        expiryDate: '15 مارس 2024',
        progress: 62.5,
        qrCode: 'DP-CUST-001-مغسلة الهدى',
        cardColor: 'linear-gradient(135deg, #10B981, #059669)'
      },
      {
        merchant: 'مغسلة المستقبل',
        washesCompleted: 3,
        washesRequired: 6,
        expiryDate: '1 أبريل 2024',
        progress: 50,
        qrCode: 'DP-CUST-001-مغسلة المستقبل',
        cardColor: 'linear-gradient(135deg, #8B5CF6, #7C3AED)'
      }
    ];

    this.selectedCard = this.loyaltyCards[0];
  }

  getStatusText(status: string): string {
    switch(status) {
      case 'completed': return 'مكتملة';
      case 'pending': return 'قيد الانتظار';
      case 'cancelled': return 'ملغاة';
      default: return status;
    }
  }

  showQRCode(card: LoyaltyCard): void {
    this.selectedCard = card;
    this.showQRModal = true;
  }

  closeQRModal(): void {
    this.showQRModal = false;
  }

  copyQRCode(): void {
    if (this.selectedCard) {
      navigator.clipboard.writeText(this.selectedCard.qrCode);
      this.toastService.showSuccess('تم نسخ رمز QR إلى الحافظة');
      this.showQRModal = false;
    }
  }

  shareQRCode(): void {
    if (this.selectedCard) {
      if (navigator.share) {
        navigator.share({
          title: `بطاقة ولاء - ${this.selectedCard.merchant}`,
          text: `قم بمسح هذا الكود في ${this.selectedCard.merchant}`,
          url: `https://digitalpass.com/qr/${this.selectedCard.qrCode}`
        });
      } else {
        this.copyQRCode();
      }
    }
  }

  downloadQR(): void {
    this.toastService.showInfo('جاري تحميل QR Code...');
    setTimeout(() => {
      this.toastService.showSuccess('تم تحميل QR Code بنجاح');
    }, 1000);
  }

  redeemReward(reward: Reward): void {
    if (reward.currentPoints >= reward.pointsRequired) {
      this.navigateWithConfirmation(
        `/customer/rewards/redeem/${reward.id}`,
        `هل تريد استبدال ${reward.name}؟`
      );
    } else {
      const neededPoints = reward.pointsRequired - reward.currentPoints;
      this.toastService.showWarning(`تحتاج ${neededPoints} نقطة إضافية`);
    }
  }

  addWalletBalance(): void {
    this.navigateWithLoader('/customer/wallet/add', 'جاري تحويلك لصفحة إضافة الرصيد...');
  }

  viewWallet(): void {
    this.navigateWithLoader('/customer/wallet', 'جاري تحويلك لصفحة المحفظة...');
  }

  viewAllLoyaltyCards(): void {
    this.navigateWithLoader('/customer/loyalty-cards', 'جاري تحويلك لصفحة بطاقات الولاء...');
  }

  logout(): void {
    if (confirm('هل تريد تسجيل الخروج؟')) {
      this.navigateToLogout();
    }
  }

  @HostListener('window:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent): void {
    if (this.showQRModal) {
      this.closeQRModal();
    }
  }
}