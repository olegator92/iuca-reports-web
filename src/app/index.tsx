import { useEffect, useState } from "react";
import { Header } from "@/widgets/header/ui/Header";
import { Sidebar } from "@/widgets/sidebar/ui/Sidebar";
import { Toaster } from "@/shared/ui";
import { ThemeProvider, cn } from "@/shared/lib";
import { StoreProvider, RouterProvider, GlobalErrorModal, ErrorBoundaryProvider, LocalizationProvider, GoogleOAuthProvider } from "./providers";
import { AuthProvider } from "./providers/AuthProvider";
import { AppRouter } from "./router";

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
    const closeSidebar = () => setIsSidebarOpen(false);

    useEffect(() => {
        const originalOverflow = document.body.style.overflow;

        if (isSidebarOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = originalOverflow;
        }

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isSidebarOpen]);

    return (
        <ThemeProvider>
            <GoogleOAuthProvider>
                <StoreProvider>
                    <AuthProvider>
                        <LocalizationProvider>
                            <RouterProvider>
                                <ErrorBoundaryProvider>
                                    <div className="flex h-dvh overflow-hidden bg-background">
                                        <Sidebar
                                            isOpen={isSidebarOpen}
                                            onClose={closeSidebar}
                                        />
                                        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                                            <Header
                                                isSidebarOpen={isSidebarOpen}
                                                onToggleSidebar={toggleSidebar}
                                                onLogoClick={closeSidebar}
                                            />
                                            <main className="flex flex-1 min-h-0 flex-col overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "flex-1 min-h-0",
                                                        isSidebarOpen
                                                            ? "overflow-hidden md:overflow-y-auto"
                                                            : "overflow-y-auto",
                                                    )}
                                                >
                                                    <div className="mx-auto h-full w-full max-w-6xl px-2 py-6 md:px-8">
                                                        <AppRouter />
                                                    </div>
                                                </div>
                                            </main>
                                        </div>
                                    </div>
                                    <GlobalErrorModal />
                                    <Toaster />
                                </ErrorBoundaryProvider>
                            </RouterProvider>
                        </LocalizationProvider>
                    </AuthProvider>
                </StoreProvider>
            </GoogleOAuthProvider>
        </ThemeProvider>
    );
}

export default App;
