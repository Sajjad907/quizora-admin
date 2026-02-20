import { Link, useLocation } from "react-router-dom";
import { useApp } from "../../../context/AppContext";
import { 
  LayoutDashboard, PlusCircle, Settings, FileText, Users,
  ChevronLeft, ChevronRight, Moon, Sun, Sparkles 
} from "lucide-react";

const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar, theme, toggleTheme } = useApp();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Create Quiz", icon: PlusCircle, path: "/quiz/create" },
    { name: "Quizzes", icon: FileText, path: "/quizzes" },
    { name: "Leads", icon: Users, path: "/leads" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 bottom-0 z-50 glass-panel transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col 
      ${isSidebarOpen ? "w-[280px]" : "w-[100px]"} bg-card/80 border-r border-border/50`}
    >
      {/* BRANDING HUB */}
      <div className="h-32 flex items-center justify-center relative overflow-hidden shrink-0 px-6">
        <div className={`flex items-center gap-4 transition-all duration-700 ${isSidebarOpen ? "scale-100" : "scale-110"}`}>
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-[0_10px_30px_-5px_rgba(99,102,241,0.5)] shrink-0 relative group">
                <Sparkles size={28} className="relative z-10" />
                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
            </div>
            {isSidebarOpen && (
                <div className="flex flex-col animate-reveal">
                    <span className="text-2xl font-black text-foreground tracking-[-0.04em] leading-none mb-1">QUIZORA</span>
                    <div className="flex items-center gap-2">
                         <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Enterprise</span>
                         <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* CORE NAVIGATION */}
      <nav className="flex-1 px-4 mt-4 space-y-1.5 overflow-y-auto custom-scroll">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-4 rounded-[20px] transition-all duration-500 group relative
                ${isActive 
                  ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]" 
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
                }
              `}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} className="shrink-0 transition-transform duration-500 group-hover:scale-110" />
              
              {isSidebarOpen && (
                <span className={`ml-4 text-[13px] font-bold tracking-tight animate-reveal transition-all duration-500 ${isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}>
                  {item.name}
                </span>
              )}

              {/* ACTIVE NOTCH */}
              {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full shadow-sm" />
              )}

              {/* TOOLTIP ON COLLAPSE */}
              {!isSidebarOpen && (
                <div className="absolute left-full ml-6 px-4 py-2 bg-foreground text-background text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0 z-50 whitespace-nowrap shadow-2xl">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* LUXURY SYSTEM SETTINGS */}
      <div className="p-6 mt-auto space-y-4 border-t border-border/50 shrink-0">
        <button 
          onClick={toggleTheme}
          className="w-full group h-14 bg-muted/50 hover:bg-muted rounded-2xl border border-border/50 flex items-center justify-between px-4 transition-all active:scale-95"
        >
             {isSidebarOpen && (
                 <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {theme === 'dark' ? 'MIDNIGHT' : 'DAYLIGHT'}
                 </span>
             )}
             <div className="w-10 h-10 rounded-xl bg-card border border-border/50 flex items-center justify-center transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                {theme === 'dark' ? <Sun size={18} className="text-yellow-500 fill-yellow-500/10" /> : <Moon size={18} className="text-primary fill-primary/10" />}
             </div>
        </button>

        <div className={`flex items-center gap-4 p-2 rounded-2xl transition-all cursor-pointer group ${!isSidebarOpen && "justify-center"}`}>
           <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-110 transition-transform">
              <img src="https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff&bold=true" alt="Avatar" className="w-full h-full object-cover" />
           </div>
           {isSidebarOpen && (
              <div className="flex-1 overflow-hidden animate-reveal">
                  <p className="text-[13px] font-black truncate leading-tight text-foreground">Admin User</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mt-1">PRO ACCOUNT</p>
              </div>
           )}
        </div>
      </div>

      {/* ELEGANT TOGGLE TRIGGER */}
      <button 
        onClick={toggleSidebar}
        className="absolute top-1/2 -right-4 translate-y-[-50%] w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-foreground shadow-md hover:bg-primary hover:text-white transition-all z-[60] cursor-pointer group"
      >
        <div className="transition-transform duration-300 group-hover:scale-110">
            {isSidebarOpen ? <ChevronLeft size={16}/> : <ChevronRight size={16}/>}
        </div>
      </button>
    </aside>
  );
};

export default Sidebar;
