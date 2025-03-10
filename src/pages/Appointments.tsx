
import React from 'react';
import { format } from 'date-fns';
import { Clock, Calendar, CheckCircle, X } from 'lucide-react';
import { Tab } from '@headlessui/react';
import { useAppointment, Appointment } from '@/context/AppointmentContext';
import NavBar from '@/components/NavBar';
import AppointmentCard from '@/components/AppointmentCard';
import { cn } from '@/lib/utils';

const AppointmentsPage = () => {
  const { appointments } = useAppointment();
  
  // Filter appointments by status
  const upcoming = appointments.filter(a => a.status === 'scheduled');
  const past = appointments.filter(a => a.status === 'completed');
  const cancelled = appointments.filter(a => a.status === 'cancelled');
  
  const getTabs = () => [
    { name: 'Upcoming', count: upcoming.length, icon: Calendar },
    { name: 'Past', count: past.length, icon: CheckCircle },
    { name: 'Cancelled', count: cancelled.length, icon: X },
  ];
  
  const getAppointmentsByTab = (tabIndex: number): Appointment[] => {
    switch (tabIndex) {
      case 0: return upcoming;
      case 1: return past;
      case 2: return cancelled;
      default: return upcoming;
    }
  };
  
  const renderEmptyState = (tabIndex: number) => {
    const messages = [
      {
        title: 'No upcoming appointments',
        description: "You don't have any scheduled appointments. Would you like to book one?",
        icon: Calendar,
      },
      {
        title: 'No past appointments',
        description: "You don't have any completed appointments yet.",
        icon: CheckCircle,
      },
      {
        title: 'No cancelled appointments',
        description: "You don't have any cancelled appointments.",
        icon: X,
      },
    ];
    
    const { title, description, icon: Icon } = messages[tabIndex];
    
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg animate-fade-in mt-4">
        <Icon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-muted-foreground">
          {description}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
        <div className="container max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">My Appointments</h1>
            <p className="text-muted-foreground">
              View and manage all your scheduled consultations
            </p>
          </div>
          
          <Tab.Group>
            <Tab.List className="flex space-x-2 rounded-xl bg-muted/50 p-1 mb-6">
              {getTabs().map((tab) => (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    cn(
                      'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                      'ring-white/60 ring-offset-2 focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-white shadow'
                        : 'text-muted-foreground hover:bg-white/[0.12]'
                    )
                  }
                >
                  <div className="flex items-center justify-center gap-2">
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                    <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs">
                      {tab.count}
                    </span>
                  </div>
                </Tab>
              ))}
            </Tab.List>
            
            <Tab.Panels>
              {[0, 1, 2].map((tabIndex) => (
                <Tab.Panel key={tabIndex} className="animate-fade-in">
                  {getAppointmentsByTab(tabIndex).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getAppointmentsByTab(tabIndex).map((appointment) => (
                        <AppointmentCard 
                          key={appointment.id} 
                          appointment={appointment} 
                        />
                      ))}
                    </div>
                  ) : (
                    renderEmptyState(tabIndex)
                  )}
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
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
    </div>
  );
};

export default AppointmentsPage;
