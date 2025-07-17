import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  iconColor: string;
  subtext?: string;
  subtextColor?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  iconColor,
  subtext,
  subtextColor = 'text-green-500'
}: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">{title}</h3>
        <span className={`material-icons ${iconColor}`}>{icon}</span>
      </div>
      <p className="text-3xl font-semibold">{value}</p>
      {subtext && (
        <div className="text-sm text-gray-600 mt-2">
          <span className={subtextColor}>{subtext}</span>
        </div>
      )}
    </div>
  );
}
