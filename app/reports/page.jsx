'use client';

import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReportsPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate comprehensive reports for your inventory
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reporting System</CardTitle>
            <CardDescription>
              This feature is coming soon. You will be able to generate monthly and yearly reports here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Future implementation will include detailed reports on stock in, stock out, and expenses with filtering and export capabilities.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}