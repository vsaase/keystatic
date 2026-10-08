import { Config } from '@keystatic/core';
import { Keystatic } from '@keystatic/core/ui';

export function makePage(
  config: Config<any, any>,
  options?: { getPortalContainer?: () => HTMLElement | null }
) {
  return function Page() {
    return (
      <Keystatic
        config={config}
        appSlug={appSlug}
        getPortalContainer={options?.getPortalContainer}
      />
    );
  };
}

const appSlug = {
  envName: 'NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG',
  value: process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG,
};
