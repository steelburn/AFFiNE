import { Avatar, uniReactRoot } from '@affine/component';
import {
  allLiteralConfig,
  createLiteral,
  renderUniLit,
  t,
} from '@blocksuite/affine/blocks/database';
import { menu } from '@blocksuite/affine/components/context-menu';
import type { ExistedUserInfo } from '@blocksuite/affine/shared/services';
import { isExistedUserInfo } from '@blocksuite/affine/shared/services';
import { CheckBoxCheckSolidIcon, CheckBoxUnIcon } from '@blocksuite/icons/lit';
import { html } from 'lit';

// Wrap Avatar React component as UniComponent for lit rendering
const UniAvatar = uniReactRoot.createUniComponent(Avatar);

export const registerMemberLiteral = () => {
  // single user
  const single = createLiteral({
    type: t.user.instance(),
    getItems: (type, value, onChange) => {
      if (!t.user.is(type)) return [];
      const userListService = type.data?.userListService;
      if (!userListService) return [];
      const selectedId = value.value as string | undefined;
      return [
        menu.group({
          items: userListService.users$.value
            .filter(isExistedUserInfo)
            .map(user => {
              return renderAction(user, selectedId === user.id, () => {
                onChange(user.id);
                return false;
              });
            }),
        }),
      ];
    },
  });
  // multi user
  const multi = createLiteral({
    type: t.array.instance(t.user.instance()),
    getItems: (type, value, onChange) => {
      if (!t.array.is(type) || !t.user.is(type.element)) return [];
      const userListService = type.element.data?.userListService;
      if (!userListService) return [];
      const selectedSet = new Set<string>(value.value as string[]);
      return [
        menu.group({
          items: userListService.users$.value
            .filter(isExistedUserInfo)
            .map(user => {
              const isSelected = selectedSet.has(user.id);
              const checkbox = isSelected
                ? CheckBoxCheckSolidIcon({ style: 'color:#1E96EB' })
                : CheckBoxUnIcon();
              return renderAction(
                user,
                isSelected,
                () => {
                  if (isSelected) {
                    selectedSet.delete(user.id);
                  } else {
                    selectedSet.add(user.id);
                  }
                  onChange([...selectedSet]);
                  return false;
                },
                checkbox
              );
            }),
        }),
      ];
    },
  });
  allLiteralConfig.push(single, multi);
};

// helper function
function renderAction(
  user: ExistedUserInfo,
  isSelected: boolean,
  onSelect: () => false,
  postfix?: HTMLElement | ReturnType<typeof CheckBoxCheckSolidIcon>
) {
  return menu.action({
    name: user.name ?? 'Unnamed',
    prefix: renderUniLit(UniAvatar, {
      url: user.avatar ?? undefined,
      name: user.name ?? undefined,
    }),
    postfix: html`${postfix}`,
    isSelected,
    select: onSelect,
  });
}
