import { useQuery } from '@tanstack/react-query';
import * as CategoryService from '../services/Category/categoryService';

function useGetCategoru() {
    const getListQuery = useQuery({
        queryKey: ['category'],
        queryFn: CategoryService.getCategory,
        cacheTime: 5000,
        refetchOnWindowFocus: false,
        staleTime: 5000,
        refetchInterval: 60000,
    });
    return getListQuery;
}

export { useGetCategoru };
