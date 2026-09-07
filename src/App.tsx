import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GrievanceProvider, useGrievance } from "./store/GrievanceContext";
import { Header, NavTab } from "./components/Header";
import { Footer } from "./components/Footer";
import { OverviewPage } from "./pages/OverviewPage";
import { CivicSectorsPage } from "./pages/CivicSectorsPage";
import { OperationsPage } from "./pages/OperationsPage";
import { SystemHealthPage } from "./pages/SystemHealthPage";
import { DocumentationPage } from "./pages/DocumentationPage";
import { LoginPage } from "./pages/LoginPage";
import { NotificationModal } from "./components/NotificationModal";
import { NotificationDrawer } from "./components/NotificationDrawer";

const MainAppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>("overview");
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState<boolean>(false);
  const { requestIntakeFocus, activeNotificationModal, setActiveNotificationModal } = useGrievance();

  const handleSelectTab = (tab: NavTab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitGrievanceClick = () => {
    setCurrentTab("operations");
    requestIntakeFocus();
  };

  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#111827] font-sans flex flex-col selection:bg-teal-700 selection:text-white relative">
      
      {/* Global Persistent Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onSubmitGrievanceClick={handleSubmitGrievanceClick}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
      />

      {/* Main Page Area with Smooth Fade Animations */}
      <main className="flex-1 w-full relative z-10">
        <AnimatePresence mode="wait">
          {currentTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
            >
              <OverviewPage
                onNavigateToOperations={() => handleSelectTab("operations")}
                onNavigateToDocs={() => handleSelectTab("documentation")}
                onNavigateToSectors={() => handleSelectTab("sectors")}
                onRequestSubmitGrievance={handleSubmitGrievanceClick}
              />
            </motion.div>
          )}

          {currentTab === "sectors" && (
            <motion.div
              key="sectors"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
            >
              <CivicSectorsPage
                onLodgeGrievance={handleSubmitGrievanceClick}
                onNavigateToOps={() => handleSelectTab("operations")}
              />
            </motion.div>
          )}

          {currentTab === "operations" && (
            <motion.div
              key="operations"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
            >
              <OperationsPage />
            </motion.div>
          )}

          {currentTab === "health" && (
            <motion.div
              key="health"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
            >
              <SystemHealthPage />
            </motion.div>
          )}

          {currentTab === "documentation" && (
            <motion.div
              key="documentation"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
            >
              <DocumentationPage />
            </motion.div>
          )}

          {currentTab === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
            >
              <LoginPage
                onLoginSuccess={() => handleSelectTab("operations")}
                onNavigateHome={() => handleSelectTab("overview")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Citizen Notification Drawer (All Dispatched SMS/Email Logs) */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
      />

      {/* Global Citizen Mock Notification Modal (Pop-up upon submission or inspection) */}
      {activeNotificationModal && (
        <NotificationModal
          notification={activeNotificationModal}
          onClose={() => setActiveNotificationModal(null)}
        />
      )}

      {/* Global Architectural Footer */}
      <Footer
        onSelectTab={handleSelectTab}
        onSubmitGrievanceClick={handleSubmitGrievanceClick}
      />

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <GrievanceProvider>
      <MainAppContent />
    </GrievanceProvider>
  );
};

export default App;
