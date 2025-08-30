'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, PackageOpen, TrendingUp, TrendingDown } from 'lucide-react';

export default function KPICards({ kpis }) {
  const kpiData = [
    {
      title: "Today's Stock In",
      value: kpis?.today?.stockIn?.count || 0,
      subValue: `${kpis?.today?.stockIn?.totalCrates || 0} parcels`,
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: "Today's Stock Out",
      value: kpis?.today?.stockOut?.count || 0,
      icon: PackageOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Monthly Stock In',
      value: kpis?.monthly?.stockIn?.count || 0,
      subValue: `Rs. ${kpis?.monthly?.stockIn?.totalRupees || 0}`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Monthly Stock Out',
      value: kpis?.monthly?.stockOut?.count || 0,
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpiData.map((item, index) => {
        const Icon = item.icon;
        
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.title}
              </CardTitle>
              <div className={`rounded-full p-2 ${item.bgColor}`}>
                <Icon className={`h-4 w-4 ${item.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              {item.subValue && (
                <p className="text-xs text-muted-foreground mt-1">
                  {item.subValue}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}