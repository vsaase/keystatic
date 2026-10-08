import { Config } from "../config.js";
export declare function Keystatic(props: {
    config: Config;
    appSlug?: {
        envName: string;
        value: string | undefined;
    };
    getPortalContainer?: () => HTMLElement | null;
}): import("react").JSX.Element;
