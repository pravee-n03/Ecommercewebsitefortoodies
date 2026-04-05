/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_SUPABASE_PROJECT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Declare figma:asset module for asset imports
declare module 'figma:asset/*' {
  const value: string
  export default value
}

// Declare sonner with version
declare module 'sonner@2.0.3' {
  export * from 'sonner'
}

// Declare react-hook-form with version
declare module 'react-hook-form@7.55.0' {
  export * from 'react-hook-form'
}
