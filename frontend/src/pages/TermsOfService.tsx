import React from 'react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F3] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-2xl">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-sky-950 mb-8">Terms of Service</h1>
          <div className="prose prose-sky max-w-none text-sky-800/80 space-y-6">
            <p className="font-bold text-sky-900">Last Updated: May 2026</p>
            
            <h2 className="text-2xl font-bold text-sky-950 mt-12 mb-4">1. Acceptance of Terms</h2>
            <p>By accessing or using the LiveFit platform and services, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.</p>
            
            <h2 className="text-2xl font-bold text-sky-950 mt-12 mb-4">2. User Accounts</h2>
            <p>When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
            
            <h2 className="text-2xl font-bold text-sky-950 mt-12 mb-4">3. Subscription and Billing</h2>
            <p>Some parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis depending on the type of subscription plan you select.</p>
            
            <h2 className="text-2xl font-bold text-sky-950 mt-12 mb-4">4. Limitation of Liability</h2>
            <p>In no event shall LiveFit, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
            
            <h2 className="text-2xl font-bold text-sky-950 mt-12 mb-4">5. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at: Workfitbylivefit@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
