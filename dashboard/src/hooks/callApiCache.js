import { useQuery } from 'react-query';
import * as CategoryService from "../Services/CategoryService";
import * as ProductService from "../Services/ProductService";
import * as ReviewService from "../Services/ReviewService";
import * as UserService from "../Services/UserService";
import * as PaymentService from "../Services/PaymentService";
import * as VoucherService from "../Services/VoucherService";

function useGetListCategory() {
    const getListQuery = useQuery('category', CategoryService.getCategory, {
        cacheTime: 5000,
        refetchOnWindowFocus: false,
        staleTime: 5000,
        refetchInterval: 60000,
    });
    return getListQuery;
}

function useGetListProduct() {
    const getListQuery = useQuery('product', ProductService.getAll, {
        cacheTime: 5000,
        refetchOnWindowFocus: false,
        staleTime: 5000,
        refetchInterval: 60000,
    });
    return getListQuery;
}

function useGetDetailProduct(id) {
    const getListQuery = useQuery('productDetail', () => ProductService.getDetailProduct(id), {
        cacheTime: 5000,
        refetchOnWindowFocus: false,
        staleTime: 5000,
        refetchInterval: 60000,
    });
    return getListQuery;
}

function useGetListReview() {
    const getListQuery = useQuery('review', ReviewService.getAll, {
        cacheTime: 5000,
        refetchOnWindowFocus: false,
        staleTime: 5000,
        refetchInterval: 60000,
    });
    return getListQuery;
}

function useGetDetailReview(id) {
    const getListQuery = useQuery('reviewtDetail', () => ReviewService.getDetailReview(id), {
        cacheTime: 5000,
        refetchOnWindowFocus: false,
        staleTime: 5000,
        refetchInterval: 60000,
    });
    return getListQuery;
}

//USER
function useGetListUser(access_token) {
    const getListQuery = useQuery('user', () => UserService.getAll(access_token), {
        cacheTime: 5000,
        refetchOnWindowFocus: false,
        staleTime: 5000,
        refetchInterval: 60000,
    });
    return getListQuery;
}

function useGetDetailUser(id, access_token) {
    const getListQuery = useQuery('reviewtDetail', () => UserService.getDetailsUser(id, access_token), {
        cacheTime: 5000,
        refetchOnWindowFocus: false,
        staleTime: 5000,
        refetchInterval: 60000,
    });
    return getListQuery;
}

// Payment

function useGetListPayment(access_token) {
    const getListQuery = useQuery('payment', () => PaymentService.getListPay(access_token), {
        cacheTime: 5000,
        refetchOnWindowFocus: false,
        staleTime: 5000,
        refetchInterval: 60000,
    });
    return getListQuery;
}

// Voucher
function useGetListVoucher(access_token) {
    const getListQuery = useQuery('voucher', () => VoucherService.getVoucher(access_token), {
        cacheTime: 5000,
        refetchOnWindowFocus: false,
        staleTime: 5000,
        refetchInterval: 60000,
    });
    return getListQuery;
}
export {
    useGetListCategory, useGetListProduct, useGetDetailProduct, useGetListReview, useGetListUser,
    useGetDetailReview, useGetDetailUser, useGetListPayment, useGetListVoucher
};
