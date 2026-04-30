import React from 'react';
import { Triangle } from 'lucide-react';

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <div className="flex min-h-screen">
            {/* Left side - Form */}
            <div className="flex w-full flex-col justify-center px-8 py-12 md:w-1/2 md:px-16 lg:px-24">
                {children}
            </div>

            {/* Right side - Branding */}
            <div className="relative hidden w-1/2 md:block">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-700" />
                {/* Overlay with building image effect */}
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    mixBlendMode: 'overlay'
                }} />
                <div className="relative z-10 flex h-full flex-col items-center justify-center text-white">
                    {/* Logo */}
                    <img 
                        src="/img/Regularize Digital -Branca.png" 
                        alt="Regulariza Digital" 
                        className="h-64 w-auto object-contain"
                    />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
