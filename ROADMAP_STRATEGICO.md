# 🚀 Roadmap Estratégico - Sofia Gastrobar Ibiza
## Transformando em "O Site Mais Preparado de Ibiza"

**Data:** 06 de Dezembro de 2025  
**Objetivo:** Transformar o site de vitrine poética em plataforma operacional completa

---

## 📊 VISÃO ATUAL vs. VISÃO FUTURA

### O que já temos (Vitrine Poética)
- ✅ Manifesto forte (IBIZA DOMINATION PHASE 1™)
- ✅ Narrativa mística (Lenda de Sofia, Tânit)
- ✅ Menu completo com nomes autorais
- ✅ Seção "O Futuro é Mágico" (promessa)
- ✅ QR Table System básico funcionando
- ✅ Design único e identidade forte

### O que vamos construir (Plataforma Operacional)
- 🎯 Sistema de pedidos completo (mesa, delivery, takeaway)
- 🎯 Clube Sofia (CRM + fidelidade)
- 🎯 Reservas integradas
- 🎯 WhatsApp Bot (SofiaGastroBot)
- 🎯 Integração ChefIApp OS/TPV
- 🎯 Automações n8n/8n8n
- 🎯 SEO e captação otimizada
- 🎯 Google Business Profile integrado

---

## 🎯 EIXOS DE MELHORIA

### 1. UX e Estrutura de Navegação
**Status:** ⚠️ Parcial (one-page, falta rotas de negócio)

**Ações:**
- [ ] Criar rotas `/reservas`, `/delivery`, `/clube-sofia`, `/empresa`
- [ ] Hero com CTAs claros e funcionais
- [ ] Seção "Como funciona o Sofia Digital"
- [ ] Navegação melhorada no Navbar

### 2. Sistema de Pedidos
**Status:** ⚠️ Parcial (QR mesa básico, falta delivery/pedidos externos)

**Ações:**
- [ ] Melhorar `/mesa/[id]` com menu integrado
- [ ] Criar `/delivery` completo
- [ ] Criar `/takeaway` (pedido externo)
- [ ] Integração com ChefIApp OS/TPV
- [ ] Fluxo de pagamento SumUp

### 3. Clube Sofia + CRM
**Status:** ❌ Não existe

**Ações:**
- [ ] Criar `/clube-sofia` com formulário
- [ ] Schema de database (customers, visits, preferences)
- [ ] Sistema de pontos/benefícios
- [ ] Integração com WhatsApp

### 4. WhatsApp Bot (SofiaGastroBot)
**Status:** ❌ Não existe

**Ações:**
- [ ] Botão fixo "Falar com Sofia"
- [ ] Fluxo de conversação inteligente
- [ ] Roteamento para mesas/delivery/reservas
- [ ] Integração com n8n

### 5. SEO e Captação
**Status:** ⚠️ Básico (metadata existe, falta otimização)

**Ações:**
- [ ] Schema.org completo (Restaurant)
- [ ] Google Business Profile integrado
- [ ] Conteúdo de captura (Sunset Sessions, Eventos)
- [ ] Meta Pixel
- [ ] UTM tracking

### 6. Integração ChefIApp OS/TPV
**Status:** ❌ Não existe

**Ações:**
- [ ] API endpoints para comunicação
- [ ] Webhooks bidirecionais
- [ ] Sincronização de pedidos
- [ ] Dashboard de operação

### 7. Automações n8n/8n8n
**Status:** ❌ Não existe

**Ações:**
- [ ] Workflows de onboarding (Clube Sofia)
- [ ] Workflows de reservas
- [ ] Workflows de pedidos delivery
- [ ] Workflows de follow-up pós-visita

---

## 🗺️ MAPA DE ROTAS

### Rotas Existentes
- ✅ `/` - Home
- ✅ `/mesa/[id]` - Página de mesa (básico)
- ✅ `/cardapio` - Menu (placeholder)
- ✅ `/dj` - Modo DJ
- ✅ `/jogo` - Mini-game

### Rotas a Criar (Prioridade ALTA)
- [ ] `/reservas` - Sistema de reservas
- [ ] `/delivery` - Pedidos delivery
- [ ] `/takeaway` - Pedidos para viagem
- [ ] `/clube-sofia` - CRM e fidelidade
- [ ] `/empresa` - B2B / "Powered by ChefIApp OS"

### Rotas a Criar (Prioridade MÉDIA)
- [ ] `/eventos` - Eventos e música
- [ ] `/sunset-sessions` - Conteúdo de captura
- [ ] `/admin` - Dashboard administrativo

---

## 🔗 ARQUITETURA DE INTEGRAÇÃO

```
┌─────────────────────────────────────────────────────────┐
│                    SOFIA WEBSITE                         │
│  (Next.js - Frontend + API Routes)                        │
└──────────────┬──────────────────────────────────────────┘
               │
               ├───► ChefIApp OS/TPV (Backend Operacional)
               │     - Pedidos
               │     - Mesas
               │     - Relatórios
               │
               ├───► SumUp (Pagamentos)
               │     - Checkout links
               │     - Webhooks
               │
               ├───► WhatsApp Business API
               │     - SofiaGastroBot
               │     - Notificações
               │
               ├───► n8n/8n8n (Automações)
               │     - Workflows
               │     - Webhooks
               │     - Integrações
               │
               └───► Database (Supabase/Postgres)
                     - Customers
                     - Orders
                     - Reservations
                     - Sessions
```

---

## 📅 CRONOGRAMA SUGERIDO

### Sprint 1 (2 semanas) - Fundação
1. ✅ Modularizar QR System (CONCLUÍDO)
2. [ ] Criar rotas de negócio (`/reservas`, `/delivery`, `/clube-sofia`)
3. [ ] Melhorar Hero com CTAs funcionais
4. [ ] Integrar Database (Supabase)

### Sprint 2 (2 semanas) - Pedidos
5. [ ] Sistema de pedidos completo (`/mesa/[id]` com menu)
6. [ ] Página `/delivery` funcional
7. [ ] Integração SumUp básica
8. [ ] Preparar estrutura para ChefIApp OS

### Sprint 3 (2 semanas) - CRM e Bot
9. [ ] Clube Sofia completo
10. [ ] WhatsApp Bot básico
11. [ ] Automações n8n iniciais
12. [ ] SEO e Schema.org completo

### Sprint 4 (2 semanas) - Integração e Automação
13. [ ] Integração ChefIApp OS completa
14. [ ] Automações n8n avançadas
15. [ ] Dashboard admin básico
16. [ ] Google Business Profile integrado

---

## 🎯 PRÓXIMA AÇÃO IMEDIATA

**Recomendação:** Começar pelo **Sprint 1 - Item 2**: Criar rotas de negócio

**Por quê?**
- Define a estrutura do site como plataforma
- Permite testar fluxos de usuário
- Prepara terreno para integrações
- Melhora SEO com páginas dedicadas

**O que fazer:**
1. Criar `/reservas` (formulário + calendário básico)
2. Criar `/delivery` (formulário de pedido)
3. Criar `/clube-sofia` (cadastro + benefícios)
4. Melhorar Hero com links funcionais
5. Adicionar seção "Como funciona"

---

**Próximo passo:** Implementar rotas de negócio ou focar em outra área específica?

