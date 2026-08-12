import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import DashboardContent from '../components/DashboardContent';

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row relative overflow-x-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 w-full">
                <Navbar />
                <main className="flex-1 overflow-y-auto">
                    <DashboardContent />
                </main>
            </div>
        </div>
    );
}