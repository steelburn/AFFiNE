import {
  createFilter,
  ct,
  t,
  tRef,
  tVar,
} from '@blocksuite/affine/blocks/database';

const option = 'userOption' as const;

export const memberUserFilters = [
  createFilter({
    name: 'memberIsOneOf',
    vars: [tVar(option, t.user.instance())] as const,
    self: tRef(option),
    args: [ct.array.instance(tRef(option))] as const,
    label: 'Is one of',
    shortString: () => undefined,
    impl: (self, value) => {
      if (!value.length) return true;
      if (self == null) return false;
      return value.includes(self);
    },
    defaultValue: args => args[0][0],
  }),
  createFilter({
    name: 'memberIsNotOneOf',
    vars: [tVar(option, t.user.instance())] as const,
    self: tRef(option),
    args: [ct.array.instance(tRef(option))] as const,
    label: 'Is not one of',
    shortString: () => undefined,
    impl: (self, value) => {
      if (!value.length) return true;
      if (self == null) return true;
      return !value.includes(self);
    },
  }),
];

export const memberMultiFilters = [
  createFilter({
    name: 'memberContainsOneOf',
    vars: [tVar(option, t.user.instance())] as const,
    self: ct.array.instance(tRef(option)),
    args: [ct.array.instance(tRef(option))] as const,
    label: 'Contains one of',
    shortString: () => undefined,
    impl: (self, value) => {
      if (!value.length) return true;
      if (self == null) return false;
      return value.some(v => self.includes(v));
    },
  }),
];

export const filterConfigList = [...memberUserFilters, ...memberMultiFilters];
