/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { ExercisesPage } from './pages/ExercisesPage';
import { RoutinesPage } from './pages/RoutinesPage';
import { WorkoutPage } from './pages/WorkoutPage';
import { Flame, Dumbbell, List, LayoutDashboard } from 'lucide-react';
import clsx from 'clsx';

function NavItem({ to, icon: Icon, label }: { to: string, icon: any, label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={clsx(
        "flex flex-col items-center gap-1 p-2 rounded-xl transition-colors",
        isActive ? "text-emerald-400 bg-emerald-500/10" : "text-gray-500 hover:text-gray-300"
      )}
    >
      <Icon size={24} />
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-emerald-500/30 pb-20 md:pb-0 md:pl-20">
      
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-20 bg-gray-950 border-r border-white/5 flex-col items-center py-8 gap-8 z-20">
        <div className="bg-emerald-500 p-2 rounded-xl mb-4">
          <Flame size={24} className="text-black fill-black" />
        </div>
        <NavItem to="/" icon={LayoutDashboard} label="Home" />
        <NavItem to="/routines" icon={List} label="Routines" />
        <NavItem to="/exercises" icon={Dumbbell} label="Exercises" />
      </nav>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-950 border-t border-white/5 h-16 flex items-center justify-around z-20 px-4">
        <NavItem to="/" icon={LayoutDashboard} label="Home" />
        <NavItem to="/routines" icon={List} label="Routines" />
        <NavItem to="/exercises" icon={Dumbbell} label="Exercises" />
      </nav>

      <main>
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/exercises" element={<ExercisesPage />} />
          <Route path="/routines" element={<RoutinesPage />} />
          <Route path="/workout/:id" element={<WorkoutPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
