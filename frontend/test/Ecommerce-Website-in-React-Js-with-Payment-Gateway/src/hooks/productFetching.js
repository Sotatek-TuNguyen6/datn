import { useQuery } from '@tanstack/react-query';
import * as ProductService from '../services/Product/productService';

function useGetProduct() {
    const getListQuery = useQuery({
        queryKey: ['product'],
        queryFn: ProductService.getProduct,
        cacheTime: 5000,
        refetchOnWindowFocus: false,
        staleTime: 5000,
        refetchInterval: 60000,
    });
    return getListQuery;
}

export { useGetProduct };
