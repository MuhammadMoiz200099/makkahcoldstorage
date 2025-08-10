'use client';

import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ExpensesPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground">
            Track and manage your business expenses
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Expense Management</CardTitle>
            <CardDescription>
              This feature is coming soon. You will be able to track monthly and weekly expenses here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Future implementation will include expense tracking, categorization, and reporting.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}