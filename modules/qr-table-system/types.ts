/**
 * QR Table System - TypeScript Types
 * Módulo Goldmonkey para sistema de mesas com QR codes
 */

export interface Table {
  id: string;
  number: number;
  capacity: number;
  location: string;
  status?: TableStatus;
  currentSession?: TableSession;
}

export type TableStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';

export interface TableSession {
  tableId: string;
  startTime: number;
  endTime?: number;
  customerCount?: number;
  orderId?: string;
}

export interface WaiterCall {
  id: string;
  tableId: string;
  action: 'call' | 'bill';
  timestamp: number;
  status: 'pending' | 'acknowledged' | 'completed';
  acknowledgedBy?: string;
  acknowledgedAt?: number;
}

export interface TableCallResponse {
  success: boolean;
  message: string;
  tableId: string;
  action: 'call' | 'bill';
  timestamp: number;
  callId?: string;
}

export interface TableSessionState {
  tableId: string;
  isActive: boolean;
  startTime: number;
  calls: WaiterCall[];
  lastCall?: WaiterCall;
}

