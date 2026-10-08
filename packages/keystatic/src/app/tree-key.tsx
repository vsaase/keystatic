import { assertNever } from 'emery';

import { ComponentSchema } from '..';
import { fixPath, FormatInfo, getDataFileExtension } from './path-utils';
import { getTreeNodeAtPath, TreeNode } from './trees';

type DirectoryUse = { path: string; directoryPerEntry: boolean };

function collectDirectoryUsesInSchemaInner(
  schema: ComponentSchema,
  directories: Map<string, DirectoryUse>,
  seenSchemas: Set<ComponentSchema>
): void {
  if (seenSchemas.has(schema)) {
    return;
  }
  seenSchemas.add(schema);
  if (schema.kind === 'array') {
    return collectDirectoryUsesInSchemaInner(
      schema.element,
      directories,
      seenSchemas
    );
  }
  if (schema.kind === 'child') {
    return;
  }
  if (schema.kind === 'form') {
    if (schema.formKind === 'asset' && schema.directory !== undefined) {
      const path = fixPath(schema.directory);
      const directoryPerEntry = schema.directoryPerEntry !== false;
      directories.set(`${path}\0${directoryPerEntry}`, {
        path,
        directoryPerEntry,
      });
    }
    if (
      (schema.formKind === 'content' || schema.formKind === 'assets') &&
      schema.directories !== undefined
    ) {
      for (const directory of schema.directories) {
        const path = fixPath(directory);
        directories.set(`${path}\0true`, {
          path,
          directoryPerEntry: true,
        });
      }
    }
    return;
  }
  if (schema.kind === 'object') {
    for (const field of Object.values(schema.fields)) {
      collectDirectoryUsesInSchemaInner(field, directories, seenSchemas);
    }
    return;
  }
  if (schema.kind === 'conditional') {
    for (const innerSchema of Object.values(schema.values)) {
      collectDirectoryUsesInSchemaInner(
        innerSchema,
        directories,
        seenSchemas
      );
    }
    return;
  }
  assertNever(schema);
}

function collectDirectoryUsesInSchema(
  schema: ComponentSchema
): DirectoryUse[] {
  const directories = new Map<string, DirectoryUse>();
  collectDirectoryUsesInSchemaInner(schema, directories, new Set());
  return [...directories.values()];
}

export function collectDirectoriesUsedInSchema(
  schema: ComponentSchema
): Set<string> {
  return new Set(collectDirectoryUsesInSchema(schema).map(x => x.path));
}

export function getDirectoriesForTreeKey(
  schema: ComponentSchema,
  directory: string,
  slug: string | undefined,
  format: FormatInfo
) {
  const directories = [fixPath(directory)];
  if (format.dataLocation === 'outer') {
    directories.push(fixPath(directory) + getDataFileExtension(format));
  }
  const toAdd = slug === undefined ? '' : `/${slug}`;
  for (const directory of collectDirectoryUsesInSchema(schema)) {
    directories.push(
      directory.path + (directory.directoryPerEntry ? toAdd : '')
    );
  }
  return directories;
}

export function getTreeKey(directories: string[], tree: Map<string, TreeNode>) {
  return directories.map(d => getTreeNodeAtPath(tree, d)?.entry.sha).join('-');
}
