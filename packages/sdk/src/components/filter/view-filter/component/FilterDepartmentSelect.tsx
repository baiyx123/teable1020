import { useQuery } from '@tanstack/react-query';
import { isMeTag, Me } from '@teable/core';
import { Building2 } from '@teable/icons';
import { axios } from '@teable/openapi';
import { cn } from '@teable/ui-lib';
import { useCallback, useMemo, useState } from 'react';
import { ReactQueryKeys } from '../../../../config/react-query-keys';
import { useTranslation } from '../../../../context/app/i18n';
import { useSession } from '../../../../hooks/use-session';
import type { DepartmentField } from '../../../../model';
import { BaseMultipleSelect, BaseSingleSelect } from './base';

interface IFilterDepartmentProps {
  field: DepartmentField;
  operator: string;
  value: string[] | string | null;
  onSearch?: (value: string) => void;
  onSelect: (value: string[] | string | null) => void;
  modal?: boolean;
}

interface IFilterDepartmentBaseProps extends IFilterDepartmentProps {
  data?: {
    departmentId: string;
    departmentName: string;
  }[];
  disableMe?: boolean;
}

const SINGLE_SELECT_OPERATORS = ['is', 'isNot'];

const FilterDepartmentSelectBase = (props: IFilterDepartmentBaseProps) => {
  const { value, onSelect, operator, data, disableMe, onSearch, modal } = props;
  const { user: currentUser } = useSession();
  const { t } = useTranslation();
  const values = useMemo<string | string[] | null>(() => value, [value]);
  const isMultiple = !SINGLE_SELECT_OPERATORS.includes(operator);

  const options = useMemo(() => {
    if (!data?.length) return [];

    const map = data.map(({ departmentId, departmentName }) => ({
      value: departmentId,
      label: departmentName,
    }));

    if (!disableMe && currentUser?.primaryDepartmentId) {
      map.unshift({
        value: Me,
        label: t('filter.currentDepartment'),
      });
    }
    return map;
  }, [data, disableMe, currentUser, t]);

  const displayRender = useCallback(
    (option: (typeof options)[number]) => {
      return (
        <div
          className={cn('gap-1 rounded-lg text-secondary-foreground', {
            'max-w-full overflow-hidden': !isMultiple,
          })}
          key={option.value}
        >
          <div
            className={cn('flex items-center space-x-2 flex-1', {
              truncate: !isMultiple,
            })}
          >
            <div className="flex items-center space-x-2">
              {isMeTag(option.value) ? (
                <span className="flex shrink-0 items-center truncate rounded-full">
                  <Building2 className="z-50 size-6 rounded-full border bg-secondary p-1" />
                </span>
              ) : (
                <Building2 className="size-4 text-muted-foreground" />
              )}
              <span className="truncate">{option.label}</span>
            </div>
          </div>
        </div>
      );
    },
    [isMultiple]
  );

  const optionRender = useCallback((option: (typeof options)[number]) => {
    return (
      <div key={option.value} className="w-full truncate rounded-lg text-secondary-foreground">
        <div className="flex w-full items-center gap-2 truncate">
          {isMeTag(option.value) ? (
            <span className="flex size-6 items-center justify-center rounded-full bg-secondary">
              <Building2 className="size-4" />
            </span>
          ) : (
            <Building2 className="size-4 text-muted-foreground" />
          )}
          <span className="truncate">{option.label}</span>
        </div>
      </div>
    );
  }, []);

  return (
    <>
      {!isMultiple ? (
        <BaseSingleSelect
          options={options}
          modal={modal}
          onSelect={onSelect}
          value={values as string}
          displayRender={displayRender}
          optionRender={optionRender}
          className="flex w-64 overflow-hidden"
          popoverClassName="w-64"
          placeholderClassName="text-xs"
          onSearch={onSearch}
        />
      ) : (
        <BaseMultipleSelect
          options={options}
          modal={modal}
          onSelect={onSelect}
          value={values as string[]}
          displayRender={displayRender}
          optionRender={optionRender}
          className="w-64"
          popoverClassName="w-64"
          placeholderClassName="text-xs"
          onSearch={onSearch}
        />
      )}
    </>
  );
};

const FilterDepartmentSelect = (props: IFilterDepartmentProps) => {
  const { user: currentUser } = useSession();
  const [search, setSearch] = useState('');

  // 从部门API获取部门列表
  const { data: departmentsData } = useQuery({
    queryKey: ReactQueryKeys.departmentList(),
    queryFn: () =>
      axios.get<Array<{ id: string; name: string }>>('/department').then((res) => res.data),
  });

  // 过滤和映射部门数据
  const data = useMemo(() => {
    const depts = departmentsData || [];
    const filtered = search
      ? depts.filter((dept) => dept.name.toLowerCase().includes(search.toLowerCase()))
      : depts;

    return filtered.map((dept) => ({
      departmentId: dept.id,
      departmentName: dept.name,
    }));
  }, [departmentsData, search]);

  return (
    <FilterDepartmentSelectBase
      {...props}
      data={data}
      onSearch={setSearch}
    />
  );
};

export { FilterDepartmentSelect, FilterDepartmentSelectBase };

