import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Crown, Sparkles, Users2, X, ShieldCheck, LogIn, UserPlus } from 'lucide-react';
import { apiClient } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { SHOW_LOGIN } from '../config/auth';

type WorkFitPlan = {
  id: 'essential' | 'team' | 'enterprise';
  name: string;
  price: string;
  features: string[];
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  buttonColor: string;
  popular?: boolean;
};

type CustomerDetails = {
  name: string;
  email: string;
  phone: string;
};

type CreateOrderResponse = {
  keyId: string;
  product: 'workfit';
  order: {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
  };
  plan: {
    id: string;
    name: string;
    amount: number;
    currency: string;
  };
};

type VerifyResponse = {
  payment: {
    product: 'workfit';
    planId: string;
    planName: string;
    amount: number;
    currency: string;
    receipt: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    customer: CustomerDetails;
    paidAt: string;
  };
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, callback: () => void) => void;
    };
  }
}

const plans: WorkFitPlan[] = [
  {
    id: 'essential',
    name: 'Essential',
    price: '49',
    features: ['Core WorkFit resources', 'Monthly group sessions', 'Wellness tips and guidance'],
    icon: Sparkles,
    accent: 'border-sky-100',
    buttonColor: 'bg-sky-950',
  },
  {
    id: 'team',
    name: 'Team',
    price: '99',
    features: ['Everything in Essential', 'Team challenges', 'Priority live support'],
    icon: Users2,
    accent: 'border-orange-200',
    buttonColor: 'bg-orange-500',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '199',
    features: ['Full WorkFit access', 'Custom workshops', 'Corporate wellness planning'],
    icon: Crown,
    accent: 'border-purple-100',
    buttonColor: 'bg-purple-600',
  },
];

const loadRazorpayScript = () =>
  new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const EMPTY_CUSTOMER: CustomerDetails = { name: '', email: '', phone: '' };

