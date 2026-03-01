import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RoleProvider } from "@/hooks/useRole";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Entry from "./pages/Entry";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import ListingDetail from "./pages/ListingDetail";
import NewListing from "./pages/NewListing";
import NegotiationRoom from "./pages/NegotiationRoom";
import Negotiations from "./pages/Negotiations";
import Transactions from "./pages/Transactions";
import TransactionDetail from "./pages/TransactionDetail";
import Profile from "./pages/Profile";
import NewNegotiation from "./pages/NewNegotiation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Checking your session…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <RoleProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Entry />} />
              <Route
                path="/dashboard"
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                }
              />
              <Route
                path="/marketplace"
                element={
                  <RequireAuth>
                    <Marketplace />
                  </RequireAuth>
                }
              />
              <Route
                path="/listing/:id"
                element={
                  <RequireAuth>
                    <ListingDetail />
                  </RequireAuth>
                }
              />
              <Route
                path="/listing/new"
                element={
                  <RequireAuth>
                    <NewListing />
                  </RequireAuth>
                }
              />
              <Route
                path="/negotiations"
                element={
                  <RequireAuth>
                    <Negotiations />
                  </RequireAuth>
                }
              />
              <Route
                path="/negotiation/:id"
                element={
                  <RequireAuth>
                    <NegotiationRoom />
                  </RequireAuth>
                }
              />
              <Route
                path="/negotiation/new"
                element={
                  <RequireAuth>
                    <NewNegotiation />
                  </RequireAuth>
                }
              />
              <Route
                path="/transactions"
                element={
                  <RequireAuth>
                    <Transactions />
                  </RequireAuth>
                }
              />
              <Route
                path="/transactions/:id"
                element={
                  <RequireAuth>
                    <TransactionDetail />
                  </RequireAuth>
                }
              />
              <Route
                path="/profile"
                element={
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                }
              />
              <Route
                path="/profile/:id"
                element={
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </RoleProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
