# 🚀 Variáveis de Ambiente para Vercel

## Adicionar no Vercel Dashboard

Vá em: **Settings → Environment Variables**

Adicione as seguintes variáveis para **Production**:

### Playlist Sunset Sessions (17h-21h)

```
NEXT_PUBLIC_SPOTIFY_SUNSET_EMBED_URL
https://open.spotify.com/embed/playlist/5az1XeIPO0ijDQiz1nykRW?utm_source=generator
```

```
NEXT_PUBLIC_SPOTIFY_SUNSET_OPEN_URL
https://open.spotify.com/playlist/5az1XeIPO0ijDQiz1nykRW
```

### Playlist Night Vibes (21h-01h)

```
NEXT_PUBLIC_SPOTIFY_NIGHT_EMBED_URL
https://open.spotify.com/embed/playlist/34bVZ5Yt3D7g2YeO8ELVaA?utm_source=generator
```

```
NEXT_PUBLIC_SPOTIFY_NIGHT_OPEN_URL
https://open.spotify.com/playlist/34bVZ5Yt3D7g2YeO8ELVaA
```

### Playlist Breakfast Flow (8h-12h)

```
NEXT_PUBLIC_SPOTIFY_BREAKFAST_EMBED_URL
https://open.spotify.com/embed/playlist/0e6iANDPfRCwP9dttHzQ13?utm_source=generator
```

```
NEXT_PUBLIC_SPOTIFY_BREAKFAST_OPEN_URL
https://open.spotify.com/playlist/0e6iANDPfRCwP9dttHzQ13
```

## Após Adicionar

1. Vá em **Deployments**
2. Clique nos **três pontinhos** do último deploy
3. Selecione **"Redeploy"**
4. Aguarde o deploy completar

## Verificação

Acesse: `https://sofiagastrobaribiza.com/mesa/01`

O Modo DJ deve aparecer com a playlist correta para o horário atual! 🎵

