import tablesData from '@/data/tables.json';

export interface Table {
  id: string;
  number: number;
  capacity: number;
  location: string;
}

export interface TablesData {
  tables: Table[];
}

/**
 * Retorna todos os dados das mesas
 */
export function getTables(): Table[] {
  return (tablesData as TablesData).tables;
}

/**
 * Busca uma mesa pelo ID
 * Aceita tanto "12" quanto "12" (normaliza IDs)
 */
export function getTableById(id: string): Table | undefined {
  // Normalizar ID: remover zeros à esquerda ou adicionar se necessário
  const normalizedId = id.startsWith('0') ? id : id.padStart(2, '0');
  
  // Tentar buscar com o ID normalizado
  let table = getTables().find(table => table.id === normalizedId);
  
  // Se não encontrar, tentar buscar com o ID original
  if (!table) {
    table = getTables().find(table => table.id === id);
  }
  
  return table;
}

/**
 * Busca uma mesa pelo número
 */
export function getTableByNumber(number: number): Table | undefined {
  return getTables().find(table => table.number === number);
}

/**
 * Valida se um ID de mesa é válido
 */
export function isValidTableId(id: string): boolean {
  return getTableById(id) !== undefined;
}

