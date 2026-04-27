<div align="center">
  
  <img src="https://raw.githubusercontent.com/google/material-design-icons/master/png/action/verified_user/materialicons/48dp/2x/baseline_verified_user_black_48dp.png" alt="TrustMark Logo" width="80" height="80">

  # TrustMark
  **Neural Integrity Protocol · v1.0**

  **AI-Powered Digital Asset Protection & Provenance Intelligence.** <br>
  *Built with Gemini 1.5 Pro Vision, Vertex AI, and Google Cloud.*

  [![Google Cloud](https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)](https://cloud.google.com/)
  [![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=FastAPI&logoColor=white)](https://fastapi.tiangolo.com/)
  [![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)

</div>

---

**🚀 Quick Links for Hackathon Submission:**
- [Live Demo URL](https://trustmark.web.app) *(Update with your final Firebase Hosting URL)*
- [Demo Video (Loom)](https://loom.com/) *(Update with your video link)*
- [Pitch Deck / Presentation](#) *(Update with your presentation link)*
- [PRD & Implementation Spec](./TrustMark_PRD_Spec.md)

---

## ⚡ The Core Problem
Every second, thousands of digital assets—images, documents, and creative works—are stolen, manipulated, forged, or falsely attributed. Existing solutions like visible watermarks are easily cropped out, EXIF metadata is trivially wiped in one click, and blockchain NFTs are too expensive and inaccessible for mainstream adoption.

**TrustMark solves this.**

---

## 🛡️ The Solution: Embed. Certify. Verify.
TrustMark is an enterprise-grade platform that embeds **invisible steganographic watermarks** into digital assets while generating **content-aware AI semantic fingerprints**. It creates an immutable chain of custody that allows anyone, anywhere, to verify the true owner of an asset in under 3 seconds—even if the image has been cropped, filtered, or screenshot.

### How it works (The 3-Step Process)
1. **Analyze (Gemini Vision)**: Gemini 1.5 Pro Vision generates a unique semantic DNA for the uploaded work. This fingerprint survives destructive modifications like Instagram filters and color grading.
2. **Embed (Steganography)**: The creator's ID and registration timestamp are woven directly into the image's binary code via DCT (Discrete Cosine Transform) pixel manipulation.
3. **Certify (Immutable Ledger)**: A cryptographic provenance record is written to a Firestore ledger. A public, shareable TrustMark Certificate is issued, acting as irrefutable proof of origin.

---

## 🧠 Google AI & Cloud Architecture

TrustMark is built specifically to highlight the power of the Google Cloud ecosystem:

- **Gemini 1.5 Pro Vision**: Core AI engine for generating high-dimensional perceptual fingerprints of visual assets.
- **Vertex AI Vector Search**: Enables the sub-3-second reverse image search to find stolen copies across a global registry.
- **Google Cloud Run**: Serverless, auto-scaling deployment for the FastAPI backend and AI processing pipelines.
- **Firebase Auth & Hosting**: Secure Google OAuth for creators and edge-cached delivery for the Next.js React frontend.
- **Firestore**: Operates as our immutable, append-only provenance ledger.

---

## 🚀 Key Features

- **Crop & Filter Resistant**: The semantic AI signature survives standard asset theft techniques.
- **Zero Crypto Required**: No blockchain wallets or gas fees. Mainstream accessibility for all creators.
- **Real-Time Global Verification**: Upload a suspicious image and get an ownership match and confidence score instantly.
- **Creator Dashboard**: Track global verifications and manage your protected asset portfolio.
- **EU AI Act Ready**: Positioned perfectly as a compliance layer for labeling AI-generated content.

---

## 💻 Local Development Setup

### 1. Prerequisites
- Google Cloud Project with Billing Enabled.
- Firebase Project (linked to GCP).
- Python 3.11+
- Node.js 20+

### 2. GCP & Firebase Configuration
1. Enable APIs: `Vertex AI API`, `Cloud Storage API`, `Firestore API`, `Cloud Run API`.
2. Set up a Service Account with `Vertex AI User`, `Storage Admin`, and `Firebase Admin / Datastore User` roles.
3. Download the JSON key file and save it in your `backend/` directory.

### 3. Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create a .env file based on .env.example
uvicorn main:app --reload --port 8000
```

### 4. Frontend Setup (Next.js 14)
```bash
cd frontend
npm install

# Create a .env.local file with your Firebase config and API Base URL
npm run dev
```
Visit `http://localhost:3000` to experience the TrustMark Neural Integrity Protocol.

---

## 🔒 Security & Provenance Rules
To guarantee the immutability of the TrustMark certificates, the Firestore database is protected by strict security rules that enforce an append-only architecture:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /assets/{assetId} {
      allow read: if true; // Public Certificates
      allow create: if request.auth != null && request.resource.data.owner_uid == request.auth.uid;
      // Immutable records: Only allow updating the verification counter
      allow update: if request.resource.data.diff(resource.data).affectedKeys().hasOnly(['verification_count', 'updated_at']);
      allow delete: if false; // Provenance cannot be erased
    }
  }
}
```

---
<div align="center">
  <b>Built for the Google Solution Challenge</b><br>
  <i>Protect what you create.</i>
</div>
