
import React from 'react';
import { Target, Cpu, Scale, AlertTriangle, BarChart3, GraduationCap, Microscope, ShieldCheck, Globe2, BookOpen, Award, Trash2, Droplets, Zap, Cloud } from 'lucide-react';

const AboutPage: React.FC = () => {
  const gorillaMetrics = [
    {
      value: "50-70%",
      label: "Of a hotel's total",
      category: "Solid Waste.",
      icon: <Trash2 size={32} className="text-[#152E2A]" />,
      highlight: "Solid Waste."
    },
    {
      value: "15-30%",
      label: "Of total",
      category: "Water Consumption.",
      icon: <Droplets size={32} className="text-[#152E2A]" />,
      highlight: "Water Consumption."
    },
    {
      value: "15-25%",
      label: "Of total",
      category: "Energy Consumption.",
      icon: <Zap size={32} className="text-[#152E2A]" />,
      highlight: "Energy Consumption."
    },
    {
      value: "20-35%",
      label: "Of the indirect",
      category: "Carbon Footprint (Scope 3).",
      icon: <Cloud size={32} className="text-[#152E2A]" />,
      highlight: "Carbon Footprint (Scope 3)."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 sm:py-32">
      {/* Hero Vision Section */}
      <div className="text-center mb-24 max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-geometric font-bold mb-8 uppercase tracking-tight">The Vision</h1>
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.5em] text-brand-gold font-bold mb-8">Powered by Us+AI Bureau</p>
        <p className="text-xl sm:text-2xl text-gray-300 font-light leading-relaxed">
          Empowering the hotel Food & Beverage industry with a comprehensive, intelligent platform for optimizing performance and enhancing profitability.
        </p>
      </div>

      {/* 800-Pound Gorilla Section - Strict Adherence to Visual Reference */}
      <div className="mb-32 bg-brand-dark overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-geometric font-bold mb-8 text-brand-gold leading-tight">
            The 800-Pound Gorilla is in the Kitchen.
          </h2>
          <p className="text-gray-300 text-lg sm:text-xl font-light leading-relaxed mb-16">
            While guest-facing initiatives are important, the F&B department is consistently the largest contributor to a hotel's environmental footprint—a fact often under-measured in ESG reporting.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {gorillaMetrics.map((m, i) => (
              <div key={i} className="flex items-center gap-6 p-4 pr-10 rounded-full bg-[#1b3a35] border border-white/5 shadow-2xl group transition-all hover:bg-[#21443f]">
                {/* Circle Icon Container - Light Green Pill style */}
                <div className="shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-brand-eco border-4 border-[#2d5c55] flex items-center justify-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] group-hover:scale-105 transition-transform duration-500">
                  {m.icon}
                </div>
                {/* Text Section - All White Metrics */}
                <div className="flex flex-col">
                  <div className="text-4xl sm:text-5xl font-geometric font-bold text-white leading-none mb-1">
                    {m.value}
                  </div>
                  <div className="text-xs sm:text-sm text-white/90 font-light leading-tight">
                    {m.label} <span className="font-bold block">{m.highlight}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
            Source: Sustainable Hospitality Alliance, Greenview.
          </div>
        </div>
      </div>

      {/* Why F&B Remains a Critical ESG Gap */}
      <div className="mb-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-geometric font-bold text-brand-gold uppercase tracking-tight">
            Why F&B Remains a Critical ESG Gap.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Actionable Insights",
              icon: <BarChart3 className="text-brand-gold" size={32} />,
              desc: "Transforming raw financial data into clear visualizations, enabling hotels to make informed decisions proactively."
            },
            {
              title: "Mila AI Assistant",
              icon: <Cpu className="text-brand-eco" size={32} />,
              desc: "Integrating Generative AI to offer intelligent suggestions and alerts, facilitating goal achievement."
            },
            {
              title: "ESG Operationalization",
              icon: <Scale className="text-brand-energy" size={32} />,
              desc: "Tracking the monetary implications of food, water, and energy waste to achieve environmental stewardship."
            }
          ].map((pillar, i) => (
            <div key={i} className="aspect-[4/5] sm:aspect-[3/4] md:aspect-[4/5] p-8 sm:p-12 bg-brand-eco/5 border border-brand-gold/30 rounded-3xl hover:bg-brand-eco/10 transition-all duration-500 flex flex-col justify-center items-center text-center gap-8 group">
              <div className="w-20 h-20 bg-brand-dark rounded-2xl flex items-center justify-center shrink-0 border border-brand-gold/20 shadow-xl group-hover:scale-110 transition-transform">
                {pillar.icon}
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-geometric font-bold leading-tight text-brand-gold">{pillar.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Differentiator Section */}
      <div className="mb-32">
        <div className="bg-brand-eco/5 border border-brand-gold/30 rounded-[40px] p-8 sm:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <h2 className="text-3xl sm:text-5xl font-geometric font-bold leading-tight">ESG Scope 3: <span className="text-brand-gold">The Differentiator</span></h2>
              <div className="space-y-6 text-gray-400 leading-relaxed text-base sm:text-lg">
                <p>
                  According to the <strong className="text-white">GHG Protocol</strong>, food waste falls under <strong className="text-white">Scope 3</strong> ("Waste Generated in Operations"). Despite its impact, it is often an industry blind spot.
                </p>
                <p>
                  Ecometricus turns ESG from reporting into real-time results.
                </p>
              </div>
              <ul className="space-y-4">
                {[
                  "Track daily waste by outlet and category",
                  "Calculate cost, carbon, water, and energy impact",
                  "Align with GSTC sustainability criteria",
                  "Educational Webinar & Workshop training"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-brand-gold">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-eco shadow-[0_0_10px_rgba(119,177,57,0.5)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4 aspect-square max-w-md mx-auto w-full">
              <div className="p-8 bg-brand-dark border border-brand-gold/20 rounded-3xl flex flex-col justify-center items-center text-center hover:border-brand-gold transition-colors">
                <div className="text-xs uppercase tracking-[0.3em] text-brand-gold mb-2 font-black">Scope 1</div>
                <div className="text-[10px] font-light text-gray-500 italic uppercase">Direct</div>
              </div>
              <div className="p-8 bg-brand-dark border border-brand-gold/20 rounded-3xl flex flex-col justify-center items-center text-center hover:border-brand-gold transition-colors">
                <div className="text-xs uppercase tracking-[0.3em] text-brand-gold mb-2 font-black">Scope 2</div>
                <div className="text-[10px] font-light text-gray-500 italic uppercase">Energy</div>
              </div>
              <div className="p-8 bg-brand-eco/10 border-2 border-brand-eco rounded-3xl col-span-2 shadow-[0_15px_40px_rgba(119,177,57,0.1)] flex flex-col justify-center items-center text-center">
                <div className="text-xs uppercase tracking-[0.5em] text-brand-eco mb-4 font-black">Scope 3: Operations</div>
                <div className="text-sm sm:text-base text-gray-200 font-bold uppercase tracking-tight">Real-time tracking and reporting.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Industry Insights Section - Matching Pillar Format */}
      <section className="pt-20 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-geometric font-bold text-brand-gold uppercase tracking-tight mb-6">
            Industry Insights
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Providing intelligence that meets global standards and pushes the boundaries of luxury hospitality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "GHG Protocol",
              icon: <Globe2 className="text-brand-eco" size={32} />,
              desc: "Compliance with greenhouse gas accounting and reporting standards for operational transparency."
            },
            {
              title: "GSTC Framework",
              icon: <Award className="text-brand-gold" size={32} />,
              desc: "Direct alignment with the Global Sustainable Tourism Council criteria for luxury hotels."
            },
            {
              title: "UN SDGs",
              icon: <Target className="text-brand-energy" size={32} />,
              desc: "Measurable contributions toward goals 6, 7, 12, and 13 for international sustainability targets."
            },
            {
              title: "Case Analysis",
              icon: <BookOpen className="text-white" size={32} />,
              desc: "Real-time benchmarking against luxury competitors to ensure continued market leadership."
            }
          ].map((item, i) => (
            <div key={i} className="aspect-[4/5] p-8 bg-brand-eco/5 border border-brand-gold/30 rounded-3xl hover:bg-brand-eco/10 transition-all duration-500 flex flex-col justify-center items-center text-center gap-8 group">
              <div className="w-20 h-20 bg-brand-dark rounded-2xl flex items-center justify-center shrink-0 border border-brand-gold/20 shadow-xl group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-geometric font-bold leading-tight text-brand-gold uppercase tracking-wider">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
