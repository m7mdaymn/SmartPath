// scan-qr.component.ts
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface ScanResult {
  status: 'success' | 'error';
  title: string;
  customerName: string;
  customerPhone: string;
  customerPhoto?: string;
  currentWashes: number;
  totalWashes: number;
  progress: number;
  daysLeft: number;
  rewardEarned: boolean;
}

@Component({
  selector: 'app-scan-qr',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './scan-qr.component.html',
  styleUrls: ['./scan-qr.component.css']
})
export class ScanQrComponent implements OnInit, OnDestroy {
  showManualInput = false;
  manualQRCode = '';
  scanResult: ScanResult | null = null;
  
  // Camera related properties
  isCameraOpen = false;
  stream: MediaStream | null = null;
  qrDetector: any = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.initializeQRScanner();
  }

  initializeQRScanner(): void {
    // Check if browser supports camera
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.warn('Camera not supported in this browser');
      return;
    }
  }

  async openCamera(): Promise<void> {
    if (this.isCameraOpen) {
      this.stopCamera();
      return;
    }

    try {
      // Request camera permission
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Prefer rear camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      this.isCameraOpen = true;
      
      // In a real app, you would use a QR scanning library here
      // For now, we'll simulate it with a timeout
      this.simulateQRScan();
      
    } catch (error: any) {
      console.error('Camera error:', error);
      
      let errorMessage = 'حدث خطأ في فتح الكاميرا';
      if (error.name === 'NotAllowedError') {
        errorMessage = 'تم رفض إذن الكاميرا. الرجاء السماح بالوصول للكاميرا من إعدادات المتصفح.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'لم يتم العثور على كاميرا في هذا الجهاز.';
      }
      
      alert(errorMessage);
    }
  }

  simulateQRScan(): void {
    // Simulate QR scan after 3 seconds
    setTimeout(() => {
      if (this.isCameraOpen) {
        this.processQRCode('DP-CUST-123-MERCHANT-001');
        this.stopCamera();
      }
    }, 3000);
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.isCameraOpen = false;
  }

  openManualInput(): void {
    this.showManualInput = true;
  }

  closeManualInput(): void {
    this.showManualInput = false;
    this.manualQRCode = '';
  }

  submitManualQR(): void {
    if (!this.manualQRCode.trim()) {
      alert('الرجاء إدخال رمز QR');
      return;
    }

    this.processQRCode(this.manualQRCode);
    this.closeManualInput();
  }

  processQRCode(qrCode: string): void {
    console.log('Processing QR code:', qrCode);
    
    // Simulate API call to process QR code
    setTimeout(() => {
      // Mock response
      this.scanResult = {
        status: 'success',
        title: 'تم المسح بنجاح!',
        customerName: 'أحمد محمد',
        customerPhone: '0551234567',
        customerPhoto: 'https://via.placeholder.com/150',
        currentWashes: 8,
        totalWashes: 10,
        progress: 80,
        daysLeft: 15,
        rewardEarned: false
      };

      // Check if customer earned a reward
      if (this.scanResult.currentWashes >= this.scanResult.totalWashes) {
        this.scanResult.rewardEarned = true;
        this.scanResult.title = '🎉 مبروك! مكافأة مستحقة';
      }

    }, 1000);
  }

  goBack(): void {
    this.router.navigate(['/merchant/dashboard']);
  }

  resetScan(): void {
    this.scanResult = null;
    this.manualQRCode = '';
  }

  scanAgain(): void {
    this.resetScan();
    this.openCamera();
  }

  @HostListener('window:beforeunload')
  ngOnDestroy(): void {
    this.stopCamera();
  }
}