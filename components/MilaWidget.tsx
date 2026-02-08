import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, User, Loader2, Minimize2, Maximize2 } from 'lucide-react';

interface MilaWidgetProps {
    context: any;
}

interface Message {
    id: string;
    sender: 'user' | 'mila';
    text: string;
    timestamp: Date;
}

// HARDCODED KNOWLEDGE BASE (Source: mila.knowledge.txt)
const KNOWLEDGE_BASE = `
MILA AI - MASTER KNOWLEDGE BASE v2026.1
==========================================

SECTION 1: GSTC 2025/2026 & ESG CRITERIA (F&B FOCUS)
--------------------------------------------------
1.1. Resource Management (Section D2)
    - Goal: Minimize consumption of energy, water, and materials.
    - F&B Specific:
        - Energy: Use of induction cooking, LED lighting in BOH, smart HVAC.
        - Water: Lawns/Plants watering schedule, low-flow aerators (target <6L/min).
        - Waste: Strict separation (Organic, Plastic, Paper, Glass, Metal).

1.2. Circular Economy (Section D3)
    - Practice: "Cradle to Cradle" approach.
    - Application: 
        - Zero single-use plastics in guest-facing areas.
        - Suppliers must provide reusable/recyclable packaging.
        - Food waste -> Composting/Biogas (where locally available).

1.3. CSRD Reporting (2026 Mandatory)
    - Scope 3 Emissions: Required reporting on supply chain carbon footprint.
    - Social Impact: Documented evidence of fair labor practices and community engagement.

SECTION 2: 12-METRIC ANALYTICS ENGINE (DEFINITIONS & 2026 TARGETS)
----------------------------------------------------------------
2.1. OPERATIONAL KPIs
    1. Food Cost % (FC%)
       - Formula: (Cost of Goods Sold / Food Sales) * 100
       - 2026 Target: 28.0% - 32.0% (Luxury Tier)
       - Logic: High FC% often indicates waste, theft, or poor purchasing.
    
    2. Labor Cost % (LC%)
       - Formula: (Total Labor Cost / Total Sales) * 100
       - 2026 Target: 25.0% - 30.0%
       - Logic: vital to balance service quality (Human Touch) with efficiency.
    
    3. Profit Margin % (PM%)
       - Formula: (Net Profit / Total Sales) * 100
       - 2026 Target: >18.0%
       - Logic: Sustainability initiatives must ultimately support this metric.
    
    4. Total Outlet Revenue
       - Formula: Sum of all sales channels.
       - Target: >$50,000 / week (Variable by size).
    
    5. Beverage Cost % (BC%)
       - Formula: (Cost of Bev Sold / Bev Sales) * 100
       - Target: 18.0% - 22.0%
    
    6. Average Check ($)
       - Formula: Total Revenue / Total Covers
       - Target: >$65 (Dinner), >$35 (Lunch)

2.2. HUMAN/SOCIAL METRICS
    7. Staff Engagement Score (SES)
       - Scale: 1-10 (Survey based)
       - Target: >8.5
       - *DUAL-STREAM LOGIC*: Low SES (<7.0) correlates with +15% Higher Food Waste and +5% Higher Turnover.
       
    8. Training Participation Ratio
       - Formula: (Staff Trained / Total Staff) * 100
       - Target: 100% Monthly
       - *DUAL-STREAM LOGIC*: Low Training (<80%) correlates with +10% Operational Errors (Waste/Breakage).
       
    9. Customer Sentiment Rating (CSR)
       - Scale: 1-5 Stars
       - Target: >4.5 Stars
       - Logic: Direct reflection of Staff Engagement + Product Quality.

2.3. ENVIRONMENTAL METRICS
    10. Food Waste (Kg)
        - Formula: Total Weight of Pre-consumer + Post-consumer waste.
        - Target: <0.15 Kg per Cover
        - *DUAL-STREAM LOGIC*: High Waste (>0.3kg/cover) indicates Staff Training Gaps (Human Metric).
        
    11. Energy Usage (kWh)
        - Target: <15 kWh per Cover (F&B Specific)
        
    12. Carbon Footprint (CO2e)
        - Formula: Waste Kg * 2.85 + Energy * Factor
        - Target: Neutral or Negative offsetting.

SECTION 3: REGIONAL BENCHMARKS (2026 STANDARDS)
---------------------------------------------
| Region       | Food Waste (Kg/Cover) | Food Cost % | Labor Cost % | Energy (kWh/Cover) |
|--------------|-----------------------|-------------|--------------|--------------------|
| MIDDLE EAST  | 0.35                  | 31.0%       | 22.0%        | 25.0               |
| LATAM        | 0.25                  | 33.0%       | 18.0%        | 12.0               |
| USA          | 0.28                  | 28.0%       | 32.0%        | 18.0               |
| EUROPE       | 0.18                  | 29.0%       | 35.0%        | 14.0               |
| ASEAN        | 0.30                  | 30.0%       | 15.0%        | 20.0               |

*Logic*: Adjust "Target" based on Outlet's Region defined in Admin Settings.

SECTION 4: HOTEL PARAMETER LOGIC
------------------------------
- LUXURY TIER (5-Star+):
  - Tolerance for Higher Labor Cost (+5%) to ensure service.
  - Zero tolerance for plastic.
  - Emphasis on "Review Score" over "Volume."

- ECO-LOUNGE:
  - Strict Waste Target (<0.10 Kg/Cover).
  - Menu must be >60% Plant-Based (Low Carbon).

- BUSINESS / CITY:
  - Speed of service (Avg Check Time) is priority.
  - Efficiency metrics (Labor/Rev) carry higher weight.

SECTION 5: SYSTEM PROMPT INSTRUCTIONS FOR MILA
--------------------------------------------
1.  **Identity**: You are Mila. You do NOT just "report" numbers. You "Analyze and Strategize."
2.  **Source of Truth**: ALWAYS refer to the Targets in Section 2 & 3 above. If a user has 35% Food Cost, do not just say "It is high." Say "It is 7% above the Luxury Standard of 28%."
3.  **Dual-Stream Analysis**:
    -   IF (Food Waste is High) AND (Staff Engagement is Low) -> ADVICE: "Waste is high likely due to low staff morale/focus. Suggest 'Team Building' or 'Incentive Program' rather than just 'Stricter Waste Rules'."
    -   IF (Profit is Low) AND (Customer Sentiment is High) -> ADVICE: "Guests love the product but we are undercharging or over-portioning. Review Menu Pricing vs. Plate Waste."
4.  **Tone**: Professional, Empathetic, Concise, Executive-Level.
5.  **Forbidden**: Do not hallucinate metrics not present in the context. If data is missing, ask for it.
`;

