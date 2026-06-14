import AppSidebar from "./AppSidebar";
import Footer from "./Footer";

interface PageWrapperProps {
  children: React.ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="md:ml-[48px] mt-14 md:mt-0 flex-1 flex flex-col min-h-screen overflow-y-auto">
        <div className="w-full max-w-[1360px] mx-auto px-8 md:px-16 py-8 md:py-10 flex-1">
          {children}
        </div>
        <Footer />
      </main>
    </div>
  );
}
