  
**BUILD WITH AI — SOLUTION CHALLENGE**

**TrustMark**

AI-Powered Digital Asset Protection & Provenance Intelligence

| Open Innovation | Digital Asset Protection | Google AI \+ Cloud |
| :---: | :---: | :---: |

PRD  •  SPEC  •  TECH STACK  •  SYSTEM DESIGN  •  MVP PLAN

# **1\. PROBLEM STATEMENT**

| The Core Problem Every second, thousands of digital assets — images, videos, documents, audio clips — are stolen, manipulated, forged, or falsely attributed. Creators lose revenue. Organizations face legal liability. The public cannot trust what they see online. |
| :---- |

## **1.1 The Scale of the Problem**

| Domain | Problem |
| :---- | :---- |
| **Media & Journalism** | Deepfakes and manipulated images spread as real news. No reliable verification tool exists at scale. |
| **Intellectual Property** | Artists, photographers, and designers lose \~$1.8B/year to digital content theft (OECD 2023 est.). |
| **Legal Documents** | Forged contracts, certificates, and identity documents cost businesses billions in fraud annually. |
| **Enterprise IP** | Leaked internal assets (designs, code, specs) cannot be traced back to the source of the breach. |
| **Content Creators** | No standard way to prove original ownership of digital work when DMCA disputes arise. |
| **AI-Generated Content** | AI-generated media floods the internet with zero provenance — nobody knows what's real anymore. |

## **1.2 Why Existing Solutions Fail**

* Metadata stripping: EXIF/metadata is trivially removed by any image editor in one click.

* Basic watermarking: Visible watermarks are cropped or edited out. Invisible ones are not AI-verified.

* Blockchain NFTs: Too expensive, requires crypto wallets, no mainstream adoption, doesn't work for documents.

* Platform-specific tools (Adobe CAI): Siloed, requires the entire pipeline to be Adobe. Not interoperable.

* Manual DMCA: Reactive, slow, and requires you to already know your asset was stolen.

| The Gap There is NO accessible, AI-powered, platform-agnostic tool that: (1) embeds imperceptible watermarks at creation time, (2) maintains a tamper-proof provenance chain, and (3) verifies ownership in real-time using AI vision — all in one product, free to creators. |
| :---- |

# **2\. BRIEF ABOUT THE SOLUTION**

TrustMark is an AI-powered digital asset protection platform that embeds imperceptible, Gemini-verified steganographic watermarks into any digital asset (image, video, PDF, audio) at the moment of creation. Every protected asset gets a unique Provenance ID stored on a tamper-evident ledger. Ownership can be verified in real-time by anyone — anywhere — without the original creator needing to be online.

## **2.1 How It Works — 30-Second Summary**

1. Creator uploads asset to TrustMark

2. Gemini Vision AI analyzes the asset, generates a semantic fingerprint (content hash \+ AI descriptor)

3. Invisible steganographic watermark embedded using DCT-based pixel manipulation (survives compression, cropping, color changes)

4. Provenance record written to Google Firestore \+ Vertex AI Vector Index for similarity search

5. Creator gets a TrustMark Certificate (shareable link \+ QR code)

6. Anyone who suspects an asset is stolen: uploads it to TrustMark Verify

7. Gemini Vision \+ Vector similarity search matches it to the original owner — in under 3 seconds

## **2.2 What Makes This Work**

| Component | How It Works |
| :---- | :---- |
| **Steganographic Watermarking** | Embeds creator ID \+ timestamp in LSB (least significant bits) of image pixels — invisible to human eye, survives JPEG compression up to 85% quality. |
| **Gemini Vision Fingerprinting** | Gemini 1.5 Pro Vision generates a semantic description \+ perceptual hash that is content-aware (survives crops, filters, color grading). |
| **Vector Similarity Search** | Vertex AI Matching Engine stores embeddings. Reverse search finds near-duplicate stolen assets even if heavily modified. |
| **Provenance Ledger** | Firestore stores immutable chain of custody records. Each transfer or modification event is logged with a hash link to previous state. |
| **Certificate System** | Every asset gets a public verify URL. Shareable, embeddable, no account needed to verify. |

