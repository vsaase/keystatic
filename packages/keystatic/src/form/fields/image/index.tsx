import { fixPath } from '../../../app/path-utils';
import { AssetFormField } from '../../api';
import { FieldDataError } from '../error';
import { RequiredValidation, assertRequired } from '../utils';
import { getSrcPrefix } from './getSrcPrefix';
import { ImageFieldInput } from '#field-ui/image';

export function image<IsRequired extends boolean | undefined>({
  label,
  directory,
  validation,
  description,
  publicPath,
  directoryPerEntry = true,
  transformFilename,
}: {
  label: string;
  directory?: string;
  directoryPerEntry?: boolean;
  validation?: { isRequired?: IsRequired };
  description?: string;
  publicPath?: string;
  /**
   * This function will only be used when `fields.image` is used in a field like `fields.markdoc`/`fields.mdx`.
   *
   * When used outside of editor fields, this function will **not** be used. Instead only the extension of the uploaded file is used and the start of the filename is based on the field key.
   */
  transformFilename?: (originalFilename: string) => string;
} & RequiredValidation<IsRequired>): AssetFormField<
  { data: Uint8Array; extension: string; filename: string } | null,
  | { data: Uint8Array; extension: string; filename: string }
  | (IsRequired extends true ? never : null),
  string | (IsRequired extends true ? never : null)
> {
  return {
    kind: 'form',
    formKind: 'asset',
    label,
    Input(props) {
      return (
        <ImageFieldInput
          label={label}
          description={description}
          validation={validation}
          transformFilename={transformFilename}
          {...props}
        />
      );
    },
    defaultValue() {
      return null;
    },
    filename(value, args) {
      if (typeof value === 'string') {
        return value.slice(
          getSrcPrefix(
            publicPath,
            directoryPerEntry ? args.slug : undefined
          ).length
        );
      }
      return undefined;
    },
    parse(value, args) {
      if (value === undefined) {
        return null;
      }
      if (typeof value !== 'string') {
        throw new FieldDataError('Must be a string');
      }
      if (args.asset === undefined) {
        return null;
      }
      return {
        data: args.asset,
        filename: value.slice(
          getSrcPrefix(
            publicPath,
            directoryPerEntry ? args.slug : undefined
          ).length
        ),
        extension: value.match(/\.([^.]+$)/)?.[1] ?? '',
      };
    },
    validate(value) {
      assertRequired(value, validation, label);
      return value;
    },
    serialize(value, args) {
      if (value === null) {
        return { value: undefined, asset: undefined };
      }
      const filename = args.suggestedFilenamePrefix
        ? args.suggestedFilenamePrefix + '.' + value.extension
        : value.filename;
      return {
        value: `${
          getSrcPrefix(
            publicPath,
            directoryPerEntry ? args.slug : undefined
          )
        }${filename}`,
        asset: { filename, content: value.data },
      };
    },
    directory: directory ? fixPath(directory) : undefined,
    directoryPerEntry,
    reader: {
      parse(value) {
        if (typeof value !== 'string' && value !== undefined) {
          throw new FieldDataError('Must be a string');
        }
        const val = value === undefined ? null : value;
        assertRequired(val, validation, label);
        return val;
      },
    },
  };
}
