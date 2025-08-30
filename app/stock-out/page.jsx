'use client';

import { useEffect, useRef, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import StockTable from '@/components/tables/StockTable';
import StockOutModal from '@/components/modals/StockOutModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import StockOutPrint from '@/components/print/stockout';

const tdStyle = {
  border: "1px solid #000",
  padding: "5px",
};


export default function StockOutPage() {
  const printRef = useRef();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedPrintItem, setSelectedPrintItem] = useState(null);
  const [tableKey, setTableKey] = useState(0);

  const handleView = (item) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleSuccess = () => {
    setTableKey(prev => prev + 1); // Force table refresh
  };

  const handlePrint = (item) => {
    setSelectedPrintItem(item);
  }

  useEffect(() => {
    if (selectedPrintItem) {
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

          <div className='flex flex-col gap-2 items-baseline md:flex-row mb-2'>
            <h1 className="text-3xl font-bold tracking-tight">Stock Out</h1>
            <span>(Gate pass)</span>
          </div>
          <p className="text-muted-foreground">
            Manage your stock out transactions and deliveries
          </p>
        </div>

        {/* Add Button */}
        <div className="flex gap-4">
          <Button onClick={() => setIsAddModalOpen(true)} className="shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            Add Stock Out
          </Button>
        </div>

        {/* Stock Out Table */}
        <StockTable
          key={tableKey}
          type="out"
          onView={handleView}
          onEdit={handleEdit}
          onPrint={handlePrint}
        />

        {/* Add Modal */}
        <StockOutModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={handleSuccess}
        />

        {/* Edit Modal */}
        <StockOutModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedItem(null);
          }}
          onSuccess={handleSuccess}
          editData={selectedItem}
        />

        {/* View Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={() => {
          setIsViewModalOpen(false);
          setSelectedItem(null);
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Stock Out Details</DialogTitle>
            </DialogHeader>
            {selectedItem && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Serial No.</label>
                    <p className="font-semibold">{selectedItem.serialNo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date</label>
                    <p>{format(new Date(selectedItem.date), 'MMM dd, yyyy')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Party Name</label>
                    <p>{selectedItem.partyName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Sub Party Name</label>
                    <p>{selectedItem.subPartyName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Party Delivery On</label>
                    <p>{selectedItem.partyGrNo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Cold Store Delivery On</label>
                    <p>{selectedItem.coldStoreGrNo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Vehicle</label>
                    <p>{selectedItem.vehicle}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Driver Name</label>
                    <p>{selectedItem.driverName}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Good Delivered To</label>
                  <p className="whitespace-pre-wrap">{selectedItem.goodDeliveredTo}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <StockOutPrint ref={printRef} item={selectedPrintItem} />
    </AppLayout>
  );
}