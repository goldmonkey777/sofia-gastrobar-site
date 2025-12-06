# 📋 Backlog de Implementação - Sofia Gastrobar

**Data:** 2024  
**Status:** Análise completa do que falta implementar

---

## ✅ O QUE JÁ ESTÁ IMPLEMENTADO

### 🏠 Páginas e Rotas
- ✅ `/` - Home completa (Hero, Lenda, Menu Highlights, How It Works)
- ✅ `/mesa/[id]` - Página da mesa com menu, carrinho, pedidos
- ✅ `/cardapio` - Menu público completo
- ✅ `/dj` - Modo DJ com playlists Spotify
- ✅ `/delivery` - Sistema de delivery com localização GPS
- ✅ `/reservas` - Sistema de reservas
- ✅ `/clube-sofia` - CRM e fidelização (básico)
- ✅ `/sobre` - Página sobre a lenda
- ✅ `/contato` - Página de contato
- ✅ `/admin` - Dashboard admin (estrutura básica)

### 🎛️ Módulos Técnicos
- ✅ **Módulo 1 - QR Mesa**: Completo e modularizado
- ✅ **Módulo 2 - DJ Spotify**: Playlists configuráveis via .env
- ✅ **Módulo 3 - Menu Dinâmico**: JSON → render, filtros por horário
- ✅ **Módulo 4 - Sistema de Reservas**: API route + formulário
- ✅ **Módulo 5 - Delivery**: API + UI + localização GPS
- ⚠️ **Módulo 6 - Clube Sofia**: Estrutura básica (falta Supabase)
- ❌ **Módulo 7 - Analytics**: Não implementado

### 🔧 Funcionalidades Core
- ✅ Sistema de pedidos na mesa (carrinho + checkout)
- ✅ Chamar garçom via API
- ✅ Pedir conta via API
- ✅ Sistema de sessão de mesa
- ✅ Geolocalização e cálculo de taxas de entrega
- ✅ Preenchimento automático de dados do usuário
- ✅ Multilíngue (PT/ES/EN) automático
- ✅ Tela de confirmação de pedido

---

## ❌ O QUE AINDA FALTA IMPLEMENTAR

### 🔴 PRIORIDADE ALTA

#### 1. **Integração com Supabase/PostgreSQL**
**Status:** ❌ Não implementado  
**Impacto:** Crítico - sem database real, dados são perdidos

**Tarefas:**
- [ ] Configurar Supabase project
- [ ] Criar schema de database (reservations, orders, customers, etc.)
- [ ] Migrar `src/lib/db/mock.ts` para chamadas reais ao Supabase
- [ ] Implementar autenticação Supabase (se necessário)
- [ ] Configurar variáveis de ambiente
- [ ] Testar CRUD completo

**Arquivos a modificar:**
- `src/lib/db/mock.ts` → `src/lib/db/supabase.ts`
- Todas as API routes que usam mock database

---

#### 2. **Integração WhatsApp Business API**
**Status:** ❌ Não implementado  
**Impacto:** Alto - confirmações e notificações

**Tarefas:**
- [ ] Configurar WhatsApp Business API
- [ ] Criar bot SofiaGastroBot
- [ ] Integrar confirmação de reservas via WhatsApp
- [ ] Integrar confirmação de pedidos delivery via WhatsApp
- [ ] Integrar notificações de status de pedido
- [ ] Criar workflows de mensagens automáticas

**Arquivos a criar:**
- `src/lib/whatsapp/client.ts`
- `src/app/api/whatsapp/route.ts`
- `src/lib/whatsapp/templates.ts`

---

#### 3. **Integração SumUp (Pagamentos)**
**Status:** ❌ Não implementado  
**Impacto:** Alto - necessário para checkout

**Tarefas:**
- [ ] Configurar conta SumUp
- [ ] Criar checkout links dinâmicos
- [ ] Integrar webhooks de pagamento
- [ ] Adicionar fluxo de pagamento no delivery
- [ ] Adicionar fluxo de pagamento na mesa (pedir conta)
- [ ] Tratamento de erros e cancelamentos

**Arquivos a criar:**
- `src/lib/sumup/client.ts`
- `src/app/api/sumup/route.ts`
- `src/app/api/sumup/webhook/route.ts`

---

#### 4. **Integração ChefIApp OS**
**Status:** ❌ Não implementado  
**Impacto:** Crítico - sistema operacional do restaurante

