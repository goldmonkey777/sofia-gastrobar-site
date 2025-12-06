# 🚀 Setup Rápido do Spotify - 5 Minutos

## 📋 O que você precisa (5 informações)

### 1️⃣ **Playlist IDs** (o mais importante!)

Para cada playlist, você precisa do **ID único**.

**Como obter:**
1. Abra a playlist no Spotify
2. Clique em **"Share"** / **"Compartilhar"**
3. Clique em **"Copy Link"** / **"Copiar Link"**
4. O link será algo como: `https://open.spotify.com/playlist/0e6iANDPfRCwP9dttHzQ13`
5. **Copie apenas a parte depois de `/playlist/`** → `0e6iANDPfRCwP9dttHzQ13`

**Você precisa de 3 IDs:**
- [ ] ID da playlist **Sunset Sessions**
- [ ] ID da playlist **Night Vibes**
- [ ] ID da playlist **Breakfast Flow**

---

### 2️⃣ **URL Pública da Playlist**

Essa é a URL completa que você copiou no passo 1.

**Exemplo:**
```
https://open.spotify.com/playlist/0e6iANDPfRCwP9dttHzQ13
```

**Usado para:** Botão "Abrir no Spotify"

---

### 3️⃣ **URL do Embed (iframe)**

Essa é a versão especial para mostrar no site.

**Como obter:**
1. Abra a playlist no Spotify
2. Clique em **"Share"** / **"Compartilhar"**
3. Clique em **"Embed Playlist"** / **"Incorporar Playlist"**
4. Copie a URL do iframe (ex: `https://open.spotify.com/embed/playlist/0e6iANDPfRCwP9dttHzQ13?utm_source=generator`)

**Formato:**
```
https://open.spotify.com/embed/playlist/SEU_ID?utm_source=generator
```

**Usado para:** Mostrar player no site

---

### 4️⃣ **Nome da Conta**

Já temos: **"Sofia Gastrobar Ibiza"** ✅

---

### 5️⃣ **Capas das Playlists**

As imagens que você usou como capa das playlists.

**Tamanho ideal:** 600×600 px ou maior  
**Formato:** PNG ou JPG

---

## ⚡ Setup em 3 Passos

### Passo 1: Copiar Template

```bash
cp .env.local.template .env.local
```

### Passo 2: Preencher IDs

Abra `.env.local` e substitua:
- `SEU_ID_SUNSET` → ID da playlist Sunset
- `SEU_ID_NIGHT` → ID da playlist Night  
- `SEU_ID_BREAKFAST` → ID da playlist Breakfast

### Passo 3: Testar

```bash
npm run dev
```

Acesse: `http://localhost:3000/mesa/01` e veja o Modo DJ funcionando!

---

## 📝 Exemplo Completo

Se sua playlist Sunset tem ID `0e6iANDPfRCwP9dttHzQ13`:

```env
NEXT_PUBLIC_SPOTIFY_SUNSET_EMBED_URL="https://open.spotify.com/embed/playlist/0e6iANDPfRCwP9dttHzQ13?utm_source=generator"
NEXT_PUBLIC_SPOTIFY_SUNSET_OPEN_URL="https://open.spotify.com/playlist/0e6iANDPfRCwP9dttHzQ13"
```

---

## ✅ Checklist Rápido

- [ ] Tenho 3 playlists criadas no Spotify
- [ ] Todas estão **públicas** e **colaborativas**
- [ ] Copiei os 3 IDs das playlists
- [ ] Criei `.env.local` a partir do template
- [ ] Preenchi todos os IDs no `.env.local`
- [ ] Testei localmente e funcionou
- [ ] Adicionei variáveis no Vercel (se usar)

---

## 🎯 Pronto!

Depois de preencher o `.env.local`, o Modo DJ estará 100% funcional no site!

**Tempo total:** ~5 minutos ⚡

