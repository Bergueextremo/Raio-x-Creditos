import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Triangle,
    PlusCircle,
    ClipboardList,
    UserCircle,
    LinkIcon,
    DollarSign,
    Landmark,
    ArrowDownCircle,
    HelpCircle,
    LogOut,
    MessageCircle,
    Menu,
    X
} from 'lucide-react';

interface DashboardLayoutProps {
    children: React.ReactNode;
    pageTitle?: string;
}

const menuItems = [
    { label: 'Novo Pedido', icon: PlusCircle, path: '/' },
    { label: 'Meus Pedidos', icon: ClipboardList, path: '/dashboard/pedidos' },
    { label: 'Dados do usuário', icon: UserCircle, path: '/dashboard/dados' },
];

const comissionItems = [
    { label: 'Copiar link de Indicação', icon: LinkIcon, path: '/dashboard/indicacao' },
    { label: 'Minhas comissões', icon: DollarSign, path: '/dashboard/comissoes' },
    { label: 'Conta Corrente', icon: Landmark, path: '/dashboard/conta' },
    { label: 'Saque', icon: ArrowDownCircle, path: '/dashboard/saque' },
];

const bottomItems = [
    { label: 'Dúvidas Frequentes', icon: HelpCircle, path: '/dashboard/faq' },
    { label: 'Sair', icon: LogOut, path: '/login' },
];

const pageTitles: Record<string, string> = {
    '/dashboard/pedidos': 'Meus Pedidos',
    '/dashboard/dados': 'Dados do Usuário',
    '/dashboard/indicacao': 'Link de Indicação',
    '/dashboard/comissoes': 'Minhas Comissões',
    '/dashboard/conta': 'Conta Corrente',
    '/dashboard/saque': 'Saque',
    '/dashboard/faq': 'Dúvidas Frequentes',
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, pageTitle }) => {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isActive = (path: string) => location.pathname === path;
    const currentTitle = pageTitle || pageTitles[location.pathname] || 'Dashboard';

    const SidebarContent = () => (
        <div className="flex h-full flex-col">
            <div className="flex flex-col items-center justify-center px-4 py-8 border-b border-white/5">
                <img 
                    src="/img/Regularize Digital -Branca.png" 
                    alt="Regulariza Digital" 
                    className="h-24 w-auto object-contain"
                />
            </div>

            {/* Main Menu */}
            <nav className="flex-1 px-3">
                <div className="space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${isActive(item.path)
                                    ? 'bg-teal-500/15 text-teal-400'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon className="h-4.5 w-4.5" />
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* Commission Section */}
                <div className="mt-8">
                    <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                        Comissionamento
                    </p>
                    <div className="space-y-1">
                        {comissionItems.map((item) => (
                            <Link
                                key={item.label}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${isActive(item.path)
                                        ? 'bg-teal-500/15 text-teal-400'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <item.icon className="h-4.5 w-4.5" />
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Bottom Items */}
                <div className="mt-8 space-y-1">
                    {bottomItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${isActive(item.path)
                                    ? 'bg-teal-500/15 text-teal-400'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon className="h-4.5 w-4.5" />
                            {item.label}
                        </Link>
                    ))}
                </div>
            </nav>

            {/* Help Card */}
            <div className="mx-4 mb-6 rounded-xl bg-[#0d2240] p-4 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-teal-500/10">
                    <MessageCircle className="h-7 w-7 text-teal-400" />
                </div>
                <p className="mb-3 text-sm font-bold text-white">Precisa de Ajuda?</p>
                <a
                    href="https://wa.me/5500000000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full rounded-lg bg-teal-500 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-teal-600"
                >
                    Falar com um atendente
                </a>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Desktop Sidebar */}
            <aside className="hidden w-64 flex-shrink-0 bg-[#0a192f] lg:block">
                <div className="sticky top-0 h-screen overflow-y-auto">
                    <SidebarContent />
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0a192f] transform transition-transform lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="absolute right-3 top-5 text-gray-400 hover:text-white"
                >
                    <X className="h-5 w-5" />
                </button>
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <div className="flex-1">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 shadow-sm md:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 lg:hidden"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <div className="text-sm text-gray-500">
                            <span className="text-gray-400">Home</span>
                            <span className="mx-2 text-gray-300">/</span>
                            <span className="font-medium text-gray-700">{currentTitle}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">
                            Olá, <span className="font-bold text-gray-800">Usuário</span>
                        </span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-xs font-bold text-white">
                            U
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
