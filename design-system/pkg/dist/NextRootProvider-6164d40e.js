'use client';
import { c } from './react-compiler-runtime-19061925.js';
import { cache } from '@keystar/ui/style';
import { KeystarProvider } from '@keystar/ui/core';
import { useServerInsertedHTML, useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useRef, useMemo } from 'react';
import { ColorSchemeProvider, useRootColorScheme } from './useRootColorScheme-ca6a3821.js';
import { jsx } from 'react/jsx-runtime';

cache.compat = true;
function NextRootProvider(props) {
  const $ = c(2);
  let t0;
  if ($[0] !== props) {
    t0 = /*#__PURE__*/jsx(ColorSchemeProvider, {
      children: /*#__PURE__*/jsx(InnerProvider, {
        ...props
      })
    });
    $[0] = props;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  return t0;
}
const insertedKeys = Object.keys(cache.inserted);
const prevInsert = cache.insert;
cache.insert = (...args) => {
  const serialized = args[1];
  if (cache.inserted[serialized.name] === undefined) {
    insertedKeys.push(serialized.name);
  }
  return prevInsert(...args);
};
function InnerProvider(props) {
  let lastIndexRef = useRef(0);
  let {
    colorScheme
  } = useRootColorScheme();
  useServerInsertedHTML(() => {
    const names = insertedKeys.slice(lastIndexRef.current);
    lastIndexRef.current = insertedKeys.length;
    if (names.length === 0) return null;
    let styles = '';
    for (const name of names) {
      styles += cache.inserted[name];
    }
    return /*#__PURE__*/jsx("style", {
      "data-emotion": `${cache.key} ${names.join(' ')}`,
      dangerouslySetInnerHTML: {
        __html: styles
      }
    }, Math.random().toString(36));
  });
  const {
    push,
    replace
  } = useRouter();
  const router = useMemo(() => {
    return {
      navigate(href, options) {
        return options !== null && options !== void 0 && options.replace ? replace(href) : push(href);
      },
      // These hooks are consumed lazily by @keystar/ui/router.
      // eslint-disable-next-line react-compiler/react-compiler
      usePathname,
      // eslint-disable-next-line react-compiler/react-compiler
      useSearch: useNextSearch
    };
  }, [push, replace]);
  return /*#__PURE__*/jsx(KeystarProvider, {
    ...props,
    UNSAFE_className: props.fontClassName,
    colorScheme: colorScheme,
    elementType: "html",
    router: router
  });
}
function useNextSearch() {
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  return search ? `?${search}` : '';
}

export { NextRootProvider };
