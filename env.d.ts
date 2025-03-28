declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}
declare module 'vue-navigation-bar'
declare module 'goeasy'
declare module '*.png' {
    const value: string;
    export default value;
  }
  interface ImportMetaEnv {
    VITE_APP_BASE_URL: string;
    VITE_APP_CLIENT_ID: string;
    VITE_APP_TIMEOUT: number;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }