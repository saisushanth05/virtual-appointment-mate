
import React from 'react';
import { Check, Calendar, Clock, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { format } from 'date-fns';
import { useAppointment, Appointment } from '@/context/AppointmentContext';

interface AppointmentConfirmationProps {
  appointment: Appointment;
  onDone: () => void;
}

const AppointmentConfirmation: React.FC<AppointmentConfirmationProps> = ({ 
  appointment, 
  onDone 
}) => {
  const { doctors } = useAppointment();
  const doctor = doctors.find(d => d.id === appointment.doctorId);
  
  if (!doctor) return null;
  
  const appointmentDate = new Date(appointment.timeSlot.date);

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
          <Check className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold">Appointment Confirmed</h2>
        <p className="text-muted-foreground mt-1">
          Your appointment has been successfully scheduled
        </p>
      </div>
      
      <Card className="glass-card overflow-hidden animate-fade-in">
        <CardHeader className="bg-primary/5 border-b">
          <CardTitle>Appointment Details</CardTitle>
          <CardDescription>
            Please save this information for your records
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6 pb-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full overflow-hidden">
              <img 
                src={doctor.avatar} 
                alt={doctor.name}
                className="h-full w-full object-cover" 
              />
            </div>
            <div>
              <p className="font-medium">{doctor.name}</p>
              <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
            </div>
          </div>
          
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Date</p>
                <p className="text-muted-foreground">
                  {format(appointmentDate, 'EEEE, MMMM d, yyyy')}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Time</p>
                <p className="text-muted-foreground">
                  {appointment.timeSlot.startTime} - {appointment.timeSlot.endTime}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-muted-foreground">
                  Virtual Consultation
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Contact</p>
                <p className="text-muted-foreground">
                  A link will be sent to your email before the appointment
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="border-t p-4 bg-muted/20">
          <Button onClick={onDone} className="w-full">
            Done
          </Button>
        </CardFooter>
      </Card>
      
      <p className="text-center text-sm text-muted-foreground mt-6">
        Need to reschedule? You can manage your appointments from your dashboard
      </p>
    </div>
  );
};

export default AppointmentConfirmation;
