import { Circle, Star, Check, CheckCheck } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

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

interface VisitorListProps {
  visitors: Visitor[];
  selectedVisitorId: number | null;
  selectedIds: number[];
  onVisitorClick: (visitor: Visitor) => void;
  onToggleFavorite: (id: number, isFavorite: boolean) => void;
  onToggleSelect: (id: number) => void;
}

export default function VisitorList({
  visitors,
  selectedVisitorId,
  selectedIds,
  onVisitorClick,
  onToggleFavorite,
  onToggleSelect,
}: VisitorListProps) {
  const getVisitorName = (visitor: Visitor) => {
    const data = visitor.formData;
    if (data?.firstNameAr) {
      return `${data.firstNameAr} ${data.lastNameAr || ''}`.trim();
    }
    if (data?.firstNameEn) {
      return `${data.firstNameEn} ${data.lastNameEn || ''}`.trim();
    }
    return `زائر ${visitor.id}`;
  };

  const getLastMessage = (visitor: Visitor) => {
    if (visitor.currentPage) {
      return `في صفحة: ${visitor.currentPage}`;
    }
    return 'لا توجد بيانات';
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `${minutes}د`;
    if (hours < 24) return `${hours}س`;
    return `${days}ي`;
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
      {visitors.map((visitor) => (
        <div
          key={visitor.id}
          className={cn(
            'flex items-center gap-3 p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors',
            selectedVisitorId === visitor.id && 'bg-blue-50',
            !visitor.isRead && 'bg-blue-50/30'
          )}
          onClick={() => onVisitorClick(visitor)}
        >
          <Checkbox
            checked={selectedIds.includes(visitor.id)}
            onCheckedChange={() => onToggleSelect(visitor.id)}
            onClick={(e) => e.stopPropagation()}
          />

          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
              {getVisitorName(visitor).charAt(0)}
            </div>
            {visitor.isOnline === 1 && (
              <div className="absolute bottom-0 left-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className={cn('font-medium text-gray-900 truncate', !visitor.isRead && 'font-bold')}>
                {getVisitorName(visitor)}
              </span>
              <span className="text-xs text-gray-500 shrink-0">
                {formatTime(visitor.updatedAt)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 mt-1">
              <span className={cn('text-sm text-gray-600 truncate', !visitor.isRead && 'font-semibold text-gray-900')}>
                {getLastMessage(visitor)}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                {!visitor.isRead ? (
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                ) : (
                  <CheckCheck className="w-4 h-4 text-blue-500" />
                )}
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(visitor.id, visitor.isFavorite === 1);
            }}
            className="shrink-0"
          >
            <Star
              className={cn(
                'w-5 h-5',
                visitor.isFavorite === 1 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              )}
            />
          </button>
        </div>
      ))}

      {visitors.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
          <Circle className="w-16 h-16 mb-4" />
          <p className="text-center">لا يوجد زوار حالياً</p>
        </div>
      )}
    </div>
  );
}
