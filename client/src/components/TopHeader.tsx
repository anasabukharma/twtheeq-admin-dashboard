import { Activity, Users, CheckCircle, Clock, XCircle, FileText } from 'lucide-react';

interface TopHeaderProps {
  stats: {
    total: number;
    active: number;
    submitted: number;
    activeSubmitted: number;
    activeNotSubmitted: number;
    byPage: Record<string, number>;
  };
}

export default function TopHeader({ stats }: TopHeaderProps) {
  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-50 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="font-bold text-xl text-gray-900">Twtheeq</span>
        <span className="font-bold text-xl text-blue-600">Dashboard</span>
      </div>

      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">الإجمالي:</span>
          <span className="font-semibold text-gray-900">{stats.total}</span>
        </div>

        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-500" />
          <span className="text-gray-600">النشطين الآن:</span>
          <span className="font-semibold text-green-600">{stats.active}</span>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-blue-500" />
          <span className="text-gray-600">سجلوا بيانات:</span>
          <span className="font-semibold text-blue-600">{stats.submitted}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-orange-500" />
          <span className="text-gray-600">نشطين + سجلوا:</span>
          <span className="font-semibold text-orange-600">{stats.activeSubmitted}</span>
        </div>

        <div className="flex items-center gap-2">
          <XCircle className="w-4 h-4 text-red-500" />
          <span className="text-gray-600">نشطين + لم يسجلوا:</span>
          <span className="font-semibold text-red-600">{stats.activeNotSubmitted}</span>
        </div>

        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-purple-500" />
          <span className="text-gray-600">حسب الصفحة:</span>
          <div className="flex gap-2">
            {Object.entries(stats.byPage).map(([page, count]) => (
              <span key={page} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                {page}: {count}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
