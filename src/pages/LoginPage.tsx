import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement login logic
        console.log('Login:', { email, password, rememberMe });
    };

    return (
        <AuthLayout>
            <div className="mx-auto w-full max-w-md">
                <h1 className="mb-2 text-3xl font-extrabold text-gray-900">Login</h1>
                <p className="mb-8 text-sm text-gray-500">Insira o email e a senha para entrar</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <input
                            id="login-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@exemplo.com"
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
                            required
                        />
                    </div>

                    <div className="relative">
                        <input
                            id="login-password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••"
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3.5 pr-12 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
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

                    <div className="flex items-center justify-between">
                        <label className="flex cursor-pointer items-center gap-2.5">
                            <button
                                type="button"
                                role="switch"
                                aria-checked={rememberMe}
                                onClick={() => setRememberMe(!rememberMe)}
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${rememberMe ? 'bg-teal-500' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${rememberMe ? 'translate-x-4.5' : 'translate-x-0.5'
                                        }`}
                                />
                            </button>
                            <span className="text-sm text-gray-600">Lembrar-me</span>
                        </label>
                        <Link
                            to="/esqueci-senha"
                            className="text-sm font-medium text-teal-600 hover:text-teal-700 hover:underline"
                        >
                            Esqueci minha senha.
                        </Link>
                    </div>

                    <button
                        id="login-submit"
                        type="submit"
                        className="w-full rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-200 transition-all hover:from-teal-600 hover:to-emerald-600 hover:shadow-xl active:scale-[0.98]"
                    >
                        Entrar
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-500">
                    Não está cadastrado?{' '}
                    <Link to="/registro" className="font-semibold text-teal-600 hover:text-teal-700 hover:underline">
                        Cadastre-se aqui!
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default LoginPage;
