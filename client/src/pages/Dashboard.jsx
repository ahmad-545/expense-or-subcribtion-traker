import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import DashboardContent from '../components/DashboardContent'; // (Aapke page ke mutabiq jo bhi content ho)

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row relative">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar />
                <main className="flex-1 overflow-y-auto">
                    <DashboardContent />
                </main>
            </div>
        </div>
    );
}