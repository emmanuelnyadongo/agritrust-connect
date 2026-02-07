import { NavLink, useLocation } from 'react-router-dom';
import { useRole } from '@/hooks/useRole';
import {
  LayoutDashboard,
  Store,
  MessageSquare,
  History,
  User,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/marketplace', label: 'Marketplace', icon: Store },
  { to: '/negotiations', label: 'Negotiations', icon: MessageSquare },
  { to: '/transactions', label: 'Transactions', icon: History },
  { to: '/profile', label: 'Profile', icon: User },
];

export const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { role, setRole } = useRole();
  const location = useLocation();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-200',
        collapsed ? 'w-16' : 'w-56'
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-sidebar-border px-4 py-5">
        {!collapsed && (
          <div>
            <h1 className="font-heading text-lg font-semibold tracking-tight text-sidebar-foreground">
              AgriTrust
            </h1>
            <p className="text-xs text-sidebar-foreground/60">Agricultural Marketplace</p>
          </div>
        )}
        {collapsed && (
          <span className="font-heading text-lg font-bold text-sidebar-primary">A</span>
        )}
      </div>

      {/* Role switcher */}
      <div className="border-b border-sidebar-border px-3 py-3">
        <div className={cn('flex gap-1', collapsed && 'flex-col')}>
          <button
            onClick={() => setRole('farmer')}
            className={cn(
              'rounded px-2 py-1 text-xs font-medium transition-colors',
              role === 'farmer'
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground/60 hover:text-sidebar-foreground'
            )}
          >
            {collapsed ? 'F' : 'Farmer'}
          </button>
          <button
            onClick={() => setRole('buyer')}
            className={cn(
              'rounded px-2 py-1 text-xs font-medium transition-colors',
              role === 'buyer'
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground/60 hover:text-sidebar-foreground'
            )}
          >
            {collapsed ? 'B' : 'Buyer'}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-2 py-3">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 rounded px-3 py-2.5 text-sm transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="border-t border-sidebar-border px-4 py-3 text-sidebar-foreground/50 hover:text-sidebar-foreground"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
};
