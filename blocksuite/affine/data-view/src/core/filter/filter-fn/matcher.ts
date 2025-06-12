import { ct } from '../../logical/composite-type.js';
import { t } from '../../logical/index.js';
import type { TypeInstance } from '../../logical/type.js';
import { typeSystem } from '../../logical/type-system.js';
import { booleanFilter } from './boolean.js';
import type { FilterConfig } from './create.js';
import { dateFilter } from './date.js';
import { multiTagFilter } from './multi-tag.js';
import { numberFilter } from './number.js';
import { stringFilter } from './string.js';
import { tagFilter } from './tag.js';
import { unknownFilter } from './unknown.js';

export const allInternalFilter = [
  ...dateFilter,
  ...multiTagFilter,
  ...numberFilter,
  ...stringFilter,
  ...tagFilter,
  ...booleanFilter,
  ...unknownFilter,
] as FilterConfig[];

const getPredicate = (selfType: TypeInstance) => (filter: FilterConfig) => {
  const fn = ct.fn.instance(
    [filter.self, ...filter.args],
    t.boolean.instance(),
    filter.vars
  );
  const staticType = fn.subst(
    Object.fromEntries(
      filter.vars?.map(v => [
        v.varName,
        {
          define: v,
          type: v.typeConstraint,
        },
      ]) ?? []
    )
  );
  if (!staticType) {
    return false;
  }
  const firstArg = staticType.args[0];
  return firstArg && typeSystem.unify(selfType, firstArg);
};

export const internalFilterMatcher = {
  filterListBySelfType: (selfType: TypeInstance) => {
    return allInternalFilter.filter(getPredicate(selfType));
  },
  firstMatchedBySelfType: (selfType: TypeInstance) => {
    return allInternalFilter.find(getPredicate(selfType));
  },
  getFilterByName: (name?: string) => {
    if (!name) {
      return;
    }
    return allInternalFilter.find(v => v.name === name);
  },
};
