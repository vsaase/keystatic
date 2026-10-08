import { c as component } from './api-26be88c9.node.react-server.js';
import { c as cloudImageSchema, b as CloudImagePreview, a as cloudImageToolbarIcon } from './cloud-image-schema-45663374.node.react-server.js';
import 'react/jsx-runtime';
import './index-c102edd4.node.react-server.js';
import '@markdoc/markdoc/dist/index.mjs';
import 'emery/assertions';
import 'emery';
import './index-10ea50e2.node.react-server.js';
import 'crypto';
import '@braintree/sanitize-url';
import './index-9722793d.node.react-server.js';

/** @deprecated Experimental */
function cloudImage(args) {
  return component({
    label: args.label,
    schema: cloudImageSchema,
    preview: CloudImagePreview,
    chromeless: true,
    toolbar: null,
    toolbarIcon: cloudImageToolbarIcon
  });
}

export { cloudImage };
