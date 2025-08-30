'use client';

import { useEffect, useRef, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import StockTable from '@/components/tables/StockTable';
import StockInModal from '@/components/modals/StockInModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import StockInPrint from '@/components/print/stockin';

export default function StockInPage() {
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
            <h1 className="text-3xl font-bold tracking-tight">Stock In</h1>
            <span>(goods received note)</span>
          </div>
          <p className="text-muted-foreground">
            Manage your stock in transactions and inventory
          </p>
        </div>

        {/* Search and Add Button */}
        <div className="flex gap-4">
          <Button onClick={() => setIsAddModalOpen(true)} className="shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            Add Stock In
          </Button>
        </div>

        {/* Stock In Table */}
        <StockTable
          key={tableKey}
          type="in"
          onView={handleView}
          onEdit={handleEdit}
          onPrint={handlePrint}
        />

        {/* Add Modal */}
        <StockInModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={handleSuccess}
        />

        {/* Edit Modal */}
        <StockInModal
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
              <DialogTitle>Stock In Details</DialogTitle>
            </DialogHeader>
            {selectedItem && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Serial No.</label>
                    <p className="font-semibold">{selectedItem.serialNo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Inward Date</label>
                    <p>{format(new Date(selectedItem.inwardDate), 'MMM dd, yyyy')}</p>
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
                    <label className="text-sm font-medium text-gray-500">Room No.</label>
                    <p>{selectedItem.roomNo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Rack No.</label>
                    <p>{selectedItem.rackNo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Received</label>
                    <p>{selectedItem.received}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Crates / Parcels</label>
                    <p>{selectedItem.crates}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Rupees</label>
                    <p>Rs. {selectedItem.rupees}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Crates Per Month</label>
                    <p>{selectedItem.cratesPerMonth}</p>
                  </div>
                  {selectedItem.issuedDate && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Issued Date</label>
                      <p>{format(new Date(selectedItem.issuedDate), 'MMM dd, yyyy')}</p>
                    </div>
                  )}
                </div>
                {selectedItem.customerMark && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Customer Mark</label>
                    <p className="whitespace-pre-wrap">{selectedItem.customerMark}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <StockInPrint ref={printRef} item={selectedPrintItem} />
    </AppLayout>
  );
}