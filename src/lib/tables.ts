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
 */
export function getTableById(id: string): Table | undefined {
  return getTables().find(table => table.id === id);
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

