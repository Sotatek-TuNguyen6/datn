import { useQuery } from '@tanstack/react-query';
import * as ShippingService from '../services/Shipping/shippingService';

function useGetShipping(access_token) {
    const getListQuery = useQuery({
        queryKey: ['shipping', access_token],
        queryFn: () => ShippingService.getShipping(access_token),
        cacheTime: 5000,
        refetchOnWindowFocus: false,
        staleTime: 5000,
        refetchInterval: 60000,
    });
    return getListQuery;
}

export { useGetShipping };
