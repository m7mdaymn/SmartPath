// src/app/pages/Merchant/merchant-setting/merchant-setting.component.ts
import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';

interface MerchantProfile {
  id?: string;
  business_name: string;
  city: string;
  phone: string;
  email: string;
  plan?: {
    type: 'basic' | 'pro';
    expiry_date?: string;
  };
  custom_logo_url?: string;
  subscription_status?: 'active' | 'expired' | 'pending';
}

interface LoyaltySettings {
  reward_washes_required: number;
  reward_time_limit_days: number;
  anti_fraud_same_day: boolean;
  enable_car_photo: boolean;
  notifications_enabled: boolean;
  notification_template_welcome: string;
  notification_template_remaining: string;
  notification_template_reward_close: string;
  reward_description: string;
  custom_primary_color: string;
  custom_secondary_color: string;
  custom_business_tagline: string;
  custom_reward_message: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-merchant-setting',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './merchant-setting.component.html',
  styleUrls: ['./merchant-setting.component.css']
})
export class MerchantSettingComponent implements OnInit {
  activeTab: 'business' | 'loyalty' | 'design' | 'features' | 'security' = 'business';
  user: MerchantProfile | null = null;
  profileData: Partial<MerchantProfile> = {};
  settings: LoyaltySettings = {
    reward_washes_required: 5,
    reward_time_limit_days: 30,
    anti_fraud_same_day: true,
    enable_car_photo: false,
    notifications_enabled: true,
    notification_template_welcome: 'وحشتنا! بدأنا معك رحلة الولاء 🚗',
    notification_template_remaining: 'باقي لك غسلتين فقط للحصول على المكافأة! 💪',
    notification_template_reward_close: 'قريباً! باقي غسلة واحدة فقط للحصول على المكافأة 🎁',
    reward_description: 'غسلة مجانية خارجي',
    custom_primary_color: '#3B82F6',
    custom_secondary_color: '#0F172A',
    custom_business_tagline: 'نظافة سيارة تبدأ معنا',
    custom_reward_message: 'اجمع {X} غسلات خلال {Y} يوم واحصل على غسلة مجانية!'
  };
  
  passwordData: PasswordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  
  showPasswordForm = false;
  saving = false;
  changingPassword = false;
  hasChanges = false;
  originalSettings: string = '';

  constructor(
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadMerchantData();
    this.originalSettings = JSON.stringify(this.settings);
    
    // Watch for changes
    setInterval(() => {
      this.checkForChanges();
    }, 1000);
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: BeforeUnloadEvent): void {
    if (this.hasChanges) {
      $event.returnValue = 'You have unsaved changes!';
    }
  }

  private checkForChanges(): void {
    const currentSettings = JSON.stringify(this.settings);
    this.hasChanges = currentSettings !== this.originalSettings;
  }

  private loadMerchantData(): void {
    // Simulate API call
    setTimeout(() => {
      this.user = {
        id: 'MER001',
        business_name: 'مغسلة النخبة للسيارات',
        city: 'الرياض',
        phone: '0551234567',
        email: 'info@elitecarwash.com',
        plan: {
          type: 'pro',
          expiry_date: '2024-12-31'
        },
        custom_logo_url: 'assets/merchant-logo.png',
        subscription_status: 'active'
      };
      
      this.profileData = { ...this.user };
      this.originalSettings = JSON.stringify(this.settings);
    }, 500);
  }

  // Loyalty settings helpers
  incrementWashes(): void {
    if (this.settings.reward_washes_required < 20) {
      this.settings.reward_washes_required++;
    }
  }

  decrementWashes(): void {
    if (this.settings.reward_washes_required > 3) {
      this.settings.reward_washes_required--;
    }
  }

  incrementDays(): void {
    if (this.settings.reward_time_limit_days < 90) {
      this.settings.reward_time_limit_days += 7;
    }
  }

  decrementDays(): void {
    if (this.settings.reward_time_limit_days > 7) {
      this.settings.reward_time_limit_days -= 7;
    }
  }

