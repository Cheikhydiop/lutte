import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Fights from "./pages/Fights";
import FightDetails from "./pages/FightDetails";
import MyBets from "./pages/MyBets";
import AvailableBets from "./pages/AvailableBets"; // NOUVELLE PAGE
import WalletPage from "./pages/WalletPage";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { AppLayout } from "@/components/layout/AppLayout";
import { RequireAdmin } from "@/components/common/RequireAdmin";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminFights from "./pages/admin/Fights";
import AdminEvents from "./pages/admin/Events";
import AdminWithdrawals from "./pages/admin/Withdrawals";
import AdminNotifications from "./pages/admin/Notifications";
import AdminFighters from "./pages/admin/Fighters";
import AdminAuditLogs from "./pages/admin/AuditLogs";
import { Outlet } from "react-router-dom";

const Layout = () => (
  <AppLayout>
    <Outlet />
  </AppLayout>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Page d'accueil */}
              <Route path="/" element={<Index />} />

              {/* Authentification */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Auth type="login" />} />
              <Route path="/register" element={<Auth type="register" />} />

              {/* Routes avec barre de navigation */}
              <Route element={<Layout />}>
                <Route path="/fights" element={<Fights />} />
                <Route path="/fights/:id" element={<FightDetails />} />
                <Route path="/fight/:id" element={<FightDetails />} />

                <Route path="/my-bets" element={<MyBets />} />
                <Route path="/available-bets" element={<AvailableBets />} />
                <Route path="/bets" element={<AvailableBets />} />
                <Route path="/bet/:id" element={<MyBets />} />

                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/wallet/deposit" element={<WalletPage tab="deposit" />} />
                <Route path="/wallet/withdraw" element={<WalletPage tab="withdraw" />} />
                <Route path="/wallet/history" element={<WalletPage tab="history" />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/settings" element={<Profile tab="settings" />} />
                <Route path="/profile/security" element={<Profile tab="security" />} />

                <Route path="/notifications" element={<Profile tab="notifications" />} />
                <Route path="/help" element={<Profile tab="help" />} />
              </Route>



              <Route element={<RequireAdmin />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/fights" element={<AdminFights />} />
                <Route path="/admin/events" element={<AdminEvents />} />
                <Route path="/admin/withdrawals" element={<AdminWithdrawals />} />
                <Route path="/admin/notifications" element={<AdminNotifications />} />
                <Route path="/admin/fighters" element={<AdminFighters />} />
                <Route path="/admin/audit" element={<AdminAuditLogs />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </NotificationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;