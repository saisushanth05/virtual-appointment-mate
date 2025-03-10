
import React, { useState } from 'react';
import { useAppointment } from '@/context/AppointmentContext';
import CalendarView from '@/components/Calendar';
import DoctorAvailability from '@/components/DoctorAvailability';
import BookingModal from '@/components/BookingModal';
import AppointmentConfirmation from '@/components/AppointmentConfirmation';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, CheckCircle, Clock, MessageSquare } from 'lucide-react';

const Index = () => {
  const { appointments } = useAppointment();
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Get the most recent appointment to show in confirmation
  const latestAppointment = appointments.length > 0 
    ? appointments[appointments.length - 1] 
    : null;

  // If booking was successful and we have an appointment, show confirmation
  React.useEffect(() => {
    if (latestAppointment && latestAppointment.status === 'scheduled') {
      setShowConfirmation(true);
    }
  }, [appointments.length, latestAppointment]);

  // If showing confirmation, render the confirmation component
  if (showConfirmation && latestAppointment) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 bg-background">
          <AppointmentConfirmation 
            appointment={latestAppointment} 
            onDone={() => setShowConfirmation(false)} 
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 bg-background">
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                Virtual Health Appointments, <span className="text-primary">Simplified</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Book your virtual consultation with top healthcare providers in just a few clicks.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <Button size="lg" className="gap-2">
                  <Calendar className="h-5 w-5" />
                  Book Appointment
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Chat with Assistant
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="glass-card p-6 rounded-xl flex flex-col items-center text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Choose Your Date</h3>
                  <p className="text-muted-foreground">
                    Select from available dates on our easy-to-use calendar interface
                  </p>
                </div>
                
                <div className="glass-card p-6 rounded-xl flex flex-col items-center text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Pick a Time Slot</h3>
                  <p className="text-muted-foreground">
                    Browse real-time availability and select the time that works for you
                  </p>
                </div>
                
                <div className="glass-card p-6 rounded-xl flex flex-col items-center text-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Confirm Booking</h3>
                  <p className="text-muted-foreground">
                    Complete your booking and receive instant confirmation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="container mx-auto">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight mb-3">
                  Book Your Appointment
                </h2>
                <p className="text-muted-foreground">
                  Select your preferred date and doctor to view available time slots
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-panel rounded-xl p-6">
                  <CalendarView />
                </div>
                
                <div className="glass-panel rounded-xl p-6">
                  <DoctorAvailability />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Ready to Prioritize Your Health?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Schedule your virtual health consultation today and take control of your wellbeing.
              </p>
              <Button size="lg" className="gap-2 animate-pulse-soft">
                Book Now
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t py-8 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="font-medium">MedicalAssist</span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} MedicalAssist. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      
      <BookingModal />
    </div>
  );
};

export default Index;
