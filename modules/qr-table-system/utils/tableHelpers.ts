/**
 * QR Table System - Helper Functions
 * Funções auxiliares para gerenciamento de mesas
 */

import { Table, TableStatus } from '../types';
import { getTableById } from '@/lib/tables';

/**
 * Gera URL completa para a página da mesa
 */
export function generateTableUrl(tableId: string, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://sofiagastrobaribiza.com');
  return `${base}/mesa/${tableId}`;
}

/**
 * Valida se um ID de mesa é válido
 */
export function validateTableId(tableId: string): boolean {
  if (!tableId || typeof tableId !== 'string') {
    return false;
  }
  
  const table = getTableById(tableId);
  return table !== undefined;
}

/**
 * Formata número da mesa para exibição
 */
export function formatTableNumber(table: Table | null | undefined): string {
  if (!table) return 'N/A';
  return `Mesa ${table.number}`;
}

/**
 * Obtém status da mesa baseado em sessão ativa
 */
export function getTableStatus(table: Table, hasActiveSession: boolean): TableStatus {
  if (table.status === 'maintenance') return 'maintenance';
  if (hasActiveSession) return 'occupied';
  return table.status || 'available';
}

/**
 * Calcula tempo de sessão em minutos
 */
export function getSessionDuration(startTime: number): number {
  return Math.floor((Date.now() - startTime) / 1000 / 60);
}

/**
 * Formata duração da sessão para exibição
 */
export function formatSessionDuration(startTime: number): string {
  const minutes = getSessionDuration(startTime);
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

/**
 * Salva sessão da mesa no localStorage
 */
export function saveTableSession(tableId: string, startTime: number): void {
  if (typeof window === 'undefined') return;
  
  const session = {
    tableId,
    startTime,
    savedAt: Date.now(),
  };
  
  localStorage.setItem(`sofia-table-${tableId}`, JSON.stringify(session));
}

/**
 * Carrega sessão da mesa do localStorage
 */
export function loadTableSession(tableId: string): { tableId: string; startTime: number } | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem(`sofia-table-${tableId}`);
  if (!stored) return null;
  
  try {
    const session = JSON.parse(stored);
    // Verifica se a sessão não é muito antiga (24 horas)
    const maxAge = 24 * 60 * 60 * 1000;
    if (Date.now() - session.savedAt > maxAge) {
      localStorage.removeItem(`sofia-table-${tableId}`);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

/**
 * Remove sessão da mesa do localStorage
 */
export function clearTableSession(tableId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`sofia-table-${tableId}`);
}

/**
 * Gera código QR data para a mesa
 */
export function generateQRData(tableId: string, baseUrl?: string): string {
  return generateTableUrl(tableId, baseUrl);
}

