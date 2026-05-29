import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../lib/env';


const countries = [
  "United States", "United Kingdom", "Canada", "Australia", "India", "Germany", "France", "Japan", "Singapore", "United Arab Emirates", 
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Austria", "Azerbaijan", 
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", 
  "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", 
  "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", 
  "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", 
  "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "Gabon", "Gambia", "Georgia", "Ghana", 
  "Greece", "Grenada", "Guatemala", "Guinea", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "Indonesia", 
  "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Jordan", "Kazakhstan", "Kenya", "Kiribati", 
  "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", 
  "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", 
  "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", 
  "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", 
  "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", 
  "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Samoa", 
  "San Marino", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", 
  "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", 
  "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", 
  "Tuvalu", "Uganda", "Ukraine", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", 
  "Zambia", "Zimbabwe"
];

const timezones = [
  "UTC-12:00 Baker Island", "UTC-11:00 Niue, Samoa", "UTC-10:00 Hawaii-Aleutian Time",
  "UTC-09:00 Alaska Standard Time", "UTC-08:00 Pacific Time (US & Canada)",
  "UTC-07:00 Mountain Time (US & Canada)", "UTC-06:00 Central Time (US & Canada)",
  "UTC-05:00 Eastern Time (US & Canada)", "UTC-04:00 Atlantic Time (Canada)",
  "UTC-03:00 Argentina, Brazil", "UTC-02:00 South Georgia", "UTC-01:00 Azores, Cape Verde",
  "UTC+00:00 Greenwich Mean Time", "UTC+01:00 Central European Time",
  "UTC+02:00 Eastern European Time", "UTC+03:00 Moscow Time", "UTC+03:30 Iran Standard Time",
  "UTC+04:00 Gulf Standard Time", "UTC+04:30 Afghanistan Time", "UTC+05:00 Pakistan Standard Time",
  "UTC+05:30 Indian Standard Time", "UTC+05:45 Nepal Time", "UTC+06:00 Bangladesh Standard Time",
  "UTC+06:30 Myanmar", "UTC+07:00 Indochina Time", "UTC+08:00 China Standard Time",
  "UTC+08:45 Southeastern Western Australia", "UTC+09:00 Japan Standard Time",
  "UTC+09:30 Australian Central Standard Time", "UTC+10:00 Australian Eastern Standard Time",
  "UTC+11:00 Solomon Islands", "UTC+12:00 New Zealand Standard Time", "UTC+13:00 Tonga", "UTC+14:00 Line Islands"
];

