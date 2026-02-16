import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { useUpdateGym } from '@/app/hooks/useGyms';

interface EditGymModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gym: {
    id: string;
    name: string;
    address: string;
    city: string;
    state?: string | null;
    pincode?: string | null;
    contact_number: string;
  };
}

export function EditGymModal({ open, onOpenChange, gym }: EditGymModalProps) {
  const updateGym = useUpdateGym();

  const [name, setName] = useState(gym.name);
  const [address, setAddress] = useState(gym.address);
  const [city, setCity] = useState(gym.city);
  const [state, setState] = useState(gym.state || '');
  const [pincode, setPincode] = useState(gym.pincode || '');
  const [contactNumber, setContactNumber] = useState(gym.contact_number);

  useEffect(() => {
    setName(gym.name);
    setAddress(gym.address);
    setCity(gym.city);
    setState(gym.state || '');
    setPincode(gym.pincode || '');
    setContactNumber(gym.contact_number);
  }, [gym]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateGym.mutateAsync({
      id: gym.id,
      name,
      address,
      city,
      state: state || null,
      pincode: pincode || null,
      contact_number: contactNumber,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Gym Details</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Gym Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter gym name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Enter state"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter pincode"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="Enter contact"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateGym.isPending}>
              {updateGym.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}