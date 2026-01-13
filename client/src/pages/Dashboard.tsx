import { useState, useEffect, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { getSocket } from '@/lib/socket';
import TopHeader from '@/components/TopHeader';
import SubHeader from '@/components/SubHeader';
import VisitorList from '@/components/VisitorList';
import VisitorDetail from '@/components/VisitorDetail';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVisitorId, setSelectedVisitorId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: visitors = [], refetch } = trpc.visitors.list.useQuery(undefined, {
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  const markAsReadMutation = trpc.visitors.markAsRead.useMutation();
  const toggleFavoriteMutation = trpc.visitors.toggleFavorite.useMutation();
  const deleteMutation = trpc.visitors.delete.useMutation();

  // Socket.IO connection
  useEffect(() => {
    const socket = getSocket();

    socket.on('visitor:new', () => {
      refetch();
      toast.success('زائر جديد!');
    });

    socket.on('visitor:update', () => {
      refetch();
    });

    socket.on('visitor:disconnect', () => {
      refetch();
    });

    return () => {
      socket.off('visitor:new');
      socket.off('visitor:update');
      socket.off('visitor:disconnect');
    };
  }, [refetch]);

  // Filter visitors based on search query
  const filteredVisitors = useMemo(() => {
    if (!searchQuery) return visitors;

    const query = searchQuery.toLowerCase();
    return visitors.filter((visitor: Visitor) => {
      const data = visitor.formData;
      const name = `${data?.firstNameAr || ''} ${data?.lastNameAr || ''} ${data?.firstNameEn || ''} ${data?.lastNameEn || ''}`.toLowerCase();
      const phone = data?.mobileNumber?.toLowerCase() || '';
      const id = data?.idNumber?.toLowerCase() || data?.cardNumber?.toLowerCase() || '';

      return name.includes(query) || phone.includes(query) || id.includes(query);
    });
  }, [visitors, searchQuery]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = visitors.length;
    const active = visitors.filter((v: Visitor) => v.isOnline === 1).length;
    const submitted = visitors.filter((v: Visitor) => v.formData && Object.keys(v.formData).length > 0).length;
    const activeSubmitted = visitors.filter((v: Visitor) => v.isOnline === 1 && v.formData && Object.keys(v.formData).length > 0).length;
    const activeNotSubmitted = active - activeSubmitted;

    const byPage: Record<string, number> = {};
    visitors.forEach((v: Visitor) => {
      if (v.currentPage) {
        byPage[v.currentPage] = (byPage[v.currentPage] || 0) + 1;
      }
    });

    return {
      total,
      active,
      submitted,
      activeSubmitted,
      activeNotSubmitted,
      byPage,
    };
  }, [visitors]);

  const selectedVisitor = useMemo(() => {
    return visitors.find((v: Visitor) => v.id === selectedVisitorId) || null;
  }, [visitors, selectedVisitorId]);

  const handleVisitorClick = async (visitor: Visitor) => {
    setSelectedVisitorId(visitor.id);

    if (visitor.isRead === 0) {
      await markAsReadMutation.mutateAsync({ id: visitor.id });
      refetch();
    }
  };

  const handleToggleFavorite = async (id: number, isFavorite: boolean) => {
    await toggleFavoriteMutation.mutateAsync({ id, isFavorite: !isFavorite });
    refetch();
  };

  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    await deleteMutation.mutateAsync({ ids: selectedIds });
    setSelectedIds([]);
    setShowDeleteDialog(false);
    toast.success(`تم حذف ${selectedIds.length} زائر بنجاح`);
    refetch();
  };

  return (
    <div className="flex h-screen w-full bg-gray-100 flex-col overflow-hidden">
      <TopHeader stats={stats} />
      <SubHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCount={selectedIds.length}
        onDeleteSelected={handleDeleteSelected}
      />

      <div className="flex flex-1 overflow-hidden">
        <VisitorList
          visitors={filteredVisitors}
          selectedVisitorId={selectedVisitorId}
          selectedIds={selectedIds}
          onVisitorClick={handleVisitorClick}
          onToggleFavorite={handleToggleFavorite}
          onToggleSelect={handleToggleSelect}
        />
        <VisitorDetail visitor={selectedVisitor} />
      </div>

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
            <AlertDialogAction onClick={confirmDelete}>حذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
