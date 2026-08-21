# AirBook Platform Engineering & Feature Roadmap

This document outlines the product strategy, technical architecture, and implementation milestones for AirBook Web Application modules.

---

## 🔒 Private Beta & Security Gate Policy

Industry Add-On Modules (eSign, HIPAA, KYC) are restricted features:
- **Local Dev Access**: Automatically unlocked for developers running in local development (`localhost` / `127.0.0.1`).
- **Public Environment Access**: Locked by default for general users. Accessible **only via an official Beta Invite Program Key** (e.g. `AIRBOOK-BETA-2026`).

---

## 🚀 Industry Add-On Modules Roadmap

### 1. eSign Consent & Liability Waivers (`esign`)
- [x] **Phase 1: UI & Client State Integration (Completed)**
  - Global Zustand state persistence (`addons.esign`).
  - Settings module toggle & Beta access gate.
  - Client Specs & Notes profile integration showing digital consent badges and timestamp logs.
- [ ] **Phase 2: Full Production Legal Engine (Q3 2026)**
  - Interactive HTML5 Touch/Mouse Canvas Signature Pad component.
  - Automatic PDF waiver generation via `pdfkit` / `jspdf`.
  - Cryptographic SHA-256 signature hash validation & ESIGN / eIDAS audit trail log table.
  - Integration with Dropbox Sign (HelloSign) / DocuSign API for high-risk surgical consents.

---

### 2. HIPAA Compliance & Health Audit Trail (`hipaa`)
- [x] **Phase 1: Compliance Badging & Encrypted Notes UI (Completed)**
  - Client state management (`addons.hipaa`).
  - Gated settings toggle & Beta program verification.
  - Client CRM indicator: `🔒 HIPAA Encrypted BAA Audit Log (45 CFR § 164.312)`.
- [ ] **Phase 2: Infrastructure & KMS Security Pipeline (Q3 2026)**
  - GCP / AWS Business Associate Agreement (BAA) infrastructure signing.
  - Row-Level Database Encryption with Google Cloud KMS (Key Management Service) for medical intake records.
  - Immutable access audit logging pipeline (`pgAudit` / BigQuery Audit Logs) tracking every read/write to patient records.

---

### 3. KYC Identity Verification (`kyc`)
- [x] **Phase 1: Identity Profile Status (Completed)**
  - Global state persistence (`addons.kyc`).
  - Gated settings toggle & Beta access key validation.
  - Client CRM badge: `🆔 KYC Government ID & Biometrics Match`.
- [ ] **Phase 2: Real-time Biometrics & ID Scanning (Q4 2026)**
  - Integration with **Stripe Identity API** / **Persona API** / **Veriff**.
  - Automated passport, driver's license, and national ID document scanning with MRZ validation.
  - 3D liveness selfie biometric verification before high-value legal and architectural consultations.

---

## 📅 Roadmap Overview Summary

| Feature Module | Current Status | Beta Locked? | Next Milestone |
| :--- | :--- | :--- | :--- |
| **Agnostic Client CRM** | ✅ Released (v1.2) | ❌ Public | Custom intake forms & automated tags |
| **Stripe Connect & Payouts** | ✅ Released (v1.2) | ❌ Public | Stripe Terminal WisePad 3 POS reader |
| **Public Booking Engine** | ✅ Released (v1.2) | ❌ Public | Custom booking themes & branding |
| **Online Booking Studio** | ✅ Released (v1.2) | ❌ Public | Embeddable JS booking widget |
| **Multi-Staff Day View** | ✅ Released (v1.2) | ❌ Public | Multi-location staff schedule sync |
| **Google Review Automation** | ✅ Released (v1.2) | ❌ Public | WhatsApp Review Requests |
| **eSign Waiver Pad** | 🟡 Beta Preview (v1.3) | 🔒 Yes (Beta/Dev) | HTML5 Signature Canvas + PDF Export |
| **HIPAA Compliance Log** | 🟡 Beta Preview (v1.3) | 🔒 Yes (Beta/Dev) | KMS Encryption & Immutable Audit Log |
| **KYC Identity Verification** | 🟡 Beta Preview (v1.3) | 🔒 Yes (Beta/Dev) | Stripe Identity API Verification |