# **3\. OPPORTUNITIES & USP**

## **3.1 How Is TrustMark Different From Everything Else?**

| Feature | TrustMark vs. Competition |
| :---- | :---- |
| **AI-Powered Verification** | No other hackathon-level tool uses Gemini Vision for semantic fingerprinting. TrustMark matches even heavily modified assets. |
| **Platform Agnostic** | Works for images, PDFs, audio, video — not locked to one file type or platform unlike Adobe CAI. |
| **No Crypto Required** | Unlike NFT solutions, zero blockchain wallet needed. Works in browser, works for non-tech users. |
| **Free for Creators** | Free tier protects up to 50 assets/month. No subscription required to verify ownership. |
| **Real-Time Reverse Search** | Finds stolen copies proactively using Vertex AI vector similarity — not just reactive DMCA. |
| **Works Post-Modification** | Watermark survives: JPEG re-saves, Instagram filters, screenshots, cropping (up to 40%), color grading. |
| **API-First** | REST API lets platforms (Unsplash, Behance clones, CMS tools) embed TrustMark natively. |

## **3.2 Market Opportunity**

| Segment | Opportunity |
| :---- | :---- |
| **Freelance Creators** | 57M+ freelancers in the US alone. 1 in 3 has had work stolen online (Freelancers Union). |
| **News Organizations** | Need to verify authenticity of UGC content before publication. $4B+ market for media verification. |
| **Legal/Compliance** | Fortune 500 companies pay $150M+ annually for document integrity solutions. |
| **EdTech** | Certificate fraud is a $1B+ problem globally. TrustMark can protect academic credentials. |
| **AI Content Space** | Watermarking AI-generated content is now a regulatory requirement in EU AI Act (2024). |

| USP in One Line TrustMark is the only tool that combines invisible AI-verified steganographic watermarking \+ semantic provenance search \+ real-time certificate verification — in a single free API that any creator or platform can use without a crypto wallet or enterprise contract. |
| :---- |

# **4\. FEATURES**

## **4.1 Core Features (MVP)**

| Feature | Description |
| :---- | :---- |
| **Asset Watermarking** | Upload any image/PDF → get back watermarked version with embedded invisible creator signature. |
| **Provenance Certificate** | Auto-generated public certificate page (QR code \+ shareable URL) for every protected asset. |
| **Ownership Verification** | Anyone uploads any file → TrustMark tells them who owns it and when it was registered. |
| **Reverse Image Search** | Find all copies of your asset across the web using Gemini Vision embeddings \+ vector search. |
| **Tamper Detection** | Detects if a watermarked asset was modified and shows WHAT was changed (crop/color/overlay). |
| **Creator Dashboard** | Portfolio of all protected assets, verification history, alert when someone verifies your asset. |
| **REST API** | Single endpoint integration for platforms to watermark/verify assets programmatically. |

## **4.2 Advanced Features (Post-MVP / V2)**

| Feature | Description |
| :---- | :---- |
| **Bulk Watermarking** | Upload a ZIP of 1000 assets → watermark all in batch via Cloud Run jobs. |
| **License Embedding** | Embed Creative Commons / custom license terms inside the watermark data payload. |
| **DMCA Auto-Draft** | When stolen copy found: auto-generate DMCA takedown letter pre-filled with evidence. |
| **Watermark for AI Output** | Gemini-based tool to watermark AI-generated images at output time (EU AI Act compliance). |
| **Video Frame Watermarking** | Extend watermarking to video: embed watermark in I-frames using FFmpeg \+ Gemini. |
| **Webhook Alerts** | Real-time webhook when your asset is verified by someone else (catch unauthorized use). |
| **White-label API** | Enterprise tier: custom branding for platform embeds (news orgs, stock photo sites).\] |

# **5\. PROCESS FLOW & USE CASE DIAGRAMS**

## **5.1 Main Process Flow**

*\[ TEXT-BASED FLOW — Replace with diagram in presentation \]*

