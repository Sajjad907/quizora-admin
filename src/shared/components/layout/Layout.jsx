import Sidebar from "./Sidebar";
import { useApp } from "../../../context/AppContext";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { AlertCircle, ArrowUpCircle } from "lucide-react";

const Layout = ({ children }) => {
  const { isSidebarOpen, subscription } = useApp();
  const isExpired = subscription && subscription.status !== 'ACTIVE' && subscription.plan !== 'Free';
  useEffect(() => {
    if (isExpired) {
      toast.error("Your subscription has expired. Please upgrade to continue.", {
        id: 'expiry-toast',
        duration: Infinity,
        position: 'bottom-center',
        icon: <AlertCircle className="text-rose-500" />
      });
    } else {
      toast.dismiss('expiry-toast');
    }
  }, [isExpired]);

  return (
    <div className="min-h-screen bg-background flex overflow-x-hidden selection:bg-primary/10 selection:text-primary">
      <Sidebar />
      <main
        className={`flex-1 min-w-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col min-h-screen relative
          ${isSidebarOpen ? "pl-[280px]" : "pl-[100px]"}
        `}
      >
        {isExpired && (
          <div className="w-full bg-rose-500/10 border-b border-rose-500/20 px-6 py-3 flex items-center justify-between animate-in slide-in-from-top duration-500 sticky top-0 z-[60] backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-rose-500" />
              </div>
              <div>
                <span className="text-sm font-bold text-foreground">Subscription Expired:</span>
                <span className="text-sm text-muted-foreground ml-2">Your {subscription.plan} plan is currently inactive.</span>
              </div>
            </div>
            <a 
              href={subscription.pricingUrl}
              target="_top"
              className="flex items-center gap-2 px-4 py-1.5 bg-rose-500 text-white text-xs font-bold rounded-lg hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20 uppercase tracking-wider"
            >
              <ArrowUpCircle className="w-3.5 h-3.5" />
              Upgrade Now
            </a>
          </div>
        )}
        <div className={`flex-1 w-full max-w-[1920px] mx-auto p-4 md:p-8 transition-all duration-500`}>
          <div className="w-full h-full animate-reveal">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