const Inquiry = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    workEmail: '',
    mobileNumber: '',
    industry: '',
    designation: '',
    companyName: '',
    country: '',
    city: '',
    preference: '',
    timezone: '',
    employeeStrength: '',
    jobFunction: '',
    requirement: ''
  });
  const [isNotRobot, setIsNotRobot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate((location.state as { from?: string } | null)?.from || '/workfit');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!isNotRobot) {
      alert("Please verify that you are not a robot.");
      return;
    }

    setLoading(true);
    try {
      const apiUrl = API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/contact/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'workfit',
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.workEmail,
          phone: formData.mobileNumber,
          message: `Company: ${formData.companyName}\nIndustry: ${formData.industry}\nDesignation: ${formData.designation}\nCountry: ${formData.country}\nCity: ${formData.city}\nPreference: ${formData.preference}\nPreferred Time Zone: ${formData.timezone}\nEmployees: ${formData.employeeStrength}\nJob Function: ${formData.jobFunction}\nRequirement: ${formData.requirement}`
        })
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || 'Unable to send inquiry right now.');
      }
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitError(err instanceof Error ? err.message : 'Unable to send inquiry right now.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#0a0510] px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-[#150f1c] p-12 rounded-lg shadow-2xl text-center border border-white/10"
        >
          <div className="w-20 h-20 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-serif text-white mb-4 font-bold tracking-widest uppercase">Request Sent</h2>
          <p className="text-white/60 mb-8 leading-relaxed text-sm">
            Thank you for your inquiry. Our corporate wellness team will reach out to you shortly.
          </p>
          <button 
            onClick={goBack}
            className="w-full py-4 bg-white text-[#0a0510] rounded font-bold hover:bg-gray-200 transition-all uppercase tracking-widest text-xs"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  const inputClass = "w-full bg-transparent border border-white/20 text-white/90 p-3 outline-none focus:border-white/60 transition-colors text-sm font-light";
  const labelClass = "block text-white font-semibold uppercase tracking-[0.15em] text-[10px] mb-2";

  return (
    <div className="min-h-screen bg-[#07030a] pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10 border-b border-white/10 pb-8">
          <button
            type="button"
            onClick={goBack}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white/70 transition-colors hover:border-white/40 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h1 className="text-3xl md:text-5xl font-sans text-white font-bold tracking-[0.3em] md:tracking-[0.3em] uppercase">
            Let's Talk About It
          </h1>
        </div>

        {/* Form Container */}
        <div className="border border-white/20 p-6 md:p-10 bg-gradient-to-br from-[#0a0510] to-[#12081c]">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className={labelClass}>First Name</label>
                <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} placeholder="Ex. John" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Last Name</label>
                <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} placeholder="Smith" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Work E-Mail</label>
                <input type="email" name="workEmail" required value={formData.workEmail} onChange={handleChange} placeholder="johnsmith@example.com" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Mobile Number</label>
                <input type="tel" name="mobileNumber" required value={formData.mobileNumber} onChange={handleChange} placeholder="+11234567890" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Industry</label>
                <select name="industry" required value={formData.industry} onChange={handleChange} className={`${inputClass} appearance-none bg-[#0a0510]`}>
                  <option className="bg-[#0a0510] text-white" value="" disabled>Select Industry</option>
                  <option className="bg-[#0a0510] text-white" value="Technology">Technology</option>
                  <option className="bg-[#0a0510] text-white" value="Finance">Finance</option>
                  <option className="bg-[#0a0510] text-white" value="Healthcare">Healthcare</option>
                  <option className="bg-[#0a0510] text-white" value="Education">Education</option>
                  <option className="bg-[#0a0510] text-white" value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Your Designation</label>
                <input type="text" name="designation" required value={formData.designation} onChange={handleChange} placeholder="Your Designation" className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Company Name</label>
              <input type="text" name="companyName" required value={formData.companyName} onChange={handleChange} placeholder="Company Name" className={inputClass} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className={labelClass}>Country</label>
                <select name="country" required value={formData.country} onChange={handleChange} className={`${inputClass} appearance-none bg-[#0a0510]`}>
                  <option className="bg-[#0a0510] text-white" value="" disabled>Select Country</option>
                  {countries.map((country, idx) => (
                    <option key={idx} className="bg-[#0a0510] text-white" value={country}>{country}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>City</label>
                <input type="text" name="city" required value={formData.city} onChange={handleChange} placeholder="Ex. New York" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Preference</label>
                <select name="preference" required value={formData.preference} onChange={handleChange} className={`${inputClass} appearance-none bg-[#0a0510]`}>
                  <option className="bg-[#0a0510] text-white" value="" disabled>Select Preference</option>
                  <option className="bg-[#0a0510] text-white" value="Onsite">Onsite</option>
                  <option className="bg-[#0a0510] text-white" value="Remote">Remote</option>
                  <option className="bg-[#0a0510] text-white" value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Preferred Time Zone</label>
                <select name="timezone" required value={formData.timezone} onChange={handleChange} className={`${inputClass} appearance-none bg-[#0a0510]`}>
                  <option className="bg-[#0a0510] text-white" value="" disabled>Select Time Zone</option>
                  {timezones.map((tz, idx) => (
                    <option key={idx} className="bg-[#0a0510] text-white" value={tz}>{tz}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Employee Strength</label>
                <select name="employeeStrength" required value={formData.employeeStrength} onChange={handleChange} className={`${inputClass} appearance-none bg-[#0a0510]`}>
                  <option className="bg-[#0a0510] text-white" value="" disabled>Select Employee Strength</option>
                  <option className="bg-[#0a0510] text-white" value="1-50">1 - 50</option>
                  <option className="bg-[#0a0510] text-white" value="51-200">51 - 200</option>
                  <option className="bg-[#0a0510] text-white" value="201-500">201 - 500</option>
                  <option className="bg-[#0a0510] text-white" value="500+">500+</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Job Function</label>
                <select name="jobFunction" required value={formData.jobFunction} onChange={handleChange} className={`${inputClass} appearance-none bg-[#0a0510]`}>
                  <option className="bg-[#0a0510] text-white" value="" disabled>--None--</option>
                  <option className="bg-[#0a0510] text-white" value="HR">Human Resources</option>
                  <option className="bg-[#0a0510] text-white" value="Operations">Operations</option>
                  <option className="bg-[#0a0510] text-white" value="Management">Management</option>
                  <option className="bg-[#0a0510] text-white" value="Employee">Employee</option>
                </select>
              </div>
            </div>



            <div>
              <label className={labelClass}>Briefly describe your corporate requirement</label>
              <textarea 
                name="requirement" 
                required 
                value={formData.requirement} 
                onChange={handleChange}
                rows={4}
                placeholder="Enter your message here" 
                className={`${inputClass} resize-none`}
              ></textarea>
            </div>

            {/* Real reCAPTCHA */}
            <div className="flex items-center gap-4 mt-6">
              <ReCAPTCHA
                sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                onChange={(token) => setIsNotRobot(!!token)}
                theme="dark"
              />
            </div>

            {submitError && (
              <div className="rounded-md border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
                {submitError}
              </div>
            )}

            <div className="mt-10">
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-white hover:bg-gray-100 text-[#ff4b72] rounded-md font-bold uppercase tracking-[0.2em] text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Request a Demo'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Inquiry;
