import React, { useState } from 'react';
import { Save, Camera, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const DadosUsuarioPage: React.FC = () => {
    const [name, setName] = useState('Usuário Exemplo');
    const [email, setEmail] = useState('usuario@exemplo.com');
    const [phone, setPhone] = useState('(11) 99999-9999');
    const [cpf, setCpf] = useState('000.000.000-00');
    const [birthDate, setBirthDate] = useState('1990-01-15');
    const [cep, setCep] = useState('01000-000');
    const [address, setAddress] = useState('Rua Exemplo, 123');
    const [city, setCity] = useState('São Paulo');
    const [state, setState] = useState('SP');
    const [saved, setSaved] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const inputClasses = "w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100";
    const labelClasses = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500";

    return (
        <DashboardLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Dados do Usuário</h1>
                <p className="mt-1 text-sm text-gray-500">Gerencie suas informações pessoais</p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-col items-center text-center">
                            <div className="relative mb-4">
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 text-3xl font-bold text-white shadow-lg shadow-teal-200">
                                    U
                                </div>
                                <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md border border-gray-100 text-gray-500 hover:text-teal-500 transition-colors">
                                    <Camera className="h-4 w-4" />
                                </button>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">{name}</h3>
                            <p className="text-sm text-gray-500">{email}</p>
                            <div className="mt-4 flex w-full flex-col gap-2">
                                <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <span className="truncate">{email}</span>
                                </div>
                                <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    <span>{phone}</span>
                                </div>
                                <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">
                                    <MapPin className="h-4 w-4 text-gray-400" />
                                    <span>{city}/{state}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 rounded-lg border border-teal-100 bg-teal-50 p-3">
                            <div className="flex items-center gap-2 text-teal-700">
                                <Shield className="h-4 w-4" />
                                <span className="text-xs font-bold">Conta verificada</span>
                            </div>
                            <p className="mt-1 text-xs text-teal-600">
                                Seus dados estão protegidos pela LGPD
                            </p>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSave} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-6 text-lg font-bold text-gray-900">Informações Pessoais</h3>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <label className={labelClasses}>Nome completo</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputClasses} />
                            </div>
                            <div>
                                <label className={labelClasses}>Email</label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClasses} />
                            </div>
                            <div>
                                <label className={labelClasses}>Telefone</label>
                                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inputClasses} />
                            </div>
                            <div>
                                <label className={labelClasses}>CPF</label>
                                <input type="text" value={cpf} onChange={e => setCpf(e.target.value)} className={inputClasses} disabled />
                            </div>
                            <div>
                                <label className={labelClasses}>Data de Nascimento</label>
                                <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className={inputClasses} />
                            </div>
                            <div>
                                <label className={labelClasses}>CEP</label>
                                <input type="text" value={cep} onChange={e => setCep(e.target.value)} className={inputClasses} />
                            </div>
                            <div className="md:col-span-2">
                                <label className={labelClasses}>Endereço</label>
                                <input type="text" value={address} onChange={e => setAddress(e.target.value)} className={inputClasses} />
                            </div>
                            <div>
                                <label className={labelClasses}>Cidade</label>
                                <input type="text" value={city} onChange={e => setCity(e.target.value)} className={inputClasses} />
                            </div>
                            <div>
                                <label className={labelClasses}>Estado</label>
                                <input type="text" value={state} onChange={e => setState(e.target.value)} className={inputClasses} />
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-6">
                            {saved && (
                                <span className="text-sm font-medium text-teal-600">✓ Dados salvos com sucesso!</span>
                            )}
                            {!saved && <span />}
                            <button
                                type="submit"
                                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-teal-200 transition-all hover:from-teal-600 hover:to-emerald-600 active:scale-[0.98]"
                            >
                                <Save className="h-4 w-4" />
                                Salvar Alterações
                            </button>
                        </div>
                    </form>

                    {/* Security */}
                    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-bold text-gray-900">Segurança</h3>
                        <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4">
                            <div>
                                <p className="text-sm font-bold text-gray-800">Alterar Senha</p>
                                <p className="text-xs text-gray-500">Última alteração: Nunca</p>
                            </div>
                            <button className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow">
                                Alterar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center text-xs text-gray-400">
                © 2026, feito com ♥ por REGULARIZA DIGITAL
            </div>
        </DashboardLayout>
    );
};

export default DadosUsuarioPage;
