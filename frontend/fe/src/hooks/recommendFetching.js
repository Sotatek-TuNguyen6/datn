import { useQuery } from '@tanstack/react-query';
import * as RecommendService from '../services/Recommend/Recommend';

function useGetRecommend(id) {
    const getListQuery = useQuery({
        queryKey: ['recommend', id],
        queryFn: () => RecommendService.getRecommend(id),
        cacheTime: 5000,
        refetchOnWindowFocus: false,
        staleTime: 5000,
        refetchInterval: 60000,
    });
    return getListQuery;
}

export { useGetRecommend };
