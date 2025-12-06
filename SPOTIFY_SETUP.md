# 🎵 Configuração do Spotify - Modo DJ

## ⚡ Setup Rápido (5 minutos)

**Para começar rápido, veja:** [`SPOTIFY_QUICK_SETUP.md`](./SPOTIFY_QUICK_SETUP.md)

---

## Perfil Oficial

**Perfil do Sofia Gastrobar Ibiza:**
- URL: https://open.spotify.com/user/316axpbhhlk3dy6duqdfctbbec2y
- Playlist atual: "Bob Marley Lives in Ibiza 1978"

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```bash
# Spotify - Modo DJ
# Configure as URLs das playlists colaborativas do Spotify

# Playlist Sunset Sessions (17h-21h)
NEXT_PUBLIC_SPOTIFY_SUNSET_EMBED_URL="https://open.spotify.com/embed/playlist/SEU_PLAYLIST_ID_SUNSET?utm_source=generator"
NEXT_PUBLIC_SPOTIFY_SUNSET_OPEN_URL="https://open.spotify.com/playlist/SEU_PLAYLIST_ID_SUNSET"

# Playlist Night Vibes (21h-01h)
NEXT_PUBLIC_SPOTIFY_NIGHT_EMBED_URL="https://open.spotify.com/embed/playlist/SEU_PLAYLIST_ID_NIGHT?utm_source=generator"
NEXT_PUBLIC_SPOTIFY_NIGHT_OPEN_URL="https://open.spotify.com/playlist/SEU_PLAYLIST_ID_NIGHT"

# Playlist Breakfast Flow (8h-12h)
NEXT_PUBLIC_SPOTIFY_BREAKFAST_EMBED_URL="https://open.spotify.com/embed/playlist/SEU_PLAYLIST_ID_BREAKFAST?utm_source=generator"
NEXT_PUBLIC_SPOTIFY_BREAKFAST_OPEN_URL="https://open.spotify.com/playlist/SEU_PLAYLIST_ID_BREAKFAST"
```

## Como obter as URLs

1. Crie as playlists no Spotify (conta do bar)
2. Torne-as **Públicas** e **Colaborativas**
3. Abra a playlist → "Compartilhar" → "Copiar link da playlist"
4. Para o embed: "Compartilhar" → "Incorporar playlist" → copie a URL do iframe

## Exemplo de URLs

- **Embed URL**: `https://open.spotify.com/embed/playlist/37i9dQZF1DX4WYpdgoIcn6?utm_source=generator`
- **Open URL**: `https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6`

## Playlists Sugeridas

- **Sofia Sunset Sessions** (17h-21h) - Fim de tarde, drinks, vibe relaxante
- **Sofia Night Vibes** (21h-01h) - Noite, energia, festa
- **Sofia Breakfast Flow** (8h-12h) - Manhã, café, energia suave