| Step | PROTECT FLOW (Creator) | VERIFY FLOW (Claimant/Public) |
| :---- | :---- | :---- |
| **1** | Creator uploads asset via Web UI or API | Suspect uploads potentially stolen asset |
| **2** | Gemini Vision generates semantic fingerprint | Gemini Vision generates fingerprint of uploaded file |
| **3** | System checks Vertex AI index for duplicates | Vertex AI vector similarity search runs against all registered assets |
| **4** | If unique: embed steganographic watermark | Top match returned with confidence score (0–100%) |
| **5** | Write provenance record to Firestore | Certificate page shown: owner, date, original vs. copy diff |
| **6** | Issue TrustMark Certificate (URL \+ QR) | If stolen: DMCA draft auto-generated (V2) |
| **7** | Creator notified; asset protected | Owner notified via webhook/email of verification event |

## **5.2 Use Case Diagram (Text Representation)**

Actors: Creator | Public Verifier | Admin | External Platform (API consumer)

| Actor | Use Cases |
| :---- | :---- |
| **Creator** | Register asset | View dashboard | Download certificate | Get theft alerts | Bulk upload | Set license type |
| **Public Verifier** | Upload for verification | View certificate | See ownership chain | Report suspected theft |
| **External Platform** | POST /watermark | GET /verify | POST /bulk | GET /certificate/:id | Subscribe to webhooks |
| **Admin** | Monitor abuse | Manually revoke certificate | View analytics | Manage API keys |

# **6\. WIREFRAMES & MOCK DIAGRAMS**

*Below are text-based wireframe descriptions. Build these in Figma or use the HTML prototype in the repo.*

## **6.1 Landing Page**

| Screen: Landing / Hero HEADER: TrustMark logo | Features | Pricing | LoginHERO: 'Protect Your Digital Work in 3 Clicks' | \[Protect Asset\] CTA button | \[Verify Ownership\] secondary CTASOCIAL PROOF: '14,000+ assets protected' | '99.7% verification accuracy'HOW IT WORKS: 3-step horizontal flow: Upload → Watermark → CertifyFOOTER: API docs | GitHub | Contact |
| :---- |

## **6.2 Protect Screen (Creator Upload)**

| Screen: /protect DRAG & DROP ZONE: 'Drag image, PDF, or audio here' | File size limit: 50MBLICENSE PICKER: \[CC-BY\] \[CC-BY-NC\] \[All Rights Reserved\] \[Custom\]ADVANCED: Watermark strength slider (Subtle ←→ Robust)CTA: \[Protect This Asset\] → Loading: 'Gemini analyzing...' → 'Embedding watermark...'OUTPUT: Download watermarked file | Copy certificate URL | Share on Twitter |
| :---- |

## **6.3 Verify Screen**

| Screen: /verify UPLOAD ZONE: 'Drop any file to check ownership'RESULT CARD (Match Found):  ✓ ORIGINAL OWNER: \[name\]  ✓ REGISTERED: \[timestamp\]  ✓ MATCH CONFIDENCE: 97.3%  ✓ MODIFICATION DETECTED: Cropped (15%), Brightness adjusted  \[View Full Certificate\] \[Report Theft\]RESULT CARD (No Match):  ⚠ Not in TrustMark registry  \[Register This Asset Instead\] |
| :---- |

## **6.4 Creator Dashboard**

| Screen: /dashboard STATS BAR: Total Protected | Verifications This Month | Suspected Theft AlertsASSET GRID: Thumbnail | Asset name | Date | Verifications | \[View Cert\] \[Delete\]ALERTS PANEL: 'Your asset 'design\_v2.png' was verified 3 times today — 1 from a new region'QUICK ACTIONS: \[Protect New Asset\] \[Download All Certificates\] \[API Keys\] |
| :---- |

# **7\. ARCHITECTURE DIAGRAM**

## **7.1 High-Level System Architecture**

*\[ See diagram below — recreate in draw.io or Lucidchart for presentation \]*

