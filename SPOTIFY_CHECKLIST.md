# 🎵 Checklist Completa - Configuração Spotify para Sofia Gastrobar

**Data de criação:** Dezembro 2025  
**Status:** ✅ Pronto para implementação

---

## 📋 VISÃO GERAL

Este checklist guia a configuração completa do sistema de música colaborativa do Sofia Gastrobar usando Spotify. Siga os passos na ordem para garantir que tudo funcione perfeitamente.

**Tempo estimado:** 2-3 horas  
**Responsável:** Gerente / Proprietário

---

## ✅ FASE 1: CONFIGURAÇÃO DA CONTA

### 1.1 Criar/Configurar Conta Spotify Premium

- [ ] Criar conta dedicada: **Sofia Gastrobar Ibiza**
  - Email: `sofiagastrobar.ibiza@...` (ou usar conta existente)
  - Username: `Sofiagastrobaribiza` (ou similar)

- [ ] Assinar **Spotify Premium**
  - ⚠️ **ESSENCIAL**: Sem Premium, a música para com anúncios
  - Assinatura mensal ou anual
  - Manter renovação automática ativa

- [ ] Fazer login no dispositivo do bar
  - iPad / Tablet / PC fixo no restaurante
  - Manter sempre logado nesta conta
  - Não compartilhar senha com clientes

**✅ Verificação:** Conta logada, Premium ativo, dispositivo conectado

---

## ✅ FASE 2: CRIAR AS 3 PLAYLISTS OFICIAIS

### 2.1 Playlist: Sofia Sunset Sessions (17h-21h)

- [ ] Criar nova playlist no Spotify
  - Nome: **"Sofia Sunset Sessions"**
  - Descrição: "Sunsets suaves, deep house, lounge, chill, vibração balear"

- [ ] Adicionar músicas base (20-40 músicas)
  - Deep house, lounge, chill, balear
  - Músicas que combinem com pôr do sol
  - Evitar músicas explícitas ou muito pesadas

- [ ] Configurar capa da playlist
  - Tamanho mínimo: 300×300 px
  - Tamanho ideal: 600×600 px ou maior
  - Usar logo do Sofia ou arte específica
  - Upload via app Spotify

**✅ Verificação:** Playlist criada, com músicas, capa configurada

---

### 2.2 Playlist: Sofia Night Vibes (21h-01h)

- [ ] Criar nova playlist no Spotify
  - Nome: **"Sofia Night Vibes"**
  - Descrição: "House, eletrônico, vibes noturnas, latin-house, festa leve"

- [ ] Adicionar músicas base (20-40 músicas)
  - House, eletrônico, latin-house
  - Energia noturna, mas ainda elegante
  - Manter clima do restaurante

- [ ] Configurar capa da playlist
  - Mesmo padrão visual das outras playlists
  - Identidade visual do Sofia

**✅ Verificação:** Playlist criada, com músicas, capa configurada

---

### 2.3 Playlist: Sofia Breakfast Flow (08h-12h)

- [ ] Criar nova playlist no Spotify
  - Nome: **"Sofia Breakfast Flow"**
  - Descrição: "Chillhop, lo-fi, acústico, vibe tranquila para café da manhã"

- [ ] Adicionar músicas base (20-40 músicas)
  - Chillhop, lo-fi, acústico
  - Energia suave, perfeita para manhã
  - Ambiente tranquilo e relaxante

- [ ] Configurar capa da playlist
  - Mesmo padrão visual das outras playlists
  - Identidade visual do Sofia

**✅ Verificação:** Playlist criada, com músicas, capa configurada

---

## ✅ FASE 3: TORNAR PLAYLISTS COLABORATIVAS E PÚBLICAS

### 3.1 Para cada playlist (Sunset, Night, Breakfast):

- [ ] Abrir playlist no app Spotify

- [ ] Tornar colaborativa
  - Clicar nos **três pontinhos** (⋯)
  - Selecionar **"Make Collaborative"** / **"Tornar Colaborativa"**
  - ✅ Playlist agora aceita músicas de outros usuários

- [ ] Tornar pública
  - Clicar nos **três pontinhos** (⋯)
  - Selecionar **"Make Public"** / **"Tornar Pública"**
  - ✅ Playlist acessível via link/QR para qualquer pessoa

