import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useRole } from '@/hooks/useRole';
import {
  LayoutDashboard,
  Store,
  MessageSquare,
  History,
  User,
  Menu,
  X,
  LogOut,
  HelpCircle,
  Scale,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/marketplace', label: 'Marketplace', icon: Store },
  { to: '/negotiations', label: 'Negotiations', icon: MessageSquare },
  { to: '/transactions', label: 'Transactions', icon: History },
  { to: '/profile', label: 'Profile', icon: User },
];

export const AppSidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { role, setRole } = useRole();
  const location = useLocation();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleSignOut = () => {
    setRole('farmer');
    navigate('/');
  };

  const sidebarContent = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-5">
        <div>
          <h1 className="font-heading text-lg font-semibold tracking-tight text-sidebar-foreground">
            AgriTrust
          </h1>
          <p className="text-xs text-sidebar-foreground/60">
            {role === 'farmer' ? 'Farmer' : 'Buyer'} Account
          </p>
        </div>
        {isMobile && (
          <button onClick={() => setMobileOpen(false)} className="text-sidebar-foreground/60 hover:text-sidebar-foreground">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Role badge */}
      <div className="border-b border-sidebar-border px-4 py-3">
        <span className="inline-block rounded bg-sidebar-primary/10 px-2.5 py-1 text-xs font-medium text-sidebar-primary">
          {role === 'farmer' ? 'Farmer' : 'Buyer'}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-2 py-3">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => isMobile && setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded px-3 py-2.5 text-sm transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Contact support & Sign out */}
      <div className="mt-auto border-t border-sidebar-border px-2 py-3 space-y-0.5">
        <a
          href="mailto:support@agritrust.co.zw?subject=AgriTrust%20support"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => isMobile && setMobileOpen(false)}
          className="flex w-full items-center gap-3 rounded px-3 py-2.5 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        >
          <HelpCircle className="h-4 w-4 shrink-0" />
          <span>Contact support</span>
        </a>
        <Link
          to="/terms"
          onClick={() => isMobile && setMobileOpen(false)}
          className="flex w-full items-center gap-3 rounded px-3 py-2.5 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        >
          <span>Terms & Privacy</span>
        </Link>
        <button
          onClick={() => { isMobile && setMobileOpen(false); handleSignOut(); }}
          className="flex w-full items-center gap-3 rounded px-3 py-2.5 text-sm text-sidebar-foreground/70 transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Sign out</span>
        </button>
      </div>
    </>
  );

  // Mobile: hamburger + drawer
  if (isMobile) {
    return (
      <>
        {/* Mobile top bar */}
        <div className="fixed left-0 right-0 top-0 z-50 flex items-center gap-3 border-b border-border bg-background px-4 py-3">
          <button onClick={() => setMobileOpen(true)} className="text-foreground">
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-heading text-sm font-semibold text-foreground">AgriTrust</span>
          <span className="ml-auto rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {role === 'farmer' ? 'Farmer' : 'Buyer'}
          </span>
        </div>

        {/* Overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setMobileOpen(false)} />
        )}

        {/* Drawer */}
        <aside
          className={cn(
            'fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-200',
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          {sidebarContent}
        </aside>
      </>
    );
  }

  // Desktop: fixed sidebar
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-56 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      {sidebarContent}
    </aside>
  );
};
