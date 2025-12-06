/**
 * Mock Database
 * Simulação de database em memória
 * 
 * NOTA: Este é um mock temporário. Quando integrar Supabase,
 * substitua estas funções por chamadas reais ao database.
 */

import type {
  Reservation,
  CreateReservationInput,
  DeliveryOrder,
  CreateDeliveryOrderInput,
  TableOrder,
  CreateTableOrderInput,
  Customer,
  CreateCustomerInput,
  WaiterCall,
  TableSession,
} from './types'

// ============================================
// MOCK STORAGE (em memória)
// ============================================
const reservations: Map<string, Reservation> = new Map()
const deliveryOrders: Map<string, DeliveryOrder> = new Map()
const tableOrders: Map<string, TableOrder> = new Map()
const customers: Map<string, Customer> = new Map()
const waiterCalls: Map<string, WaiterCall> = new Map()
const tableSessions: Map<string, TableSession> = new Map()

// ============================================
// HELPERS
// ============================================
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

function now(): string {
  return new Date().toISOString()
}

// ============================================
// RESERVATIONS
// ============================================
export async function createReservation(input: CreateReservationInput): Promise<Reservation> {
  const reservation: Reservation = {
    id: generateId(),
    ...input,
    status: 'pending',
    createdAt: now(),
    updatedAt: now(),
  }
  reservations.set(reservation.id, reservation)
  return reservation
}

export async function getReservation(id: string): Promise<Reservation | null> {
  return reservations.get(id) || null
}

export function getReservationById(id: string): Reservation | null {
  return reservations.get(id) || null
}

export async function updateReservationPayment(
  id: string,
  paymentStatus: 'pending' | 'paid' | 'failed' | 'expired' | 'cancelled',
  prepaidAmount: number,
  paymentLinkId?: string
): Promise<Reservation | null> {
  const reservation = reservations.get(id)
  if (!reservation) return null
  
  reservation.paymentStatus = paymentStatus
  reservation.prepaidAmount = prepaidAmount
  if (paymentLinkId) reservation.paymentLinkId = paymentLinkId
  if (paymentStatus === 'paid') {
    reservation.paidAt = now()
    reservation.status = 'confirmed'
  }
  reservation.updatedAt = now()
  reservations.set(id, reservation)
  return reservation
}

export async function getReservationsByDate(date: string): Promise<Reservation[]> {
  return Array.from(reservations.values()).filter(r => r.date === date)
}

export async function updateReservationStatus(
  id: string,
  status: Reservation['status']
): Promise<Reservation | null> {
  const reservation = reservations.get(id)
  if (!reservation) return null
  
  reservation.status = status
  reservation.updatedAt = now()
  reservations.set(id, reservation)
  return reservation
}

// ============================================
// DELIVERY ORDERS
// ============================================
export async function createDeliveryOrder(input: CreateDeliveryOrderInput): Promise<DeliveryOrder> {
  const subtotal = input.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const zoneFee = input.zone === 'sant-antoni' ? 3.00 :
                   input.zone === 'ibiza-town' ? 5.00 :
                   input.zone === 'san-jose' ? 4.00 :
                   input.zone === 'santa-eulalia' ? 6.00 : 8.00
  
  const order: DeliveryOrder = {
    id: generateId(),
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    customerEmail: input.customerEmail,
    address: input.address,
    zone: input.zone,
    zoneFee,
    items: input.items,
    subtotal,
    total: subtotal + zoneFee,
    deliveryTime: input.deliveryTime,
    scheduledTime: input.scheduledTime,
    notes: input.notes,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: now(),
    updatedAt: now(),
  }
  
  deliveryOrders.set(order.id, order)
  return order
}

export async function getDeliveryOrder(id: string): Promise<DeliveryOrder | null> {
  return deliveryOrders.get(id) || null
}

export async function updateDeliveryOrderStatus(
  id: string,
  status: DeliveryOrder['status']
): Promise<DeliveryOrder | null> {
  const order = deliveryOrders.get(id)
  if (!order) return null
  
  order.status = status
  order.updatedAt = now()
  deliveryOrders.set(id, order)
  return order
}

