/**
 * QR Table System - useCallWaiter Hook
 * Hook para gerenciar chamadas de garçom e pedidos de conta
 */

import { useState, useCallback } from 'react';
import { TableCallResponse, WaiterCall } from '../types';

type CallStatus = 'idle' | 'calling' | 'success' | 'error';

interface UseCallWaiterOptions {
  tableId: string;
  onSuccess?: (response: TableCallResponse) => void;
  onError?: (error: Error) => void;
}

interface UseCallWaiterReturn {
  callStatus: CallStatus;
  billStatus: CallStatus;
  callWaiter: () => Promise<void>;
  requestBill: () => Promise<void>;
  lastCall?: WaiterCall;
  lastBill?: WaiterCall;
}

export function useCallWaiter({
  tableId,
  onSuccess,
  onError,
}: UseCallWaiterOptions): UseCallWaiterReturn {
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [billStatus, setBillStatus] = useState<CallStatus>('idle');
  const [lastCall, setLastCall] = useState<WaiterCall | undefined>();
  const [lastBill, setLastBill] = useState<WaiterCall | undefined>();

  const makeCall = useCallback(
    async (action: 'call' | 'bill') => {
      const statusSetter = action === 'call' ? setCallStatus : setBillStatus;
      const lastCallSetter = action === 'call' ? setLastCall : setLastBill;

      statusSetter('calling');

      try {
        const response = await fetch('/api/garcom', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tableId, action }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to ${action === 'call' ? 'call waiter' : 'request bill'}`);
        }

        const data: TableCallResponse = await response.json();
        
        const callRecord: WaiterCall = {
          id: data.callId || `${tableId}-${data.timestamp}`,
          tableId: data.tableId,
          action: data.action,
          timestamp: data.timestamp,
          status: 'pending',
        };

        lastCallSetter(callRecord);
        statusSetter('success');
        
        if (onSuccess) {
          onSuccess(data);
        }

        // Reset status after 3 seconds
        setTimeout(() => {
          statusSetter('idle');
        }, 3000);
      } catch (error) {
        statusSetter('error');
        
        if (onError) {
          onError(error instanceof Error ? error : new Error('Unknown error'));
        } else {
          console.error(`Error ${action === 'call' ? 'calling waiter' : 'requesting bill'}:`, error);
        }

        // Reset status after 3 seconds
        setTimeout(() => {
          statusSetter('idle');
        }, 3000);
      }
    },
    [tableId, onSuccess, onError]
  );

  const callWaiter = useCallback(() => makeCall('call'), [makeCall]);
  const requestBill = useCallback(() => makeCall('bill'), [makeCall]);

  return {
    callStatus,
    billStatus,
    callWaiter,
    requestBill,
    lastCall,
    lastBill,
  };
}

