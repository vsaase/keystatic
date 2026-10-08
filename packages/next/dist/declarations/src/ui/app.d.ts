import { Config } from '@keystatic/core';
export declare function makePage(config: Config<any, any>, options?: {
    getPortalContainer?: () => HTMLElement | null;
}): () => import("react").JSX.Element;
