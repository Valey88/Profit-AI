import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Sidebar } from '@/widgets/sidebar/ui/Sidebar';
import { InboxPage } from '@/pages/inbox/ui/InboxPage';
import { AgentSettingsPage } from '@/pages/agent-settings/ui/AgentSettingsPage';
import { TeamPage } from '@/pages/team/ui/TeamPage';
import { BillingPage } from '@/pages/billing/ui/BillingPage';
import { OnboardingPage } from '@/pages/onboarding/ui/OnboardingPage';
import { IntegrationsPage } from '@/pages/integrations/ui/IntegrationsPage';
import { LandingPage } from '@/pages/landing/ui/LandingPage';
import { AdminPage } from '@/pages/admin/ui/AdminPage';
import { LoginPage, RegisterPage } from '@/pages/auth';
import { useCompany, useAgentConfig } from '@/shared/api/hooks';
import { Loader2 } from 'lucide-react';

export type Page = 'inbox' | 'agent' | 'team' | 'billing' | 'integrations' | 'admin';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Auth state management
function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);

  const login = (newToken: string) => {
    localStorage.setItem('auth_token', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('onboarding_completed');
    setToken(null);
    setIsAuthenticated(false);
    // Invalidate all queries
    queryClient.clear();
  };

  return { token, isAuthenticated, login, logout };
}

// Check if onboarding is needed
function useOnboardingCheck() {
  const { data: company, isLoading: companyLoading, error: companyError } = useCompany();
  const { data: agent, isLoading: agentLoading, error: agentError } = useAgentConfig();

  const isLoading = companyLoading || agentLoading;
  const error = companyError || agentError;

  // Check localStorage for manual skip
  const hasCompletedOnboarding = localStorage.getItem('onboarding_completed') === 'true';

  // Need onboarding if:
  // 1. Never completed before AND
  // 2. No channels connected OR no agent name configured
  const needsOnboarding = !hasCompletedOnboarding && (
    !company?.channels?.some(c => c.status === 'connected') ||
    !agent?.name
  );

  return { needsOnboarding, isLoading, error };
}

// Main dashboard content
const DashboardContent: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { needsOnboarding, isLoading, error } = useOnboardingCheck();
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('inbox');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShowOnboarding(needsOnboarding);
    }
  }, [isLoading, needsOnboarding]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setShowOnboarding(false);
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4 text-center">
        <Loader2 className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Нет соединения с сервером</h2>
        <p className="text-zinc-500 mb-6 max-w-md">
          Не удалось загрузить данные. Возможно сервер отключен или обновляется.
        </p>
        <button
          onClick={onLogout}
          className="px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-zinc-200 transition-colors"
        >
          Вернуться на главную
        </button>
      </div>
    );
  }

  // Show loading while checking
  if (isLoading || showOnboarding === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (showOnboarding) {
    return <OnboardingPage onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden text-zinc-100 bg-black">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={onLogout}
        onRestartOnboarding={() => setShowOnboarding(true)}
        mobileIsOpen={isSidebarOpen}
        onMobileClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-zinc-900/0 to-zinc-900/0"></div>

        {/* Mobile Header with Hamburger */}
        <div className="md:hidden flex items-center p-4 border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-30 shrink-0">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <span className="ml-3 font-bold text-sm">Profit Flow</span>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
          {currentPage === 'inbox' && <InboxPage />}
          {currentPage === 'agent' && <AgentSettingsPage />}
          {currentPage === 'team' && <TeamPage />}
          {currentPage === 'billing' && <BillingPage />}
          {currentPage === 'integrations' && <IntegrationsPage />}
          {currentPage === 'admin' && <AdminPage />}
        </div>
      </main>
    </div>
  );
};

// Inner component that uses hooks
const AppContent: React.FC = () => {
  const { isAuthenticated, login, logout } = useAuth();
  const [authPage, setAuthPage] = useState<'landing' | 'login' | 'register'>('landing');

  // Not authenticated - show landing/login/register
  if (!isAuthenticated) {
    if (authPage === 'landing') {
      return (
        <LandingPage
          onLogin={() => setAuthPage('login')}
          onRegister={() => setAuthPage('register')}
        />
      );
    }

    if (authPage === 'register') {
      return (
        <RegisterPage
          onRegister={(token) => {
            login(token);
          }}
          onSwitchToLogin={() => setAuthPage('login')}
        />
      );
    }

    return (
      <LoginPage
        onLogin={(token) => {
          login(token);
        }}
        onSwitchToRegister={() => setAuthPage('register')}
      />
    );
  }

  // Authenticated - show dashboard
  return <DashboardContent onLogout={logout} />;
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
};

export default App;