import { useLocation } from "wouter";
import AppSidebar from "@/components/layout/AppSidebar";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  const [, navigate] = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="md:ml-[185px] mt-14 md:mt-0 flex-1 flex flex-col min-h-screen overflow-y-auto">
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="text-center max-w-md">
            <p className="text-[80px] font-bold leading-none text-primary/20 select-none mb-2">404</p>
            <h1 className="text-2xl font-bold text-foreground mb-3">Page not found</h1>
            <p className="text-[15px] text-muted-foreground leading-relaxed mb-8">
              The page you are looking for does not exist or has been moved.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate("/")}
                className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Go to Home
              </button>
              <button
                onClick={() => navigate("/docs")}
                className="px-5 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm font-medium hover:bg-muted/50 transition-colors"
              >
                Read Docs
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}
