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

function useGetProductDetail(id) {
    const getListQuery = useQuery({
        queryKey: ['productDetail', id],
        queryFn: () => ProductService.getProductDetail(id),
        cacheTime: 5000,
        refetchOnWindowFocus: false,
        staleTime: 5000,
        refetchInterval: 60000,
    });
    return getListQuery;
}

function useGetProductByCategory(categoryId){
    const getListQuery = useQuery({
        queryKey: ['productByCategory', categoryId],
        queryFn: () => ProductService.getProductByCategory(categoryId),
        cacheTime: 5000,
        refetchOnWindowFocus: false,
        staleTime: 5000,
        refetchInterval: 60000,
    });
    return getListQuery;
}
export { useGetProduct, useGetProductDetail, useGetProductByCategory };
