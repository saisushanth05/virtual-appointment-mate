
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Check, X, Clock, User, Mail, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAppointment } from '@/context/AppointmentContext';
import { toast } from 'sonner';

const BookingModal: React.FC = () => {
  const {
    selectedDoctor,
    selectedTimeSlot,
    isBookingModalOpen,
    setIsBookingModalOpen,
    bookAppointment,
  } = useAppointment();

  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!selectedTimeSlot || !selectedDoctor) return null;

  const selectedDate = new Date(selectedTimeSlot.date);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!patientName.trim() || !patientEmail.trim()) {
      toast.error('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(patientEmail)) {
      toast.error('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    // Simulate network delay
    setTimeout(() => {
      // Book appointment
      bookAppointment(patientName, patientEmail, notes);
      
      // Show success message
      toast.success('Appointment booked successfully!', {
        description: `Your appointment with ${selectedDoctor.name} is confirmed.`,
      });
      
      // Reset form
      setPatientName('');
      setPatientEmail('');
      setNotes('');
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <div className="bg-primary/5 p-6 border-b">
          <DialogHeader>
            <DialogTitle className="text-xl">Book Your Appointment</DialogTitle>
            <DialogDescription>
              Complete the form below to schedule your appointment with {selectedDoctor.name}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full overflow-hidden">
                <img 
                  src={selectedDoctor.avatar} 
                  alt={selectedDoctor.name} 
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium">{selectedDoctor.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedDoctor.specialty}</p>
              </div>
            </div>
            
            <div className="flex gap-4 p-3 bg-background rounded-lg">
              <div className="flex flex-col">
                <span className="text-sm font-medium">Date</span>
                <span className="text-muted-foreground text-sm">
                  {format(selectedDate, 'EEE, MMM d, yyyy')}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Time</span>
                <span className="text-muted-foreground text-sm">
                  {selectedTimeSlot.startTime} - {selectedTimeSlot.endTime}
                </span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Your Name
              </label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Additional Notes
              </label>
              <Textarea
                id="notes"
                placeholder="Any symptoms or concerns you'd like to mention? (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full min-h-[100px]"
              />
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsBookingModalOpen(false)}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Confirm Booking
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