const WorkFitMembershipGate = ({
  onUnlock,
}: {
  onUnlock: (payment: VerifyResponse['payment']) => void;
}) => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<WorkFitPlan | null>(null);
  const [customer, setCustomer] = useState<CustomerDetails>(EMPTY_CUSTOMER);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
  const isWorkfitUser = storedUser?.role === 'workfit';

  const openCheckout = (plan: WorkFitPlan) => {
    if (!isWorkfitUser) {
      setError(SHOW_LOGIN ? 'Please login with a WorkFit account first.' : 'Please create a WorkFit account first.');
      return;
    }

    setCustomer({
      name: storedUser?.name || '',
      email: storedUser?.email || '',
      phone: storedUser?.phone || '',
    });
    setSelectedPlan(plan);
    setError('');
  };

  const closeCheckout = () => {
    if (!isProcessing) {
      setSelectedPlan(null);
      setError('');
    }
  };

  const handlePayment = async () => {
    if (!selectedPlan) return;

    if (!customer.name || !customer.email || !customer.phone) {
      setError('Please fill in your name, email, and phone number.');
      return;
    }

    try {
      setIsProcessing(true);
      setError('');

      const scriptReady = await loadRazorpayScript();
      if (!scriptReady) {
        throw new Error('Razorpay checkout failed to load. Please try again.');
      }

      const orderResponse = await apiClient.post<CreateOrderResponse>('/api/payment/create-order', {
        product: 'workfit',
        planId: selectedPlan.id,
        customer,
      });

      const { keyId, order, plan } = orderResponse.data;

      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'WorkFit',
        description: `${plan.name} Membership`,
        order_id: order.id,
        prefill: {
          name: customer.name,
          email: customer.email,
          contact: customer.phone,
        },
        theme: {
          color: '#0f172a',
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyResponse = await apiClient.post<VerifyResponse>('/api/payment/verify', {
              ...response,
              product: 'workfit',
              planId: selectedPlan.id,
              customer,
              receipt: order.receipt,
            });

            localStorage.setItem(
              'workfitMembership',
              JSON.stringify({
                product: 'workfit',
                planId: verifyResponse.data.payment.planId,
                planName: verifyResponse.data.payment.planName,
                email: verifyResponse.data.payment.customer.email,
                customer: verifyResponse.data.payment.customer,
                paidAt: verifyResponse.data.payment.paidAt,
              })
            );

            onUnlock(verifyResponse.data.payment);
            setSelectedPlan(null);
            setIsProcessing(false);
          } catch (verifyError: any) {
            setError(verifyError.response?.data?.message || 'Payment completed, but verification failed.');
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', () => {
        setError('Payment failed. Please try again or use a different payment method.');
      });
      razorpay.open();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Unable to start payment.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F3] pt-32 pb-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-[-8%] w-72 h-72 rounded-full bg-sky-100/50 blur-3xl" />
        <div className="absolute bottom-0 right-[-5%] w-96 h-96 rounded-full bg-orange-100/50 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto text-center mb-16 relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-orange-500 mb-4">WorkFit Membership</p>
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-sky-950 mb-6 italic">Choose Your Access Plan</h1>
        <p className="text-sky-900/60 text-lg max-w-2xl mx-auto">
          Select a plan to unlock the WorkFit experience. Once payment is successful, the full WorkFit area opens for you automatically.
        </p>
      </div>

      {!isWorkfitUser && (
      <div className="max-w-3xl mx-auto mb-10 relative z-10">
        <div className="bg-white border border-sky-100 rounded-[2rem] p-6 md:p-8 shadow-lg text-center">
          <div className="w-14 h-14 rounded-full bg-sky-50 flex items-center justify-center mx-auto mb-5">
            <LogIn className="w-7 h-7 text-orange-500" />
          </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-3">
              {SHOW_LOGIN ? 'Login Required' : 'Account Required'}
            </p>
            <h2 className="text-3xl font-serif font-bold text-sky-950 italic mb-3">
              {SHOW_LOGIN ? 'Sign in with your WorkFit account first' : 'Create your WorkFit account first'}
            </h2>
            <p className="text-sky-900/60 text-sm max-w-xl mx-auto mb-6">
              We only allow membership purchase for verified WorkFit users. Please use the same email and mobile number you used during registration.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {SHOW_LOGIN && (
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-950 px-6 py-4 text-white font-black uppercase tracking-[0.18em] text-[10px]"
                >
                  Login <LogIn className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => navigate('/signup?role=workfit')}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-sky-100 px-6 py-4 text-sky-950 font-black uppercase tracking-[0.18em] text-[10px]"
              >
                Create WorkFit Account <UserPlus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {plans.map((plan, idx) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-white rounded-[2.5rem] p-8 border-2 ${plan.accent} relative shadow-xl overflow-hidden`}
          >
            {plan.popular && (
              <div className="absolute top-6 right-6 bg-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                Most Popular
              </div>
            )}

            <div className={`w-14 h-14 rounded-2xl mb-8 flex items-center justify-center ${plan.popular ? 'bg-orange-50 text-orange-500' : 'bg-slate-50 text-sky-950'}`}>
              <plan.icon className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-serif font-bold text-sky-950 mb-2">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-black text-sky-950">₹{plan.price}</span>
              <span className="text-sky-900/40 font-bold uppercase tracking-widest text-xs">/ month</span>
            </div>

            <div className="space-y-4 mb-10">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-green-500" />
                  </div>
                  <span className="text-sm text-sky-900/60 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => openCheckout(plan)}
              disabled={!isWorkfitUser}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs text-white shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${plan.buttonColor}`}
            >
              Unlock WorkFit <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto mt-16 relative z-10">
        <div className="bg-white/80 border border-sky-100 rounded-[2rem] p-6 md:p-8 shadow-lg text-sky-900/70">
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck className="w-5 h-5 text-orange-500" />
            <p className="font-black uppercase tracking-[0.25em] text-[10px] text-sky-950">Secure access</p>
          </div>
          <p className="text-sm leading-6">
            After a successful payment, we store your membership in this browser and verify it from the backend so WorkFit stays unlocked for you.
          </p>
        </div>
      </div>

      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-white rounded-[2rem] shadow-2xl p-6 md:p-8 relative">
            <button
              onClick={closeCheckout}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors"
              aria-label="Close checkout"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-3">Secure Razorpay Checkout</p>
              <h2 className="text-3xl font-serif font-bold text-sky-950 italic mb-2">{selectedPlan.name} Membership</h2>
              <p className="text-sky-900/60 text-sm">
                Confirm your details to unlock the WorkFit membership for this account.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <label className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-950">Full Name</span>
                <input
                  type="text"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  className="w-full rounded-2xl border border-sky-100 px-4 py-3.5 text-sm outline-none focus:border-sky-400"
                  placeholder="Your full name"
                />
              </label>

              <label className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-950">Email Address</span>
                <input
                  type="email"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full rounded-2xl border border-sky-100 px-4 py-3.5 text-sm outline-none focus:border-sky-400"
                  placeholder="you@example.com"
                />
              </label>

              <label className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-950">Phone Number</span>
                <input
                  type="tel"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className="w-full rounded-2xl border border-sky-100 px-4 py-3.5 text-sm outline-none focus:border-sky-400"
                  placeholder="+91 98765 43210"
                />
              </label>
            </div>

            {error && (
              <div className="mt-5 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3">
                {error}
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={closeCheckout}
                disabled={isProcessing}
                className="flex-1 py-4 rounded-2xl border border-sky-100 text-sky-900 font-black uppercase tracking-[0.18em] text-[10px] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex-1 py-4 rounded-2xl bg-sky-950 text-white font-black uppercase tracking-[0.18em] text-[10px] shadow-xl disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : `Pay ₹${selectedPlan.price}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkFitMembershipGate;
