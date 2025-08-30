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

export default function StockInModal({ isOpen, onClose, onSuccess, editData = null }) {
  const [formData, setFormData] = useState({
    inwardDate: format(new Date(), 'yyyy-MM-dd'),
    partyName: '',
    subPartyName: '',
    roomNo: '',
    rackNo: '',
    received: '',
    crates: '',
    rupees: '',
    cratesPerMonth: '',
    customerMark: '',
    issuedDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [parties, setParties] = useState([]);  // store all parties
  const [loadingParties, setLoadingParties] = useState(false);
  const [openCmd, setOpenCmd] = useState(false)

  useEffect(() => {
    if (editData) {
      setFormData({
        inwardDate: editData.inwardDate ? format(new Date(editData.inwardDate), 'yyyy-MM-dd') : '',
        partyName: editData.partyName || '',
        subPartyName: editData.subPartyName || '',
        roomNo: editData.roomNo || '',
        rackNo: editData.rackNo || '',
        received: editData.received || '',
        crates: editData.crates || '',
        rupees: editData.rupees || '',
        cratesPerMonth: editData.cratesPerMonth || '',
        customerMark: editData.customerMark || '',
        issuedDate: editData.issuedDate ? format(new Date(editData.issuedDate), 'yyyy-MM-dd') : ''
      });
    } else {
      resetForm();
    }
  }, [editData, isOpen]);

  const resetForm = () => {
    setFormData({
      inwardDate: format(new Date(), 'yyyy-MM-dd'),
      partyName: '',
      subPartyName: '',
      roomNo: '',
      rackNo: '',
      received: '',
      crates: '',
      rupees: '',
      cratesPerMonth: '',
      customerMark: '',
      issuedDate: '',
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
      const payload = {
        ...formData,
        received: parseFloat(formData.received) || 0,
        crates: parseFloat(formData.crates) || 0,
        rupees: parseFloat(formData.rupees) || 0,
        cratesPerMonth: parseFloat(formData.cratesPerMonth) || 0,
        issuedDate: formData.issuedDate || null,
      };

      const url = editData ? `/api/stock-in/${editData._id}` : '/api/stock-in';
      const method = editData ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(editData ? 'Stock in record updated successfully' : 'Stock in record created successfully');
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
            {editData ? 'Edit Stock In' : 'Add Stock In'}
            <span className='ml-2'>(Goods Received Note)</span>
          </DialogTitle>

        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="inwardDate">Inward Date *</Label>
              <Input
                id="inwardDate"
                name="inwardDate"
                type="date"
                value={formData.inwardDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="issuedDate">Issued Date</Label>
              <Input
                id="issuedDate"
                name="issuedDate"
                type="date"
                value={formData.issuedDate}
                onChange={handleChange}
              />
            </div>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="roomNo">Room No.</Label>
              <Input
                id="roomNo"
                name="roomNo"
                value={formData.roomNo}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="rackNo">Rack No.</Label>
              <Input
                id="rackNo"
                name="rackNo"
                value={formData.rackNo}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="received">Received</Label>
              <Input
                id="received"
                name="received"
                type="number"
                step="0.01"
                value={formData.received}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="crates">Crates / Parcels</Label>
              <Input
                id="crates"
                name="crates"
                type="number"
                step="0.01"
                value={formData.crates}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rupees">Rupees per month</Label>
              <Input
                id="rupees"
                name="rupees"
                type="number"
                step="0.01"
                value={formData.rupees}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="cratesPerMonth">Crates / Parcels weight kg</Label>
              <Input
                id="cratesPerMonth"
                name="cratesPerMonth"
                type="number"
                step="0.01"
                value={formData.cratesPerMonth}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="customerMark">Customer Mark</Label>
            <Textarea
              id="customerMark"
              name="customerMark"
              value={formData.customerMark}
              onChange={handleChange}
              rows={3}
            />
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