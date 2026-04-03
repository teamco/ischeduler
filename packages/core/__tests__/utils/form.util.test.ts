import { describe, it, expect } from 'vitest';
import {
  mergeNames,
  requiredField,
  placeholderField,
  isReadOnlyField,
} from '@ischeduler-core/utils';

describe('form utilities', () => {
  describe('mergeNames', () => {
    it('should merge prefix with names', () => {
      expect(mergeNames(['scheduler', 'sale'], 'duration', 'type')).toEqual([
        'scheduler',
        'sale',
        'duration',
        'type',
      ]);
    });

    it('should handle null prefix', () => {
      expect(mergeNames(null, 'duration')).toEqual(['duration']);
    });

    it('should handle empty prefix array', () => {
      expect(mergeNames([], 'duration')).toEqual(['duration']);
    });

    it('should handle single name', () => {
      expect(mergeNames(['prefix'], 'name')).toEqual(['prefix', 'name']);
    });
  });

  describe('requiredField', () => {
    it('should return required rule', () => {
      const rule = requiredField('Name');
      expect(rule.required).toBe(true);
      expect(rule.message).toContain('Name');
    });

    it('should return non-required when false', () => {
      const rule = requiredField('Name', false);
      expect(rule.required).toBe(false);
    });
  });

  describe('placeholderField', () => {
    it('should return input placeholder by default', () => {
      const result = placeholderField('Name');
      expect(result).toContain('Name');
    });

    it('should return select placeholder', () => {
      const result = placeholderField('Status', 'select');
      expect(result).toContain('Status');
    });
  });

  describe('isReadOnlyField', () => {
    it('should return true if field is in read-only list', () => {
      expect(isReadOnlyField('duration', ['duration', 'type'])).toBe(true);
    });

    it('should return false if field is not in read-only list', () => {
      expect(isReadOnlyField('name', ['duration', 'type'])).toBe(false);
    });

    it('should return false for empty list', () => {
      expect(isReadOnlyField('name', [])).toBe(false);
    });
  });
});