**✅ Verificação:** Todas as 3 playlists estão colaborativas E públicas

---

## ✅ FASE 4: OBTER LINKS E QR CODES

### 4.1 Para cada playlist:

- [ ] Copiar link da playlist
  - Abrir playlist → **"Share"** / **"Compartilhar"**
  - **"Copy Link"** / **"Copiar Link"**
  - Guardar o link (ex: `https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6`)

- [ ] Obter URL de embed
  - Abrir playlist → **"Share"** / **"Compartilhar"**
  - **"Embed Playlist"** / **"Incorporar Playlist"**
  - Copiar URL do iframe (ex: `https://open.spotify.com/embed/playlist/37i9dQZF1DX4WYpdgoIcn6?utm_source=generator`)

- [ ] Gerar QR Code
  - Acessar: https://www.spotifycodes.com/
  - Colar link da playlist
  - Customizar (cores, bordas, estilo)
  - Baixar em alta resolução (PNG)
  - Imprimir para colocar nas mesas

**✅ Verificação:** 3 links de playlist, 3 URLs de embed, 3 QR codes gerados

---

## ✅ FASE 5: CONFIGURAR DISPOSITIVO DO BAR

### 5.1 Setup do iPad/Tablet/PC do Bar

- [ ] Dispositivo conectado à conta Premium do Sofia
  - Login ativo
  - Premium funcionando

- [ ] Conectar à saída de som
  - Cabo auxiliar ou Bluetooth
  - Conectado às caixas/mixer do bar
  - Testar volume e qualidade

- [ ] Configurar reprodução
  - Abrir playlist correspondente ao horário
  - Dar **Play**
  - **Shuffle**: Ativado (opcional)
  - **Repeat**: Desativado
  - Volume ajustado

- [ ] Deixar rodando continuamente
  - Não pausar durante o expediente
  - Trocar playlist conforme horário:
    - 08h-12h: Breakfast Flow
    - 12h-17h: Sunset Sessions
    - 17h-01h: Night Vibes

**✅ Verificação:** Música tocando, som saindo nas caixas, playlist correta para o horário

---

## ✅ FASE 6: INTEGRAR NO SITE

### 6.1 Configurar Variáveis de Ambiente

- [ ] Criar arquivo `.env.local` na raiz do projeto

- [ ] Adicionar URLs das playlists:

```bash
# Playlist Sunset Sessions (17h-21h)
NEXT_PUBLIC_SPOTIFY_SUNSET_EMBED_URL="https://open.spotify.com/embed/playlist/SEU_ID_SUNSET?utm_source=generator"
NEXT_PUBLIC_SPOTIFY_SUNSET_OPEN_URL="https://open.spotify.com/playlist/SEU_ID_SUNSET"

# Playlist Night Vibes (21h-01h)
NEXT_PUBLIC_SPOTIFY_NIGHT_EMBED_URL="https://open.spotify.com/embed/playlist/SEU_ID_NIGHT?utm_source=generator"
NEXT_PUBLIC_SPOTIFY_NIGHT_OPEN_URL="https://open.spotify.com/playlist/SEU_ID_NIGHT"

# Playlist Breakfast Flow (8h-12h)
NEXT_PUBLIC_SPOTIFY_BREAKFAST_EMBED_URL="https://open.spotify.com/embed/playlist/SEU_ID_BREAKFAST?utm_source=generator"
NEXT_PUBLIC_SPOTIFY_BREAKFAST_OPEN_URL="https://open.spotify.com/playlist/SEU_ID_BREAKFAST"
```

- [ ] Substituir `SEU_ID_*` pelos IDs reais das playlists

- [ ] Se usar Vercel, adicionar variáveis no dashboard:
  - Settings → Environment Variables
  - Adicionar todas as variáveis acima

**✅ Verificação:** Variáveis configuradas, site mostra playlists corretas

---

## ✅ FASE 7: COLOCAR QR CODES NAS MESAS

### 7.1 Preparar QR Codes Físicos

- [ ] Imprimir QR codes em alta qualidade
  - Tamanho mínimo: 5×5 cm
  - Papel resistente (laminado se possível)
  - Testar escaneamento antes de imprimir

- [ ] Colocar nas mesas
  - Uma cópia por mesa
  - Posição visível e acessível
  - Protegido contra água/derramamentos

