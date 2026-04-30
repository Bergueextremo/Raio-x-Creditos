import React, { useState } from 'react';
import { Landmark, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const SaquePage: React.FC = () => {
    const [amount, setAmount] = useState('');
    const [pixKey, setPixKey] = useState('');
    const [pixKeyType, setPixKeyType] = useState('cpf');
    const balance = 0;

    const withdrawals: any[] = [];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Solicitação de saque enviada! (funcionalidade será integrada em breve)');
    };

    const inputClasses = "w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100";

    return (
        <DashboardLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Saque</h1>
                <p className="mt-1 text-sm text-gray-500">Solicite a transferência do seu saldo</p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Balance + Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Balance Card */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Saldo disponível para saque</p>
                                <p className="mt-1 text-3xl font-bold text-gray-900">R$ {balance.toFixed(2).replace('.', ',')}</p>
                            </div>
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-teal-100">
                                <Landmark className="h-7 w-7 text-teal-600" />
                            </div>
                        </div>
                    </div>

                    {/* Withdrawal Form */}
                    <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-base font-bold text-gray-900">Solicitar Saque</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Valor do saque
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">R$</span>
                                    <input
                                        type="text"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0,00"
                                        className={`${inputClasses} pl-10`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Tipo de chave PIX
                                </label>
                                <select
                                    value={pixKeyType}
                                    onChange={(e) => setPixKeyType(e.target.value)}
                                    className={`${inputClasses} appearance-none`}
                                >
                                    <option value="cpf">CPF</option>
                                    <option value="email">Email</option>
                                    <option value="phone">Telefone</option>
                                    <option value="random">Chave aleatória</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Chave PIX
                                </label>
                                <input
                                    type="text"
                                    value={pixKey}
                                    onChange={(e) => setPixKey(e.target.value)}
                                    placeholder="Insira sua chave PIX"
                                    className={inputClasses}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={balance <= 0}
                            className="mt-6 w-full rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-200 transition-all hover:from-teal-600 hover:to-emerald-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                        >
                            Solicitar Saque
                        </button>
                    </form>
                </div>

                {/* Info + History */}
                <div className="space-y-6">
                    {/* Info */}
                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
                        <div className="mb-3 flex items-center gap-2 text-blue-700">
                            <Info className="h-5 w-5" />
                            <span className="text-sm font-bold">Informações Importantes</span>
                        </div>
                        <ul className="space-y-2 text-xs text-blue-600">
                            <li>• Valor mínimo para saque: <b>R$ 50,00</b></li>
                            <li>• Saques são processados em até <b>3 dias úteis</b></li>
                            <li>• Transferências realizadas via <b>PIX</b></li>
                            <li>• Somente uma solicitação por vez</li>
                        </ul>
                    </div>

                    {/* History */}
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                        <h3 className="mb-4 text-sm font-bold text-gray-900">Histórico de Saques</h3>
                        {withdrawals.length === 0 ? (
                            <div className="py-6 text-center">
                                <Landmark className="mx-auto mb-3 h-8 w-8 text-gray-300" />
                                <p className="text-xs text-gray-500">Nenhum saque realizado.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {withdrawals.map((w: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">R$ {w.amount}</p>
                                            <p className="text-xs text-gray-500">{w.date}</p>
                                        </div>
                                        <span className={`rounded-full px-2 py-1 text-xs font-bold ${w.status === 'concluido' ? 'bg-teal-50 text-teal-600' :
                                                w.status === 'pendente' ? 'bg-yellow-50 text-yellow-600' :
                                                    'bg-red-50 text-red-600'
                                            }`}>
                                            {w.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center text-xs text-gray-400">
                © 2026, feito com ♥ por REGULARIZA DIGITAL
            </div>
        </DashboardLayout>
    );
};

export default SaquePage;