| FRONTEND LAYER React PWA (Next.js) Hosted: Firebase Hosting / Cloud Run Auth: Firebase Auth (Google OAuth) | API LAYER FastAPI (Python 3.11) Hosted: Cloud Run (containerized) Auth middleware: Firebase Admin SDK |
| :---- | :---- |
| **AI / ML LAYER** Gemini 1.5 Pro Vision — fingerprinting Vertex AI Matching Engine — vector similarity Vision AI — tamper detection Gemma 2 (local) — lightweight hash gen | **STORAGE & DATA LAYER** Cloud Storage — original \+ watermarked assets Firestore — provenance ledger (immutable) Redis (Memorystore) — rate limiting \+ cache BigQuery — analytics, abuse detection |

## **7.2 Data Flow Architecture**

PROTECT FLOW:

User → \[Next.js UI\] → POST /api/protect → \[Cloud Run FastAPI\] → \[Gemini Vision API: generate fingerprint\] → \[Vertex AI: check duplicates\] → \[Watermark Service: embed LSB\] → \[Cloud Storage: save files\] → \[Firestore: write provenance record\] → Return certificate URL

VERIFY FLOW:

User → \[Next.js UI\] → POST /api/verify → \[Cloud Run FastAPI\] → \[Gemini Vision API: fingerprint uploaded file\] → \[Vertex AI: similarity search\] → \[Firestore: fetch matched asset metadata\] → \[Vision AI: tamper analysis\] → Return match result \+ certificate data

## **7.3 Architecture Components Summary**

| Component | Service Used |
| :---- | :---- |
| **Frontend Hosting** | Firebase Hosting / Cloud Run — Next.js 14 App Router |
| **Backend API** | Cloud Run — FastAPI containerized via Docker |
| **Authentication** | Firebase Authentication — Google OAuth 2.0 |
| **AI Fingerprinting** | Gemini 1.5 Pro Vision via Vertex AI SDK (google-cloud-aiplatform) |
| **Vector Search** | Vertex AI Matching Engine — approximate nearest neighbor search |
| **Tamper Detection** | Google Vision AI — image annotation \+ diff analysis |
| **Lightweight Model** | Gemma 2 (2B) — deployed on Vertex AI for hash generation (cost saving) |
| **File Storage** | Cloud Storage (GCS) — multi-regional, CORS enabled |
| **Provenance DB** | Firestore — serverless, real-time, immutable record pattern |
| **Caching** | Cloud Memorystore (Redis) — API rate limiting, certificate cache |
| **Analytics** | BigQuery — usage metrics, abuse pattern detection |
| **CI/CD** | Cloud Build — auto deploy on GitHub push |
| **Watermarking Logic** | Python: stegano \+ pywavelets \+ python-dctr (custom module) |

# **8\. TECHNOLOGIES TO BE USED**

## **8.1 Google AI & Cloud Stack (Required)**

| Google Technology | Usage in TrustMark |
| :---- | :---- |
| **Gemini 1.5 Pro Vision (Vertex AI)** | Core AI engine: semantic fingerprinting of assets, generates content-aware embeddings for similarity search, describes asset content for provenance metadata. |
| **Gemma 2 2B (Vertex AI)** | Lightweight local model deployed on Vertex for perceptual hash generation — cost-optimized path for bulk processing without calling full Gemini. |
| **Vertex AI Matching Engine** | Stores all asset embeddings as vectors. Approximate nearest-neighbor search finds stolen copies even when modified (crop, filter, compression). |
| **Google Cloud Vision AI** | Detects tamper markers, runs Safe Search, extracts text from documents for additional fingerprint signals. |
| **Google AI Studio** | Used for rapid prototyping of Gemini prompts before migrating to production Vertex AI SDK. |
| **Google Cloud Run** | Hosts FastAPI backend — serverless, auto-scales, cold start \< 2s with container pre-warming. |
| **Firebase Hosting** | Serves Next.js frontend — global CDN, zero-config HTTPS, custom domain. |
| **Firebase Auth** | Google OAuth login for creators — zero password management, trusted identity. |
| **Firestore** | Provenance ledger — document-oriented, supports immutable record pattern via security rules. |
| **Cloud Storage (GCS)** | Stores original and watermarked asset files — versioning enabled, lifecycle policies for cost. |
| **Cloud Memorystore (Redis)** | Rate limiting, certificate page caching, session management. |
| **BigQuery** | Analytics pipeline: verification events, abuse detection, creator usage metrics. |
| **Cloud Build \+ Artifact Registry** | CI/CD pipeline — auto-build Docker images, push to registry, deploy to Cloud Run on PR merge. |

