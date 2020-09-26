import { Plugin } from '@nuxt/types';
import { AxiosInstance } from 'axios';
import { SystemApi } from '~/api/api';
import { Configuration } from '~/api/configuration';

declare module '@nuxt/types' {
  interface Context {
    $systemApi: SystemApi;
  }

  interface NuxtAppOptions {
    $systemApi: SystemApi;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $systemApi: SystemApi;
  }
}

const systemApiPlugin: Plugin = (context, inject) => {
  const config = new Configuration();

  const systemApi = new SystemApi(config, '', context.$axios as AxiosInstance);
  inject('systemApi', systemApi);
};

export default systemApiPlugin;
