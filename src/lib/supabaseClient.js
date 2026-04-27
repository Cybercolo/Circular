import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const missingEnvError = {
  message:
    'Supabase no esta configurado. Define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu entorno.',
}

function createMockQuery() {
  const state = {
    mode: 'select',
  }

  const builder = {
    select() {
      state.mode = 'select'
      return builder
    },
    eq() {
      return builder
    },
    insert(rows) {
      state.mode = 'insert'
      state.rows = rows
      return builder
    },
    upsert(rows) {
      state.mode = 'upsert'
      state.rows = rows
      return builder
    },
    async maybeSingle() {
      return { data: null, error: missingEnvError }
    },
    async single() {
      const row = Array.isArray(state.rows) ? state.rows[0] ?? null : null
      return { data: row, error: missingEnvError }
    },
    async then(resolve, reject) {
      const response =
        state.mode === 'select'
          ? { data: [], error: missingEnvError }
          : { data: Array.isArray(state.rows) ? state.rows : [], error: missingEnvError }

      return Promise.resolve(response).then(resolve, reject)
    },
  }

  return builder
}

function createMockSupabaseClient() {
  return {
    auth: {
      async signUp() {
        return { data: { user: null, session: null }, error: missingEnvError }
      },
      async signInWithPassword() {
        return { data: { user: null, session: null }, error: missingEnvError }
      },
      async getUser() {
        return { data: { user: null }, error: null }
      },
      onAuthStateChange() {
        return {
          data: {
            subscription: {
              unsubscribe() {},
            },
          },
        }
      },
      async signOut() {
        return { error: null }
      },
    },
    storage: {
      from() {
        return {
          async upload() {
            return { data: null, error: missingEnvError }
          },
          getPublicUrl() {
            return { data: { publicUrl: null } }
          },
        }
      },
    },
    from() {
      return createMockQuery()
    },
  }
}

function isValidHttpUrl(value) {
  try {
    const parsedUrl = new URL(value)
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'
  } catch {
    return false
  }
}

const hasValidSupabaseConfig = Boolean(supabaseKey) && isValidHttpUrl(supabaseUrl)

if (!hasValidSupabaseConfig) {
  console.warn(
    'Supabase no configurado: agrega VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para habilitar auth y base de datos.',
  )
}

export const supabase =
  hasValidSupabaseConfig
    ? createClient(supabaseUrl, supabaseKey)
    : createMockSupabaseClient()