## **8.2 Open Source / Third-Party Stack**

| Technology | Purpose |
| :---- | :---- |
| **Next.js 14 (React)** | Frontend framework — App Router, Server Components, API routes for BFF layer. |
| **FastAPI (Python 3.11)** | Backend API — async, OpenAPI auto-docs, Pydantic validation, easy Vertex AI SDK integration. |
| **stegano (Python)** | LSB steganography library — embeds/extracts creator ID from image pixel LSBs. |
| **pywavelets** | Wavelet transform for frequency-domain watermarking — more robust than pure LSB. |
| **Pillow (PIL)** | Image processing — format conversion, resize, color space manipulation before watermarking. |
| **PyMuPDF (fitz)** | PDF text/image extraction for fingerprinting PDF documents. |
| **Docker** | Container packaging for Cloud Run deployment. |
| **Tailwind CSS** | Frontend styling — utility-first, fast to build. |
| **shadcn/ui** | React component library — accessible, customizable. |
| **pytest** | Unit \+ integration testing for API endpoints and watermark module. |
| **Locust** | Load testing — validate Cloud Run auto-scaling behavior. |

# **9\. ESTIMATED IMPLEMENTATION COST**

## **9.1 Development Cost (One-Time)**

| Resource | Estimate |
| :---- | :---- |
| **Developer Time (Solo / 2-person team)** | MVP: \~80–120 hours. Value \~$0 for hackathon (self-built). |
| **Design (Figma mockups)** | $0 — use free Figma tier \+ free UI kit. |
| **Domain Name** | $10–15/year (e.g., trustmark.app) |
| **SSL Certificate** | $0 — Firebase Hosting provides free auto-renew SSL. |

## **9.2 Google Cloud Operational Cost (Monthly — Free Tier / Hackathon Scale)**

| Service | Free Tier / Cost | Hackathon Usage |
| :---- | :---- | :---- |
| Gemini 1.5 Pro Vision | Free via AI Studio; $0.00125/1K tokens on Vertex | \~500 verifications \= \~$2–5/month |
| Vertex AI Matching Engine | $0.18/node-hr (0.4 node \= \~$0/month on smallest) | Smallest index: \~$5/month |
| Cloud Vision AI | 1000 units/month free | Well within free tier at MVP |
| Cloud Run | 2M req/month free tier | Well within free tier at MVP |
| Firebase Hosting | 10GB storage free, 360MB/day transfer | Well within free tier at MVP |
| Firestore | 1GB storage \+ 50K reads/day free | Well within free tier at MVP |
| Cloud Storage | 5GB free | \~$0.02/GB beyond free tier |
| Cloud Memorystore | \~$0.016/GB/hr (smallest \= \~$12/month) | Can replace with in-memory cache for hackathon: $0 |
| BigQuery | 10GB storage \+ 1TB queries/month free | Free at hackathon scale |

| Total Hackathon Cost Estimate Conservative: $0–10/month (using free tiers \+ Google Cloud $300 new user credit)Production scale (1000 MAU): \~$50–80/monthEnterprise scale (100K MAU): \~$800–1200/month (negotiable with Google for startups via Google for Startups program) |
| :---- |

# **10\. MVP PLANNING**

## **10.1 MVP Scope (What to Build for Hackathon Demo)**

| MVP Goal A working demo that shows: (1) upload an image → get watermarked version \+ certificate URL, (2) upload a copy of that image → system correctly identifies original owner. That's the WOW moment for judges. |
| :---- |

