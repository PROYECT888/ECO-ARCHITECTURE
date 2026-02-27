# Supervisor Dashboard: Audit Logic & Triage System

## 1. Triage System (Red/Green Alerts)
The dashboard uses a dual-layer alert system to prioritize operational focus:

### A. Report Level (Static Logic)
*   **Deviation Detect (Red)**: Triggered immediately when a metric exceeds its benchmark.
    *   *Example*: Food Cost > 29.0%.
    *   *Visual*: Flashing "ATTENTION" header, Dark Amber border.
*   **Recommended Action (Green)**: A hard-coded, immediate operational fix.
    *   *Example*: "Check portion control."

### B. Component Logic
*   **`ReportAlertBoxKPI`**: Dedicated component for Financial/Operational alerts (e.g., Food Cost, Labor).
*   **`ReportAlertBox`**: Dedicated component for Sustainability/Environmental alerts (e.g., Waste, CO2).

## 2. Mila Strategic Widget (AI Reasoning)
Mila serves as the "Auditor" and "Strategist," differing from the static alerts:

### A. Core Logic
*   **Persona**: Executive Consultant (Auditor).
*   **Input Handling**: Natural Language Processing (NLP) captures name and intent without regex scripts.
*   **Knowledge Base**: Uses a "Secret Reference" text file for regional benchmarking (e.g., ASEAN averages).

### B. Response Structure (Strict Markdown)
To prevent "knowledge dumps," Mila enforces a strict executive format:
1.  **Acknowledgement**: 1 Sentence (Natural, proactive).
2.  **Strategic Analysis**: 3 Bullet Points (Double-spaced, Bold Headers).
    *   *Root Cause*
    *   *Regional Insight* (Context from Knowledge Base)
    *   *Actionable Step* (Human-centric intervention)

## 3. Deployment Notes
*   **Environment**: Requires `VITE_DEEPSEEK_API_KEY`.
*   **Architecture**: Built on React + TypeScript + Tailwind CSS.
