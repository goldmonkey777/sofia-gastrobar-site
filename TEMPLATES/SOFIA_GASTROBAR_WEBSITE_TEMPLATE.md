# 🌅 SOFIA_GASTROBAR_WEBSITE_TEMPLATE.md

**Template oficial – Goldmonkey Studio – Versão 1.0 (Atual + Futuro)**

---

## 1. ✨ Identidade & Propósito

Sofia Gastrobar Ibiza é a fusão entre:
- Gastronomia mediterrânea
- Energia balear
- Tecnologia inteligente
- Experiências digitais
- Música colaborativa
- Atendimento otimizado
- Arte e misticismo

A página deve transmitir:
- Leveza
- Conexão espiritual
- Sunset vibes
- Profissionalismo
- Modernidade
- Ibiza lifestyle

A estética geral deve ser:
- Cristalina
- Colorida com gradientes suaves
- Inspiração Flower of Life (logo)
- Ícones elegantes
- Tipografia suave e amigável

---

## 2. 🏛️ Estrutura Geral do Site

O site deve ser **100% mobile-first** porque:
- 90% dos clientes são turistas
- 90% desses turistas acessam via QR
- Eles usam telefone dentro e fora do bar

A estrutura principal é:

```
/
├── Home (landing page)
├── Menu
├── Mesa/[id] (QR interno)
├── DJ (Modo Sofia Magic DJ™)
├── Delivery
├── Reservas
├── Clube Sofia (CRM)
├── Sobre / Lenda de Sofia
├── Contato
└── Admin (oculto – ChefIApp OS Bridge)
```

---

## 3. 🏠 Página Home – "Magia, Fogo e Sabor"

**Elementos obrigatórios:**
- Hero com foto de sunset + tagline
- Botões principais:
  - Ver Menu
  - Reservar Mesa
  - Delivery para Ibiza
- Ícones das categorias do menu (Tapas, Bowls, Burgers etc.)
- Seção "A Lenda de Sofia" (texto místico)
- Seção "Cozinha de Alma Livre"
- Destaque de cocktails (com fotos grandes)
- Integração com Instagram
- Google Map embed
- Horário de funcionamento
- Botão WhatsApp fixo
- Rodapé: "Designed by Goldmonkey Studio"
- Link para "Sofia Magic DJ™"

---

## 4. 🍽️ Página Menu (para turistas e QR externo)

**Prioridades:**
- Carregar rápido
- Fotos grandes
- Multilíngue EN/ES/PT
- Filtros por categorias
- Destaques automáticos por horário:
  - Breakfast Flow: 08:00–12:00
  - Lunch: 12:00–17:00
  - Tapas & Dinner: 17:00–01:00

**Elementos:**
- Grid de pratos com:
  - Foto
  - Nome
  - Preço
  - Descrição curta
  - Alérgenos
  - Destaques "Mais pedidos"
  - Opção de visualizar combos / sugestões

**Backend futurista:**
- Menu carregado dinamicamente via ChefIApp OS
- Mudança de preço/sazonalidade em tempo real
- A/B tests automáticos de posições de pratos

---

## 5. 🍽️ Página Mesa /mesa/[id] – QR interno

**A página mais importante do restaurante.**

Quando turista escaneia o QR da mesa →

➡️ Entra direto em `/mesa/12` ou equivalente.

**Funções obrigatórias:**
- Mostrar o menu imediatamente
- Mostrar recomendações baseadas no horário
- Chamar garçom
- Pedir conta (somente após pedido)
- Entrar no Clube Sofia
- Acesso ao Modo DJ (escolher música)
- Botão WhatsApp da mesa (caso disponível)

**Futuro:**
- Fazer pedido direto pelo site (pedido interno)
- Mostrar estado do pedido:
  - Preparando
  - A caminho
  - Servido
- Mostrar fila de atendimento

---

## 6. 🎧 Página DJ – Sofia Magic DJ™

**Objetivo:**

Que o cliente participe da música do bar.

**Elementos:**
- Título: Sofia Magic DJ™ – Escolha a Próxima Música
- Descrição:
  - Adicione até 2 músicas à playlist oficial do Sunset.
  - Sua música entra na fila sem interromper a vibe atual.