  // Car Photo Upload
  onCarPhotoUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    if (!this.user || this.user.plan?.type !== 'pro') {
      this.toastService.showError('هذه الميزة متاحة فقط لمستخدمي باقة Pro');
      return;
    }

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      this.toastService.showError('حجم الصورة يجب أن يكون أقل من 5MB');
      return;
    }

    if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
      this.toastService.showError('يجب أن تكون الصورة بصيغة JPG أو PNG');
      return;
    }

    // Show loading
    this.toastService.showInfo('جاري رفع صورة السيارة...');

    // Simulate upload
    setTimeout(() => {
      this.toastService.showSuccess('تم رفع صورة السيارة بنجاح! ستظهر في بطاقة العميل');
      
      // In real app, you would update the customer's loyalty card
      // this.merchantService.uploadCustomerCarPhoto(customerId, file).subscribe(...)
      
      input.value = '';
    }, 1500);
  }

  // Logo Upload
  onLogoUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    
    // Validate file
    if (file.size > 2 * 1024 * 1024) {
      this.toastService.showError('حجم الشعار يجب أن يكون أقل من 2MB');
      return;
    }

    if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
      this.toastService.showError('يجب أن يكون الشعار بصيغة JPG أو PNG');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e: any) => {
      if (this.user) {
        this.user.custom_logo_url = e.target.result;
      }
    };
    reader.readAsDataURL(file);

    // Simulate upload
    setTimeout(() => {
      this.toastService.showSuccess('تم رفع الشعار بنجاح');
    }, 1000);
  }

  removeLogo(): void {
    if (this.user) {
      this.user.custom_logo_url = undefined;
      this.toastService.showInfo('تم حذف الشعار');
    }
  }

  // QR Code Functions
  downloadQR(): void {
    this.toastService.showInfo('جاري تحميل QR Code...');
    // In real app: generate and download QR code
    setTimeout(() => {
      this.toastService.showSuccess('تم تحميل QR Code بنجاح');
    }, 1000);
  }

  copyLink(): void {
    const link = `https://digitalpass.com/merchant/${this.user?.id}`;
    navigator.clipboard.writeText(link).then(() => {
      this.toastService.showSuccess('تم نسخ الرابط إلى الحافظة');
    });
  }

  // Security Functions
  changePassword(): void {
    if (!this.passwordData.currentPassword) {
      this.toastService.showError('أدخل كلمة المرور الحالية');
      return;
    }

    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.toastService.showError('كلمات المرور غير متطابقة');
      return;
    }

    if (this.passwordData.newPassword.length < 6) {
      this.toastService.showError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    this.changingPassword = true;
    
    // Simulate API call
    setTimeout(() => {
      this.toastService.showSuccess('تم تغيير كلمة المرور بنجاح');
      this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
      this.showPasswordForm = false;
      this.changingPassword = false;
    }, 1500);
  }

  logoutAllSessions(): void {
    if (confirm('هل تريد تسجيل الخروج من جميع الأجهزة؟')) {
      this.toastService.showInfo('جاري تسجيل الخروج...');
      
      setTimeout(() => {
        this.toastService.showSuccess('تم تسجيل الخروج من جميع الأجهزة');
        // In real app: call logout API
      }, 1000);
    }
  }

  // Save Settings
  saveSettings(): void {
    this.saving = true;

    // Validate settings
    if (this.settings.reward_washes_required < 3 || this.settings.reward_washes_required > 20) {
      this.toastService.showError('عدد الغسلات يجب أن يكون بين 3 و 20');
      this.saving = false;
      return;
    }

    if (this.settings.reward_time_limit_days < 7 || this.settings.reward_time_limit_days > 90) {
      this.toastService.showError('المدة الزمنية يجب أن تكون بين 7 و 90 يوم');
      this.saving = false;
      return;
    }

    // Simulate API call
    setTimeout(() => {
      this.toastService.showSuccess('تم حفظ الإعدادات بنجاح');
      this.originalSettings = JSON.stringify(this.settings);
      this.hasChanges = false;
      this.saving = false;
      
      // In real app: call merchant service to save settings
      // this.merchantService.saveSettings(this.settings).subscribe(...)
    }, 1500);
  }

  discardChanges(): void {
    if (confirm('هل تريد تجاهل التغييرات غير المحفوظة؟')) {
      // Reload original settings
      this.settings = JSON.parse(this.originalSettings);
      this.hasChanges = false;
      this.toastService.showInfo('تم تجاهل التغييرات');
    }
  }
}