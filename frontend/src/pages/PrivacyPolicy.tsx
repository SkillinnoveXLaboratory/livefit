import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-2xl">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-sky-950 mb-8">Privacy Policy</h1>
          <div className="prose prose-sky max-w-none text-sky-800/80 space-y-6">
            <p className="font-bold text-sky-900">Last Updated: May 2026</p>
            
            <h2 className="text-2xl font-bold text-sky-950 mt-12 mb-4">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, and other information you choose to provide.</p>
            
            <h2 className="text-2xl font-bold text-sky-950 mt-12 mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect about you to provide, maintain, and improve our services, such as to facilitate payments, send receipts, provide products and services you request, develop new features, provide customer support, develop safety features, authenticate users, and send product updates and administrative messages.</p>
            
            <h2 className="text-2xl font-bold text-sky-950 mt-12 mb-4">3. Data Security</h2>
            <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
            
            <h2 className="text-2xl font-bold text-sky-950 mt-12 mb-4">4. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at: Workfitbylivefit@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