**Tarefas:**
- [ ] Documentar API do ChefIApp OS
- [ ] Criar client para comunicação
- [ ] Sincronizar pedidos (mesa + delivery)
- [ ] Sincronizar reservas
- [ ] Webhooks bidirecionais
- [ ] Dashboard de integração

**Arquivos a criar:**
- `src/lib/chefiapp/client.ts`
- `src/app/api/chefiapp/route.ts`
- `src/app/api/chefiapp/webhook/route.ts`

---

#### 5. **Sistema de Tracking de Pedidos**
**Status:** ⚠️ Parcial (estrutura existe, falta UI)  
**Impacto:** Médio - UX importante

**Tarefas:**
- [ ] Criar página `/pedido/[id]` para tracking
- [ ] Mostrar estados: Preparando → A caminho → Servido
- [ ] Notificações push (se possível)
- [ ] Integrar com ChefIApp OS para atualizações
- [ ] Timeline visual do pedido

**Arquivos a criar:**
- `src/app/pedido/[id]/page.tsx`
- `src/components/order/OrderTracking.tsx`
- `src/components/order/OrderStatus.tsx`

---

### 🟡 PRIORIDADE MÉDIA

#### 6. **Automações n8n**
**Status:** ❌ Não implementado  
**Impacto:** Médio - melhora operação

**Tarefas:**
- [ ] Configurar n8n instance
- [ ] Workflow: Novo cliente no Clube Sofia → Mensagem WhatsApp
- [ ] Workflow: Nova reserva → Notificação gerente
- [ ] Workflow: Pedido delivery → Atualizar status
- [ ] Workflow: Follow-up pós-visita
- [ ] Webhooks para comunicação

---

#### 7. **Sistema de Pontos e Rewards (Clube Sofia)**
**Status:** ⚠️ Estrutura básica existe  
**Impacto:** Médio - fidelização

**Tarefas:**
- [ ] Implementar sistema de pontos
- [ ] Pontos por visita
- [ ] Pontos por pedidos
- [ ] Pontos por adicionar músicas (DJ)
- [ ] Sistema de benefícios e recompensas
- [ ] Dashboard de pontos para cliente
- [ ] Integrar com Supabase

**Arquivos a modificar:**
- `src/app/clube-sofia/page.tsx`
- `src/lib/rewards/points.ts`
- `src/components/rewards/PointsDisplay.tsx`

---

#### 8. **Analytics e Métricas (Módulo 7)**
**Status:** ❌ Não implementado  
**Impacto:** Médio - insights importantes

**Tarefas:**
- [ ] Integrar Google Analytics / Vercel Analytics
- [ ] Heatmap de visitas
- [ ] Pratos mais visualizados
- [ ] Músicas mais pedidas (DJ)
- [ ] Horários de maior tráfego
- [ ] Origem de tráfego (Google / QR / Instagram)
- [ ] Dashboard de analytics no admin

**Arquivos a criar:**
- `src/lib/analytics/tracking.ts`
- `src/components/analytics/Heatmap.tsx`
- `src/app/admin/analytics/page.tsx`

---

#### 9. **Melhorias na Página Home**
**Status:** ⚠️ Parcial  
**Impacto:** Baixo - melhorias visuais

**Tarefas:**
- [ ] Integração com Instagram (feed)
- [ ] Google Map embed (já tem localização, falta embed)
- [ ] Horário de funcionamento mais destacado
- [ ] Link para "Sofia Magic DJ™" mais visível
- [ ] Rodapé: "Designed by Goldmonkey Studio"

---

#### 10. **Autenticação e Segurança Admin**
**Status:** ❌ Não implementado  
**Impacto:** Alto - segurança crítica

**Tarefas:**
- [ ] Implementar NextAuth.js
- [ ] Sistema de login para admin
- [ ] Permissões (gerente, dono, staff)
- [ ] Proteger rotas `/admin`
- [ ] Proteger API routes sensíveis

