/**
 * QR Table System - useTableSession Hook
 * Hook principal para gerenciar sessão da mesa
 */

import { useState, useEffect, useCallback } from 'react';
import { getTableById } from '@/lib/tables';
import { Table, TableSessionState } from '../types';
import {
  saveTableSession,
  loadTableSession,
  clearTableSession,
  getSessionDuration,
  formatSessionDuration,
} from '../utils/tableHelpers';

interface UseTableSessionOptions {
  tableId: string;
  autoStart?: boolean; // Inicia sessão automaticamente se não existir
}

interface UseTableSessionReturn {
  table: Table | null;
  isActive: boolean;
  sessionStartTime: number | null;
  sessionDuration: number; // em minutos
  sessionDurationFormatted: string;
  startSession: () => void;
  endSession: () => void;
  refreshSession: () => void;
  state: TableSessionState | null;
}

export function useTableSession({
  tableId,
  autoStart = true,
}: UseTableSessionOptions): UseTableSessionReturn {
  const [table, setTable] = useState<Table | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);

  // Carrega mesa e sessão
  useEffect(() => {
    const tableData = getTableById(tableId);
    setTable(tableData || null);

    // Tenta carregar sessão existente
    const savedSession = loadTableSession(tableId);
    if (savedSession) {
      setSessionStartTime(savedSession.startTime);
    } else if (autoStart && tableData) {
      // Inicia nova sessão automaticamente
      const startTime = Date.now();
      setSessionStartTime(startTime);
      saveTableSession(tableId, startTime);
    }
  }, [tableId, autoStart]);

  // Atualiza duração da sessão a cada minuto
  useEffect(() => {
    if (!sessionStartTime) {
      setSessionDuration(0);
      return;
    }

    const updateDuration = () => {
      const duration = getSessionDuration(sessionStartTime);
      setSessionDuration(duration);
    };

    updateDuration(); // Atualiza imediatamente
    const interval = setInterval(updateDuration, 60000); // A cada minuto

    return () => clearInterval(interval);
  }, [sessionStartTime]);

  const startSession = useCallback(() => {
    if (!table) return;
    
    const startTime = Date.now();
    setSessionStartTime(startTime);
    saveTableSession(tableId, startTime);
  }, [table, tableId]);

  const endSession = useCallback(() => {
    setSessionStartTime(null);
    clearTableSession(tableId);
  }, [tableId]);

  const refreshSession = useCallback(() => {
    const savedSession = loadTableSession(tableId);
    if (savedSession) {
      setSessionStartTime(savedSession.startTime);
    } else if (autoStart && table) {
      startSession();
    }
  }, [tableId, autoStart, table, startSession]);

  const isActive = sessionStartTime !== null;
  const sessionDurationFormatted = sessionStartTime
    ? formatSessionDuration(sessionStartTime)
    : '0 min';

  const state: TableSessionState | null = isActive && sessionStartTime
    ? {
        tableId,
        isActive: true,
        startTime: sessionStartTime,
        calls: [], // Será preenchido pelo useCallWaiter se necessário
      }
    : null;

  return {
    table,
    isActive,
    sessionStartTime,
    sessionDuration,
    sessionDurationFormatted,
    startSession,
    endSession,
    refreshSession,
    state,
  };
}

