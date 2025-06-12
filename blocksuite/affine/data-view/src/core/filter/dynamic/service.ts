import { createIdentifier } from '@blocksuite/global/di';

import type { DataSource } from '../../data-source/base.js';
import { Matcher_ } from '../../logical/matcher.js';
import type { FilterConfig } from '../filter-fn/create.js';
import { allInternalFilter } from '../filter-fn/matcher.js';

// External filter config provider (DI token)
export const ExternalFilterConfigProvider = createIdentifier<FilterConfig>(
  'external-filter-config'
);

const createFilterMatcher = (list: FilterConfig[]) => {
  return new Matcher_(list, v => v.self);
};

export class FilterService {
  constructor(private readonly dataSource: DataSource) {}

  allExternalFilterConfig(): FilterConfig[] {
    return Array.from(
      this.dataSource.provider.getAll(ExternalFilterConfigProvider).values()
    );
  }

  get matcher() {
    return createFilterMatcher([
      ...this.allExternalFilterConfig(),
      ...allInternalFilter,
    ]);
  }
}

export const FilterServiceProvider =
  createIdentifier<FilterService>('filter-service');

export const getFilterService = (dataSource: DataSource) => {
  return dataSource.serviceGetOrCreate(
    FilterServiceProvider,
    () => new FilterService(dataSource)
  );
};
