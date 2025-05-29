# 🏛️ Software Engineering Principles (Cursor-Aligned)

## 🎯 Engineering Philosophy

**"Build a state-of-the-art technology marvel through disciplined engineering excellence."**

We build with autonomy, modularity, and velocity — letting Cursor drive, while we guide with values.

---

## 🏗️ Core Architectural Principles

### 1. SOLID Principles

- **SRP**: Single Responsibility — each module should have only one reason to change
- **OCP**: Open for extension, closed for modification
- **LSP**: Subtypes must be substitutable for base types
- **ISP**: Interfaces should be focused on what clients need
- **DIP**: High-level modules should not depend on low-level modules directly

---

### 2. Clean Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Presentation Layer                       │
│           (UI Components, Controllers, API)                │
│                     ↕ Dependencies                         │
├─────────────────────────────────────────────────────────────┤
│                   Application Layer                        │
│              (Use Cases, Business Logic)                   │
│                     ↕ Dependencies                         │
├─────────────────────────────────────────────────────────────┤
│                    Domain Layer                            │
│         (Entities, Value Objects, Domain Rules)            │
│                     ↕ Dependencies                         │
├─────────────────────────────────────────────────────────────┤
│                  Infrastructure Layer                      │
│          (Database, External APIs, Frameworks)             │
└─────────────────────────────────────────────────────────────┘
```

---

### 3. Domain-Driven Design (DDD)

- **Bounded Contexts**:
  - White-collar: Analytics, enterprise features
  - Grey-collar: Team management, hiring
  - Blue-collar: Job discovery, applications
- **Ubiquitous Language**:
  - Terms like Sewak, Mandi, SewakCoins are used across tiers
- **Domain Events**:
  - Examples: `JobApplicationSubmitted`, `WageNegotiated`, `WorkerVerified`

---

## ✅ Testing & Quality

- Cursor should write tests automatically during feature development
- Minimum coverage target: **80%** (unit + integration combined)
- TDD is **optional** and recommended only for complex business logic
- Test purpose:
  - Business logic validation
  - Preventing regression
  - Ensuring integrations between tiers remain stable

---

## 🔒 Security Principles

- **Authentication**: JWT with refresh tokens
- **Authorization**: Role-based, tier-aware
- **Data Encryption**: AES-256 at rest, TLS 1.3 in transit
- **Compliance**: Fully aligned with DPDP Act 2023
- **API Security**: Rate limiting, sanitization, protection against XSS/CSRF

---

## ⚡ Performance Principles

- **UI Interactions**: < 100ms
- **API Responses**: < 200ms
- **Voice Command Latency**: < 1000ms
- **Memory & CPU**: < 50MB RAM, < 30% CPU
- **Battery Drain**: < 2%/hour
- **Network Support**: Offline-first, works on 2G/3G
- **Storage Footprint**: < 100MB

---

## 🌐 Accessibility & Inclusivity

- **Languages**: English, Hindi, Bengali (Phase 1)
- **Low-Literacy Support**: Voice guidance, visual icons
- **Touch Targets**: Minimum 44px for ease of interaction
- **Voice Commands**: Hands-free job discovery for blue-collar users
- **Screen Reader Compatibility**: For visually impaired users

---

## 🔄 Real-time Synchronization

- **WebSocket-first architecture**
- **Event-Driven Data Flow**: Sync across White ↔ Grey ↔ Blue
- **Conflict Handling**: Timestamp-based resolution
- **Eventual Consistency** guaranteed

---

## 🎯 Quality Standards

- **Cyclomatic Complexity**: < 10 per function
- **Duplication**: < 3%
- **Documentation**: Recommended for all exported functions/APIs
- **Definition of Done**:
  - [x] 80%+ test coverage
  - [x] Meets performance targets
  - [x] Complies with accessibility and security
  - [x] Code reviewed and deployable

---

## 🚀 Innovation & AI Principles

- **Cursor-First Development**: Code is written and reasoned by Cursor with autonomy
- **AI Learning**: Models improve through real-world use across tiers
- **Bias Prevention**: Checked continuously
- **Transparency**: Every decision is explainable to users and maintainers
- **Future-Ready Stack**:
  - Microservices
  - API-first
  - Containerized + cloud-native
  - Data-driven by default

---

**Principles → Implementation → Excellence**

Cursor builds it. You direct it. Together, we create a system worthy of India's workforce revolution.