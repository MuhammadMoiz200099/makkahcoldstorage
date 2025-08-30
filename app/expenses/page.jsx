'use client';

import { useState, useEffect, useRef } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ChevronLeft, ChevronRight, Calendar, DollarSign, Package, PackageOpen, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { format, subMonths } from 'date-fns';
import axios from "axios";
import ExpensesPrint from '@/components/print/expenses';

export default function ExpensesPage() {
  const printRef = useRef();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [selectedPrintItem, setSelectedPrintItem] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchExpenses();
  }, [search, selectedMonth, pagination.page]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search: search,
        month: selectedMonth
      });

      const response = await fetch(`/api/expenses?${params}`);

      if (response.ok) {
        const result = await response.json();
        setExpenses(result.expenses);
        setPagination(result.pagination);
      } else {
        toast.error('Failed to fetch expenses');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const goToPage = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  // Generate month options for the last 12 months
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), i);
    return {
      value: format(date, 'yyyy-MM'),
      label: format(date, 'MMMM yyyy')
    };
  });

  const getTotalAmount = () => {
    return expenses.reduce((total, expense) => total + expense.totalAmount, 0);
  };

  const getTotalStockIn = () => {
    return expenses.reduce((total, expense) => total + expense.stockInCount, 0);
  };

  const getTotalStockOut = () => {
    return expenses.reduce((total, expense) => total + expense.stockOutCount, 0);
  };

  const handlePrint = async (item) => {
    try {
      const res = await axios.get(`/api/party/${encodeURIComponent(item.partyName)}`);
      const response = res.data;
      if(response.stockIn && response.stockIn.length) {
        const stocks = response.stockIn;
        const size = stocks.length;
        let data = {
          partyName: response.partyName,
          stockOut: response.stockOut,
          stockIn: []
        }
        if(size > 20) {
          data.stockIn = response.stockIn;
        } else {
          let dummy = Array(20 - size).fill({});
          let dums = [...response.stockIn, ...dummy];
          data.stockIn = dums;
        }
        setSelectedPrintItem(data)
      }
      
    } catch (error) {
      if (error.response) {
        console.error("API Error:", error.response.data);
      } else {
        console.error("Request Error:", error.message);
      }
    }
  };

  useEffect(() => {
    if (selectedPrintItem) {
      console.log(selectedPrintItem)
      const printContents = printRef.current.innerHTML;
      const originalContents = document.body.innerHTML;

      // Replace body with print layout
      document.body.innerHTML = printContents;

      window.print(); // Open print modal

      // Restore original page
      document.body.innerHTML = originalContents;
      window.location.reload(); // reload so React re-renders UI
      setSelectedPrintItem(null);
    }
  }, [selectedPrintItem])

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground">
            Track party-wise billing and expenses for stock operations
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rs. {getTotalAmount().toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                For {format(new Date(selectedMonth), 'MMMM yyyy')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock In Operations</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalStockIn()}</div>
              <p className="text-xs text-muted-foreground">
                Total transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Out Operations</CardTitle>
              <PackageOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalStockOut()}</div>
              <p className="text-xs text-muted-foreground">
                Total transactions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by party name..."
              value={search}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
          <Select value={selectedMonth} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-48">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Expenses Table */}
        <Card>
          <CardHeader>
            <CardTitle>Party-wise Billing Summary</CardTitle>
            <CardDescription>
              Monthly billing summary for each party based on stock operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Party Name</TableHead>
                    <TableHead>Sub Party</TableHead>
                    <TableHead>Stock In Count</TableHead>
                    <TableHead>Stock Out Count</TableHead>
                    <TableHead>Total Crates</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Last Transaction</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : expenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No expenses found for the selected month
                      </TableCell>
                    </TableRow>
                  ) : (
                    expenses.map((expense, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{expense.partyName}</TableCell>
                        <TableCell>{expense.subPartyName}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-green-600">
                            {expense.stockInCount}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-blue-600">
                            {expense.stockOutCount}
                          </Badge>
                        </TableCell>
                        <TableCell>{expense.totalCrates}</TableCell>
                        <TableCell className="font-semibold">
                          Rs. {expense.totalAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {expense.lastTransaction ?
                            format(new Date(expense.lastTransaction), 'MMM dd, yyyy') :
                            'N/A'
                          }
                        </TableCell>
                        <TableCell>
                          <Button onClick={() => handlePrint(expense)} className="shrink-0">
                            <Printer className="mr-2 h-4 w-4" />
                            Print
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-700">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} results
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                      .filter(page =>
                        page === 1 ||
                        page === pagination.pages ||
                        Math.abs(page - pagination.page) <= 1
                      )
                      .map((page, index, array) => (
                        <div key={page}>
                          {index > 0 && array[index - 1] < page - 1 && (
                            <span className="px-2 text-gray-400">...</span>
                          )}
                          <Button
                            variant={page === pagination.page ? "default" : "outline"}
                            size="sm"
                            onClick={() => goToPage(page)}
                          >
                            {page}
                          </Button>
                        </div>
                      ))
                    }
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <ExpensesPrint ref={printRef} details={selectedPrintItem} />
    </AppLayout>
  );
}