import { Condition } from '../types';
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
