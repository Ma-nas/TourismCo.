# Zero-Impact Automated Keep-Alive System (Multi-Project)

**Document Version:** 1.0.0  
**Scope:** 3 Deployed Applications (Inference APIs, Full-Stack Web Apps, DB-backed services)

---

## 1. System Overview & Problem Statement

Free-tier cloud hosting platforms (Render, Koyeb, Glitch, Hugging Face Spaces) automatically put inactive web services and containers into a sleep/hibernation state after **15 minutes** of inactivity. Free database instances (e.g. Supabase) also pause after extended idle periods.

This leads to:
- **504 Gateway Timeouts**
- **60+ second cold-start delays** for visitors and recruiter dynamic previews
- **Broken GitHub portfolio links** and poor user experience

**Engineering Goal:** Maintain continuous availability (24/7 warm state) across all target deployments with **0% code modifications** to existing business logic or frameworks and **$0 cloud cost**.

---

## 2. Implemented Architecture & Strategies

```
┌────────────────────────────────────────────────────────┐
│              Keep-Alive Engine (External)              │
│                                                        │
│  Option A: UptimeRobot / cron-job.org (Zero-Code SaaS) │
│  Option B: Unified GitHub Actions Cron Job (In-Repo)   │
└──────────────────────────┬─────────────────────────────┘
                           │
           Periodic HTTP GET Probe (10–12m)
                           │
      ┌────────────────────┼────────────────────┐
      ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Project 1   │    │  Project 2   │    │  Project 3   │
│ (TourismCo)  │    │  (ML/API)    │    │ (DB/Fullstack│
└──────────────┘    └──────────────┘    └──────────────┘
```

| Deployment Tier | Hibernation Threshold | Heartbeat Frequency | Probe Method | Compute / API Cost |
| :--- | :--- | :--- | :--- | :--- |
| **Compute / API** (Render, Koyeb) | 15 minutes | Every 10–12 minutes | HTTP GET to `/` or `/health` | $0.00 / Zero compute overhead |
| **Database** (Supabase, Neon) | 7 days | Every 24 hours | Lightweight API/Health Ping | $0.00 |
| **Static Frontend** (Vercel, Pages) | Never | N/A | No probe required | $0.00 |

---

## 3. Implementation Details

### Implementation Path A: Zero-Code Cloud Monitor (SaaS Probe)
1. Sign up for a free account at [UptimeRobot](https://uptimerobot.com/) or [cron-job.org](https://cron-job.org/).
2. Add HTTP(s) Monitors for your 3 target projects:
   - **URL 1:** `https://tourismco-backend.onrender.com/` (or target API root)
   - **URL 2:** `https://your-project-2.onrender.com/`
   - **URL 3:** `https://your-project-3.onrender.com/`
3. Set **Monitoring Interval**: `10 minutes` (prevents Render's 15-minute sleep cycle without hitting rate limits).

### Implementation Path B: Centralized GitHub Action Workflow (In-Repo)
Created workflow at [`.github/workflows/multi-project-keepalive.yml`](.github/workflows/multi-project-keepalive.yml).

#### How to configure GitHub Repository Secrets:
Go to your GitHub Repository > **Settings** > **Secrets and variables** > **Actions** > **New repository secret**:
- `PROJECT_1_URL`: `https://tourismco-backend.onrender.com` (or your actual deployed URL)
- `PROJECT_2_URL`: `https://<your-second-project>.onrender.com`
- `PROJECT_3_URL`: `https://<your-third-project>.onrender.com`

*Note: If no secret is set, the workflow falls back to defaults or safely skips empty/placeholder targets.*

---

## 4. Rollout & Verification Checklist

- [x] **T-0:** Confirm primary workflow definition at `.github/workflows/multi-project-keepalive.yml`.
- [ ] **T+1:** Deploy backend to Render/Koyeb and configure GitHub Repository Secrets (`PROJECT_1_URL`, `PROJECT_2_URL`, `PROJECT_3_URL`).
- [ ] **T+2:** Manually trigger the heartbeat test in GitHub Actions tab (**Actions** -> **Multi-Project Keep-Alive Daemon** -> **Run workflow**).
- [ ] **T+30m:** Allow services to sit idle for 30 minutes.
- [ ] **T+35m:** Open each application URL directly to confirm zero cold-start latency (<1 sec response time).
