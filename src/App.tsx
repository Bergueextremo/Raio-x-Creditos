/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Link } from 'react-router-dom';
import {
  Triangle,
  Search,
  ChevronDown,
  ChevronRight,
  CreditCard,
  ShieldCheck,
  AlertCircle,
  Instagram,
  Linkedin,
  Facebook,
  MessageCircle,
  CheckCircle2,
  Lock,
  Wallet,
  Scale,
  Briefcase,
  PlusCircle,
  Zap,
  FileText,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import MeusPedidosPage from './pages/MeusPedidosPage';
import DadosUsuarioPage from './pages/DadosUsuarioPage';
import IndicacaoPage from './pages/IndicacaoPage';
import ComissoesPage from './pages/ComissoesPage';
import ContaCorrentePage from './pages/ContaCorrentePage';
import SaquePage from './pages/SaquePage';
import FAQPage from './pages/FAQPage';

// --- Types ---
type CheckoutStage = 'selection' | 'form' | 'confirmation' | 'checkout';

interface FormField {
  label: string;
  type: 'text' | 'date' | 'email' | 'tel' | 'select' | 'textarea';
  placeholder?: string;
  options?: string[];
  optional?: boolean;
  info?: string;
}

interface ServiceItem {
  name: string;
  subtitle?: string;
  price: number;
  tag?: string;
  fields: FormField[];
  urgentNotice?: string;
}

interface Category {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  items: ServiceItem[];
  isExpanded?: boolean;
}

const clientNames = [
  "Kayk D. - Indaiatuba/SP", "Erik E. - Tabatinga/AM", "Luis F. - Rio de Janeiro/RJ",
  "Liliana R. - São Paulo/SP", "CLAUDIO F. - Brotas/SP", "Renato T. - São Paulo/SP",
  "Antonio C. - Itapira/SP", "Raudinei T. - Ribeirão das Neves/MG", "José P. - Rio de Janeiro/...RJ",
  "Waltécio G. - Itapetininga/SP", "Lúcia E. - Taquari/RS", "Carin K. - Guarulhos/SP",
  "Rui A. - São Paulo/SP", "Luiza M. - Cuiabá/MT", "Marta B. - Curitiba/PR",
  "Luiz B. - Recife/PE", "Anezia A. - Nova Lima/MG", "Rozanilde F. - São Luís/MA",
  "AGNO F. - Várzea Grande/MT", "Roselaine J. - Joinville/SC", "THIAGO A. - Curitiba/PR",
  "CARLOS H. - Rio de Janeiro/RJ", "SÉRGIO D. - Rio de Janeiro/RJ", "Josemir C. - Brasília/DF",
  "Edimir L. - Manaus/AM", "Juliana D. - Presidente Prudente/SP", "Sonia C. - Belo Horizonte/MG",
  "ELDER A. - Feira de Santana/BA", "maria D. - Maceió/Alagoas", "UBIRAJARA G. - Cuiabá/MT",
  "Mariano M. - Gaspar/SC", "matheus S. - Itaquaquecetuba/SP", "Junot C. - Curitiba/PR",
  "Sonia S. - Rio de Janeiro/RJ", "Roberto G. - Lauro de Freitas/BA", "LEANA D. - Rio de Janeiro/RJ",
  "Francisca S. - Fortaleza/Ce", "silvio P. - Araçatuba/SP", "Ednelsa R. - Uberaba/MG",
  "euter J. - Linhares/ES", "Nilce A. - São Bernardo do Campo /SP", "André P. - São Gonçalo/RJ",
  "Ricardo P. - Rio de Janeiro/RJ", "Rosângela V. - Campinas/SP", "Maria D. - Santo André/SP",
  "CRISTIANE T. - São José/SC", "DEISE P. - Lapão/BA", "Conceição D. - Brasília/DF",
  "Diego M. - São Paulo/SP", "Ana P. - Belém/PA", "Ana C. - Magé/RJ",
  "Sergio A. - Dourados/MS", "Walquiria D. - Poços de Caldas/MG", "michele D. - Itanhaém/SP",
  "Elizabeth D. - Rio de Janeiro/RJ", "Alexsandra O. - Fortaleza/CE", "IARA A. - Brasilia/Distrito Federal",
  "Américo G. - São Paulo/SP", "siegmar B. - Curitiba/PR", "José N. - Campinas/SP",
  "Maria I. - Teresina/PI", "Vanessa V. - Belém/PA", "Rui D. - São Paulo/SP",
  "MARIA R. - Uruguaiana/RS", "JULIANO W. - Porto Alegre/RS", "Carlos V. - Mirassol/SP",
  "cleusiane M. - Campinas/SP", "Anderson R. - Maceió/AL", "Cezar J. - Rio de Janeiro/RJ",
  "Aref S. - Assis/SP", "LOURIVAL P. - Araguari/MG", "Francisco C. - Campinas/SP",
  "Lourival P. - Araguari/MG", "Emerson M. - Rolim de Moura/RO", "TIAGO B. - Paracatu/MG",
  "Giovana R. - Santana de Parnaíba/SP", "TANIA M. - São José dos Campos/SP", "Ariane P. - São Paulo /Sp",
  "Helem C. - Brasília/DF", "Sergio L. - Santana de Parnaíba/SP", "Isabella M. - Dores do Indaiá/MG",
  "Eliana D. - Tremembé/SP", "Bruna F. - Porto Alegre/RS", "Maurício M. - São Paulo/SP",
  "Inês C. - Brasília/DF", "Edgar E. - Matupá/MT", "Lourival P. - Araguari/MG",
  "Leonardo C. - Criciúma/SC", "Thiago U. - Recife/PE", "Roberta F. - Prado Ferreira/PR",
  "DAISE A. - Cidade Ocidental/GO", "Marina R. - Rio de Janeiro/RJ", "marinea F. - Rio de Janeiro/RJ",
  "nelson C. - São Paulo/SP", "Caroline B. - Santo Ângelo/RS", "Simone R. - Indaiatuba/SP",
  "maria L. - São Paulo/SP", "Fábio E. - Goiânia/GO", "Vanuza C. - Brumadinho/MG",
  "CHRISTOVÃO D. - Brasília/DF"
];

// --- Components ---

const Checkout = ({
  service,
  formValues,
  fetchedData,
  onBack
}: {
  service: ServiceItem;
  formValues: Record<string, string>;
  fetchedData: any;
  onBack: () => void
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);

  const handlePayment = async () => {
    setIsLoadingPayment(true);
    try {
      const response = await axios.post('/api/kiwify/create-payment', {
        service,
        customer: {
          name: formValues['Nome completo'] || formValues['NOME COMPLETO'] || 'Cliente',
          email: formValues['EMAIL'] || 'cliente@exemplo.com',
          document: formValues['CPF'] || formValues['CNPJ'] || formValues['CNPJ MEI'] || formValues['CPF/CNPJ'] || '',
          phone: formValues['Telefone / WhatsApp'] || ''
        }
      });

      if (response.data.checkout_url) {
        window.location.href = response.data.checkout_url;
      }
    } catch (error: any) {
      console.error('Erro ao processar pagamento:', error);
      const errorMsg = error.response?.data?.details || error.response?.data?.error || 'Erro ao processar o pagamento. Por favor, tente novamente.';
      alert(errorMsg);
    } finally {
      setIsLoadingPayment(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm"
    >
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline"
      >
        <ChevronRight className="h-4 w-4 rotate-180" />
        Voltar para informações
      </button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Order Info */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Resumo do Pagamento</h3>

          <div className="rounded-xl bg-gray-50 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-500 uppercase">Serviço</span>
              <span className="text-sm font-black text-gray-900">{service.name}</span>
            </div>
            <div className="flex justify-between items-center border-t border-gray-200 pt-4">
              <span className="text-sm font-bold text-gray-500 uppercase">Documento</span>
              <span className="text-sm font-black text-gray-900">
                {formValues['CPF'] || formValues['CNPJ'] || formValues['CNPJ MEI'] || formValues['CPF/CNPJ']}
              </span>
            </div>
            {fetchedData && !fetchedData.isError && (
              <div className="flex justify-between items-start border-t border-gray-200 pt-4">
                <span className="text-sm font-bold text-gray-500 uppercase">Razão Social</span>
                <span className="text-sm font-black text-gray-900 text-right max-w-[200px]">{fetchedData.companyName}</span>
              </div>
            )}
            <div className="flex justify-between items-center border-t border-gray-200 pt-4">
              <span className="text-lg font-black text-gray-900 uppercase">Total</span>
              <span className="text-2xl font-black text-blue-600">
                R$ {service.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-blue-700">
            <ShieldCheck className="h-6 w-6 flex-shrink-0" />
            <p className="text-xs font-bold leading-relaxed uppercase">
              Pagamento 100% Seguro via Criptografia SSL
            </p>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Forma de Pagamento</h3>

          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => setPaymentMethod('pix')}
              className={`flex items-center justify-between rounded-xl border-2 p-4 transition-all ${paymentMethod === 'pix' ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200'
                }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Zap className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <p className="font-black text-gray-900 uppercase tracking-tight">PIX</p>
                  <p className="text-xs font-bold text-emerald-600 uppercase">Aprovação Imediata</p>
                </div>
              </div>
              {paymentMethod === 'pix' && <CheckCircle2 className="h-6 w-6 text-blue-600" />}
            </button>

            <button
              onClick={() => setPaymentMethod('card')}
              className={`flex items-center justify-between rounded-xl border-2 p-4 transition-all ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200'
                }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <p className="font-black text-gray-900 uppercase tracking-tight">Cartão de Crédito</p>
                  <p className="text-xs font-bold text-gray-500 uppercase">Até 12x no cartão</p>
                </div>
              </div>
              {paymentMethod === 'card' && <CheckCircle2 className="h-6 w-6 text-blue-600" />}
            </button>
          </div>

          <button
            disabled={isLoadingPayment}
            className={`w-full rounded-xl py-5 text-lg font-black text-white shadow-lg transition-all active:scale-[0.98] ${isLoadingPayment ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#4CAF50] shadow-green-100 hover:bg-green-600'
              }`}
            onClick={handlePayment}
          >
            {isLoadingPayment ? 'PROCESSANDO...' : (paymentMethod === 'pix' ? 'GERAR QR CODE PIX' : 'PAGAR COM CARTÃO')}
          </button>

          <div className="flex items-center justify-center gap-6 opacity-50 grayscale">
            <img src="https://logodownload.org/wp-content/uploads/2014/07/visa-logo-1.png" alt="Visa" className="h-4 object-contain" referrerPolicy="no-referrer" />
            <img src="https://logodownload.org/wp-content/uploads/2014/07/mastercard-logo-7.png" alt="Mastercard" className="h-6 object-contain" referrerPolicy="no-referrer" />
            <img src="https://logodownload.org/wp-content/uploads/2020/10/pix-logo-2.png" alt="Pix" className="h-5 object-contain" referrerPolicy="no-referrer" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface ServiceGroupProps {
  category: Category;
  onSelectService: (service: ServiceItem, categoryTitle: string) => void;
  selectedService: ServiceItem | null;
}

const ServiceGroup: React.FC<ServiceGroupProps> = ({ category, onSelectService, selectedService }) => {
  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/50 p-4">
        <span className="text-blue-900">{category.icon}</span>
        <div className="flex flex-col">
          <span className="text-sm font-black uppercase tracking-wider text-blue-950">{category.title}</span>
          {category.description && (
            <span className="text-[10px] font-medium text-gray-500">{category.description}</span>
          )}
        </div>
      </div>

      <div className="p-2">
        {category.items.map((item, idx) => {
          const isSelected = selectedService?.name === item.name;
          return (
            <div key={idx} className="mb-1 last:mb-0">
              <div
                onClick={() => onSelectService(item, category.title)}
                className={`group flex cursor-pointer items-center justify-between rounded-lg p-3 transition-all hover:bg-gray-50 ${isSelected ? 'bg-blue-50 ring-2 ring-blue-600/20' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${isSelected ? 'border-blue-700 bg-white' : 'border-gray-300 group-hover:border-blue-400'}`}>
                    {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-blue-700" />}
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-sm font-bold ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>{item.name}</span>
                    {item.subtitle && (
                      <span className="text-[10px] text-gray-400 font-medium">{item.subtitle}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-[9px] font-black uppercase tracking-tighter text-blue-700 border border-blue-100">
                    <ShieldCheck className="h-3 w-3" />
                    Assessoria Disponível
                  </span>
                  {item.tag && (
                    <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[9px] font-black uppercase tracking-tighter text-amber-700 border border-amber-100">
                      <Zap className="h-3 w-3 fill-amber-700" />
                      {item.tag}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function HomePage() {
  const [expandedId, setExpandedId] = useState<string | null>('gestao');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  useEffect(() => {
    setFetchedData(null);
    setFormValues({});
    setPriceUnlocked(false);
  }, [selectedService]);

  const [peopleOnline, setPeopleOnline] = useState(55);
  const [remainingServices, setRemainingServices] = useState(35);

  useEffect(() => {
    const interval = setInterval(() => {
      setPeopleOnline(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const next = prev + change;
        return next < 30 ? 30 : next > 80 ? 80 : next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Initial decrease after 5 seconds
    const timeout = setTimeout(() => {
      setRemainingServices(prev => prev - 1);
    }, 5000);

    const interval = setInterval(() => {
      setRemainingServices(prev => {
        if (prev <= 5) return prev;
        // Moderate probability of decrease
        const shouldDecrease = Math.random() > 0.4;
        if (shouldDecrease) {
          const amount = Math.random() > 0.95 ? 2 : 1;
          const next = prev - amount;
          return next < 5 ? 5 : next;
        }
        return prev;
      });
    }, 15000); // Every 15 seconds
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [stage, setStage] = useState<CheckoutStage>('selection');
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [fetchedData, setFetchedData] = useState<{ companyName?: string; tradeName?: string } | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [priceUnlocked, setPriceUnlocked] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const categories: Category[] = [
    {
      id: 'gestao',
      title: 'Gestão de MEI (Abertura/Baixa)',
      icon: <Wallet className="h-5 w-5" />,
      items: [
        {
          name: 'ABRIR MEI',
          price: 107.00,
          tag: 'Mais Procurado',
          fields: [
            { label: 'Nome completo', type: 'text', placeholder: 'Seu nome completo' },
            { label: 'EMAIL', type: 'email', placeholder: 'seu@email.com' },
            { label: 'CPF', type: 'text', placeholder: '000.000.000-00' },
            { label: 'Telefone / WhatsApp', type: 'tel', placeholder: '(00) 00000-0000' },
            { label: 'Atividades (CNAEs)', type: 'textarea', placeholder: 'Descreva as atividades que irá realizar' },
          ]
        },
        {
          name: 'BAIXA MEI',
          price: 109.00,
          fields: [
            { label: 'Nome completo', type: 'text', placeholder: 'Seu nome completo' },
            { label: 'EMAIL', type: 'email', placeholder: 'seu@email.com' },
            { label: 'CPF', type: 'text', placeholder: '000.000.000-00' },
            { label: 'CNPJ MEI', type: 'text', placeholder: '00.000.000/0001-00' },
            { label: 'Telefone / WhatsApp', type: 'tel', placeholder: '(00) 00000-0000' },
          ]
        },
        {
          name: 'ALTERAR MEI',
          price: 89.90,
          fields: [
            { label: 'Nome completo', type: 'text', placeholder: 'Seu nome completo' },
            { label: 'EMAIL', type: 'email', placeholder: 'seu@email.com' },
            { label: 'CPF', type: 'text', placeholder: '000.000.000-00' },
            { label: 'Telefone / WhatsApp', type: 'tel', placeholder: '(00) 00000-0000' },
            { label: 'Atividade para alterar (CNAEs)', type: 'textarea', placeholder: 'Quais atividades deseja alterar?' },
          ]
        },
      ]
    },
    {
      id: 'fiscais',
      title: 'Serviços Fiscais',
      icon: <FileText className="h-5 w-5" />,
      items: [
        {
          name: 'NOTA FISCAL',
          price: 72.00,
          fields: [
            { label: 'CNPJ', type: 'text', placeholder: '00.000.000/0001-00' },
            { label: 'Info', type: 'text', info: 'Entraremos em contato para pedir os dados da Nota' },
          ]
        },
      ]
    },
    {
      id: 'obrigacoes',
      title: 'Obrigações e Impostos',
      icon: <Scale className="h-5 w-5" />,
      items: [
        {
          name: 'REGULARIZE MEI',
          price: 102.00,
          urgentNotice: 'Comunicado: MEI irregular após 31/03 pode ter o CNPJ cancelado e dívida transferida para o CPF. REGULARIZE AGORA.',
          fields: [
            { label: 'CNPJ', type: 'text', placeholder: '00.000.000/0001-00' },
            { label: 'DATA DE NASCIMENTO', type: 'date' },
            { label: 'CPF', type: 'text', placeholder: '000.000.000-00' },
            { label: 'Opcional - TÍTULO DE ELEITOR', type: 'text', placeholder: 'Número do título', optional: true },
          ]
        },
        {
          name: 'DECLARAÇÃO MEI',
          price: 107.00,
          urgentNotice: 'Atenção: O prazo para a declaração anual encerra em breve. Evite multas e cancelamento do seu MEI.',
          fields: [
            { label: 'CNPJ', type: 'text', placeholder: '00.000.000/0001-00' },
            { label: 'CPF', type: 'text', placeholder: '000.000.000-00' },
            {
              label: 'QUAL TIPO DE SERVIÇO',
              type: 'select',
              options: ['Consultar declaração', 'Recibo da declaração', 'Emitir 2 via da declaração já apresentada']
            },
          ]
        },
        {
          name: 'BOLETO DAS MEI',
          price: 49.90,
          fields: [
            { label: 'CNPJ', type: 'text', placeholder: '00.000.000/0001-00' },
            { label: 'NOME COMPLETO', type: 'text', placeholder: 'Seu nome completo' },
            { label: 'CPF', type: 'text', placeholder: '000.000.000-00' },
            { label: 'EMAIL', type: 'email', placeholder: 'seu@email.com' },
          ]
        },
        {
          name: 'PARCELAMENTO MEI',
          price: 107.00,
          urgentNotice: 'Aviso: Parcelamentos em atraso podem ser rescindidos pela Receita Federal. Regularize suas parcelas.',
          fields: [
            { label: 'CNPJ', type: 'text', placeholder: '00.000.000/0001-00' },
            { label: 'DATA DE NASCIMENTO', type: 'date' },
            { label: 'CPF', type: 'text', placeholder: '000.000.000-00' },
            { label: 'Opcional - TÍTULO DE ELEITOR', type: 'text', placeholder: 'Número do título', optional: true },
          ]
        },
      ]
    },
    {
      id: 'documentos',
      title: 'Documentos e Certidões',
      icon: <Briefcase className="h-5 w-5" />,
      items: [
        {
          name: 'CERTIFICADO MEI - CCMEI',
          price: 57.90,
          fields: [
            { label: 'CNPJ', type: 'text', placeholder: '00.000.000/0001-00' },
            { label: 'NOME COMPLETO', type: 'text', placeholder: 'Seu nome completo' },
            { label: 'CPF', type: 'text', placeholder: '000.000.000-00' },
            { label: 'EMAIL', type: 'email', placeholder: 'seu@email.com' },
          ]
        },
        {
          name: 'ALVARÁ DE LICENÇA DE FUNCIONAMENTO',
          price: 169.00,
          fields: [
            { label: 'CNPJ', type: 'text', placeholder: '00.000.000/0001-00' },
            { label: 'CPF', type: 'text', placeholder: '000.000.000-00' },
          ]
        },
        {
          name: 'CARTÃO CNPJ MEI',
          price: 55.90,
          fields: [
            { label: 'CNPJ', type: 'text', placeholder: '00.000.000/0001-00' },
            { label: 'CPF', type: 'text', placeholder: '000.000.000-00' },
          ]
        },
      ]
    },
    {
      id: 'consultas',
      title: 'Consultas e Pesquisas',
      icon: <Search className="h-5 w-5" />,
      items: [
        {
          name: 'CONSULTAR PENDÊNCIAS',
          price: 62.90,
          fields: [
            { label: 'CNPJ', type: 'text', placeholder: '00.000.000/0001-00' },
            { label: 'DATA DE NASCIMENTO', type: 'date' },
            { label: 'CPF', type: 'text', placeholder: '000.000.000-00' },
            { label: 'Opcional - TÍTULO DE ELEITOR', type: 'text', placeholder: 'Número do título', optional: true },
          ]
        },
        {
          name: 'CONSULTAR BAIXA MEI',
          price: 68.90,
          fields: [
            { label: 'CNPJ', type: 'text', placeholder: '00.000.000/0001-00' },
            { label: 'CPF', type: 'text', placeholder: '000.000.000-00' },
          ]
        },
        {
          name: 'BUSCAR MEI PELO CPF',
          price: 52.90,
          fields: [
            { label: 'CPF', type: 'text', placeholder: '000.000.000-00' },
            { label: 'NOME COMPLETO', type: 'text', placeholder: 'Seu nome completo' },
            { label: 'EMAIL', type: 'email', placeholder: 'seu@email.com' },
          ]
        },
        {
          name: 'SITUAÇÃO MEI',
          price: 58.90,
          fields: [
            { label: 'CNPJ', type: 'text', placeholder: '00.000.000/0001-00' },
            { label: 'DATA DE NASCIMENTO', type: 'date' },
            { label: 'CPF', type: 'text', placeholder: '000.000.000-00' },
            { label: 'Nome da mãe', type: 'text', placeholder: 'Nome completo da mãe' },
          ]
        },
      ]
    },
    {
      id: 'credito',
      title: 'Crédito e Financiamento',
      icon: <CreditCard className="h-5 w-5" />,
      items: [
        {
          name: 'Crédito PJ',
          price: 149.00,
          tag: 'Entrega Rápida',
          fields: [
            { label: 'CNPJ', type: 'text', placeholder: '00.000.000/0001-00' },
            { label: 'NOME COMPLETO', type: 'text', placeholder: 'Seu nome completo' },
            { label: 'VALOR DESEJADO', type: 'text', placeholder: 'R$ 0,00' },
          ]
        },
      ]
    },
    {
      id: 'juridico',
      title: 'Jurídico e Regularização',
      icon: <Scale className="h-5 w-5" />,
      items: [
        {
          name: 'Limpa Nome Judicial',
          price: 299.00,
          fields: [
            { label: 'CPF/CNPJ', type: 'text', placeholder: '000.000.000-00' },
            { label: 'NOME COMPLETO', type: 'text', placeholder: 'Seu nome completo' },
          ]
        },
      ]
    },
    {
      id: 'auditoria',
      title: 'AUDITORIA JURÍDICA ESPECIALIZADA',
      description: 'Qual tipo de contrato você quer blindar?',
      icon: <ShieldCheck className="h-5 w-5" />,
      items: [
        {
          name: 'Financiamento de Veículo',
          subtitle: 'Juros abusivos, Busca e Apreensão, Taxas Ocultas',
          price: 197.00,
          urgentNotice: 'Selecione a categoria do seu documento para uma análise de precisão máxima baseada no STJ e Bacen.',
          fields: [
            { label: 'CPF/CNPJ', type: 'text', placeholder: '000.000.000-00' },
            { label: 'NOME COMPLETO', type: 'text', placeholder: 'Seu nome completo' },
            { label: 'TIPO DE PROBLEMA', type: 'select', options: ['Juros abusivos', 'Busca e Apreensão', 'Taxas Ocultas'] },
          ]
        },
        {
          name: 'Arrematação em Leilão',
          subtitle: 'Edital, Matrícula, Dívidas Ocultas',
          price: 247.00,
          urgentNotice: 'Selecione a categoria do seu documento para uma análise de precisão máxima baseada no STJ e Bacen.',
          fields: [
            { label: 'CPF/CNPJ', type: 'text', placeholder: '000.000.000-00' },
            { label: 'NOME COMPLETO', type: 'text', placeholder: 'Seu nome completo' },
            { label: 'TIPO DE PROBLEMA', type: 'select', options: ['Edital', 'Matrícula', 'Dívidas Ocultas'] },
          ]
        },
        {
          name: 'Aluguel & Imobiliário',
          subtitle: 'Multa de rescisão, Reajuste IGP-M, Despejo',
          price: 187.00,
          urgentNotice: 'Selecione a categoria do seu documento para uma análise de precisão máxima baseada no STJ e Bacen.',
          fields: [
            { label: 'CPF/CNPJ', type: 'text', placeholder: '000.000.000-00' },
            { label: 'NOME COMPLETO', type: 'text', placeholder: 'Seu nome completo' },
            { label: 'TIPO DE PROBLEMA', type: 'select', options: ['Multa de rescisão', 'Reajuste IGP-M', 'Despejo'] },
          ]
        },
        {
          name: 'Empréstimo Bancário & Consignado',
          subtitle: 'Superendividamento, RMC, Venda Casada',
          price: 197.00,
          urgentNotice: 'Selecione a categoria do seu documento para uma análise de precisão máxima baseada no STJ e Bacen.',
          fields: [
            { label: 'CPF/CNPJ', type: 'text', placeholder: '000.000.000-00' },
            { label: 'NOME COMPLETO', type: 'text', placeholder: 'Seu nome completo' },
            { label: 'TIPO DE PROBLEMA', type: 'select', options: ['Superendividamento', 'RMC', 'Venda Casada'] },
          ]
        },
        {
          name: 'Empresarial & Contrato Social',
          subtitle: 'Blindagem de Sócios, Saída, Responsabilidade',
          price: 297.00,
          urgentNotice: 'Selecione a categoria do seu documento para uma análise de precisão máxima baseada no STJ e Bacen.',
          fields: [
            { label: 'CPF/CNPJ', type: 'text', placeholder: '000.000.000-00' },
            { label: 'NOME COMPLETO', type: 'text', placeholder: 'Seu nome completo' },
            { label: 'TIPO DE PROBLEMA', type: 'select', options: ['Blindagem de Sócios', 'Saída', 'Responsabilidade'] },
          ]
        },
        {
          name: 'Prestação de Serviços',
          subtitle: 'Riscos trabalhistas, Não pagamento, Prazos',
          price: 157.00,
          urgentNotice: 'Selecione a categoria do seu documento para uma análise de precisão máxima baseada no STJ e Bacen.',
          fields: [
            { label: 'CPF/CNPJ', type: 'text', placeholder: '000.000.000-00' },
            { label: 'NOME COMPLETO', type: 'text', placeholder: 'Seu nome completo' },
            { label: 'TIPO DE PROBLEMA', type: 'select', options: ['Riscos trabalhistas', 'Não pagamento', 'Prazos'] },
          ]
        },
        {
          name: 'Outros Contratos',
          subtitle: 'Consulta Jurídica Genérica',
          price: 127.00,
          urgentNotice: 'Selecione a categoria do seu documento para uma análise de precisão máxima baseada no STJ e Bacen.',
          fields: [
            { label: 'CPF/CNPJ', type: 'text', placeholder: '000.000.000-00' },
            { label: 'NOME COMPLETO', type: 'text', placeholder: 'Seu nome completo' },
            { label: 'DESCRIÇÃO DO CONTRATO', type: 'textarea', placeholder: 'Descreva brevemente o contrato' },
          ]
        },
      ]
    },
    {
      id: 'consultoria',
      title: 'Consultoria e Gestão',
      icon: <Briefcase className="h-5 w-5" />,
      items: [
        {
          name: 'Aumento de Score',
          price: 127.00,
          tag: 'Entrega Rápida',
          fields: [
            { label: 'CPF', type: 'text', placeholder: '000.000.000-00' },
            { label: 'NOME COMPLETO', type: 'text', placeholder: 'Seu nome completo' },
          ]
        },
        {
          name: 'Atualização de Rating',
          price: 137.00,
          tag: 'Entrega Rápida',
          fields: [
            { label: 'CNPJ', type: 'text', placeholder: '00.000.000/0001-00' },
            { label: 'NOME DA EMPRESA', type: 'text', placeholder: 'Razão Social' },
          ]
        },
      ]
    },

  ];

  const handleSelectService = (service: ServiceItem, categoryTitle: string) => {
    setSelectedService(service);
    setSelectedCategory(categoryTitle);
    setStage('selection');
    setFetchedData(null);
    setPriceUnlocked(false);
  };

  const handleAdvanceToForm = () => {
    if (selectedService) {
      setStage('form');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinalize = () => {
    setStage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToForm = () => {
    setStage('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmData = async (manualValue?: string) => {
    // Always unlock price when this is called (from the button)
    setPriceUnlocked(true);

    const cnpjValue = (typeof manualValue === 'string' ? manualValue : null) || formValues['CNPJ'] || formValues['CNPJ MEI'] || formValues['CPF/CNPJ'];
    const cpfValue = formValues['CPF'];

    // Prioritize CNPJ for the data box
    const valueToProcess = cnpjValue || cpfValue;
    if (!valueToProcess) return;

    const cleanValue = valueToProcess.replace(/\D/g, '');

    if (cleanValue.length === 14) {
      setIsLoadingData(true);
      setFetchedData(null);

      try {
        const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanValue}`);
        if (!response.ok) throw new Error('CNPJ não encontrado');

        const data = await response.json();
        setFetchedData({
          companyName: data.razao_social,
          tradeName: data.nome_fantasia || data.razao_social,
          isError: false
        });
      } catch (error) {
        console.error('Erro ao buscar CNPJ:', error);
        setFetchedData({
          companyName: "CNPJ NÃO ENCONTRADO",
          tradeName: "VERIFIQUE O NÚMERO OU TENTE NOVAMENTE",
          isError: true
        });
      } finally {
        setIsLoadingData(false);
      }
    } else if (cleanValue.length === 11) {
      // For CPF, we just unlock the price and set a mock fetchedData 
      // so the user can proceed to checkout (Gestão de MEI flow)
      setFetchedData({
        companyName: formValues['Nome completo'] || formValues['NOME COMPLETO'] || 'CLIENTE PESSOA FÍSICA',
        tradeName: 'DOCUMENTO CPF VALIDADO',
        isError: false
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
      {/* --- Header & Top Bars --- */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        {/* Main Nav */}
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <div className="flex items-center gap-2">
            <img 
              src="/img/Regularize Digital.png" 
              alt="Regulariza Digital" 
              className="h-[124px] w-auto object-contain"
            />
          </div>
          <nav className="hidden items-center gap-8 text-xs font-bold text-gray-600 md:flex">
            <a href="#" className="hover:text-blue-600">HOME</a>
            <a href="#" className="hover:text-blue-600">PARA EMPRESAS</a>
            <a href="#" className="hover:text-blue-600">ACOMPANHAR SOLICITAÇÕES</a>
            <div className="h-4 w-[1px] bg-gray-300" />
            <Link to="/login" className="hover:text-blue-600">Entrar | Cadastrar</Link>
          </nav>
        </div>
      </header>

      {/* Status Bar */}
      <div className="bg-blue-50 py-1.5 text-center">
        <div className="counter">
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
            <span id="contador" className="text-blue-700">{peopleOnline}</span> Pessoas online.
          </p>
        </div>
      </div>

      {/* Main Title Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-400 py-12 text-center">
        <h1 className="text-4xl font-bold text-white">Solicite seus Serviços</h1>
      </div>

      {/* Client Banner */}
      <div className="bg-white border-b border-gray-200 pt-4 pb-2">
        <div className="mx-auto max-w-7xl px-4 md:px-8 mb-3">
          <p className="text-xs font-bold text-gray-700">
            Pedidos realizados hoje: <span className="text-blue-600 ml-1">118.330</span>
          </p>
        </div>
        <div className="relative overflow-hidden bg-gray-50 py-3 border-y border-gray-100">
          <div className="flex animate-marquee whitespace-nowrap">
            <div className="flex gap-12 pr-12">
              {clientNames.map((name, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-gray-600">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  {name}
                </div>
              ))}
            </div>
            <div className="flex gap-12 pr-12">
              {clientNames.map((name, i) => (
                <div key={`dup-${i}`} className="flex items-center gap-2 text-[11px] font-bold text-gray-600">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <main className="mx-auto max-w-7xl px-4 py-10 pb-32 md:px-8 lg:pb-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* Left Column */}
          <div className={stage === 'checkout' ? 'lg:col-span-3' : 'lg:col-span-2'}>
            {/* Step Indicator */}
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                {stage === 'selection' ? '1' : stage === 'form' ? '2' : '3'}
              </div>
              <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">
                {stage === 'selection' ? 'Selecione o Serviço' : stage === 'form' ? 'Informações do Cliente' : 'Checkout e Pagamento'}
              </h2>
            </div>

            {/* Service Groups (Always Expanded) */}
            <AnimatePresence mode="wait">
              {stage === 'selection' ? (
                <motion.div
                  key="selection"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {/* Search Bar */}
                  <div className="relative mb-8">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Qual serviço você procura?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white py-4 pl-12 pr-4 shadow-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div className="space-y-4">
                    {categories
                      .map(cat => ({
                        ...cat,
                        items: cat.items.filter(item =>
                          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cat.title.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                      }))
                      .filter(cat => cat.items.length > 0)
                      .map((cat) => (
                        <ServiceGroup
                          key={cat.id}
                          category={cat}
                          onSelectService={handleSelectService}
                          selectedService={selectedService}
                        />
                      ))}

                    {searchQuery && categories.every(cat =>
                      !cat.items.some(item =>
                        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        cat.title.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                    ) && (
                        <div className="py-12 text-center">
                          <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                          <p className="text-gray-500 font-medium">Nenhum serviço encontrado para "{searchQuery}"</p>
                          <button
                            onClick={() => setSearchQuery('')}
                            className="mt-4 text-blue-600 font-bold hover:underline"
                          >
                            Limpar busca
                          </button>
                        </div>
                      )}
                  </div>
                </motion.div>
              ) : stage === 'form' ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
                >
                  <button
                    onClick={() => setStage('selection')}
                    className="mb-6 flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline"
                  >
                    <ChevronRight className="h-4 w-4 rotate-180" />
                    Voltar para seleção de serviços
                  </button>

                  {/* Urgency Banner */}
                  {selectedService?.urgentNotice && (
                    <div className="mb-8 flex items-start gap-4 rounded-xl border border-red-100 bg-red-50 p-5 text-red-800 shadow-sm">
                      <AlertCircle className="h-6 w-6 flex-shrink-0 text-red-600" />
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-black uppercase tracking-widest">Aviso Importante</span>
                        <p className="text-sm font-bold leading-relaxed">
                          {selectedService.urgentNotice}
                        </p>
                      </div>
                    </div>
                  )}

                  <h3 className="mb-6 text-lg font-bold text-gray-800">
                    Preencha os dados para <span className="text-blue-600">{selectedService?.name}</span>
                  </h3>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {selectedService?.fields.map((field, idx) => (
                      <div key={idx} className={`flex flex-col gap-2 ${field.type === 'textarea' ? 'md:col-span-2' : ''}`}>
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-gray-500 uppercase">
                            {field.label} {field.optional && <span className="text-[10px] font-normal lowercase">(opcional)</span>}
                          </label>
                          {(field.label === 'CPF' || field.label === 'CNPJ') && (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600">
                              <Lock className="h-3 w-3" />
                              CONEXÃO SEGURA LGPD
                            </div>
                          )}
                        </div>

                        {field.info ? (
                          <div className="rounded-lg bg-blue-50 p-3 text-sm font-medium text-blue-700">
                            {field.info}
                          </div>
                        ) : field.type === 'select' ? (
                          <select
                            value={formValues[field.label] || ''}
                            onChange={(e) => setFormValues(prev => ({ ...prev, [field.label]: e.target.value }))}
                            className="rounded-lg border border-gray-200 bg-gray-50 p-3 outline-none focus:border-blue-500 focus:bg-white"
                          >
                            <option value="">Selecione uma opção</option>
                            {field.options?.map((opt, i) => (
                              <option key={i} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : field.type === 'textarea' ? (
                          <textarea
                            placeholder={field.placeholder}
                            rows={4}
                            value={formValues[field.label] || ''}
                            onChange={(e) => setFormValues(prev => ({ ...prev, [field.label]: e.target.value }))}
                            className="rounded-lg border border-gray-200 bg-gray-50 p-3 outline-none focus:border-blue-500 focus:bg-white"
                          />
                        ) : (
                          <input
                            type={field.type}
                            placeholder={field.placeholder}
                            value={formValues[field.label] || ''}
                            onChange={(e) => {
                              let val = e.target.value;
                              const label = field.label.toUpperCase().trim();

                              if (label === 'CPF') {
                                val = val.replace(/\D/g, '').slice(0, 11);
                                val = val.replace(/(\d{3})(\d)/, '$1.$2');
                                val = val.replace(/(\d{3})(\d)/, '$1.$2');
                                val = val.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                              } else if (label === 'CNPJ' || label === 'CNPJ MEI') {
                                val = val.replace(/\D/g, '').slice(0, 14);
                                val = val.replace(/^(\d{2})(\d)/, '$1.$2');
                                val = val.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                                val = val.replace(/\.(\d{3})(\d)/, '.$1/$2');
                                val = val.replace(/(\d{4})(\d)/, '$1-$2');
                              } else if (label === 'CPF/CNPJ') {
                                val = val.replace(/\D/g, '').slice(0, 14);
                                if (val.replace(/\D/g, '').length <= 11) {
                                  val = val.replace(/(\d{3})(\d)/, '$1.$2');
                                  val = val.replace(/(\d{3})(\d)/, '$1.$2');
                                  val = val.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                                } else {
                                  val = val.replace(/^(\d{2})(\d)/, '$1.$2');
                                  val = val.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                                  val = val.replace(/\.(\d{3})(\d)/, '.$1/$2');
                                  val = val.replace(/(\d{4})(\d)/, '$1-$2');
                                }
                              } else if (field.type === 'tel') {
                                val = val.replace(/\D/g, '').slice(0, 11);
                                val = val.replace(/^(\d{2})(\d)/g, '($1) $2');
                                val = val.replace(/(\d)(\d{4})$/, '$1-$2');
                              }

                              setFormValues(prev => ({ ...prev, [field.label]: val }));
                            }}
                            className="rounded-lg border border-gray-200 bg-gray-50 p-3 outline-none focus:border-blue-500 focus:bg-white"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <button
                      onClick={() => handleConfirmData()}
                      disabled={isLoadingData}
                      className="w-full rounded-lg bg-blue-900 py-4 text-sm font-black text-white shadow-lg transition-all hover:bg-blue-950 active:scale-[0.98] disabled:opacity-50"
                    >
                      {isLoadingData ? 'CONSULTANDO BASE DE DADOS...' : 'CONFIRMAR DADOS E GERAR TAXAS'}
                    </button>
                  </div>

                  {/* Skeleton / Fetched Data Confirmation */}
                  <div className="flex flex-col gap-6">
                    <AnimatePresence mode="popLayout">
                      {isLoadingData && (
                        <motion.div
                          key="skeleton"
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-8 space-y-4 overflow-hidden"
                        >
                          <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
                          <div className="h-12 w-full animate-pulse rounded-lg bg-gray-100" />
                          <div className="h-12 w-full animate-pulse rounded-lg bg-gray-100" />
                        </motion.div>
                      )}

                      {fetchedData && !isLoadingData && (
                        <motion.div
                          key="data-box"
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className={`mt-8 rounded-xl border p-6 overflow-hidden ${fetchedData.isError ? 'border-red-100 bg-red-50' : 'border-green-100 bg-green-50'}`}
                        >
                          <div className={`mb-4 flex items-center gap-2 ${fetchedData.isError ? 'text-red-700' : 'text-green-700'}`}>
                            {fetchedData.isError ? <AlertCircle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                            <span className="text-sm font-bold uppercase tracking-wider">
                              {fetchedData.isError ? 'Erro na Localização dos Dados' : 'Dados Encontrados na Receita'}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="flex flex-col min-w-0">
                              <span className={`text-[10px] font-bold uppercase ${fetchedData.isError ? 'text-red-600' : 'text-green-600'}`}>
                                {fetchedData.isError ? 'Status' : 'Razão Social'}
                              </span>
                              <span className="text-sm font-black text-gray-800 break-words">{fetchedData.companyName}</span>
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className={`text-[10px] font-bold uppercase ${fetchedData.isError ? 'text-red-600' : 'text-green-600'}`}>
                                {fetchedData.isError ? 'Ação' : 'Nome Fantasia'}
                              </span>
                              <span className="text-sm font-black text-gray-800 break-words">{fetchedData.tradeName}</span>
                            </div>
                          </div>
                          {!fetchedData.isError && (
                            <p className="mt-4 text-xs font-medium text-green-600">
                              * Por favor, confirme se os dados acima correspondem à sua empresa.
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-4 text-blue-700">
                      <Lock className="h-5 w-5 flex-shrink-0" />
                      <p className="text-sm font-medium">Seus dados estão protegidos por criptografia de ponta a ponta.</p>
                    </div>
                  </div>

                  {/* Terms & LGPD */}
                  <div className="mt-8 space-y-4 border-t border-gray-100 pt-8">
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs font-medium leading-relaxed text-gray-500">
                        Li e concordo com os <a href="#" className="text-blue-600 underline">Termos de Uso</a> e a <a href="#" className="text-blue-600 underline">Política de Privacidade (LGPD)</a> da REGULARIZA DIGITAL.
                      </span>
                    </label>
                  </div>

                  <p className="mt-8 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    A REGULARIZA DIGITAL é uma plataforma privada de assessoria contábil e jurídica, independente do Governo Federal.
                  </p>
                </motion.div>
              ) : (
                <Checkout
                  service={selectedService!}
                  formValues={formValues}
                  fetchedData={fetchedData}
                  onBack={handleBackToForm}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Right Column (33%) - Sidebar */}
          {stage !== 'checkout' && (
            <div className="lg:col-span-1">
              <div className="sticky top-28 rounded-2xl bg-white p-6 shadow-xl shadow-gray-200/50">
                <h3 className="mb-6 text-xl font-bold text-gray-950">Resumo do pedido</h3>

                {!selectedService ? (
                  <div className="mb-8 flex flex-col items-center justify-center py-8 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                      <AlertCircle className="h-8 w-8 text-gray-950" />
                    </div>
                    <p className="text-sm font-medium text-gray-500">Selecione um serviço</p>
                  </div>
                ) : (
                  <div className="mb-6">
                    <p className="mb-3 text-sm font-bold text-gray-600">{selectedCategory}</p>

                    <div className="mb-4 flex items-center justify-between rounded-lg border border-blue-400 bg-white p-4 shadow-sm">
                      <span className="text-sm font-medium text-gray-800">{selectedService.name}</span>
                      <span className="text-sm font-black text-gray-900">
                        {priceUnlocked ? (
                          `R$ ${selectedService.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                        ) : (
                          <span className="text-[10px] font-bold text-blue-600">Calculando taxas...</span>
                        )}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedService(null);
                        setStage('selection');
                        setPriceUnlocked(false);
                      }}
                      className="mb-8 flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-blue-600"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Remover Serviço
                    </button>

                    <div className="mb-6 flex items-center justify-between border-t border-gray-100 pt-6">
                      <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">TOTAL</span>
                      <span className="text-2xl font-black text-blue-500">
                        {priceUnlocked ? (
                          `R$ ${selectedService.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                        ) : (
                          '---'
                        )}
                      </span>
                    </div>

                    {stage === 'selection' ? (
                      <button
                        onClick={handleAdvanceToForm}
                        className="mb-8 hidden w-full rounded-lg bg-blue-900 py-4 text-sm font-black text-white shadow-lg transition-all hover:bg-blue-950 active:scale-[0.98] lg:block"
                      >
                        REQUISITAR ATENDIMENTO
                      </button>
                    ) : (
                      <button
                        disabled={!acceptedTerms || !fetchedData}
                        onClick={handleFinalize}
                        className={`mb-8 hidden w-full rounded-lg py-4 text-sm font-black text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] lg:block ${acceptedTerms && fetchedData ? 'bg-[#4CAF50] shadow-green-200' : 'cursor-not-allowed bg-gray-300 shadow-none'
                          }`}
                      >
                        FINALIZAR E PAGAR
                      </button>
                    )}
                  </div>
                )}

                {/* Attention Box - Styled like the reference */}
                <div className="mb-8 flex flex-col border-l-4 border-blue-500 bg-blue-50/30 p-4 rounded-r-lg">
                  <p className="mb-1 text-sm font-black text-gray-900 uppercase tracking-wider">ATENÇÃO:</p>
                  <p className="text-sm leading-relaxed text-gray-700">
                    Devido à alta demanda, hoje a Emissão de Certidões está limitada.
                  </p>
                  <p className="mt-2 text-sm font-medium text-gray-900 flex items-center gap-1">
                    Restam apenas:
                    <AnimatePresence mode="wait">
                      <motion.b
                        key={remainingServices}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.3 }}
                        className="font-black text-red-600 text-lg"
                      >
                        {remainingServices}
                      </motion.b>
                    </AnimatePresence>
                  </p>
                </div>

                {/* Card Footer Info */}
                <div className="space-y-4 border-t border-gray-100 pt-6">
                  <div className="flex items-center gap-3 text-gray-950">
                    <CreditCard className="h-4 w-4" />
                    <span className="text-xs font-medium">Pague no cartão de crédito em 12 vezes</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-950">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-xs font-medium">Garantia de serviço</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* --- Footer --- */}
      <footer className="mt-20">
        {/* Upper Footer */}
        <div className="bg-[#0a192f] py-16 text-white">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            {/* All Services Grid */}
            <div className="mb-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5 border-b border-white/5 pb-16">
              {categories.map((cat) => (
                <div key={cat.id}>
                  <h4 className="mb-6 text-xs font-black uppercase tracking-widest text-blue-400">
                    {cat.title}
                  </h4>
                  <ul className="space-y-3 text-[10px] font-medium text-gray-400">
                    {cat.items.map((item, i) => (
                      <li key={i}>
                        <button
                          onClick={() => {
                            setSelectedService(item);
                            setStage('selection');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="hover:text-white transition-colors text-left"
                        >
                          {item.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
              {/* Col 1 */}
              <div>
                <div className="mb-6 flex items-center gap-2">
                  <img 
                    src="/img/Regularize Digital -Branca.png" 
                    alt="Regulariza Digital" 
                    className="h-28 w-auto object-contain"
                  />
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Assessoria especializada para MEI e empresas em todo o Brasil.
                  Simplificamos a burocracia para você focar no que importa: seu negócio.
                </p>
              </div>

              {/* Col 2 */}
              <div>
                <h4 className="mb-6 text-sm font-bold uppercase tracking-wider">Institucional</h4>
                <ul className="space-y-3 text-xs text-gray-400">
                  <li><a href="#" className="hover:text-white">Quem Somos</a></li>
                  <li><a href="#" className="hover:text-white">Política de Privacidade</a></li>
                  <li><a href="#" className="hover:text-white">Termos de Uso</a></li>
                  <li><a href="#" className="hover:text-white">Trabalhe Conosco</a></li>
                </ul>
              </div>

              {/* Col 3 */}
              <div>
                <h4 className="mb-6 text-sm font-bold uppercase tracking-wider">Links Úteis</h4>
                <ul className="space-y-3 text-xs text-gray-400">
                  <li><a href="#" className="hover:text-white">Home</a></li>
                  <li><a href="#" className="hover:text-white">Blog</a></li>
                  <li><a href="#" className="hover:text-white">FAQ</a></li>
                  <li><a href="#" className="hover:text-white">Central de Ajuda</a></li>
                </ul>
              </div>

              {/* Col 4 */}
              <div>
                <h4 className="mb-6 text-sm font-bold uppercase tracking-wider">Atendimento</h4>
                <div className="mb-6 space-y-2 text-xs text-gray-400">
                  <p>contato@regularizadigital.com.br</p>
                  <p>0800 123 4567</p>
                  <p>Seg - Sex: 08h às 18h</p>
                </div>
                <h4 className="mb-4 text-sm font-bold uppercase tracking-wider">Redes Sociais</h4>
                <div className="flex gap-4">
                  <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-blue-600">
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-blue-600">
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-blue-600">
                    <Facebook className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Footer */}
        <div className="bg-white py-8">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
              {/* Left: Payments */}
              <div className="flex flex-col items-center md:items-start">
                <span className="mb-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Formas de Pagamento</span>
                <div className="flex flex-wrap gap-2">
                  {/* Mock Payment Icons */}
                  <div className="flex h-6 w-10 items-center justify-center rounded border border-gray-100 bg-gray-50 text-[8px] font-bold text-orange-500">VISA</div>
                  <div className="flex h-6 w-10 items-center justify-center rounded border border-gray-100 bg-gray-50 text-[8px] font-bold text-red-500">MASTER</div>
                  <div className="flex h-6 w-10 items-center justify-center rounded border border-gray-100 bg-gray-50 text-[8px] font-bold text-blue-500">ELO</div>
                  <div className="flex h-6 w-10 items-center justify-center rounded border border-gray-100 bg-gray-50 text-[8px] font-bold text-teal-500">PIX</div>
                  <div className="flex h-6 w-10 items-center justify-center rounded border border-gray-100 bg-gray-50 text-[8px] font-bold text-gray-500">BOLETO</div>
                </div>
              </div>

              {/* Center/Right: Seals */}
              <div className="flex flex-wrap items-center justify-center gap-6">
                <div className="flex items-center gap-2 rounded-full border border-gray-100 bg-gray-50 px-4 py-2">
                  <Lock className="h-4 w-4 text-green-500" />
                  <span className="text-[10px] font-bold text-gray-500">SSL BLINDADO</span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-gray-100 bg-gray-50 px-4 py-2">
                  <ShieldCheck className="h-4 w-4 text-blue-500" />
                  <span className="text-[10px] font-bold text-gray-500">SITE SEGURO</span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-4 py-2">
                  <MessageCircle className="h-4 w-4 text-green-600" />
                  <span className="text-[10px] font-bold text-green-600">WHATSAPP</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-lg font-black text-blue-600">9.3</span>
                  <span className="text-[8px] font-bold text-gray-400 uppercase">Nota de Avaliação</span>
                </div>
              </div>
            </div>

            {/* Signature */}
            <div className="mt-12 flex flex-col items-center justify-between border-t border-gray-100 pt-8 text-center md:flex-row md:text-left">
              <div className="flex items-center gap-2 opacity-30">
                <img 
                  src="/img/Regularize Digital.png" 
                  alt="Regulariza Digital" 
                  className="h-6 w-auto object-contain grayscale"
                />
              </div>
              <p className="mt-4 text-[10px] font-medium text-gray-400 md:mt-0">
                © {new Date().getFullYear()} REGULARIZA DIGITAL LTDA. Todos os direitos reservados. CNPJ: 00.000.000/0001-00
              </p>
            </div>
          </div>
        </div>
      </footer>
      {/* Mobile Fixed Summary Bar */}
      {selectedService && stage !== 'checkout' && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] lg:hidden">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="max-w-[120px] truncate text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {selectedService.name}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Total:</span>
                <span className="text-lg font-black text-blue-600">
                  {priceUnlocked ? (
                    `R$ ${selectedService.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                  ) : (
                    '---'
                  )}
                </span>
              </div>
            </div>

            <div className="flex-1">
              {stage === 'selection' ? (
                <button
                  onClick={handleAdvanceToForm}
                  className="w-full rounded-xl bg-blue-900 py-3 text-xs font-black text-white shadow-lg transition-all active:scale-[0.98]"
                >
                  REQUISITAR ATENDIMENTO
                </button>
              ) : (
                <button
                  disabled={!acceptedTerms || !fetchedData}
                  onClick={handleFinalize}
                  className={`w-full rounded-xl py-3 text-xs font-black text-white shadow-lg transition-transform active:scale-[0.98] ${acceptedTerms && fetchedData ? 'bg-[#4CAF50] shadow-green-200' : 'cursor-not-allowed bg-gray-300 shadow-none'
                    }`}
                >
                  FINALIZAR E PAGAR
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />
      <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
      <Route path="/dashboard/pedidos" element={<MeusPedidosPage />} />
      <Route path="/dashboard/dados" element={<DadosUsuarioPage />} />
      <Route path="/dashboard/indicacao" element={<IndicacaoPage />} />
      <Route path="/dashboard/comissoes" element={<ComissoesPage />} />
      <Route path="/dashboard/conta" element={<ContaCorrentePage />} />
      <Route path="/dashboard/saque" element={<SaquePage />} />
      <Route path="/dashboard/faq" element={<FAQPage />} />
    </Routes>
  );
}
