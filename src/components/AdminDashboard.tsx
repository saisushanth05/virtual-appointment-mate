
import React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Search, Plus, Calendar, ChevronDown } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppointment, Appointment } from '@/context/AppointmentContext';
import AppointmentCard from './AppointmentCard';
import { cn } from '@/lib/utils';

const AdminDashboard: React.FC = () => {
  const { doctors, appointments, selectedDoctor, setSelectedDoctor } = useAppointment();
  
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Filter appointments based on selected doctor, date, and search term
  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.timeSlot.date);
    const matchesDoctor = !selectedDoctor || appointment.doctorId === selectedDoctor.id;
    const matchesDate = !date || appointmentDate.toDateString() === date.toDateString();
    const matchesSearch = !searchTerm || 
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patientEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesDoctor && matchesDate && matchesSearch;
  });
  
  // Group appointments by status
  const scheduledAppointments = filteredAppointments.filter(a => a.status === 'scheduled');
  const completedAppointments = filteredAppointments.filter(a => a.status === 'completed');
  const cancelledAppointments = filteredAppointments.filter(a => a.status === 'cancelled');

  return (
    <div className="container py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage appointments and doctor availability</p>
        </div>
        
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Availability
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Appointments</CardTitle>
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming</CardTitle>
            <CardDescription>Scheduled appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{scheduledAppointments.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            <CardDescription>Past appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedAppointments.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cancelled</CardTitle>
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{cancelledAppointments.length}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patient name or email..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select
          value={selectedDoctor?.id || ''}
          onValueChange={(value) => {
            const doctor = doctors.find(d => d.id === value);
            setSelectedDoctor(doctor || null);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Doctors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Doctors</SelectItem>
            {doctors.map(doctor => (
              <SelectItem key={doctor.id} value={doctor.id}>
                {doctor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : <span>Pick a date</span>}
              <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
            <div className="p-3 border-t">
              <Button
                variant="ghost"
                className="w-full justify-center"
                onClick={() => setDate(undefined)}
              >
                Clear Date
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map(appointment => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-muted/30 rounded-lg">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium">No appointments found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters to see more results
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="scheduled" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scheduledAppointments.length > 0 ? (
              scheduledAppointments.map(appointment => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-muted/30 rounded-lg">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium">No scheduled appointments</h3>
                <p className="text-muted-foreground">
                  There are no upcoming appointments scheduled
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="completed" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedAppointments.length > 0 ? (
              completedAppointments.map(appointment => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-muted/30 rounded-lg">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium">No completed appointments</h3>
                <p className="text-muted-foreground">
                  There are no completed appointments yet
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="cancelled" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cancelledAppointments.length > 0 ? (
              cancelledAppointments.map(appointment => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-muted/30 rounded-lg">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium">No cancelled appointments</h3>
                <p className="text-muted-foreground">
                  There are no cancelled appointments
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
