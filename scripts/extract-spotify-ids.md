# 🔍 Como Extrair IDs do Spotify - Guia Visual

## Método 1: Via Link (Mais Rápido)

### Passo a Passo:

1. **Abra a playlist no Spotify** (app ou web)

2. **Clique nos três pontinhos** (⋯) ou botão **"Share"**

3. **Selecione "Copy Link"** / **"Copiar Link"**

4. **Cole o link aqui para ver o ID:**

   ```
   https://open.spotify.com/playlist/0e6iANDPfRCwP9dttHzQ13
                                    ^^^^^^^^^^^^^^^^^^^^^^
                                    ESTE É O ID!
   ```

5. **Copie apenas a parte depois de `/playlist/`**

---

## Método 2: Via Embed (Para obter URL completa)

1. **Abra a playlist no Spotify**

2. **Clique em "Share"** → **"Embed Playlist"**

3. **Copie o código do iframe:**

   ```html
   <iframe 
     src="https://open.spotify.com/embed/playlist/0e6iANDPfRCwP9dttHzQ13?utm_source=generator"
     ...
   </iframe>
   ```

4. **Extraia a URL do `src`:**

   ```
   https://open.spotify.com/embed/playlist/0e6iANDPfRCwP9dttHzQ13?utm_source=generator
   ```

5. **O ID está aqui:**

   ```
   https://open.spotify.com/embed/playlist/0e6iANDPfRCwP9dttHzQ13?utm_source=generator
                                        ^^^^^^^^^^^^^^^^^^^^^^
                                        ESTE É O ID!
   ```

---

## 📋 Template para Preencher

Cole os links aqui e extraia os IDs:

### Playlist Sunset Sessions
- Link completo: `_________________________________`
- ID extraído: `_________________`

### Playlist Night Vibes
- Link completo: `_________________________________`
- ID extraído: `_________________`

### Playlist Breakfast Flow
- Link completo: `_________________________________`
- ID extraído: `_________________`

---

## ✅ Depois de Extrair

1. Abra `.env.local`
2. Substitua `SEU_ID_SUNSET` pelo ID da Sunset
3. Substitua `SEU_ID_NIGHT` pelo ID da Night
4. Substitua `SEU_ID_BREAKFAST` pelo ID da Breakfast
5. Salve e teste!

---

## 🎯 Exemplo Prático

**Link copiado:**
```
https://open.spotify.com/playlist/0e6iANDPfRCwP9dttHzQ13
```

**ID extraído:**
```
0e6iANDPfRCwP9dttHzQ13
```

**URLs para .env.local:**
```env
NEXT_PUBLIC_SPOTIFY_SUNSET_EMBED_URL="https://open.spotify.com/embed/playlist/0e6iANDPfRCwP9dttHzQ13?utm_source=generator"
NEXT_PUBLIC_SPOTIFY_SUNSET_OPEN_URL="https://open.spotify.com/playlist/0e6iANDPfRCwP9dttHzQ13"
```

**Pronto!** 🎉

