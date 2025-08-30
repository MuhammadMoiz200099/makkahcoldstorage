'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import KPICards from '@/components/dashboard/KPICards';
import StockTable from '@/components/tables/StockTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function Dashboard() {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const init = async () => {
    await fetchKPIs();
    setLoading(false);
  };

  useEffect(() => {
      init();
  }, [router]);

  const fetchKPIs = async () => {
    try {
      const response = await fetch('/api/dashboard/kpis');
      if (response.ok) {
        const data = await response.json();
        setKpis(data.kpis);
      }
    } catch (error) {
      console.error('Error fetching KPIs:', error);
      toast.error('Failed to fetch KPIs');
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your inventory management system
          </p>
        </div>
        {loading ? (
          <div className="text-center text-muted">Checking session...</div>
        ) : (
          <>
            <KPICards kpis={kpis} />
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest stock in and out transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="stock-in">
                  <TabsList>
                    <TabsTrigger value="stock-in">Stock In</TabsTrigger>
                    <TabsTrigger value="stock-out">Stock Out</TabsTrigger>
                  </TabsList>
                  <TabsContent value="stock-in" className="mt-6">
                    <StockTable type="in" />
                  </TabsContent>
                  <TabsContent value="stock-out" className="mt-6">
                    <StockTable type="out" />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  );
}

export const dynamic = 'force-dynamic';