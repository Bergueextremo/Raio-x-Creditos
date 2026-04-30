import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement password reset logic
        console.log('Reset password for:', email);
        setSubmitted(true);
    };

    return (
        <AuthLayout>
            <div className="mx-auto w-full max-w-md">
                <h1 className="mb-2 text-3xl font-extrabold text-gray-900">Esqueci minha senha</h1>
                <p className="mb-8 text-sm text-gray-500">Insira o email para recuperarmos sua senha</p>

                {submitted ? (
                    <div className="rounded-lg border border-teal-100 bg-teal-50 p-6 text-center">
                        <p className="text-sm font-medium text-teal-700">
                            Se o email estiver cadastrado, você receberá um link para redefinir sua senha.
                        </p>
                        <button
                            onClick={() => setSubmitted(false)}
                            className="mt-4 text-sm font-semibold text-teal-600 hover:underline"
                        >
                            Enviar novamente
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <input
                                id="forgot-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
                                required
                            />
                        </div>

                        <button
                            id="forgot-submit"
                            type="submit"
                            className="w-full rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-200 transition-all hover:from-teal-600 hover:to-emerald-600 hover:shadow-xl active:scale-[0.98]"
                        >
                            Resetar
                        </button>
                    </form>
                )}

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

export default ForgotPasswordPage;
