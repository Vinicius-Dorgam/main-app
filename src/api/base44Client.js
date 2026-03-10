// Camada de dados baseada em Supabase, mantendo a mesma
// interface usada anteriormente pelos módulos `pages/*`.
import { supabase } from '@/lib/supabaseClient';

const TABLES = {
  Equipment: 'equipment',
  WorkOrder: 'work_orders',
  Inspection: 'inspections',
  PreventivePlan: 'preventive_plans',
};

const parseOrdering = (ordering, defaultField = 'created_date') => {
  if (!ordering) {
    return { column: defaultField, ascending: false };
  }
  const desc = ordering.startsWith('-');
  const column = ordering.replace(/^-/, '') || defaultField;
  return { column, ascending: !desc };
};

const makeEntityStore = (entityKey) => {
  const table = TABLES[entityKey];

  return {
    async list(ordering, limit) {
      const { column, ascending } = parseOrdering(ordering);
      let query = supabase.from(table).select('*').order(column, { ascending });
      if (limit && Number.isFinite(limit)) {
        query = query.limit(limit);
      }
      const { data, error } = await query;
      if (error) {
        console.error(`Erro ao listar em ${table}:`, error);
        throw error;
      }
      return data ?? [];
    },

    async filter(criteria = {}, ordering) {
      const { column, ascending } = parseOrdering(ordering);
      let query = supabase.from(table).select('*');
      Object.entries(criteria).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
      query = query.order(column, { ascending });
      const { data, error } = await query;
      if (error) {
        console.error(`Erro ao filtrar em ${table}:`, error);
        throw error;
      }
      return data ?? [];
    },

    async create(data) {
      const { data: rows, error } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single();

      if (error) {
        console.error(`Erro ao criar em ${table}:`, error);
        throw error;
      }
      return rows;
    },

    async update(id, data) {
      const { data: rows, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error(`Erro ao atualizar em ${table}:`, error);
        throw error;
      }
      return rows;
    },

    async delete(id) {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) {
        console.error(`Erro ao excluir em ${table}:`, error);
        throw error;
      }
      return { success: true };
    },
  };
};

const entities = {
  Equipment: makeEntityStore('Equipment'),
  WorkOrder: makeEntityStore('WorkOrder'),
  Inspection: makeEntityStore('Inspection'),
  PreventivePlan: makeEntityStore('PreventivePlan'),
};

export const base44 = {
  entities,
};

