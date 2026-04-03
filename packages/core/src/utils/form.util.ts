/**
 * Generic form instance interface — adapter-agnostic abstraction over antd FormInstance,
 * react-hook-form, MUI form refs, etc.
 */
export interface IFormInstance<T extends Record<string, unknown> = Record<string, unknown>> {
  getFieldValue: (name: string | string[]) => unknown;
  getFieldsValue: (allValues?: boolean) => T;
  setFieldsValue: (values: Partial<T>) => void;
  resetFields: (fields?: string[]) => void;
}

/**
 * Merge form field name prefix with additional names.
 */
export const mergeNames = (prefix: string[] | null, ...names: string[]): string[] => {
  const base = prefix && prefix.length > 0 ? [...prefix] : [];
  return [...base, ...names];
};

/**
 * Return a validation rule descriptor for required fields.
 */
export const requiredField = (field: string, required = true) => ({
  required,
  message: `${field} is required`,
});

/**
 * Return a placeholder string for a form field.
 */
export const placeholderField = (field: string, fieldType: 'input' | 'select' = 'input') =>
  fieldType === 'select' ? `Select ${field}` : `Enter ${field}`;

/**
 * Check if a field is in the read-only list.
 */
export const isReadOnlyField = (field: string, readOnlyFields: string[]): boolean =>
  readOnlyFields.includes(field);

/**
 * Set nested dynamic fields on a form instance.
 * Replaces lodash _.set() usage.
 */
export const setNestedDynamicFields = (
  formRef: IFormInstance,
  names: string | string[],
  value: unknown,
): void => {
  const path = Array.isArray(names) ? names : [names];
  const currentValues = formRef.getFieldsValue(true);
  let obj = currentValues as Record<string, unknown>;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (obj[key] === undefined || obj[key] === null || typeof obj[key] !== 'object') {
      obj[key] = {};
    }
    obj = obj[key] as Record<string, unknown>;
  }
  obj[path[path.length - 1]] = value;
  formRef.setFieldsValue(currentValues);
};

/**
 * Find a value in a nested object by path.
 */
export const findFieldValue = (data: object, nested: string | string[]): unknown => {
  const path = Array.isArray(nested) ? nested : nested.split('.');
  let current: unknown = data;
  for (const key of path) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }
  return current;
};
