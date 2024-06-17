import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginScreen from "./Screen/Login/LoginScreen";
import { useDispatch, useSelector } from "react-redux";
import ProductScreen from "./Screen/Product/ProductScreen";
import AddProduct from "./Screen/Product/AddProductScreen";
import EditProductScreen from "./Screen/Product/EditProductSreen";
import OrderScreen from "./Screen/OrdersScreen";
import EditOrdersScreen from "./Screen/EditOrderScreen";
import UserScreen from "./Screen/User/UserScreen";
import CategoryScreen from "./Screen/Category/CategoryScreen";
import AddCategory from "./Screen/Category/AddCategorySreen";
import PaymentScreen from "./Screen/PaymentScreen";
import VoucherScreen from "./Screen/Voucher/VoucherScreen";
import EditVoucherScreen from "./Screen/Voucher/EditVoucherScreen";
import AddReviewScreen from "./Screen/Review/AddReviewScreen";
import ReviewScreen from "./Screen/Review/ReviewScreen";
import EditReviewScreen from "./Screen/Review/EditReviewScreen";
import PrivateRoutes from "./PrivateRouter";
import EditPaymentScreen from "./Screen/EditPaymentScreen";
import EditUserScreen from "./Screen/User/UserEditScreen";
import AddUserScreen from "./Screen/User/UserAddScreen";
import AddVoucherScreen from "./Screen/Voucher/AddVoucherScreen";
import ChatScreen from "./Screen/Chat/chatScreen";

function App() {
    const userLogin = useSelector((state) => state.user);
    // const location = useLocation();

    const dispatch = useDispatch();

    // useEffect(() => {
    //     if (email !== "") {
    //         dispatch(fetchAsyncProducts());
    //         // hangldeGetAll()
    //     }
    // }, [dispatch]);
    // useEffect(() => {
    //     const { storageData, decoded } = handleDecoded();
    //     if (decoded?.id) {
    //         handleGetDetailsUser(decoded?.id, storageData);
    //     }
    //     //  dispatch(updateUser({data}))
    // }, []);
    // const handleDecoded = () => {
    //     let storageData = localStorage.getItem("access_token");
    //     // let token_refresh = localStorage.getItem("refresh_token");
    //     let decoded = {};
    //     if (storageData && isJsonString(storageData)) {
    //         storageData = JSON.parse(storageData);
    //         // token_refresh = JSON.parse(token_refresh);
    //         decoded = jwt_decode(storageData);
    //     }
    //     return { decoded, storageData };
    // };
    // UserService.axiosJWT.interceptors.request.use(
    //     async (config) => {
    //         // Do something before request is sent
    //         const currentTime = new Date();
    //         const { decoded, token_refresh } = handleDecoded();
    //         // console.log(decoded?.exp < currentTime.getTime() / 1000)
    //         if (decoded?.exp < currentTime.getTime() / 1000) {
    //             const data = await UserService.refreshToken(token_refresh);
    //             console.log(data)

    //             config.headers["Authorization"] = `Bearer ${data?.access_token}`;
    //         }
    //         return config;
    //     },
    //     (err) => {
    //         return Promise.reject(err);
    //     }
    // );
    // const handleGetDetailsUser = async (id, token) => {
    //     const res = await UserService.getDetailsUser(id, token);
    //     dispatch(updateUser({ ...res?.data, access_token: token }));
    // };

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PrivateRoutes />}>
                    <Route>
                        <Route path="/" element={<ProductScreen />} />
                        <Route path="/products" element={<ProductScreen />} />
                        <Route path="/addproduct" element={<AddProduct />} />
                        <Route path="/orders" element={<OrderScreen />} />
                        <Route path="/category" element={<CategoryScreen />} />
                        <Route path="/addcategory" element={<AddCategory />} />

                        <Route path="/users" element={<UserScreen />} />
                        <Route path="/user/:id" element={<EditUserScreen />} />
                        <Route path="/adduser" element={<AddUserScreen />} />

                        {/*<Route path="/users/:id/edit" element={<EditUserScreen />} />*/}

                        <Route path="/product/:id/edit" element={<EditProductScreen />} />
                        <Route path="/orders/:id/edit" element={<EditOrdersScreen />} />

                        <Route path="/payment" element={<PaymentScreen />} />
                        <Route path="/payment/:id/edit" element={<EditPaymentScreen />} />

                        <Route path="/voucher" element={<VoucherScreen />} />
                        <Route path="/addvoucher" element={< AddVoucherScreen/>} />
                        <Route path="/voucher/:id/edit" element={<EditVoucherScreen />} />

                        <Route path="/review" element={<ReviewScreen />} />
                        <Route path="/review/create" element={<AddReviewScreen />} />
                        <Route path="/review/:id/edit" element={<EditReviewScreen />} />
                        <Route path="/chat" element={<ChatScreen />} />

                        {/* <Route path="/message/create" element={<AddVoucherScreen />} /> */}

                    </Route>
                </Route>
                <Route path="/login" element={<LoginScreen />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
