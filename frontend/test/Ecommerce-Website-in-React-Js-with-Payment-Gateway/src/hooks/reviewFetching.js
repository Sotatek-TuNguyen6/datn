import { useQuery } from '@tanstack/react-query';
import * as ReviewService from '../services/Review/reviewService';

function useGetReview(id) {
    const getListQuery = useQuery({
        queryKey: ['review', id],
        queryFn: () => ReviewService.getReview(id),
        cacheTime: 5000,
        refetchOnWindowFocus: false,
        staleTime: 5000,
        refetchInterval: 60000,
    });
    return getListQuery;
}

export { useGetReview };
