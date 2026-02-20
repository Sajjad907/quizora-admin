import Sidebar from "./Sidebar";
import { useApp } from "../../../context/AppContext";

const Layout = ({ children }) => {
  const { isSidebarOpen } = useApp();

  return (
    <div className="min-h-screen bg-background flex selection:bg-primary/10 selection:text-primary">
      {/* Sidebar Controller */}

      <Sidebar />
      {/* Main Fluid Area */}
      <main 
        className={`flex-1 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col min-h-screen
          ${isSidebarOpen ? "pl-[280px]" : "pl-[100px]"}
        `}
      >
        <div className="flex-1 w-full max-w-[1920px] mx-auto p-4 md:p-8">
            <div className="w-full h-full animate-reveal">
                {children}
            </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
