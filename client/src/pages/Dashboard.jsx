import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import DashboardContent from '../components/DashboardContent';

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar remains fixed on desktop */}
            <Sidebar />
            
            {/* Right side container holding navbar and scrollable content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
                <Navbar />
                <main className="flex-1 overflow-y-auto bg-[#030814]">
                    <DashboardContent />
                </main>
            </div>
        </div>
    );
}