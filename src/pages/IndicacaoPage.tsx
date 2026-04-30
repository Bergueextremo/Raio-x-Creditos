import React, { useState } from 'react';
import { Copy, Check, Share2, Users, TrendingUp, Gift } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const IndicacaoPage: React.FC = () => {
    const [copied, setCopied] = useState(false);
    const referralLink = 'https://regularizadigital.com.br/ref/usuario123';
    const referralCode = 'USUARIO123';

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    return (
        <DashboardLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Link de Indicação</h1>
                <p className="mt-1 text-sm text-gray-500">Compartilhe seu link e ganhe comissões por cada indicação</p>
            </div>

            {/* Banner */}
            <div className="mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 p-6 md:p-8 text-white">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <Gift className="h-6 w-6" />
                            <h3 className="text-xl font-bold">Programa de Indicação</h3>
                        </div>
                        <p className="text-sm text-teal-100">
                            Indique amigos e receba comissões em cada pedido realizado!
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-white/15 backdrop-blur-sm px-4 py-2 text-center">
                            <p className="text-2xl font-bold">0</p>
                            <p className="text-xs text-teal-100">Indicações</p>
                        </div>
                        <div className="rounded-lg bg-white/15 backdrop-blur-sm px-4 py-2 text-center">
                            <p className="text-2xl font-bold">R$ 0</p>
                            <p className="text-xs text-teal-100">Ganhos</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Link Section */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-base font-bold text-gray-900">Seu link de indicação</h3>

                    <div className="mb-4 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                        <input
                            type="text"
                            value={referralLink}
                            readOnly
                            className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
                        />
                        <button
                            onClick={handleCopy}
                            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold transition-all ${copied
                                    ? 'bg-teal-500 text-white'
                                    : 'bg-gray-900 text-white hover:bg-gray-800'
                                }`}
                        >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            {copied ? 'Copiado!' : 'Copiar'}
                        </button>
                    </div>

                    <div className="mb-4">
                        <p className="mb-1 text-xs font-bold uppercase text-gray-500">Código de indicação</p>
                        <div className="flex items-center gap-2 rounded-lg border border-dashed border-teal-300 bg-teal-50 px-4 py-3">
                            <span className="text-lg font-black tracking-wider text-teal-700">{referralCode}</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-green-600">
                            <Share2 className="h-4 w-4" />
                            WhatsApp
                        </button>
                        <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-600">
                            <Share2 className="h-4 w-4" />
                            Compartilhar
                        </button>
                    </div>
                </div>

                {/* How it works */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-base font-bold text-gray-900">Como funciona?</h3>

                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-600">1</div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">Compartilhe</p>
                                <p className="text-xs text-gray-500">Envie seu link ou código para amigos e conhecidos</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-600">2</div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">Eles se cadastram</p>
                                <p className="text-xs text-gray-500">Quando alguém se cadastra usando seu link, a indicação é registrada</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-600">3</div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">Receba comissões</p>
                                <p className="text-xs text-gray-500">A cada pedido do indicado, você recebe uma comissão na sua conta</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 rounded-lg border border-teal-100 bg-teal-50 p-4">
                        <div className="flex items-center gap-2 text-teal-700">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-xs font-bold">Sem limites de indicação!</span>
                        </div>
                        <p className="mt-1 text-xs text-teal-600">
                            Quanto mais pessoas você indicar, mais você ganha.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center text-xs text-gray-400">
                © 2026, feito com ♥ por REGULARIZA DIGITAL
            </div>
        </DashboardLayout>
    );
};

export default IndicacaoPage;
