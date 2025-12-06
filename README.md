# Sofia Gastrobar Ibiza - Official Website

Welcome to the official source code for **Sofia Gastrobar Ibiza** (Domination Phase 1™). 
This project is a modern, high-performance web application designed to capture the essence of "Magic, Fire, and Flavor".

## 🌅 The Vision

Sofia is not just a restaurant. It is a refuge, a stage, and a living microcosm of Ibiza. This website serves as the digital gateway to that experience, featuring:

-   **Manifesto**: The spiritual and culinary philosophy of the house.
-   **Smart Table System**: Integration with the physical dining experience (QR, Waiter Call).
-   **Modo DJ**: An immersive audio ritual bringing the sunset vibes to the browser.
-   **Gamification**: "A Ilha Mágica de Sofia" mini-game integration.

## 🛠 Tech Stack

-   **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom "Goldmonkey" Design System
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Language**: TypeScript

## 🗺️ Sistema de Localização

O projeto inclui um sistema completo de localização com:
- ✅ Geolocalização precisa (GPS)
- ✅ Google Places Autocomplete
- ✅ Integração Apple Maps
- ✅ Preenchimento automático de dados do usuário
- ✅ Detecção automática de zona de entrega

**📋 Para configurar:** Veja [SETUP_LOCALIZACAO.md](./SETUP_LOCALIZACAO.md)

## ⚡ Configuração Rápida - SumUp

**⚠️ IMPORTANTE:** Para os pagamentos funcionarem, você precisa configurar o SumUp.

**📋 Ver checklist completo:** `CHECKLIST_SUMUP.md`

**Resumo rápido:**
1. Criar conta SumUp: https://sumup.com
2. Obter API Key do Dashboard
3. Adicionar `SUMUP_API_KEY` ao `.env.local`
4. Adicionar `SUMUP_API_KEY` ao Vercel (produção)
5. Reiniciar servidor

---

## 🚀 Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run the development server**:
    ```bash
    npm run dev
    ```

3.  **Build for production**:
    ```bash
    npm run build
    ```

## 📂 Project Structure

-   `src/app`: Main pages and layout (Next.js App Router).
-   `src/components/ui`: Reusable UI components (MagicButton, Section, AudioPlayer).
-   `src/components/sections`: Feature-specific sections (Hero, Menu, Story, SmartTable).
-   `src/lib`: Utilities (Tailwind merge, etc.).

## ✨ Key Features

-   **Immersive Hero**: Full-screen video/image background with "Goldmonkey" gradients.
-   **Audio Player**: Global floating player for the "Ritual Sonoro".
-   **Responsive Design**: Mobile-first approach for tourists and diners.
-   **QR Table System**: Smart table management with QR codes.
-   **Waiter Call API**: Real-time waiter calling system.

## 🌐 Production

-   **Domain**: [sofiagastrobaribiza.com](https://sofiagastrobaribiza.com)
-   **Deployment**: Vercel (auto-deploy from `main` branch)
-   **See**: [DEPLOY.md](./DEPLOY.md) for detailed deployment instructions

## 📦 Build Status

```bash
# Test build locally
npm run build

# Start production server
npm start
```

---

**Designed & Developed by Goldmonkey Studio**
