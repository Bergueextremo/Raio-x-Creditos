import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, ChevronDown } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

const RegisterPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profile, setProfile] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '').slice(0, 11);
        val = val.replace(/^(\d{2})(\d)/g, '($1) $2');
        val = val.replace(/(\d)(\d{4})$/, '$1-$2');
        setPhone(val);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement register logic
        console.log('Register:', { name, email, phone, password, confirmPassword, profile });
    };

    const inputClasses = "w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100";

    return (
        <AuthLayout>
            <div className="mx-auto w-full max-w-md">
                <h1 className="mb-2 text-3xl font-extrabold text-gray-900">Registro</h1>
                <p className="mb-8 text-sm text-gray-500">Registre-se para entrar</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            id="register-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nome"
                            className={inputClasses}
                            required
                        />
                    </div>

                    <div>
                        <input
                            id="register-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className={inputClasses}
                            required
                        />
                    </div>

                    <div>
                        <input
                            id="register-phone"
                            type="tel"
                            value={phone}
                            onChange={handlePhoneChange}
                            placeholder="Telefone"
                            className={inputClasses}
                            required
                        />
                    </div>

                    <div className="relative">
                        <input
                            id="register-password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Senha"
                            className={`${inputClasses} pr-12`}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>

                    <div className="relative">
                        <input
                            id="register-confirm-password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirma Senha"
                            className={`${inputClasses} pr-12`}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>

                    <div>
                        <p className="mb-2 text-sm font-bold text-gray-700">Selecione seu perfil</p>
                        <div className="relative">
                            <select
                                id="register-profile"
                                value={profile}
                                onChange={(e) => setProfile(e.target.value)}
                                className={`${inputClasses} appearance-none pr-10`}
                                required
                            >
                                <option value="" disabled>Selecione</option>
                                <option value="cliente">Cliente</option>
                                <option value="parceiro">Parceiro</option>
                                <option value="revendedor">Revendedor</option>
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    <button
                        id="register-submit"
                        type="submit"
                        className="w-full rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-200 transition-all hover:from-teal-600 hover:to-emerald-600 hover:shadow-xl active:scale-[0.98]"
                    >
                        Registrar
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-500">
                    Já se registrou?{' '}
                    <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-700 hover:underline">
                        Entre aqui!
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default RegisterPage;
