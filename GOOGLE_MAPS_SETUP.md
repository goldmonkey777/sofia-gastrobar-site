# 🗺️ Google Maps API - Setup Completo

## Configuração para Localização e Endereços

### 1. Obter API Key do Google Maps

1. Acesse: https://console.cloud.google.com/
2. Crie um projeto ou selecione um existente
3. Ative as seguintes APIs:
   - **Maps JavaScript API** (obrigatório)
   - **Places API** (obrigatório para autocomplete)
   - **Geocoding API** (obrigatório para reverse geocoding)
4. Vá em "Credenciais" → "Criar credenciais" → "Chave de API"
5. Copie a chave gerada

### 2. Configurar Restrições (Recomendado)

Para segurança, configure restrições na API key:

1. Vá em "Credenciais" → Clique na sua API key
2. Em "Restrições de aplicativo":
   - Selecione "Referenciadores de sites HTTP"
   - Adicione:
     - `https://sofiagastrobaribiza.com/*`
     - `http://localhost:3000/*` (para desenvolvimento)
3. Em "Restrições de API":
   - Selecione "Restringir chave"
   - Marque apenas:
     - Maps JavaScript API
     - Places API
     - Geocoding API

### 3. Configurar Variável de Ambiente

Adicione no `.env.local`:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="sua-api-key-aqui"
```

E no Vercel:
1. Vá em Settings → Environment Variables
2. Adicione: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
3. Cole sua API key
4. Selecione todos os ambientes (Production, Preview, Development)

### 4. Funcionalidades Implementadas

✅ **Google Places Autocomplete**
- Autocomplete de endereços em tempo real
- Restrito a Espanha (Ibiza)
- Suporte multilíngue

✅ **Geolocalização**
- Obter localização precisa do GPS
- Reverse geocoding (coordenadas → endereço)
- Fallback para OpenStreetMap se API key não configurada

✅ **Detecção Automática de Zona**
- Detecta zona de Ibiza baseado em coordenadas
- Calcula taxa de entrega automaticamente
- 4 zonas principais + "outra zona"

✅ **Integração Apple Maps**
- Deep links para Apple Maps (iOS)
- Fallback para web no Android/Desktop

✅ **Preenchimento Automático**
- Usa dados salvos no navegador (localStorage)
- Botão "Preencher com Meus Dados"
- Salva dados após primeiro uso

### 5. Testar

1. Acesse `/delivery`
2. Clique em "Usar Minha Localização"
3. Permita acesso à localização
4. Endereço será preenchido automaticamente
5. Zona será detectada automaticamente

### 6. Custos

**Google Maps API:**
- Primeiros $200/mês são gratuitos
- Places API: $17 por 1000 requests
- Geocoding API: $5 por 1000 requests
- Maps JavaScript API: $7 por 1000 loads

**Estimativa para Sofia Gastrobar:**
- ~1000 usuários/mês
- ~2000 requests de Places/mês
- Custo estimado: ~$50/mês (dentro do crédito gratuito)

### 7. Troubleshooting

**Erro: "Google Maps API key not found"**
- Verifique se a variável está em `.env.local`
- Reinicie o servidor de desenvolvimento
- Verifique se está usando `NEXT_PUBLIC_` no início

**Erro: "This API project is not authorized"**
- Verifique se as APIs estão ativadas
- Verifique restrições da API key
- Aguarde alguns minutos após ativar APIs

**Autocomplete não funciona:**
- Verifique se Places API está ativada
- Verifique se a biblioteca `places` está no script
- Verifique console do navegador para erros

### 8. Alternativa Gratuita (Fallback)

Se não quiser usar Google Maps, o sistema usa:
- **OpenStreetMap Nominatim** (gratuito)
- Limitações: 1 request/segundo, menos preciso
- Funciona sem API key

---

**Status:** ✅ Implementado e pronto para uso
**Próximo passo:** Adicionar API key no Vercel

