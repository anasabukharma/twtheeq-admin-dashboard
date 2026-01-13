import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { getSocket } from "@/lib/socket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Star, 
  Circle, 
  CheckCheck, 
  Check,
  Trash2,
  User,
  Globe,
  Monitor,
  Smartphone,
  MapPin
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [selectedVisitor, setSelectedVisitor] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: visitors = [], refetch: refetchVisitors } = trpc.visitors.list.useQuery();
  const { data: stats } = trpc.visitors.stats.useQuery();
  const markAsRead = trpc.visitors.markAsRead.useMutation();
  const toggleFavorite = trpc.visitors.toggleFavorite.useMutation();
  const deleteVisitors = trpc.visitors.delete.useMutation();

  // Filter visitors based on search
  const filteredVisitors = visitors.filter((v: any) => {
    if (!searchTerm) return true;
    const data = v.formData || {};
    const searchLower = searchTerm.toLowerCase();
    
    return (
      data.fullName?.toLowerCase().includes(searchLower) ||
      data.phoneNumber?.toLowerCase().includes(searchLower) ||
      data.idNumber?.toLowerCase().includes(searchLower) ||
      data.residenceNumber?.toLowerCase().includes(searchLower) ||
      v.ipAddress?.toLowerCase().includes(searchLower)
    );
  });

  // Select first visitor by default
  useEffect(() => {
    if (filteredVisitors.length > 0 && !selectedVisitor) {
      setSelectedVisitor(filteredVisitors[0]);
    }
  }, [filteredVisitors]);

  // Socket.IO real-time updates
  useEffect(() => {
    if (!user) return;

    const socket = getSocket();

    // Listen for new visitors
    socket.on('visitor:new', (data: any) => {
      console.log('New visitor:', data);
      refetchVisitors();
    });

    // Listen for visitor updates
    socket.on('visitor:update', (data: any) => {
      console.log('Visitor updated:', data);
      refetchVisitors();
    });

    // Listen for visitor status changes
    socket.on('visitor:status', (data: any) => {
      console.log('Visitor status changed:', data);
      refetchVisitors();
    });

    // Listen for visitor data submissions
    socket.on('visitor:data', (data: any) => {
      console.log('Visitor data received:', data);
      refetchVisitors();
    });

    return () => {
      socket.off('visitor:new');
      socket.off('visitor:update');
      socket.off('visitor:status');
      socket.off('visitor:data');
    };
  }, [user, refetchVisitors]);

  const handleVisitorClick = async (visitor: any) => {
    setSelectedVisitor(visitor);
    if (visitor.isRead === 0) {
      await markAsRead.mutateAsync({ id: visitor.id });
      refetchVisitors();
    }
  };

  const handleToggleFavorite = async (visitor: any, e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleFavorite.mutateAsync({ 
      id: visitor.id, 
      isFavorite: visitor.isFavorite === 0 
    });
    refetchVisitors();
  };

  const handleSelectVisitor = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(i => i !== id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    await deleteVisitors.mutateAsync({ ids: selectedIds });
    setSelectedIds([]);
    setShowDeleteDialog(false);
    setSelectedVisitor(null);
    refetchVisitors();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">لوحة تحكم الزوار</h1>
          <p className="text-center text-muted-foreground mb-6">
            يجب تسجيل الدخول للوصول إلى لوحة التحكم
          </p>
          <Button className="w-full" onClick={() => window.location.href = '/api/oauth/login'}>
            تسجيل الدخول
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Statistics Bar */}
      <div className="bg-card border-b p-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats?.total || 0}</div>
              <div className="text-xs text-muted-foreground">إجمالي الزوار</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats?.active || 0}</div>
              <div className="text-xs text-muted-foreground">نشطين الآن</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats?.submitted || 0}</div>
              <div className="text-xs text-muted-foreground">سجلوا بيانات</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats?.activeSubmitted || 0}</div>
              <div className="text-xs text-muted-foreground">نشطين + سجلوا</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats?.activeNotSubmitted || 0}</div>
              <div className="text-xs text-muted-foreground">نشطين + لم يسجلوا</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {stats?.byPage ? Object.keys(stats.byPage).length : 0}
              </div>
              <div className="text-xs text-muted-foreground">صفحات مختلفة</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-card border-b p-3">
        <div className="container mx-auto flex gap-3 items-center">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث بالاسم، رقم الهاتف، رقم الهوية، أو IP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          {selectedIds.length > 0 && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 ml-2" />
              حذف ({selectedIds.length})
            </Button>
          )}
        </div>
      </div>

      {/* Main Content: WhatsApp-style Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Visitors List - Right Side */}
        <div className="w-full md:w-96 bg-card border-l overflow-y-auto">
          {filteredVisitors.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>لا يوجد زوار</p>
            </div>
          ) : (
            filteredVisitors.map((visitor: any) => {
              const data = visitor.formData || {};
              const name = data.fullName || data.firstName || 'زائر';
              const isSelected = selectedIds.includes(visitor.id);
              
              return (
                <div
                  key={visitor.id}
                  className={`p-4 border-b cursor-pointer hover:bg-accent/50 transition-colors ${
                    selectedVisitor?.id === visitor.id ? 'bg-accent' : ''
                  }`}
                  onClick={() => handleVisitorClick(visitor)}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => handleSelectVisitor(visitor.id, checked as boolean)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold truncate">{name}</span>
                          {visitor.isOnline === 1 && (
                            <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {visitor.isRead === 0 && (
                            <Badge variant="default" className="h-5 w-5 p-0 rounded-full">
                              <span className="text-xs">!</span>
                            </Badge>
                          )}
                          <button
                            onClick={(e) => handleToggleFavorite(visitor, e)}
                            className="hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`h-4 w-4 ${
                                visitor.isFavorite === 1
                                  ? 'fill-yellow-500 text-yellow-500'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground truncate">
                        {data.phoneNumber || visitor.ipAddress || 'لا توجد معلومات'}
                      </div>
                      
                      <div className="text-xs text-muted-foreground mt-1">
                        {visitor.currentPage && (
                          <Badge variant="outline" className="text-xs">
                            {visitor.currentPage}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Visitor Details - Left Side */}
        <div className="flex-1 bg-background overflow-y-auto p-6">
          {!selectedVisitor ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <User className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p>اختر زائراً لعرض التفاصيل</p>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-4">
              {/* Technical Information Bubble */}
              <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  المعلومات التقنية
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">IP:</span>
                    <span>{selectedVisitor.ipAddress || 'غير متوفر'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">المتصفح:</span>
                    <span>{selectedVisitor.browser || 'غير متوفر'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">نظام التشغيل:</span>
                    <span>{selectedVisitor.os || 'غير متوفر'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">الجهاز:</span>
                    <span>{selectedVisitor.device || 'غير متوفر'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">البلد:</span>
                    <span>{selectedVisitor.country || 'غير متوفر'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">المدينة:</span>
                    <span>{selectedVisitor.city || 'غير متوفر'}</span>
                  </div>
                </div>
                {selectedVisitor.userAgent && (
                  <div className="mt-3 pt-3 border-t">
                    <span className="font-semibold text-xs">User Agent:</span>
                    <p className="text-xs text-muted-foreground mt-1 break-all">
                      {selectedVisitor.userAgent}
                    </p>
                  </div>
                )}
              </Card>

              {/* Form Data Bubbles */}
              {selectedVisitor.formData && Object.keys(selectedVisitor.formData).length > 0 ? (
                Object.entries(selectedVisitor.formData).map(([page, data]: [string, any]) => (
                  <Card key={page} className="p-4 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
                    <h3 className="font-bold mb-3">{page}</h3>
                    <div className="space-y-2">
                      {Object.entries(data).map(([key, value]: [string, any]) => (
                        <div key={key} className="flex gap-2 text-sm">
                          <span className="font-semibold min-w-[120px]">{key}:</span>
                          <span className="break-all">
                            {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-8 text-center text-muted-foreground">
                  <p>لم يقم الزائر بتسجيل أي بيانات بعد</p>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف {selectedIds.length} زائر؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSelected} className="bg-destructive hover:bg-destructive/90">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
