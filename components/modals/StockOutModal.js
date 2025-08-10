'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function StockOutModal({ isOpen, onClose, onSuccess, editData = null }) {
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    partyName: '',
    subPartyName: '',
    goodDeliveredTo: '',
    partyDeliveryOn: '',
    coldStoreDeliveryOn: '',
    vehicle: '',
    driverName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData({
        date: editData.date ? format(new Date(editData.date), 'yyyy-MM-dd') : '',
        partyName: editData.partyName || '',
        subPartyName: editData.subPartyName || '',
        goodDeliveredTo: editData.goodDeliveredTo || '',
        partyDeliveryOn: editData.partyDeliveryOn ? format(new Date(editData.partyDeliveryOn), 'yyyy-MM-dd') : '',
        coldStoreDeliveryOn: editData.coldStoreDeliveryOn ? format(new Date(editData.coldStoreDeliveryOn), 'yyyy-MM-dd') : '',
        vehicle: editData.vehicle || '',
        driverName: editData.driverName || ''
      });
    } else {
      resetForm();
    }
  }, [editData, isOpen]);

  const resetForm = () => {
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      partyName: '',
      subPartyName: '',
      goodDeliveredTo: '',
      partyDeliveryOn: '',
      coldStoreDeliveryOn: '',
      vehicle: '',
      driverName: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editData ? `/api/stock-out/${editData._id}` : '/api/stock-out';
      const method = editData ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(editData ? 'Stock out record updated successfully' : 'Stock out record created successfully');
        onSuccess();
        handleClose();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Operation failed');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editData ? 'Edit Stock Out' : 'Add Stock Out'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="partyName">Party Name *</Label>
              <Input
                id="partyName"
                name="partyName"
                value={formData.partyName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="subPartyName">Sub Party Name *</Label>
              <Input
                id="subPartyName"
                name="subPartyName"
                value={formData.subPartyName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="goodDeliveredTo">Good Delivered To *</Label>
            <Textarea
              id="goodDeliveredTo"
              name="goodDeliveredTo"
              value={formData.goodDeliveredTo}
              onChange={handleChange}
              required
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="partyDeliveryOn">Party Delivery On *</Label>
              <Input
                id="partyDeliveryOn"
                name="partyDeliveryOn"
                type="date"
                value={formData.partyDeliveryOn}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="coldStoreDeliveryOn">Cold Store Delivery On *</Label>
              <Input
                id="coldStoreDeliveryOn"
                name="coldStoreDeliveryOn"
                type="date"
                value={formData.coldStoreDeliveryOn}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vehicle">Vehicle *</Label>
              <Input
                id="vehicle"
                name="vehicle"
                value={formData.vehicle}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="driverName">Driver Name *</Label>
              <Input
                id="driverName"
                name="driverName"
                value={formData.driverName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : editData ? 'Update' : 'Submit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}