// ============================================
// TABLE ORDERS
// ============================================
export async function createTableOrder(input: CreateTableOrderInput): Promise<TableOrder> {
  const subtotal = input.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  
  const order: TableOrder = {
    id: generateId(),
    tableId: input.tableId,
    items: input.items.map(item => ({
      ...item,
      status: 'pending' as const,
    })),
    subtotal,
    total: subtotal, // No service fee for now
    status: 'pending',
    notes: input.notes,
    createdAt: now(),
    updatedAt: now(),
  }
  
  tableOrders.set(order.id, order)
  return order
}

export async function getTableOrder(id: string): Promise<TableOrder | null> {
  return tableOrders.get(id) || null
}

export async function getTableOrdersByTable(tableId: string): Promise<TableOrder[]> {
  return Array.from(tableOrders.values()).filter(o => o.tableId === tableId)
}

export async function updateTableOrderStatus(
  id: string,
  status: TableOrder['status']
): Promise<TableOrder | null> {
  const order = tableOrders.get(id)
  if (!order) return null
  
  order.status = status
  order.updatedAt = now()
  tableOrders.set(id, order)
  return order
}

// ============================================
// CUSTOMERS (Clube Sofia)
// ============================================
export async function createCustomer(input: CreateCustomerInput): Promise<Customer> {
  const customer: Customer = {
    id: generateId(),
    ...input,
    points: 0,
    level: 'bronze',
    visits: 0,
    tags: [],
    createdAt: now(),
    updatedAt: now(),
  }
  
  customers.set(customer.id, customer)
  return customer
}

export async function getCustomer(id: string): Promise<Customer | null> {
  return customers.get(id) || null
}

export async function getCustomerByPhone(phone: string): Promise<Customer | null> {
  return Array.from(customers.values()).find(c => c.phone === phone) || null
}

export async function getCustomerByEmail(email: string): Promise<Customer | null> {
  return Array.from(customers.values()).find(c => c.email === email) || null
}

export async function addCustomerPoints(id: string, points: number): Promise<Customer | null> {
  const customer = customers.get(id)
  if (!customer) return null
  
  customer.points += points
  
  // Update level based on points
  if (customer.points >= 1000) customer.level = 'platinum'
  else if (customer.points >= 500) customer.level = 'gold'
  else if (customer.points >= 200) customer.level = 'silver'
  else customer.level = 'bronze'
  
  customer.updatedAt = now()
  customers.set(id, customer)
  return customer
}

export async function incrementCustomerVisits(id: string): Promise<Customer | null> {
  const customer = customers.get(id)
  if (!customer) return null
  
  customer.visits += 1
  customer.lastVisit = now()
  customer.updatedAt = now()
  customers.set(id, customer)
  return customer
}

// ============================================
// WAITER CALLS
// ============================================
export async function createWaiterCall(tableId: string, action: 'call' | 'bill'): Promise<WaiterCall> {
  const call: WaiterCall = {
    id: generateId(),
    tableId,
    action,
    status: 'pending',
    createdAt: now(),
  }
  
  waiterCalls.set(call.id, call)
  return call
}

export async function getWaiterCallsByTable(tableId: string): Promise<WaiterCall[]> {
  return Array.from(waiterCalls.values())
    .filter(call => call.tableId === tableId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getPendingWaiterCalls(): Promise<WaiterCall[]> {
  return Array.from(waiterCalls.values())
    .filter(call => call.status === 'pending')
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
}

// ============================================
// TABLE SESSIONS
// ============================================
export async function createTableSession(tableId: string): Promise<TableSession> {
  const session: TableSession = {
    id: generateId(),
    tableId,
    startedAt: now(),
    isActive: true,
  }
  
  tableSessions.set(session.id, session)
  return session
}

export async function getActiveTableSession(tableId: string): Promise<TableSession | null> {
  return Array.from(tableSessions.values())
    .find(session => session.tableId === tableId && session.isActive) || null
}

export async function endTableSession(tableId: string): Promise<TableSession | null> {
  const session = Array.from(tableSessions.values())
    .find(s => s.tableId === tableId && s.isActive)
  
  if (!session) return null
  
  session.endedAt = now()
  session.isActive = false
  if (session.startedAt && session.endedAt) {
    session.duration = Math.floor(
      (new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()) / 1000
    )
  }
  
  tableSessions.set(session.id, session)
  return session
}

