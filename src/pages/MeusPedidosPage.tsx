import React, { useState } from 'react';
import { ChevronDown, Calendar, Search } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const MeusPedidosPage: React.FC = () => {
    const [filterCertidao, setFilterCertidao] = useState('');
    const [filterPagamento, setFilterPagamento] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterNumero, setFilterNumero] = useState('');

    // Mock: empty orders list
    const orders: any[] = [];

    const selectClasses = "appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 pr-9 text-sm text-gray-500 outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-100";

    return (
        <DashboardLayout>
            {/* Page Title */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Meus Pedidos</h1>
            </div>

            {/* Promotional Banner */}
            <div className="mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-[#0a192f] to-[#1a3a5c]">
                <div className="flex items-center justify-between p-6 md:p-8">
                    <div className="flex-1">
                        <h3 className="mb-1 text-lg font-bold text-white md:text-xl">
                            Nova Funcionalidade
                        </h3>
                        <p className="text-sm text-gray-300 md:text-base">
                            Acompanhe seus pedidos em tempo real e receba notificações de atualização
                        </p>
                    </div>
                    <div className="hidden flex-shrink-0 md:block">
                        <div className="rounded-lg bg-gradient-to-r from-yellow-400 to-green-400 px-5 py-2.5 text-sm font-extrabold uppercase tracking-tight text-[#0a192f]">
                            Disponível Agora
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-base font-bold text-gray-800">Filtros</h3>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    {/* Filter by certidão */}
                    <div className="relative">
                        <select
                            id="filter-certidao"
                            value={filterCertidao}
                            onChange={(e) => setFilterCertidao(e.target.value)}
                            className={selectClasses + " w-full"}
                        >
                            <option value="">Filtrar por certidões</option>
                            <option value="ccmei">CCMEI</option>
                            <option value="alvara">Alvará</option>
                            <option value="contrato">Contrato Social</option>
                            <option value="cartao">Cartão CNPJ</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>

                    {/* Filter by pagamento */}
                    <div className="relative">
                        <select
                            id="filter-pagamento"
                            value={filterPagamento}
                            onChange={(e) => setFilterPagamento(e.target.value)}
                            className={selectClasses + " w-full"}
                        >
                            <option value="">Filtrar por pagamento</option>
                            <option value="pix">PIX</option>
                            <option value="cartao">Cartão de Crédito</option>
                            <option value="boleto">Boleto</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>

                    {/* Filter by status */}
                    <div className="relative">
                        <select
                            id="filter-status"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className={selectClasses + " w-full"}
                        >
                            <option value="">Filtrar por status</option>
                            <option value="pendente">Pendente</option>
                            <option value="processando">Processando</option>
                            <option value="concluido">Concluído</option>
                            <option value="cancelado">Cancelado</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>

                    {/* Date filter */}
                    <div className="relative">
                        <input
                            id="filter-date"
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className={selectClasses + " w-full"}
                        />
                    </div>

                    {/* Order number */}
                    <div className="relative">
                        <input
                            id="filter-numero"
                            type="text"
                            value={filterNumero}
                            onChange={(e) => setFilterNumero(e.target.value)}
                            placeholder="Número do pedido"
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-500 outline-none transition-all placeholder:text-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                        />
                    </div>
                </div>
            </div>

            {/* Orders List */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                {orders.length === 0 ? (
                    <div className="py-8 text-center">
                        <Search className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                        <p className="text-sm font-medium text-gray-500">Nenhum resultado encontrado.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="pb-3 text-xs font-bold uppercase tracking-wider text-gray-400">Nº</th>
                                    <th className="pb-3 text-xs font-bold uppercase tracking-wider text-gray-400">Serviço</th>
                                    <th className="pb-3 text-xs font-bold uppercase tracking-wider text-gray-400">Status</th>
                                    <th className="pb-3 text-xs font-bold uppercase tracking-wider text-gray-400">Pagamento</th>
                                    <th className="pb-3 text-xs font-bold uppercase tracking-wider text-gray-400">Data</th>
                                    <th className="pb-3 text-xs font-bold uppercase tracking-wider text-gray-400">Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order: any, idx: number) => (
                                    <tr key={idx} className="border-b border-gray-50">
                                        <td className="py-3 font-mono text-sm text-gray-600">{order.id}</td>
                                        <td className="py-3 font-medium text-gray-800">{order.service}</td>
                                        <td className="py-3">
                                            <span className="rounded-full bg-yellow-50 px-2 py-1 text-xs font-bold text-yellow-600">
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-3 text-gray-600">{order.payment}</td>
                                        <td className="py-3 text-gray-600">{order.date}</td>
                                        <td className="py-3 font-bold text-gray-800">{order.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-xs text-gray-400">
                © 2026, feito com ♥ por REGULARIZA DIGITAL
            </div>
        </DashboardLayout>
    );
};

export default MeusPedidosPage;
