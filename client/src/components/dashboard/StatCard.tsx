import { ReactNode } from 'react';
import { BarChart3, CheckCircle, Clock, X } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  iconColor: string;
  subtext?: string;
  subtextColor?: string;
}

const iconMap: Record<string, any> = {
  bar_chart: BarChart3,
  check_circle: CheckCircle,
  hourglass_empty: Clock,
  cancel: X
};

export default function StatCard({
  title,
  value,
  icon,
  iconColor,
  subtext,
  subtextColor = 'text-green-500'
}: StatCardProps) {
  const IconComponent = iconMap[icon] || BarChart3;
  
  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="font-medium text-sm sm:text-base">{title}</h3>
        <IconComponent size={20} className={iconColor} />
      </div>
      <p className="text-2xl sm:text-3xl font-semibold mb-2">{value}</p>
      {subtext && (
        <div className="text-xs sm:text-sm text-gray-600">
          <span className={subtextColor}>{subtext}</span>
        </div>
      )}
    </div>
  );
}
