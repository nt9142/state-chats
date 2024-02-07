import type { Condition } from '../types';
import { evaluateCondition } from '../utils';

describe('evaluateCondition', () => {
  const answers = {
    variable1: 'value1',
    variable2: 'value2',
    variable3: 'value4',
  };

  it('should return true for equals condition when variable value matches', () => {
    const condition: Condition = {
      type: 'equals',
      variable: 'variable1',
      value: 'value1',
    };
    const result = evaluateCondition(condition, answers);
    expect(result).toBe(true);
  });

  it('should return false for equals condition when variable value does not match', () => {
    const condition: Condition = {
      type: 'equals',
      variable: 'variable1',
      value: 'value2',
    };
    const result = evaluateCondition(condition, answers);
    expect(result).toBe(false);
  });

  it('should return true for contains condition when variable value includes the specified value', () => {
    const condition: Condition = {
      type: 'contains',
      variable: 'variable2',
      value: 'val',
    };
    const result = evaluateCondition(condition, answers);
    expect(result).toBe(true);
  });

  it('should return false for contains condition when variable value does not include the specified value', () => {
    const condition: Condition = {
      type: 'contains',
      variable: 'variable2',
      value: 'value4',
    };
    const result = evaluateCondition(condition, answers);
    expect(result).toBe(false);
  });

  it('should return true for and condition when all sub-conditions evaluate to true', () => {
    const condition: Condition = {
      type: 'and',
      conditions: [
        { type: 'equals', variable: 'variable1', value: 'value1' },
        { type: 'contains', variable: 'variable2', value: 'value2' },
      ],
    };
    const result = evaluateCondition(condition, answers);
    expect(result).toBe(true);
  });

  it('should return false for and condition when any sub-condition evaluates to false', () => {
    const condition: Condition = {
      type: 'and',
      conditions: [
        { type: 'equals', variable: 'variable1', value: 'value1' },
        { type: 'equals', variable: 'variable2', value: 'value3' },
      ],
    };
    const result = evaluateCondition(condition, answers);
    expect(result).toBe(false);
  });

  it('should return true for or condition when any sub-condition evaluates to true', () => {
    const condition: Condition = {
      type: 'or',
      conditions: [
        { type: 'equals', variable: 'variable1', value: 'value2' },
        { type: 'equals', variable: 'variable2', value: 'value2' },
      ],
    };
    const result = evaluateCondition(condition, answers);
    expect(result).toBe(true);
  });

  it('should return false for or condition when all sub-conditions evaluate to false', () => {
    const condition: Condition = {
      type: 'or',
      conditions: [
        { type: 'equals', variable: 'variable1', value: 'value2' },
        { type: 'contains', variable: 'variable2', value: 'value4' },
      ],
    };
    const result = evaluateCondition(condition, answers);
    expect(result).toBe(false);
  });

  it('should return true for not condition when the sub-condition evaluates to false', () => {
    const condition: Condition = {
      type: 'not',
      condition: { type: 'equals', variable: 'variable1', value: 'value2' },
    };
    const result = evaluateCondition(condition, answers);
    expect(result).toBe(true);
  });

  it('should return false for not condition when the sub-condition evaluates to true', () => {
    const condition: Condition = {
      type: 'not',
      condition: { type: 'equals', variable: 'variable1', value: 'value1' },
    };
    const result = evaluateCondition(condition, answers);
    expect(result).toBe(false);
  });
});

describe('evaluateCondition with array extensions', () => {
  const answers = {
    list1: [1, 2, 3, 4],
    list2: ['a', 'b', 'c'],
    list3: ['hello', 'world'],
  };

  it('should return true for lengthAtLeast condition when array length meets the minimum requirement', () => {
    const condition: Condition = {
      type: 'lengthAtLeast',
      variable: 'list1',
      value: 4,
    };
    const result = evaluateCondition(condition, answers);
    expect(result).toBe(true);
  });

  it('should return false for lengthAtLeast condition when array length does not meet the minimum requirement', () => {
    const condition: Condition = {
      type: 'lengthAtLeast',
      variable: 'list2',
      value: 4,
    };
    const result = evaluateCondition(condition, answers);
    expect(result).toBe(false);
  });

  it('should return true for lengthAtMost condition when array length meets the maximum requirement', () => {
    const condition: Condition = {
      type: 'lengthAtMost',
      variable: 'list1',
      value: 4,
    };
    const result = evaluateCondition(condition, answers);
    expect(result).toBe(true);
  });

  it('should return false for lengthAtMost condition when array length exceeds the maximum requirement', () => {
    const condition: Condition = {
      type: 'lengthAtMost',
      variable: 'list1',
      value: 3,
    };
    const result = evaluateCondition(condition, answers);
    expect(result).toBe(false);
  });

  it('should return true for lengthEquals condition when array length matches the specified value', () => {
    const condition: Condition = {
      type: 'lengthEquals',
      variable: 'list3',
      value: 2,
    };
    const result = evaluateCondition(condition, answers);
    expect(result).toBe(true);
  });
});
