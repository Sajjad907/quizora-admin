import Sidebar from "./Sidebar";
import { useApp } from "../../../context/AppContext";

const Layout = ({ children }) => {
  const { isSidebarOpen, subscription } = useApp();
  const isExpired = subscription && subscription.status !== 'ACTIVE' && subscription.plan !== 'Free';

  return (
    <div className="min-h-screen bg-background flex overflow-x-hidden selection:bg-primary/10 selection:text-primary">
      <Sidebar />
      <main
        className={`flex-1 min-w-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col min-h-screen relative
          ${isSidebarOpen ? "pl-[280px]" : "pl-[100px]"}
        `}
      >
        <div className={`flex-1 w-full max-w-[1920px] mx-auto p-4 md:p-8 transition-all duration-500 ${isExpired ? 'blur-md pointer-events-none select-none' : ''}`}>
          <div className="w-full h-full animate-reveal">
            {children}
          </div>
        </div>

        {isExpired && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-background/20 backdrop-blur-[2px]">
            <div className="max-w-md w-full glass-panel p-8 text-center space-y-6 shadow-2xl border-rose-500/20">
              <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-rose-500 text-3xl">⚠️</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black tracking-tight text-foreground">Subscription Expired</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Your <span className="font-bold text-foreground">{subscription.plan}</span> plan has been suspended. 
                  Please upgrade or renew your subscription in Shopify to continue using Quizora.
                </p>
              </div>
              <a 
                href={subscription.pricingUrl}
                target="_top"
                className="block w-full py-4 bg-primary text-white font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20"
              >
                RENEW SUBSCRIPTION
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Layout;
