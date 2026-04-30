import React, { useState } from 'react';
import { DollarSign, TrendingUp, Calendar, Search, Filter } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const ComissoesPage: React.FC = () => {
    const [filterPeriod, setFilterPeriod] = useState('');

    // Mock data – empty state
    const commissions: any[] = [];

    const stats = [
        { label: 'Total de Comissões', value: 'R$ 0,00', icon: DollarSign, color: 'teal' },
        { label: 'Comissões do Mês', value: 'R$ 0,00', icon: Calendar, color: 'blue' },
        { label: 'Total de Indicações', value: '0', icon: TrendingUp, color: 'emerald' },
    ];

    return (
        <DashboardLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Minhas Comissões</h1>
                <p className="mt-1 text-sm text-gray-500">Acompanhe seus ganhos de comissionamento</p>
            </div>

            {/* Stats Cards */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {stats.map((stat, idx) => (
                    <div key={idx} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="mb-3 flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{stat.label}</span>
                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color === 'teal' ? 'bg-teal-100 text-teal-600' :
                                    stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                                        'bg-emerald-100 text-emerald-600'
                                }`}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Commission History */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-base font-bold text-gray-900">Histórico de Comissões</h3>
                    <div className="flex items-center gap-2">
                        <select
                            value={filterPeriod}
                            onChange={(e) => setFilterPeriod(e.target.value)}
                            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                        >
                            <option value="">Todos os períodos</option>
                            <option value="7d">Últimos 7 dias</option>
                            <option value="30d">Últimos 30 dias</option>
                            <option value="90d">Últimos 90 dias</option>
                        </select>
                    </div>
                </div>

                {commissions.length === 0 ? (
                    <div className="py-12 text-center">
                        <DollarSign className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                        <p className="text-sm font-medium text-gray-500">Nenhuma comissão registrada ainda.</p>
                        <p className="mt-1 text-xs text-gray-400">Comece indicando pessoas para ganhar comissões!</p>
                    </div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="pb-3 text-xs font-bold uppercase tracking-wider text-gray-400">Data</th>
                                <th className="pb-3 text-xs font-bold uppercase tracking-wider text-gray-400">Indicado</th>
                                <th className="pb-3 text-xs font-bold uppercase tracking-wider text-gray-400">Serviço</th>
                                <th className="pb-3 text-xs font-bold uppercase tracking-wider text-gray-400">Valor</th>
                                <th className="pb-3 text-xs font-bold uppercase tracking-wider text-gray-400">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {commissions.map((c: any, idx: number) => (
                                <tr key={idx} className="border-b border-gray-50">
                                    <td className="py-3 text-gray-600">{c.date}</td>
                                    <td className="py-3 font-medium text-gray-800">{c.referral}</td>
                                    <td className="py-3 text-gray-600">{c.service}</td>
                                    <td className="py-3 font-bold text-teal-600">{c.amount}</td>
                                    <td className="py-3">
                                        <span className="rounded-full bg-yellow-50 px-2 py-1 text-xs font-bold text-yellow-600">{c.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="mt-8 text-center text-xs text-gray-400">
                © 2026, feito com ♥ por REGULARIZA DIGITAL
            </div>
        </DashboardLayout>
    );
};

export default ComissoesPage;
