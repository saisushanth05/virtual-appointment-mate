
import React from 'react';
import NavBar from '@/components/NavBar';
import AdminDashboard from '@/components/AdminDashboard';

const AdminPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 bg-background">
        <AdminDashboard />
      </main>
    </div>
  );
};

export default AdminPage;
