import React from 'react';
import { Landmark, ArrowDownLeft, ArrowUpRight, Calendar } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const ContaCorrentePage: React.FC = () => {
    // Mock data
    const balance = 0;
    const transactions: any[] = [];

    return (
        <DashboardLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Conta Corrente</h1>
                <p className="mt-1 text-sm text-gray-500">Visualize seu saldo e extrato de movimentações</p>
            </div>

            {/* Balance Card */}
            <div className="mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-[#0a192f] to-[#1a3a5c] p-6 md:p-8 text-white">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="mb-1 text-sm text-gray-300">Saldo disponível</p>
                        <p className="text-4xl font-bold">R$ {balance.toFixed(2).replace('.', ',')}</p>
                        <p className="mt-2 text-xs text-gray-400">Atualizado em {new Date().toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="rounded-lg bg-white/10 backdrop-blur-sm p-4 text-center">
                            <ArrowDownLeft className="mx-auto mb-1 h-5 w-5 text-emerald-400" />
                            <p className="text-lg font-bold">R$ 0,00</p>
                            <p className="text-xs text-gray-400">Entradas</p>
                        </div>
                        <div className="rounded-lg bg-white/10 backdrop-blur-sm p-4 text-center">
                            <ArrowUpRight className="mx-auto mb-1 h-5 w-5 text-red-400" />
                            <p className="text-lg font-bold">R$ 0,00</p>
                            <p className="text-xs text-gray-400">Saídas</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-base font-bold text-gray-900">Extrato</h3>
                    <div className="flex items-center gap-2">
                        <select
                            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                        >
                            <option value="">Todos os períodos</option>
                            <option value="7d">Últimos 7 dias</option>
                            <option value="30d">Últimos 30 dias</option>
                            <option value="90d">Últimos 90 dias</option>
                        </select>
                    </div>
                </div>

                {transactions.length === 0 ? (
                    <div className="py-12 text-center">
                        <Landmark className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                        <p className="text-sm font-medium text-gray-500">Nenhuma movimentação encontrada.</p>
                        <p className="mt-1 text-xs text-gray-400">Suas comissões aparecerão aqui automaticamente.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {transactions.map((t: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4">
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${t.type === 'credit' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                                        }`}>
                                        {t.type === 'credit' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">{t.description}</p>
                                        <p className="text-xs text-gray-500">{t.date}</p>
                                    </div>
                                </div>
                                <span className={`text-sm font-bold ${t.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {t.type === 'credit' ? '+' : '-'} R$ {t.amount}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-8 text-center text-xs text-gray-400">
                © 2026, feito com ♥ por REGULARIZA DIGITAL
            </div>
        </DashboardLayout>
    );
};

export default ContaCorrentePage;
