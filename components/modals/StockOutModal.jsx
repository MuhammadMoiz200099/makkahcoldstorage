'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils"

export default function StockOutModal({ isOpen, onClose, onSuccess, editData = null }) {
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    partyName: '',
    subPartyName: '',
    goodDeliveredTo: '',
    partyGrNo: '',
    coldStoreGrNo: '',
    vehicle: '',
    driverName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [parties, setParties] = useState([]);  // store all parties
  const [loadingParties, setLoadingParties] = useState(false);
  const [openCmd, setOpenCmd] = useState(false)

  useEffect(() => {
    if (editData) {
      setFormData({
        date: editData.date ? format(new Date(editData.date), 'yyyy-MM-dd') : '',
        partyName: editData.partyName || '',
        subPartyName: editData.subPartyName || '',
        goodDeliveredTo: editData.goodDeliveredTo || '',
        partyGrNo: editData.partyGrNo || '',
        coldStoreGrNo: editData.coldStoreGrNo || '',
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
      partyGrNo: '',
      coldStoreGrNo: '',
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

  useEffect(() => {
    if (!open || parties.length > 0) return
    const fetchParties = async () => {
      setLoadingParties(true);
      try {
        const res = await fetch('/api/party');
        const data = await res.json();
        if (res.ok) {
          setParties(data.parties || []);
        } else {
          toast.error(data.error || 'Failed to load parties');
        }
      } catch (error) {
        toast.error('Error fetching parties');
      } finally {
        setLoadingParties(false);
      }
    };

    if (isOpen) {
      fetchParties();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editData ? 'Edit Stock Out' : 'Add Stock Out'}
            <span className='ml-2'>(Gate Pass)</span>
          </DialogTitle>
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
              <Label>Party Name *</Label>
              <Popover open={openCmd} onOpenChange={setOpenCmd}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {formData.partyName || "Select or add party..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search or add party..."
                      onValueChange={(val) => {
                        setFormData(prev => ({ ...prev, partyName: val }))
                      }}
                      value={formData.partyName}
                    />
                    {loadingParties ? (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span className="text-sm text-gray-500">Loading...</span>
                      </div>
                    ) : (
                      <>
                        {/* If no party found → allow adding new */}
                        <CommandEmpty>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, partyName: formData.partyName }))
                              setOpenCmd(false)
                            }}
                          >
                            ➕ Add "{formData.partyName}"
                          </Button>
                        </CommandEmpty>

                        <CommandGroup>
                          {parties.map((party, idx) => (
                            <CommandItem
                              key={idx}
                              value={party}
                              onSelect={(currentValue) => {
                                setFormData(prev => ({ ...prev, partyName: currentValue }))
                                setOpenCmd(false) // close after select
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.partyName === party ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {party}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </>
                    )}
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="subPartyName">Sub Party Name</Label>
              <Input
                id="subPartyName"
                name="subPartyName"
                value={formData.subPartyName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="goodDeliveredTo">Good Delivered To</Label>
            <Textarea
              id="goodDeliveredTo"
              name="goodDeliveredTo"
              value={formData.goodDeliveredTo}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="partyGrNo">Party GR No. *</Label>
              <Input
                id="partyGrNo"
                name="partyGrNo"
                type="text"
                value={formData.partyGrNo}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="coldStoreGrNo">Cold Storage GR No.</Label>
              <Input
                id="coldStoreGrNo"
                name="coldStoreGrNo"
                type="text"
                value={formData.coldStoreGrNo}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vehicle">Vehicle</Label>
              <Input
                id="vehicle"
                name="vehicle"
                value={formData.vehicle}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="driverName">Driver Name</Label>
              <Input
                id="driverName"
                name="driverName"
                value={formData.driverName}
                onChange={handleChange}
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