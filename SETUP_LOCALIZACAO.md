# 🗺️ Setup Completo - Sistema de Localização

## ✅ Status: 100% Implementado

O sistema de localização está **completamente implementado** e pronto para uso. Siga os passos abaixo para ativá-lo.

---

## 📋 Checklist de Configuração

### 1. ✅ Código Implementado
- [x] Hook `useGeolocation` criado
- [x] Hook `useUserData` criado
- [x] Componente `AddressInput` criado
- [x] Componente `UserDataAutoFill` criado
- [x] Helpers de localização criados
- [x] Integração nas páginas `/delivery` e `/reservas`
- [x] Multilíngue completo (PT/ES/EN)
- [x] Detecção automática de zona

### 2. 🔑 Google Maps API Key (Obrigatório para Autocomplete)

#### Passo 1: Criar Projeto no Google Cloud
1. Acesse: https://console.cloud.google.com/
2. Clique em "Selecionar projeto" → "Novo projeto"
3. Nome: `Sofia Gastrobar`
4. Clique em "Criar"

#### Passo 2: Ativar APIs Necessárias
1. No menu lateral: **APIs e Serviços** → **Biblioteca**
2. Ative as seguintes APIs (busque e clique em "Ativar"):
   - ✅ **Maps JavaScript API**
   - ✅ **Places API**
   - ✅ **Geocoding API**

#### Passo 3: Criar API Key
1. Vá em **APIs e Serviços** → **Credenciais**
2. Clique em **+ Criar credenciais** → **Chave de API**
3. Copie a chave gerada (exemplo: `AIzaSyB...`)

#### Passo 4: Configurar Restrições (Recomendado)
1. Clique na API key criada
2. Em **Restrições de aplicativo**:
   - Selecione **Referenciadores de sites HTTP**
   - Adicione:
     ```
     https://sofiagastrobaribiza.com/*
     http://localhost:3000/*
     https://*.vercel.app/*
     ```
3. Em **Restrições de API**:
   - Selecione **Restringir chave**
   - Marque apenas:
     - Maps JavaScript API
     - Places API
     - Geocoding API
4. Clique em **Salvar**

### 3. 🔧 Configurar no Projeto

#### Opção A: Desenvolvimento Local
1. Crie/edite `.env.local`:
   ```bash
   cp env.local.example .env.local
   ```
2. Adicione a API key:
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="sua-api-key-aqui"
   ```
3. Reinicie o servidor:
   ```bash
   npm run dev
   ```

#### Opção B: Vercel (Produção)
1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto `sofia-gastrobar-site`
3. Vá em **Settings** → **Environment Variables**
4. Adicione:
   - **Name**: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - **Value**: `sua-api-key-aqui`
   - **Environments**: ✅ Production, ✅ Preview, ✅ Development
5. Clique em **Save**
6. Faça um novo deploy (ou aguarde o próximo)

---

## 🧪 Como Testar

### Teste 1: Geolocalização
1. Acesse: `http://localhost:3000/delivery`
2. Clique em **"Usar Minha Localização"**
3. Permita acesso à localização no navegador
4. ✅ Endereço deve ser preenchido automaticamente
5. ✅ Zona deve ser detectada automaticamente

### Teste 2: Autocomplete de Endereço
1. No campo de endereço, comece a digitar: `Carrer`
2. ✅ Deve aparecer sugestões de endereços em Ibiza
3. Selecione um endereço
4. ✅ Campo deve ser preenchido automaticamente

### Teste 3: Preenchimento Automático de Dados
1. Preencha o formulário uma vez
2. Recarregue a página
3. Clique em **"Preencher com Meus Dados"**
4. ✅ Dados devem ser preenchidos automaticamente

### Teste 4: Integração Apple Maps
1. Em um iPhone/iPad, acesse a página de delivery
2. Preencha um endereço
3. Clique em **"Abrir no Apple Maps"**
4. ✅ Deve abrir no app Apple Maps

---

## 💰 Custos do Google Maps

### Crédito Gratuito
- **$200 USD/mês** de crédito gratuito
- Cobre aproximadamente:
  - 28,000 carregamentos de Maps JavaScript API
  - 11,000 requests de Places API
  - 40,000 requests de Geocoding API

### Estimativa para Sofia Gastrobar
- **1000 usuários/mês** usando delivery
- **~2000 requests** de Places/mês
- **~1000 requests** de Geocoding/mês
- **Custo estimado**: ~$50/mês
- **✅ Dentro do crédito gratuito!**

### Monitoramento
1. Acesse: https://console.cloud.google.com/
2. Vá em **APIs e Serviços** → **Painel**
3. Veja uso em tempo real

---

## 🐛 Troubleshooting

### Erro: "Google Maps API key not found"
**Solução:**
- Verifique se a variável está em `.env.local`
- Reinicie o servidor (`npm run dev`)
- Verifique se está usando `NEXT_PUBLIC_` no início

### Erro: "This API project is not authorized"
**Solução:**
- Verifique se as APIs estão ativadas
- Aguarde 5-10 minutos após ativar
- Verifique restrições da API key

### Autocomplete não funciona
**Solução:**
- Verifique console do navegador (F12)
- Verifique se Places API está ativada
- Verifique se a biblioteca `places` está no script

### Geolocalização não funciona
**Solução:**
- Verifique permissões do navegador
- Teste em HTTPS (geolocalização requer HTTPS em produção)
- Verifique se o navegador suporta geolocalização

### Fallback para OpenStreetMap
Se a API key não estiver configurada, o sistema usa:
- **OpenStreetMap Nominatim** (gratuito)
- Limitações: 1 request/segundo, menos preciso
- Funciona sem API key, mas com qualidade reduzida

---

## 📱 Funcionalidades por Dispositivo

### iOS (iPhone/iPad)
- ✅ Geolocalização precisa
- ✅ Apple Maps deep links
- ✅ Preenchimento automático de dados
- ✅ Autocomplete de endereços

### Android
- ✅ Geolocalização precisa
- ✅ Google Maps links
- ✅ Preenchimento automático de dados
- ✅ Autocomplete de endereços

### Desktop
- ✅ Geolocalização (se permitido)
- ✅ Google Maps links
- ✅ Preenchimento automático de dados
- ✅ Autocomplete de endereços

---

## 🎯 Próximos Passos (Opcional)

### Melhorias Futuras
1. **Cache de endereços** - Salvar endereços frequentes
2. **Histórico de entregas** - Mostrar endereços anteriores
3. **Validação de endereço** - Verificar se endereço existe
4. **Mapa interativo** - Mostrar localização no mapa
5. **Rastreamento de entrega** - Mostrar posição do entregador

---

## ✅ Checklist Final

- [ ] Google Maps API Key criada
- [ ] APIs ativadas (Maps, Places, Geocoding)
- [ ] Restrições configuradas
- [ ] Variável adicionada no `.env.local` (dev)
- [ ] Variável adicionada no Vercel (produção)
- [ ] Testado geolocalização
- [ ] Testado autocomplete
- [ ] Testado preenchimento automático
- [ ] Testado em iOS (Apple Maps)
- [ ] Testado em Android (Google Maps)

---

## 📞 Suporte

Se tiver problemas:
1. Verifique o console do navegador (F12)
2. Verifique logs do servidor
3. Verifique status das APIs no Google Cloud Console
4. Consulte documentação: `GOOGLE_MAPS_SETUP.md`

---

**Status:** ✅ Sistema 100% implementado e pronto para uso
**Próximo passo:** Adicionar API key no Vercel e testar

