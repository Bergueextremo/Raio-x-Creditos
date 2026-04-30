import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, MessageCircle } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

const faqData: FAQItem[] = [
    {
        category: 'Pedidos',
        question: 'Como faço um novo pedido?',
        answer: 'Para fazer um novo pedido, clique em "Novo Pedido" no menu lateral. Selecione o serviço desejado, preencha os dados solicitados e finalize o pagamento. Após a confirmação, você receberá um e-mail com os detalhes do seu pedido.'
    },
    {
        category: 'Pedidos',
        question: 'Qual o prazo de entrega dos documentos?',
        answer: 'O prazo de entrega varia de acordo com o tipo de serviço. Em geral, documentos como CCMEI e Cartão CNPJ são entregues em até 24h. Serviços mais complexos como Regularização e Declaração MEI podem levar até 5 dias úteis. Você pode acompanhar o status do seu pedido na seção "Meus Pedidos".'
    },
    {
        category: 'Pedidos',
        question: 'Como acompanho o status do meu pedido?',
        answer: 'Acesse "Meus Pedidos" no menu lateral. Lá você encontrará todos os seus pedidos com seus respectivos status atualizados em tempo real. Você também receberá notificações por e-mail a cada atualização.'
    },
    {
        category: 'Pagamentos',
        question: 'Quais formas de pagamento são aceitas?',
        answer: 'Aceitamos pagamento via PIX (aprovação imediata) e cartão de crédito (em até 12x). Para pagamentos via PIX, você receberá um QR Code após finalizar o pedido. Pagamentos com cartão são processados instantaneamente.'
    },
    {
        category: 'Pagamentos',
        question: 'Posso solicitar reembolso?',
        answer: 'Sim. Caso o serviço não possa ser realizado por qualquer motivo, você tem direito ao reembolso integral. Basta entrar em contato com nosso suporte via WhatsApp ou e-mail informando o número do pedido. O prazo para estorno é de até 7 dias úteis.'
    },
    {
        category: 'Comissões',
        question: 'Como funciona o programa de comissões?',
        answer: 'Ao indicar alguém usando seu link de indicação, você recebe uma comissão sobre cada pedido realizado pelo indicado. As comissões ficam disponíveis na sua Conta Corrente e podem ser sacadas a qualquer momento via PIX, desde que atinjam o valor mínimo de R$ 50,00.'
    },
    {
        category: 'Comissões',
        question: 'Quando posso sacar minhas comissões?',
        answer: 'Você pode solicitar o saque a qualquer momento, desde que o saldo disponível seja de pelo menos R$ 50,00. Saques são processados em até 3 dias úteis e transferidos para a chave PIX cadastrada.'
    },
    {
        category: 'Conta',
        question: 'Como altero meus dados cadastrais?',
        answer: 'Acesse "Dados do Usuário" no menu lateral. Lá você pode atualizar nome, e-mail, telefone, endereço e outras informações. Para alterar o CPF, entre em contato com nosso suporte.'
    },
    {
        category: 'Conta',
        question: 'Esqueci minha senha, o que faço?',
        answer: 'Na tela de login, clique em "Esqueci minha senha". Informe seu e-mail cadastrado e enviaremos um link para redefinir sua senha. O link é válido por 24 horas.'
    },
    {
        category: 'Conta',
        question: 'Meus dados estão seguros?',
        answer: 'Sim! Utilizamos criptografia SSL de ponta a ponta para proteger todas as suas transmissões de dados. Nosso sistema está em total conformidade com a LGPD (Lei Geral de Proteção de Dados). Seus dados pessoais nunca são compartilhados com terceiros sem seu consentimento.'
    },
];

const categories = [...new Set(faqData.map(item => item.category))];

const FAQPage: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const filteredFAQ = faqData.filter(item => {
        const matchesSearch = searchQuery === '' ||
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === '' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <DashboardLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Dúvidas Frequentes</h1>
                <p className="mt-1 text-sm text-gray-500">Encontre respostas para as perguntas mais comuns</p>
            </div>

            {/* Search & Filters */}
            <div className="mb-8 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar pergunta..."
                        className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setSelectedCategory('')}
                        className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${selectedCategory === ''
                                ? 'bg-teal-500 text-white shadow-md'
                                : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        Todas
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${selectedCategory === cat
                                    ? 'bg-teal-500 text-white shadow-md'
                                    : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* FAQ Items */}
            <div className="space-y-3">
                {filteredFAQ.map((item, idx) => {
                    const globalIdx = faqData.indexOf(item);
                    const isOpen = openIndex === globalIdx;
                    return (
                        <div
                            key={globalIdx}
                            className={`overflow-hidden rounded-xl border bg-white shadow-sm transition-all ${isOpen ? 'border-teal-200' : 'border-gray-200'
                                }`}
                        >
                            <button
                                onClick={() => setOpenIndex(isOpen ? null : globalIdx)}
                                className="flex w-full items-center justify-between p-5 text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${item.category === 'Pedidos' ? 'bg-blue-50 text-blue-600' :
                                            item.category === 'Pagamentos' ? 'bg-emerald-50 text-emerald-600' :
                                                item.category === 'Comissões' ? 'bg-amber-50 text-amber-600' :
                                                    'bg-purple-50 text-purple-600'
                                        }`}>
                                        {item.category}
                                    </span>
                                    <span className="text-sm font-bold text-gray-800">{item.question}</span>
                                </div>
                                {isOpen ? (
                                    <ChevronUp className="h-5 w-5 flex-shrink-0 text-teal-500" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 flex-shrink-0 text-gray-400" />
                                )}
                            </button>
                            {isOpen && (
                                <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">
                                    <p className="text-sm leading-relaxed text-gray-600">{item.answer}</p>
                                </div>
                            )}
                        </div>
                    );
                })}

                {filteredFAQ.length === 0 && (
                    <div className="py-12 text-center">
                        <Search className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                        <p className="text-sm font-medium text-gray-500">Nenhum resultado encontrado para "{searchQuery}"</p>
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedCategory(''); }}
                            className="mt-2 text-sm font-bold text-teal-600 hover:underline"
                        >
                            Limpar filtros
                        </button>
                    </div>
                )}
            </div>

            {/* Contact Card */}
            <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-center">
                <MessageCircle className="mx-auto mb-3 h-10 w-10 text-teal-500" />
                <h3 className="mb-1 text-base font-bold text-gray-900">Ainda tem dúvidas?</h3>
                <p className="mb-4 text-sm text-gray-500">Nossa equipe está pronta para ajudar</p>
                <a
                    href="https://wa.me/5500000000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-green-600"
                >
                    <MessageCircle className="h-4 w-4" />
                    Falar com um atendente
                </a>
            </div>

            <div className="mt-8 text-center text-xs text-gray-400">
                © 2026, feito com ♥ por REGULARIZA DIGITAL
            </div>
        </DashboardLayout>
    );
};

export default FAQPage;
