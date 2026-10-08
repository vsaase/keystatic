import { ReactNode } from 'react';
import type { Router } from "./types.js";
export declare function RouterContextProvider({ children, router, }: {
    children: ReactNode;
    router: Router;
}): import("react").JSX.Element;
/** Returns the function configured for client-side navigation. */
export declare function useNavigate(): Router['navigate'];
/** Returns the current application-relative pathname. */
export declare function usePathname(): string;
/** Returns the current query string, including the leading question mark. */
export declare function useSearch(): string;
