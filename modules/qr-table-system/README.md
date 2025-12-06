# 🍽️ QR Table System Module

Módulo Goldmonkey para sistema de mesas com QR codes.

## Features

- ✅ Geração de páginas dinâmicas `/mesa/[id]`
- ✅ Detecção automática de mesa via URL
- ✅ Botões de ação (Chamar garçom, Pedir conta, Cancelar)
- ✅ Estado persistente com localStorage
- ✅ APIs para comunicação com backend

## Usage

```typescript
import { useTableSession } from '@/modules/qr-table-system/hooks/useTableSession'

function MesaPage({ params }: { params: { id: string } }) {
  const { tableId, isActive, callWaiter, requestBill } = useTableSession(params.id)

  return (
    <div>
      <h1>Mesa {tableId}</h1>
      <button onClick={callWaiter}>Chamar Garçom</button>
      <button onClick={requestBill}>Pedir Conta</button>
    </div>
  )
}
```

## Files

- `hooks/useTableSession.ts` - React hook para gerenciar sessão da mesa
- `hooks/useCallWaiter.ts` - Hook específico para chamar garçom
- `utils/tableHelpers.ts` - Funções auxiliares
- `types.ts` - TypeScript types

## API Routes Required

```typescript
// app/api/mesa/[id]/route.ts
GET  /api/mesa/[id]       → Status da mesa
POST /api/mesa/[id]/call  → Chamar garçom
POST /api/mesa/[id]/bill  → Pedir conta
```

## Installation

Este módulo já está incluído quando você usa:
```bash
./scripts/init-next-web.sh MeuRestaurante --industry restaurant
```

## Configuration

Adicione em `.env.local`:
```bash
NEXT_PUBLIC_ENABLE_QR_TABLES=true
```
