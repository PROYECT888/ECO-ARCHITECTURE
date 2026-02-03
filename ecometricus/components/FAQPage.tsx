
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, PieChart, Database, Zap, Users, ShieldCheck } from 'lucide-react';

const FAQItem: React.FC<{ question: string; answer: React.ReactNode }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10 group last:border-0">
      <button 
        className="w-full py-8 flex items-center justify-between text-left transition-colors group-hover:text-brand-gold"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-geometric font-bold tracking-wide uppercase">{question}</span>
        {isOpen ? <ChevronUp className="text-brand-gold" /> : <ChevronDown className="text-gray-500 group-hover:text-brand-gold" />}
      </button>
      {isOpen && (
        <div className="pb-10 text-gray-400 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
          {answer}
        </div>
      )}
    </div>
  );
};

const FAQPage: React.FC = () => {
  const faqs = [
    {
      question: "What is an Ecometricus app?",
      answer: "Ecometricus is an application (App) designed as an F&B Dashboard Metrics (KPIs) with displayed charts per outlet. It is used as a sophisticated tool for the hotel industry to drive data-driven decision making."
    },
    {
      question: "What are the main categories of metrics tracked?",
      answer: (
        <div className="grid sm:grid-cols-2 gap-8 mt-4">
          <div className="space-y-3">
            <h4 className="text-brand-gold font-bold text-sm uppercase flex items-center gap-2">
              <PieChart size={16} /> Financial Metrics
            </h4>
            <ul className="text-xs space-y-2 list-disc pl-4">
              <li>Total Sales (Food, Bev, Banquet, etc)</li>
              <li>Net Profit & Margin</li>
              <li>Food & Labor Cost Percentages</li>
              <li>Cost of Goods Sold (COGS)</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-brand-eco font-bold text-sm uppercase flex items-center gap-2">
              <Zap size={16} /> Operational Metrics
            </h4>
            <ul className="text-xs space-y-2 list-disc pl-4">
              <li>Average Check & Headcount</li>
              <li>Inventory Turnover Ratio</li>
              <li>Peak Hour Analysis</li>
              <li>Customer Retention Rate</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-brand-energy font-bold text-sm uppercase flex items-center gap-2">
              <Database size={16} /> Sustainability ESG
            </h4>
            <ul className="text-xs space-y-2 list-disc pl-4">
              <li>Food Waste (Weight & Monetary)</li>
              <li>Water & Energy Waste</li>
              <li>CO₂ Emission Reduction</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-gray-300 font-bold text-sm uppercase flex items-center gap-2">
              <Users size={16} /> Other KPIs
            </h4>
            <ul className="text-xs space-y-2 list-disc pl-4">
              <li>Online Reviews & Ratings</li>
              <li>Employee Engagement Scores</li>
              <li>Distribution Costs</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      question: "How does Ecometricus help with ESG goals?",
      answer: "Ecometricus provides daily manual input for food waste tracking by weight. Chefs log data by categories like preparation, plate waste, storage, and overproduction. The AI (Mila AI assistant) then calculates the monetary cost of wasted food, as well as water and energy savings, CO₂ reduction, and aligns data with GHG protocol and GSTC criteria."
    },
    {
      question: "Where are you getting all this data from?",
      answer: "All data is factual and extracted from your hotel's existing systems like PMS, CRM, and POS, alongside historic internal data and public reports (e.g., STR, RevPAR Guru). This information is gathered through secure APIs, with daily food waste weight being a manual input by the chef."
    },
    {
      question: "How secure is the company’s information shared through APIs with Ecometricus?",
      answer: (
        <div className="space-y-4">
          <p>
            Ecometricus uses encrypted, read-only API connections following industry-standard security protocols. Data is transmitted securely (TLS/HTTPS), access is role-based, and no sensitive credentials are stored in plain text.
          </p>
          <p>
            We collect only the data required for analytics, never resell it, and clients retain full ownership and control of their information at all times.
          </p>
        </div>
      )
    },
    {
      question: "How does Ecometricus provide actionable insights?",
      answer: "The app includes 'Suggestion' windows with next month's actions to improve metrics. An 'Alert' window triggers when percentage metrics deviate from pre-established parameters or industry standards, often with AI-suggested actions for food cost, inventory, or occupancy deviations."
    },
    {
      question: "How often is the data updated?",
      answer: "All charts and information metrics are updated every 24 hours at 12 AM based on the user's local time zone, ensuring you always have the most current insights for daily operational management."
    },
    {
      question: "What kind of reports does Ecometricus generate?",
      answer: "Ecometricus delivers 100% digital, real-time reports to reduce paper use and ensure accuracy. Reports are automatically organized as daily, weekly, monthly, or quarterly, enabling fast decision-making and full transparency. Operational sustainability reports can be shared with staff and guests, while outlets comparative KPIs and benchmarking reports are generated for management and HQ, supporting consistent performance tracking across locations."
    },
    {
      question: "Are there different access levels for staff?",
      answer: "Yes. Ecometricus supports distinct user roles: Admin Privilege for full access and benchmarking, and Supervisor Privilege (including Chef Privilege for ESG input and Manager Privilege for labor and forecast input)."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-geometric font-bold mb-4 uppercase tracking-widest">Ecometricus KPIs</h1>
        <p className="text-brand-gold text-sm font-bold uppercase tracking-[0.3em]">Knowledge Base & FAQ</p>
      </div>
      
      {/* Block container with consistent styling */}
      <div className="bg-brand-eco/5 border border-brand-gold/30 rounded-[40px] p-8 md:p-12 shadow-2xl">
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