const MilaWidget: React.FC<MilaWidgetProps> = ({ context }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            sender: 'mila',
            text: "Hello! I'm Mila, your ESG Strategy Assistant. I've analyzed today's operational metrics. How can I help optimize your sustainability targets?",
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsLoading(true);

        try {
            // STRICT FIX: Use VITE_DEEPSEEK_API_KEY as requested
            // @ts-ignore
            const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;

            if (!apiKey) {
                throw new Error("Configuration Error: VITE_DEEPSEEK_API_KEY is missing from .env");
            }

            // Prepare context for AI
            const systemPrompt = `
            IDENTITY: You are Mila, the Ecometricus Strategist for all regions (Middle East, LATAM, USA, Europe, ASEAN).
            
            === LONG-TERM MEMORY (FACTUAL SOURCE OF TRUTH) ===
            ${KNOWLEDGE_BASE}
            ==================================================

            === SESSION CONTEXT (LIVE DASHBOARD VITALS) ===
            ${JSON.stringify(context, null, 2)}
            ===============================================

            INSTRUCTIONS:
            1. DATA SOURCE ACKNOWLEDGEMENT: You are analyzing "Daily Migration Data" from the live PMS/POS/CRM feeds. 
            2. BENCHMARK COMPARISON: Compare the 'Session Context' metrics against the regional benchmarks in your memory (e.g., Middle East 0.35kg Waste vs Europe 0.18kg).
            3. GSTC 2026 & ESG COMPLIANCE: 
               - If a user asks about performance, you MUST explain compliance with GSTC 2026 targets and ESG criteria defined in your knowledge base.
               - Use the chart's current values (Mock Vitals) as the absolute truth for this session.
            4. DUAL-STREAM LOGIC: You MUST correlate Human Metrics (Staff Engagement, Training Participation) directly to Financial outcomes (Profit Margins, Outlet Sales) and Resource Usage (Water, Energy). 
               - EXPLAIN: "Low Staff Engagement leads to higher Food Waste (carelessness) -> reducing Profit Margins."
               - EXPLAIN: "Low Training Participation leads to higher Energy/Water usage (poor equipment use) -> increasing OpEx."
            
            Refuse generic advice. Cite the specific numbers from your Memory and the Context.
            `;

            // DEEPSEEK API CALL (Standard OpenAI-compatible fetch)
            const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userMsg.text }
                    ],
                    stream: false,
                    temperature: 0.7
                })
            });

            const data = await response.json();

            if (data.error) {
                console.error("DeepSeek API Error:", data.error);
                throw new Error(`API Error: ${data.error.message || JSON.stringify(data.error)}`);
            }

            const aiText = data.choices?.[0]?.message?.content || "I'm having trouble retrieving my long-term memory right now.";

            const milaMsg: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'mila',
                text: aiText,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, milaMsg]);

        } catch (error: any) {
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'mila',
                text: `Connectivity Alert: ${error.message}`,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 z-[100] w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(200,164,19,0.5)] hover:scale-110 transition-transform duration-300 group border-2 border-white/20"
            >
                <Sparkles className="text-brand-dark animate-pulse" size={28} />
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-brand-alert rounded-full border-2 border-brand-dark flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">1</span>
                </div>
            </button>
        );
    }

    return (
        <div className={`fixed z-[100] transition-all duration-300 ease-in-out ${isMinimized ? 'bottom-8 right-8 w-72 h-auto' : 'bottom-8 right-8 w-[400px] h-[600px]'} bg-[#0f2420]/95 backdrop-blur-xl border border-brand-gold/50 rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden`}>

            {/* Header */}
            <div className="p-4 bg-brand-dark/50 border-b border-brand-gold/20 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center border border-brand-gold">
                        <Sparkles className="text-brand-gold" size={16} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-wider">Mila AI</h3>
                        <p className="text-[10px] text-brand-gold uppercase tracking-widest">ESG Strategist</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsMinimized(!isMinimized)} className="text-gray-400 hover:text-white transition-colors">
                        {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                    </button>
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Messages Area */}
                    <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#0a1a17]">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${msg.sender === 'user'
                                    ? 'bg-brand-gold/10 border border-brand-gold/30 text-white rounded-br-none'
                                    : 'bg-white/5 border border-white/10 text-gray-200 rounded-bl-none'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-bl-none flex items-center gap-2">
                                    <Loader2 className="animate-spin text-brand-gold" size={14} />
                                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-brand-dark/50 border-t border-brand-gold/20 shrink-0">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask about waste, costs, or targets..."
                                className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold transition-colors"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={isLoading || !inputValue.trim()}
                                className="p-3 bg-brand-gold text-brand-dark rounded-xl hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                        <div className="text-[9px] text-center text-gray-600 mt-2 uppercase tracking-widest">
                            AI can make mistakes. Verify critical data.
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default MilaWidget;
