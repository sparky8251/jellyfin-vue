import { Plugin } from '@nuxt/types';
import { AxiosInstance } from 'axios';
import { BrandingApi } from '~/api/api';
import { Configuration } from '~/api/configuration';

declare module '@nuxt/types' {
  interface Context {
    $brandingApi: BrandingApi;
  }

  interface NuxtAppOptions {
    $brandingApi: BrandingApi;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $brandingApi: BrandingApi;
  }
}

const brandingApiPlugin: Plugin = (context, inject) => {
  const config = new Configuration();

  const brandingApi = new BrandingApi(
    config,
    '',
    context.$axios as AxiosInstance
  );
  inject('brandingApi', brandingApi);
};

export default brandingApiPlugin;