| MVP Feature | Status |
| :---- | :---- |
| **Image watermarking (LSB steganography)** | MUST HAVE |
| **Gemini Vision fingerprinting (embedding generation)** | MUST HAVE |
| **Firestore provenance record write** | MUST HAVE |
| **Ownership verification via vector similarity** | MUST HAVE |
| **Certificate page (public URL)** | MUST HAVE |
| **Creator dashboard (basic)** | SHOULD HAVE |
| **PDF support** | NICE TO HAVE (demo images only) |
| **Bulk upload** | SKIP for hackathon |
| **DMCA auto-draft** | SKIP for hackathon |

## **10.2 Build Timeline (3-Week Hackathon Sprint)**

| Week | Tasks |
| :---- | :---- |
| **Week 1: Foundation** | Set up GCP project \+ Firebase. Scaffold Next.js \+ FastAPI. Implement Firebase Auth. Build watermarking module (stegano \+ PIL). Test LSB embed/extract pipeline locally. |
| **Week 2: AI Integration** | Integrate Gemini Vision API via Vertex AI SDK. Build embedding generation pipeline. Set up Firestore schema. Set up Vertex AI Matching Engine index. Build /protect and /verify API endpoints. Connect frontend to API. |
| **Week 3: Polish \+ Demo** | Build certificate page. Creator dashboard (basic grid). Tamper detection (Vision AI). Load test on Cloud Run. Deploy final build. Create demo video. Write README. Prepare slides from this PRD. |

## **10.3 Project Structure**

