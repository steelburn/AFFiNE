import { BlockSuiteError, ErrorCode } from '@blocksuite/global/exceptions';

import type { DataSource } from '../data-source/base.js';
import { getRefType } from '../expression/ref/ref.js';
import type { Variable, VariableRef } from '../expression/types.js';
import { getFilterService } from './dynamic/service.js';
import type { FilterGroup, SingleFilter } from './types.js';

export const firstFilterName = (
  vars: Variable[],
  ref: VariableRef,
  dataSource: DataSource
) => {
  const matcher = getFilterService(dataSource).matcher;
  const type = getRefType(vars, ref);
  if (!type) {
    throw new BlockSuiteError(
      ErrorCode.DatabaseBlockError,
      `can't resolve ref type`
    );
  }
  return matcher.allMatched(type)[0]?.name;
};
export const firstFilterByRef = (
  vars: Variable[],
  ref: VariableRef,
  dataSource: DataSource
): SingleFilter => {
  return {
    type: 'filter',
    left: ref,
    function: firstFilterName(vars, ref, dataSource),
    args: [],
  };
};
export const firstFilter = (
  vars: Variable[],
  dataSource: DataSource
): SingleFilter => {
  const variable = vars[0];
  if (!variable) {
    throw new BlockSuiteError(
      ErrorCode.DatabaseBlockError,
      `can't find any variable`
    );
  }
  const ref: VariableRef = {
    type: 'ref',
    name: variable.id,
  };
  const filter = firstFilterName(vars, ref, dataSource);
  if (!filter) {
    throw new BlockSuiteError(
      ErrorCode.DatabaseBlockError,
      `can't match any filter`
    );
  }
  return {
    type: 'filter',
    left: ref,
    function: filter,
    args: [],
  };
};
export const firstFilterInGroup = (
  vars: Variable[],
  dataSource: DataSource
): FilterGroup => {
  return {
    type: 'group',
    op: 'and',
    conditions: [firstFilter(vars, dataSource)],
  };
};
export const emptyFilterGroup: FilterGroup = {
  type: 'group',
  op: 'and',
  conditions: [],
};
