'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import KPICards from '@/components/dashboard/KPICards';
import StockTable from '@/components/tables/StockTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { connectToDatabase } from '@/lib/mongodb';

export default function Dashboard() {
  const [kpis, setKpis] = useState(null);

  useEffect(async () => {
    fetchKPIs();
    await connectToDatabase();
  }, []);

  const fetchKPIs = async () => {
    try {
      const response = await fetch('/api/dashboard/kpis');
      if (response.ok) {
        const data = await response.json();
        setKpis(data.kpis);
      }
    } catch (error) {
      toast.error('Failed to fetch KPIs');
    }
  };

  const handleView = (item) => {
    // Implement view functionality
    console.log('View item:', item);
  };

  const handleEdit = (item) => {
    // Implement edit functionality
    console.log('Edit item:', item);
  };

  const handleDelete = (item) => {
    // Implement delete functionality
    console.log('Delete item:', item);
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

        {/* KPI Cards */}
        <KPICards kpis={kpis} />

        {/* Recent Activity Table */}
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
                <StockTable 
                  type="in" 
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </TabsContent>
              <TabsContent value="stock-out" className="mt-6">
                <StockTable 
                  type="out" 
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}