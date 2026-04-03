# GigShield Demo Video Guide

This document breaks down the core architecture of the GigShield Insurance OS. It is specifically designed to provide you with a clear, structural explanation of how the AI engines operate so you can explain them smoothly during your demo presentation or pitch.

---

## 1. Dynamic Risk Assessment (The Premium Engine)

**The Problem:** Traditional insurance relies on static historical data, making it too expensive or inflexible for the gig economy.

**The GigShield Solution:** We use real-time, hyper-local dynamic pricing. 

### How It Works During Registration:
When a worker registers, the app captures their primary delivery zone, vehicle type, hours worked, and experience. Behind the scenes, the **`PremiumEngine`** cross-references this against our **Zone Risk Profile Matrix**.

- **Hyper-Local Risk:** A driver operating in "Zone A" (high flood risk) will see a different premium than someone in "Zone B" (low risk, high traffic).
- **Behavioral Multipliers:** The algorithm calculates a Base Premium and applies risk weights out of 1.0. For example:
  - High order volume (15+ orders/day) increases risk exposure.
  - Using a 2-Wheeler scales risk differently than a heavy van.
- **Sustained Hazard Economics:** (The *10-day Rain Edge Case*). If a zone is hit by continuous severe weather, traditional logic would spike premiums infinitely, bankrupting the worker. Instead, our engine applies a **Logarithmic Penalty Curve**. The system recognizes the systemic hazard, gently capping the premium surge, but automatically enforces **Coverage Constraints** (e.g., lowering maximum daily insurable hours to keep drivers safely off the roads during storms).

---

## 2. Policy Generation & Smart Contracting

**The Problem:** Gig workers have fluctuating, unpredictable incomes. Fixed monthly insurance premiums lead to policy lapses.

**The GigShield Solution:** Micro-policies tied directly to the worker's earnings velocity.

### How It Works in the App:
- **Instant Policy Tiering:** Instead of forcing the user into a one-size-fits-all plan, the AI calculates the worker's unique risk profile and auto-recommends a tier (e.g., *Smart Shield* at ₹45/week).
- **Micro-Savings Wallet:** The policy is funded through micro-deductions. As seen in the Wallet tab, the platform might deduct just ₹7 a day automatically, accumulating the weekly premium invisibly without causing cash-flow stress.
- **Data Synchronization:** Upon pressing **Activate Policy**, the app immediately compiles the user's constraints and pushes the policy to the decentralized **Supabase Data Layer**. *(Note for the demo: The system uses robust Upsert logic, meaning you can replay this flow with the same test account repeatedly without crashing the database)*.

---

## 3. Zero-Touch Parametric Claims (The Hero Feature)

**The Problem:** Submitting a claim usually involves taking photos, calling an adjuster, and waiting 2-4 weeks for a tiny payout.

**The GigShield Solution:** Zero-Touch Parametric Payouts triggered automatically by environmental APIs.

### How It Works in the "Simulate AI Claim" Demo:
During the demo, when you tap the bright blue **"Simulate AI Claim"** button, you are initiating a parametric event trigger. 

The visual overlay demonstrates the hidden Backend sequence:
1. **Intercepting Civic Warning:** The app detects an external API trigger (e.g., IMD Flash Flood Alert or extreme AQI).
2. **Validating GPS Parity:** The AI checks if the worker was actually active in the affected risk zone during the time of the incident.
3. **Fraud Detection Mapping:** The `ClaimManager` evaluates identical signals. *(If you click the demo button twice, you will see it block the duplicate event instantly, proving to the audience that the system is fraud-resistant)*.
4. **Zero-Touch Payout:** Because it is a parametric claim (meaning the payout is tied to a *parameter* like rainfall, rather than subjective physical damage), no human review is needed. The funds (e.g., ₹500 for a lost income day) instantly drop straight into the worker's wallet shown in the dashboard.

---

## 💡 Top 3 "Wow" Moments for Your Demo Video

1. **The AI Premium Calculation:** Pause on the Registration screen when the UI says *"AI Recalculating..."*. Point out how it takes just seconds to assess 15+ risk vectors and output a unique premium.
2. **The Glassmorphism Simulation Screen:** When you click the *Simulate AI Claim* button, let the audience watch the beautiful 4-step progress loader. Narrate the steps out loud to emphasize that no human is involved in the approval.
3. **The Duplicate Fraud Block:** Immediately after the first successful simulated claim, press the Simulate button **a second time**. Show the audience the glowing orange *"Duplicate Event Blocked"* screen. This proves the system is enterprise-ready and protects the underwriter from batch exploitation.
