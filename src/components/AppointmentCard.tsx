
import React from 'react';
import { format } from 'date-fns';
import { CalendarDays, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAppointment, Appointment } from '@/context/AppointmentContext';
import { Badge } from './ui/badge-custom';
import { toast } from 'sonner';

interface AppointmentCardProps {
  appointment: Appointment;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  const { doctors, cancelAppointment } = useAppointment();
  const doctor = doctors.find(d => d.id === appointment.doctorId);
  
  if (!doctor) return null;
  
  const appointmentDate = new Date(appointment.timeSlot.date);
  
  const handleCancelAppointment = () => {
    cancelAppointment(appointment.id);
    toast.success('Appointment cancelled successfully');
  };
  
  const getStatusBadge = () => {
    switch (appointment.status) {
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Scheduled</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Cancelled</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="glass-card h-full flex flex-col animate-slide-up">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{doctor.name}</CardTitle>
          {getStatusBadge()}
        </div>
        <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
      </CardHeader>
      
      <CardContent className="space-y-3 flex-1">
        <div className="flex items-center gap-2 text-sm">
          <CalendarDays className="h-4 w-4 text-primary" />
          <span>{format(appointmentDate, 'EEEE, MMMM d, yyyy')}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-primary" />
          <span>{appointment.timeSlot.startTime} - {appointment.timeSlot.endTime}</span>
        </div>
        
        {appointment.notes && (
          <div className="mt-3 text-sm">
            <p className="font-medium">Notes:</p>
            <p className="text-muted-foreground">{appointment.notes}</p>
          </div>
        )}
      </CardContent>
      
      {appointment.status === 'scheduled' && (
        <CardFooter className="border-t pt-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full text-destructive">
                <X className="h-4 w-4 mr-2" />
                Cancel Appointment
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to cancel your appointment with {doctor.name} on {format(appointmentDate, 'MMMM d')} at {appointment.timeSlot.startTime}?
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
                <AlertDialogAction onClick={handleCancelAppointment} className="bg-destructive text-destructive-foreground">
                  Yes, Cancel
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      )}
    </Card>
  );
};

export default AppointmentCard;