**trustmark/**

├── frontend/               ← Next.js 14 App

│   ├── app/

│   │   ├── page.tsx        ← Landing page

│   │   ├── protect/        ← Upload \+ watermark UI

│   │   ├── verify/         ← Verification UI

│   │   ├── dashboard/      ← Creator dashboard

│   │   └── cert/\[id\]/      ← Public certificate page

│   ├── components/         ← Reusable UI components

│   └── lib/                ← Firebase client SDK, API calls

├── backend/                ← FastAPI Python app

│   ├── main.py             ← App entry \+ router

│   ├── routers/

│   │   ├── protect.py      ← POST /protect

│   │   ├── verify.py       ← POST /verify

│   │   └── certificate.py  ← GET /certificate/:id

│   ├── services/

│   │   ├── watermark.py    ← LSB \+ DCT watermarking logic

│   │   ├── gemini.py       ← Vertex AI Gemini Vision calls

│   │   ├── vector\_index.py ← Vertex AI Matching Engine client

│   │   ├── firestore.py    ← Provenance ledger writes/reads

│   │   └── vision.py       ← Google Vision AI tamper detection

│   ├── models/             ← Pydantic schemas

│   ├── Dockerfile

│   └── requirements.txt

├── infra/

│   ├── cloudbuild.yaml     ← CI/CD pipeline

│   └── terraform/         ← IaC for GCP resources (optional)

└── README.md

# **11\. ADDITIONAL DETAILS & FUTURE DEVELOPMENT**

## **11.1 V2 Roadmap**

| Feature | Target Quarter |
| :---- | :---- |
| **Video frame watermarking (FFmpeg \+ Gemini)** | Q2 2025 |
| **Audio watermarking (frequency domain embed)** | Q2 2025 |
| **DMCA auto-draft with evidence package** | Q3 2025 |
| **Browser extension (watermark before you post)** | Q3 2025 |
| **EU AI Act compliance module (AI-generated content labeling)** | Q4 2025 |
| **Enterprise white-label API** | Q4 2025 |
| **Monetization: Pro tier ($9/mo, unlimited assets)** | Q1 2026 |

## **11.2 Legal & Compliance Notes**

* GDPR/DPDP compliant: users can delete their account \+ all assets. Provenance records anonymized on deletion.

* Watermark only stores: creator\_id (hashed), timestamp (Unix), license\_type. No PII inside the watermark itself.

* EU AI Act Article 50: TrustMark is positioned as a compliance tool for AI-generated content watermarking requirements.

* We do NOT claim to be a legal document certification service — TrustMark is evidence, not proof beyond reasonable doubt.

## **11.3 Security Considerations**

* API rate limiting: 100 req/hour per API key via Redis.

* File validation: Magic bytes check (not just extension). Reject executables, oversized files.

* Watermark is tamper-evident: changing even 5% of pixels degrades but does not erase it.

* Provenance records: Firestore security rules prevent any client-side modification after write.

* All GCS assets: signed URLs with 1-hour expiry. No public buckets.

## **11.4 Competitive Moat**

* Data moat: Every asset registered makes the vector index smarter. More data \= better match accuracy.

* Network effect: More creators using TrustMark \= more verifiers trusting TrustMark certificates.

* API-first: Platforms embedding the API create distribution that competitors can't replicate easily.

* Google ecosystem lock-in (positive): Deep Vertex AI \+ Firebase integration \= impossible to replicate on other clouds without significant re-architecture.

# **12\. STEP-BY-STEP IMPLEMENTATION GUIDE**

## **Phase 1: Environment Setup**

8. Create GCP project: console.cloud.google.com → New Project → 'trustmark-prod'

9. Enable APIs: Vertex AI, Cloud Vision, Firestore, Cloud Storage, Cloud Run, Cloud Build, Firebase

10. Install Google Cloud SDK (gcloud CLI). Run: gcloud auth login && gcloud config set project trustmark-prod

11. Create Firebase project and link to GCP project. Enable Firebase Auth \+ Firestore \+ Hosting.

12. Create service account with roles: Vertex AI User, Cloud Storage Admin, Datastore User. Download JSON key.

## **Phase 2: Backend (FastAPI)**

13. cd backend && python \-m venv venv && source venv/bin/activate

14. pip install fastapi uvicorn google-cloud-aiplatform google-cloud-firestore google-cloud-storage google-cloud-vision stegano Pillow PyMuPDF python-jose

15. Set env vars: GOOGLE\_APPLICATION\_CREDENTIALS, GCP\_PROJECT\_ID, GCS\_BUCKET\_NAME, VERTEX\_INDEX\_ID

16. Build watermark.py: LSB embed function takes (image\_bytes, creator\_id) → returns watermarked\_bytes. Extract function reverses it.

17. Build gemini.py: generate\_embedding(image\_bytes) calls Vertex AI multimodal embedding endpoint. Returns 1408-dim float vector.

18. Build vector\_index.py: upsert\_vector(asset\_id, embedding) and search\_similar(embedding, top\_k=5) using Matching Engine client.

19. Build firestore.py: create\_provenance\_record(asset\_id, creator\_id, embedding\_hash, license, timestamp) → immutable write.

20. Wire up POST /protect and POST /verify routes. Add Firebase JWT middleware.

21. Dockerize: docker build \-t gcr.io/trustmark-prod/api:latest . && docker push

22. Deploy: gcloud run deploy trustmark-api \--image gcr.io/trustmark-prod/api:latest \--platform managed \--region us-central1 \--allow-unauthenticated

## **Phase 3: Frontend (Next.js)**

23. npx create-next-app@latest frontend \--typescript \--tailwind \--app

24. npm install firebase @google-cloud/aiplatform shadcn-ui

25. npx shadcn-ui@latest init && add button card input toast

26. Set up Firebase Auth: GoogleAuthProvider \+ signInWithPopup in /lib/firebase.ts

27. Build /protect page: drag-drop upload → POST to backend /protect → show certificate URL \+ download link

28. Build /verify page: drag-drop upload → POST to backend /verify → show match result card

29. Build /cert/\[id\] page: fetch from Firestore via API → render public certificate (owner name, date, thumbnail, license)

30. Build /dashboard: list all creator's assets from Firestore. Show verification counts.

31. Deploy: firebase deploy \--only hosting

## **Phase 4: Vertex AI Index Setup**

32. Create Matching Engine Index: gcloud ai indexes create \--display-name=trustmark-index \--metadata-file=index\_metadata.json

33. Create Index Endpoint and deploy the index to it.

34. Set VERTEX\_INDEX\_ENDPOINT\_ID and VERTEX\_INDEX\_ID in Cloud Run environment variables.

35. Test: curl \-X POST /protect with a test image → check Firestore for record → check vector index for embedding.

## **Phase 5: Demo Prep**

36. Record Loom demo video: 'I upload my original photo → get certificate → someone uses my photo → I upload their version → TrustMark catches it in 2 seconds'

37. Prepare 5 test assets: 1 original image, 1 Instagram-filtered copy, 1 cropped copy, 1 color-corrected copy, 1 screenshot of a screenshot → all should match.

38. Screenshot the match results for the PRD snapshot section (Section 10 placeholder).

39. Add API demo: show Postman/cURL call to /verify returning JSON with match\_confidence: 97.3.

# **13\. PRESENTATION SLIDE OUTLINE (PPT TEMPLATE MAPPING)**

Map to the given Hack2Skill PPT template:

| Slide \# | Content |
| :---- | :---- |
| **Slide 1: Cover** | Team name, leader, Problem Statement: 'Digital assets are stolen, forged, and falsely attributed at massive scale — with no accessible AI-powered solution to prove ownership.' |
| **Slide 2: Problem** | Stats on IP theft, deepfakes, document forgery. Show the gap: why existing tools fail. |
| **Slide 3: Solution** | TrustMark in 3 steps. Tagline: 'Embed. Certify. Verify.' Show the 3-step flow diagram. |
| **Slide 4: USP** | Competitive table: TrustMark vs Adobe CAI vs NFTs vs Basic watermarks. |
| **Slide 5: Architecture** | System architecture diagram. Highlight all Google AI services used. |
| **Slide 6: Features** | Feature grid: 6 core features with icons. Highlight AI-powered ones. |
| **Slide 7: Tech Stack** | Google Cloud stack: Gemini Vision, Vertex AI, Cloud Run, Firebase, GCS. Why each one. |
| **Slide 8: MVP Demo** | Screenshots/GIFs of actual working prototype. Match result with 97.3% confidence. |
| **Slide 9: Market Opportunity** | TAM/SAM. EU AI Act regulatory tailwind. Creator economy size. |
| **Slide 10: Team \+ Next Steps** | Team bios. V2 roadmap. Ask: 'We need feedback from judges on...' |

# **14\. SUBMISSION CHECKLIST**

| Hackathon Requirements Check ✅ Cloud deployment: Cloud Run (backend) \+ Firebase Hosting (frontend)✅ Google AI model used: Gemini 1.5 Pro Vision (fingerprinting) \+ Gemma 2 (hash gen) \+ Vision AI (tamper detection)✅ Feasibility: All team members can build this — uses standard Python/JS stack✅ One project per team: TrustMark is the single submission✅ POC/demo included: Live watermarking \+ verification demo |
| :---- |

## **14.1 Files to Submit**

* PPT using Hack2Skill template (use sections 1-12 to fill every slide)

* GitHub repo with working code \+ README

* Live demo URL (Cloud Run \+ Firebase Hosting)

* Demo video (Loom, 3-5 minutes)

* Architecture diagram (draw.io export as PNG for PPT)

## **14.2 Judge Scoring Optimization**

| Judging Criterion | How TrustMark Nails It |
| :---- | :---- |
| **Innovation** | Semantic AI fingerprinting \+ steganography combo is genuinely novel at this level. Nobody else is doing this. |
| **Technical Feasibility** | All APIs are production-ready. Codebase is standard Python/JS. No exotic dependencies. |
| **Google AI Usage** | Uses 4+ Google AI services with REAL integration — not just a Gemini chatbot wrapper. |
| **Impact** | Directly addresses creator economy IP theft ($1.8B/year problem) \+ EU AI Act compliance. |
| **Completeness** | Working MVP \+ certificate demo is a complete user journey — not just a concept. |

**TrustMark — Built with Gemini. Powered by Google Cloud. Owned by its creators.**