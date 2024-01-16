export type BaseCondition = {
  variable: string;
  value?: any;
};

export type EqualsCondition = BaseCondition & {
  type: 'equals';
};

export type ContainsCondition = BaseCondition & {
  type: 'contains';
};

export type NotCondition = {
  type: 'not';
  condition: Condition; // Recursive reference for nested conditions
};

export type AndOrCondition = {
  type: 'and' | 'or';
  conditions: Condition[]; // An array of Condition for 'and' or 'or' type
};

export type Condition =
  | EqualsCondition
  | ContainsCondition
  | NotCondition
  | AndOrCondition;