**Arquivos a criar:**
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/middleware.ts`
- `src/lib/auth/permissions.ts`

---

### 🟢 PRIORIDADE BAIXA / FUTURO

#### 11. **WebSockets para Tempo Real**
**Status:** ❌ Não implementado  
**Impacto:** Baixo - melhora UX

**Tarefas:**
- [ ] Configurar WebSocket server
- [ ] Atualizações em tempo real de pedidos
- [ ] Notificações push
- [ ] Chat em tempo real (se necessário)

---

#### 12. **A/B Testing de Menu**
**Status:** ❌ Não implementado  
**Impacto:** Baixo - otimização futura

**Tarefas:**
- [ ] Sistema de A/B testing
- [ ] Testar posições de pratos
- [ ] Analytics de conversão

---

#### 13. **Ranking "DJ da Noite"**
**Status:** ❌ Não implementado  
**Impacto:** Baixo - gamificação

**Tarefas:**
- [ ] Sistema de ranking
- [ ] Pontos por músicas adicionadas
- [ ] Leaderboard
- [ ] Prêmios semanais

---

#### 14. **Menu Dinâmico via ChefIApp OS**
**Status:** ⚠️ Atualmente usa JSON estático  
**Impacto:** Baixo - melhora operação

**Tarefas:**
- [ ] API para buscar menu do ChefIApp OS
- [ ] Cache inteligente
- [ ] Atualização automática de preços
- [ ] Sazonalidade automática

---

#### 15. **QR Code da Playlist (DJ)**
**Status:** ❌ Não implementado  
**Impacto:** Baixo - conveniência

**Tarefas:**
- [ ] Gerar QR code para cada playlist
- [ ] Página de impressão
- [ ] QR codes nas mesas

---

## 📊 RESUMO POR CATEGORIA

### 🔴 Crítico (Bloqueadores)
1. **Supabase/PostgreSQL** - Sem database real
2. **ChefIApp OS** - Sistema operacional do restaurante
3. **SumUp** - Pagamentos necessários

### 🟡 Importante (Melhora Operação)
4. **WhatsApp Business API** - Comunicação
5. **Tracking de Pedidos** - UX
6. **Autenticação Admin** - Segurança
7. **Sistema de Pontos** - Fidelização
8. **Analytics** - Insights

### 🟢 Nice to Have (Futuro)
9. WebSockets
10. A/B Testing
11. Ranking DJ
12. Menu dinâmico ChefIApp
13. QR Playlist

---

## 🎯 PRÓXIMOS PASSOS RECOMENDADOS

### Sprint 1 (2 semanas) - Fundação
1. ✅ Modularizar QR System (CONCLUÍDO)
2. ✅ Criar rotas de negócio (CONCLUÍDO)
3. [ ] **Integrar Supabase** ← PRÓXIMO
4. [ ] Configurar variáveis de ambiente

### Sprint 2 (2 semanas) - Integrações Core
5. [ ] Integração SumUp
6. [ ] Integração WhatsApp Business API
7. [ ] Sistema de tracking de pedidos
8. [ ] Preparar estrutura ChefIApp OS

### Sprint 3 (2 semanas) - Operação
9. [ ] Integração ChefIApp OS completa
10. [ ] Autenticação admin
11. [ ] Sistema de pontos completo
12. [ ] Analytics básico

### Sprint 4 (2 semanas) - Automação
13. [ ] Automações n8n
14. [ ] WebSockets (se necessário)
15. [ ] Melhorias finais
16. [ ] Testes e otimização

---

## 📝 NOTAS IMPORTANTES

### Database Mock
- Atualmente usando `src/lib/db/mock.ts` (em memória)
- **IMPORTANTE:** Dados são perdidos ao reiniciar servidor
- Substituir por Supabase assim que possível

### APIs Existentes
- ✅ `/api/garcom` - Chamar garçom e pedir conta
- ✅ `/api/reservas` - Criar e buscar reservas
- ✅ `/api/delivery` - Criar e buscar pedidos delivery
- ✅ `/api/pedidos` - Criar e buscar pedidos de mesa
- ✅ `/api/clube-sofia` - Gerenciar clientes

### Variáveis de Ambiente Necessárias
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_KEY`
- [ ] `WHATSAPP_API_KEY`
- [ ] `WHATSAPP_PHONE_NUMBER_ID`
- [ ] `SUMUP_API_KEY`
- [ ] `CHEFIAPP_API_KEY`
- [ ] `CHEFIAPP_API_URL`
- [ ] `N8N_WEBHOOK_URL`

---

**Última atualização:** 2024  
**Status do projeto:** ~60% completo  
**Próxima ação:** Integrar Supabase

