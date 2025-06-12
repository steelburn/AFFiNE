import {
  DatabaseBlockDataSource,
  ExternalFilterConfigProvider,
  ExternalGroupByConfigProvider,
} from '@blocksuite/affine/blocks/database';
import type { ExtensionType } from '@blocksuite/affine/store';

import { filterConfigList } from '../../database-block/filters/index.js';
import { groupByConfigList } from '../../database-block/group-by';
import { registerMemberLiteral } from '../../database-block/literals/member.js';
import { propertiesPresets } from '../../database-block/properties';

export function patchDatabaseBlockConfigService(): ExtensionType {
  //TODO use service
  DatabaseBlockDataSource.externalProperties.value = propertiesPresets;
  registerMemberLiteral();
  return {
    setup: di => {
      groupByConfigList.forEach(config => {
        di.addValue(ExternalGroupByConfigProvider(config.name), config);
      });
      filterConfigList.forEach(config => {
        di.addValue(ExternalFilterConfigProvider(config.name), config);
      });
    },
  };
}
