import { Search, User, Phone, CreditCard, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SubHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCount: number;
  onDeleteSelected: () => void;
}

export default function SubHeader({
  searchQuery,
  onSearchChange,
  selectedCount,
  onDeleteSelected,
}: SubHeaderProps) {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-40">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="ابحث بالاسم، رقم الهاتف، أو رقم الهوية/الإقامة..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pr-10 text-right"
          />
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span>الاسم</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="w-4 h-4" />
          <span>الهاتف</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CreditCard className="w-4 h-4" />
          <span>الهوية/الإقامة</span>
        </div>
      </div>

      {selectedCount > 0 && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            تم تحديد {selectedCount} زائر
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={onDeleteSelected}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            حذف المحدد
          </Button>
        </div>
      )}
    </div>
  );
}
