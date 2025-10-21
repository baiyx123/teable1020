import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

interface Department {
  id: string;
  name: string;
  code: string;
  level: number;
  path?: string;
  status: string;
}

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ['departments', 'list'],
    queryFn: async () => {
      const response = await fetch('/api/department');
      if (!response.ok) {
        throw new Error('Failed to fetch departments');
      }
      return response.json() as Promise<Department[]>;
    },
    staleTime: 5 * 60 * 1000, // 5分钟缓存
  });

  useEffect(() => {
    if (data) {
      setDepartments(data);
    }
  }, [data]);

  return {
    departments,
    loading: isLoading,
  };
}