- Embed da playlist do Spotify (Sunset / Night / Breakfast)
- Botão: Abrir no Spotify
- QR da playlist (para imprimir e colocar nas mesas)
- Regras:
  - Máximo 2 músicas
  - Sem músicas explícitas
  - A casa mantém controle de volume e vibe

**Futuro:**
- Pontos no Clube Sofia para quem adiciona músicas
- Ranking "DJ da Noite"
- Analytics: músicas mais pedidas

---

## 7. 📦 Página Delivery – Entrega para Toda Ibiza

**Elementos:**
- Escolher endereço
- Mostrar zonas e tempos de entrega
- Menu especial de delivery
- Formulário rápido
- Pagamento via SumUp Link
- Confirmação via WhatsApp
- Tracking básico (pedido aceito → saiu para entrega)

**Futuro:**
- Integração total com ChefIApp OS
- Painel de entregas
- Taxas por zona automaticamente calculadas

---

## 8. 📞 Página Reservas

**Elementos:**
- Formulário simples (nome, telefone, pessoas, horário)
- Escolha de área:
  - Interior
  - Terraço
  - Sunset front
- Confirmação automática via WhatsApp
- Envio para ChefIApp OS (painel do gerente)

---

## 9. 💛 Clube Sofia – CRM e Fidelização

**Página /clube-sofia:**
- Formulário de inscrição (nome, telefone, idioma)
- Benefícios:
  - Pontos por visita
  - Brindes surpresa
  - Eventos secretos
  - Prioridade em reservas
  - Promoções exclusivas
  - QR de cadastro nas mesas

**Backend:**
- Supabase / PostgreSQL
- Automação n8n para:
  - registrar cliente
  - enviar mensagem automática
  - gerenciamento de tags

---

## 10. 🧭 Página Sobre – "A Lenda de Sofia"

**Conteúdo emocional e artístico:**
- A história da viajante Sofia
- A benção de Tânit
- O ritual do fogo e do mar
- Porque o gastrobar é uma casa de encantamento
- Fotos, vídeos, arte

---

## 11. 🧯 Página Admin – ChefIApp OS Bridge (não pública)

**Para uso interno:**
- Controle de mesas
- Chamados
- Status dos pedidos
- Dashboard em tempo real
- Controle de playlists (visão DJ)
- Acesso do gerente/dono

---

## 12. 🎛️ Módulos técnicos obrigatórios no template

### Módulo 1 – QR Mesa
- Geração automática
- Rota dinâmica `/mesa/[id]`

### Módulo 2 – DJ Spotify
- Embeds configuráveis via `.env`
- Componente visual

### Módulo 3 – Menu Dinâmico
- JSON → render → otimização mobile

### Módulo 4 – Sistema de Reservas
- API route
- Envio para WhatsApp
- Dashboard do gerente

### Módulo 5 – Delivery
- API + UI
- Pagamento SumUp
- Tracking

### Módulo 6 – Clube Sofia (CRM)
- Supabase
- Automação n8n
- Rewards

### Módulo 7 – Analytics
- Heatmap de visitas
- Pratos mais visualizados
- Músicas mais pedidas
- Horários de maior tráfego
- Origem de tráfego (Google / QR externo / Insta)

---

## 13. 📦 Pasta recomendada no repositório

```
/TEMPLATES/
 └── SOFIA_GASTROBAR_WEBSITE_TEMPLATE.md
```

E dentro do projeto do Sofia:

```
/app
  /mesa/[id]
  /dj
  /delivery
  /reservas
  /clube-sofia
  /admin
/components
/modules
/public/images
/styles
```

---

## 14. 🧠 Filosofia Goldmonkey para este template

- Tudo é experiência
- Tudo é automação
- Tudo é poesia
- Tudo é tecnologia suave
- Tudo é Ibiza
- Tudo é inteligência operacional
- **Tudo deve funcionar no celular, na mão do turista, sem fricção.**

---

## 💎 PRONTO.

Esse documento é completo, eterno, escalável e já no padrão Goldmonkey OS.

---

**Template oficial – Goldmonkey Studio**  
**Versão 1.0**  
**Última atualização: 2024**