- [ ] Adicionar instrução simples
  - "Escaneie para escolher a música 🎶"
  - "Adicione até 2 músicas à nossa playlist"

**✅ Verificação:** QR codes impressos, colocados nas mesas, funcionando

---

## ✅ FASE 8: REGRAS E MODERAÇÃO

### 8.1 Comunicar Regras aos Clientes

- [ ] Exibir regras no site
  - Máximo 2 músicas por pessoa
  - Manter clima chill e relaxante
  - Evitar músicas explícitas ou agressivas
  - A casa pode pular músicas que quebrem o clima

- [ ] Treinar equipe
  - Garçons sabem explicar o sistema
  - Sabem onde está o QR code
  - Entendem as regras

### 8.2 Moderação da Playlist

- [ ] Designar responsável pela moderação
  - Gerente ou pessoa de confiança
  - Acesso à conta do Spotify do bar

- [ ] Rotina de moderação
  - Revisar playlist diariamente
  - Remover músicas problemáticas
  - Reordenar se necessário
  - Limpar playlist de tempos em tempos

**✅ Verificação:** Regras comunicadas, equipe treinada, moderação ativa

---

## ✅ FASE 9: BRANDING E ENGAJAMENTO

### 9.1 Identidade Visual

- [ ] Capas das playlists com logo do Sofia
  - Todas as 3 playlists com identidade visual consistente
  - Logo oficial ou arte específica

- [ ] Perfil do Spotify
  - Foto de perfil: Logo do Sofia
  - Nome: "Sofia Gastrobar Ibiza"
  - Bio: Descrição do restaurante

### 9.2 Promoção

- [ ] Destacar no site
  - Seção "Sofia Magic DJ™" visível
  - Botão destacado na página da mesa

- [ ] Promover nas redes sociais
  - Posts sobre o sistema
  - Stories com QR code
  - Incentivar participação

- [ ] Integrar com Clube Sofia (futuro)
  - Pontos para quem usar o Modo DJ
  - Experiência + fidelização

**✅ Verificação:** Branding consistente, promoção ativa

---

## ✅ FASE 10: TESTE FINAL

### 10.1 Testar Fluxo Completo

- [ ] Testar QR code da mesa
  - Escanear com celular
  - Abrir página do site
  - Ver Modo DJ na página

- [ ] Testar adicionar música
  - Clicar "Abrir no Spotify"
  - Adicionar música na playlist colaborativa
  - Verificar se aparece na playlist do bar

- [ ] Testar reprodução
  - Música aparece na fila
  - Toca em ordem
  - Não interrompe música atual

- [ ] Testar em diferentes horários
  - Manhã: mostra Breakfast Flow
  - Tarde: mostra Sunset Sessions
  - Noite: mostra Night Vibes

**✅ Verificação:** Tudo funcionando, sistema pronto para uso

---

## 📝 NOTAS IMPORTANTES

### ⚠️ Lembretes Críticos

1. **Spotify Premium deve estar sempre ativo**
   - Se expirar, a música para
   - Configurar renovação automática

2. **Playlist colaborativa = apenas adicionar músicas**
   - Clientes não controlam play/pausa
   - Controle fica com a conta do bar

3. **Moderação é essencial**
   - Revisar playlist regularmente
   - Remover músicas problemáticas
   - Manter clima do restaurante

4. **Trocar playlist conforme horário**
   - 08h-12h: Breakfast Flow
   - 12h-17h: Sunset Sessions
   - 17h-01h: Night Vibes

---

## 🎯 RESULTADO ESPERADO

Após completar este checklist, você terá:

✅ Sistema de música colaborativa funcionando  
✅ Clientes podem adicionar músicas via QR code  
✅ Playlists organizadas por horário/clima  
✅ Integração completa com o site  
✅ Branding consistente  
✅ Moderação ativa  

**O Sofia Gastrobar terá o sistema de música mais preparado de Ibiza! 🎵**

---

## 📞 SUPORTE

Se tiver dúvidas durante a configuração:
- Consultar `SPOTIFY_SETUP.md` para detalhes técnicos
- Verificar documentação do Spotify: https://support.spotify.com
- Contatar equipe técnica se necessário

---

**Última atualização:** Dezembro 2025  
**Versão:** 1.0

