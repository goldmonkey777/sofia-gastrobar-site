/**
 * Database Types
 * Tipos para o schema do database (Supabase/Postgres)
 * 
 * NOTA: Este arquivo define os tipos TypeScript que correspondem
 * ao schema do database. Quando integrar Supabase, estes tipos
 * devem corresponder às tabelas criadas.
 */

// ============================================
// TABELA: reservations
// ============================================
export interface Reservation {
  id: string
  name: string
  email: string
  phone: string
  date: string // ISO date string
  time: string // HH:mm format
  guests: number
  area?: 'interior' | 'terraco' | 'sunset-front'
  specialRequests?: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  prepaidAmount?: number // Valor pago antecipadamente (6€ * pessoas)
  paymentLinkId?: string // ID do link SumUp
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'expired' | 'cancelled'
  paidAt?: string // ISO timestamp
  createdAt: string // ISO timestamp
  updatedAt: string // ISO timestamp
}

export interface CreateReservationInput {
  name: string
  email: string
  phone: string
  date: string
  time: string
  guests: number
  area?: 'interior' | 'terraco' | 'sunset-front'
  specialRequests?: string
}

// ============================================
// TABELA: delivery_orders
// ============================================
export interface DeliveryOrder {
  id: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  address: string
  zone: string
  zoneFee: number
  items: DeliveryOrderItem[]
  subtotal: number
  total: number
  deliveryTime: 'now' | 'scheduled'
  scheduledTime?: string // ISO timestamp
  notes?: string
  status: 'pending' | 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed'
  paymentLink?: string // SumUp checkout link
  createdAt: string // ISO timestamp
  updatedAt: string // ISO timestamp
}

export interface DeliveryOrderItem {
  id: string // Menu item ID
  name: string
  price: number
  quantity: number
  notes?: string
}

export interface CreateDeliveryOrderInput {
  customerName: string
  customerPhone: string
  customerEmail?: string
  address: string
  zone: string
  items: DeliveryOrderItem[]
  deliveryTime: 'now' | 'scheduled'
  scheduledTime?: string
  notes?: string
}

// ============================================
// TABELA: table_orders
// ============================================
export interface TableOrder {
  id: string
  tableId: string
  items: TableOrderItem[]
  subtotal: number
  total: number
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'paid' | 'cancelled'
  notes?: string
  createdAt: string // ISO timestamp
  updatedAt: string // ISO timestamp
}

export interface TableOrderItem {
  id: string // Menu item ID
  name: string
  price: number
  quantity: number
  notes?: string
  status?: 'pending' | 'preparing' | 'ready' | 'served'
}

export interface CreateTableOrderInput {
  tableId: string
  items: TableOrderItem[]
  notes?: string
}

// ============================================
// TABELA: customers (Clube Sofia)
// ============================================
export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  language: 'pt' | 'es' | 'en'
  points: number
  level: 'bronze' | 'silver' | 'gold' | 'platinum'
  visits: number
  lastVisit?: string // ISO timestamp
  consentMarketing: boolean
  consentTerms: boolean
  tags: string[] // e.g., ['VIP', 'Frequente', 'Sunset Lover']
  createdAt: string // ISO timestamp
  updatedAt: string // ISO timestamp
}

export interface CreateCustomerInput {
  name: string
  email: string
  phone: string
  language: 'pt' | 'es' | 'en'
  consentMarketing: boolean
  consentTerms: boolean
}

// ============================================
// TABELA: waiter_calls
// ============================================
export interface WaiterCall {
  id: string
  tableId: string
  action: 'call' | 'bill'
  status: 'pending' | 'acknowledged' | 'completed'
  acknowledgedBy?: string // Staff member ID
  createdAt: string // ISO timestamp
  completedAt?: string // ISO timestamp
}

// ============================================
// TABELA: table_sessions
// ============================================
export interface TableSession {
  id: string
  tableId: string
  startedAt: string // ISO timestamp
  endedAt?: string // ISO timestamp
  duration?: number // seconds
  isActive: boolean
}

// ============================================
// Helper Types
// ============================================
export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'preparing' 
  | 'ready' 
  | 'served' 
  | 'paid' 
  | 'cancelled'

export type PaymentStatus = 
  | 'pending' 
  | 'paid' 
  | 'failed'

export type ReservationStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'cancelled' 
  | 'completed'

export type CustomerLevel = 
  | 'bronze' 
  | 'silver' 
  | 'gold' 
  | 'platinum'

