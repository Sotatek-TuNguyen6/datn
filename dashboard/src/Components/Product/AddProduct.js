import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Toast from "../LoadingError/Toast";
import axios from "axios";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import * as ProductService from "../../Services/ProductService";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import './editor.css'
import { useGetListCategory } from "../../hooks/callApiCache";

const AddProductMain = () => {
    const [name, setName] = useState("");
    const [priceSale, setPriceSale] = useState(0);
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState({
        categoryId: "",
        categoryName: ""
    });
    const [specifications, setSpeciFicaTions] = useState("")
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const [rating, setRating] = useState(0);
    const [brand, setBrand] = useState("")
    const [stockQuantity, setStockQuantity] = useState("")
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [loading, setLoading] = useState(false);
    const toastId = React.useRef(null);
    const history = useNavigate();
    const Toastobjects = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    };
    const handleFileInputChange = (event) => {
        const selectedImages = Array.from(event.target.files);
        setImages(selectedImages);
    };
    const mutationAddProduct = useMutationHooks((data) => {
        const { ...rests } = data;
        const res = ProductService.createProduct(rests);
        return res;
    });

    const submitHandler = async (event) => {
        event.preventDefault();
        if (name === "" || category === "" || description === "" || price === 0) {
            if (!toast.isActive(toastId.current)) {
                toastId.current = toast.error("Không được để trống!", Toastobjects);
            }
        } else {
            const uploadedImageUrls = [];
            setLoading(true)
            try {
                for (const image of images) {
                    const formData = new FormData();
                    formData.append("file", image);
                    formData.append("upload_preset", "Project1");

                    const response = await axios.post(
                        `https://api.cloudinary.com/v1_1/dgeeyhyzq/image/upload`,
                        formData
                    );
                    uploadedImageUrls.push(response.data.secure_url);
                }
                setLoading(false)
            } catch (error) {
                console.log(error);
            }
            mutationAddProduct.mutate({
                productName: name,
                categoryId: category.categoryId,
                categoryName: category.categoryName,
                description,
                price,
                percentSale: priceSale,
                images: uploadedImageUrls,
                mainImage: uploadedImageUrls[0],
                ratings: rating,
                brand,
                stockQuantity,
                specifications: specifications.split(",")
            });
        }
    };

    const onEditorStateChange = (newEditorState) => {
        setEditorState(newEditorState);
        setDescription(
            draftToHtml(convertToRaw(newEditorState.getCurrentContent()))
        );
    };
    const { error, isLoading, isSuccess, isError } = mutationAddProduct;
    useEffect(() => {
        if (!error && isSuccess) {
            if (!toast.isActive(toastId.current)) {
                toastId.current = toast.success("Thành công!", Toastobjects);
            }
            history('/products');
        } else if (error) {
            if (!toast.isActive(toastId.current)) {
                toastId.current = toast.error(
                    error.response.data.message,
                    Toastobjects
                );
            }
        }
    }, [error, isSuccess]);

    const getListQuery = useGetListCategory();

    const { data: listCategory } = getListQuery

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };
    const handleCategoryChange = (e) => {
        const selectedUserId = e.target.value;
        const selectedUser = listCategory.data.find((item) => item._id === selectedUserId);

        if (selectedUser) {
            setCategory({
                categoryId: selectedUser._id,
                categoryName: selectedUser.categoryName
            });
        }
    };
    return (
        <>
            <Toast />
            <section className="content-main position-relative" style={{ maxWidth: "1200px" }}>
                {loading &&
                    <>
                        <div
                            className="position-absolute w-screen h-screen bg-gray-50 z-10 border border-gray-200 rounded-lg">
                            <div role="status" className={"position-relative left-1/3 top-1/3"}>
                                <svg aria-hidden="true" className="Toastify__spinner"
                                    viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor" />
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill" />
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    </>
                }
                <form onSubmit={submitHandler}>
                    <div className="content-header">
                        <Link to="/products" className="btn btn-danger text-white">
                            Về trang sản phẩm
                        </Link>
                        <h2 className="content-title">Thêm sản phẩm</h2>
                        <div>
                            <button type="submit" className="btn btn-primary">
                                Xác nhận thêm
                            </button>
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="col-xl-12 col-lg-12">
                            <div className="card mb-4 shadow-sm">
                                <div className="card-body">
                                    <div className="mb-4">
                                        <label htmlFor="product_title" className="form-label">
                                            Tên sản phẩm
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Tên sản phẩm"
                                            className="form-control"
                                            id="product_title"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="product_price" className="form-label">
                                            Danh mục
                                        </label>
                                        <select
                                            className="form-select text-capitalize"
                                            aria-label="Default select example"
                                            value={category.categoryId}
                                            onChange={handleCategoryChange}
                                        >
                                            <option value="1">Choose category</option>
                                            {listCategory?.data?.map((item, index) => (
                                                <option
                                                    key={index}
                                                    value={item._id}
                                                    className="text-capitalize"
                                                >
                                                    {item.categoryName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="product_price" className="form-label">
                                            Mô tả
                                        </label>
                                        <Editor
                                            editorState={editorState}
                                            wrapperClassName="demo-wrapper"
                                            editorClassName="demo-editor"
                                            onEditorStateChange={onEditorStateChange}
                                        />

                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label">Giá Gốc</label>
                                        <input
                                            type="number"
                                            placeholder="Type here"
                                            className="form-control"
                                            onChange={(e) => setPrice(e.target.value)}
                                        ></input>
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label">Giá sale</label>
                                        <input
                                            type="number"
                                            placeholder="Type here"
                                            className="form-control"
                                            onChange={(e) => setPriceSale(e.target.value)}
                                        ></input>
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label">Rating</label>
                                        <input
                                            type="number"
                                            placeholder="Type here"
                                            className="form-control"
                                            onChange={(e) => setRating(e.target.value)}
                                        ></input>
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label">Số lượng</label>
                                        <input
                                            type="number"
                                            placeholder="Type here"
                                            className="form-control"
                                            onChange={(e) => setStockQuantity(e.target.value)}
                                        ></input>
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label">Thông số kĩ thuật</label>
                                        <input
                                            type="text"
                                            placeholder="Type here"
                                            className="form-control"
                                            onChange={(e) => setSpeciFicaTions(e.target.value)}
                                        ></input>
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label">Brand</label>
                                        <input
                                            type="text"
                                            placeholder="Type here"
                                            className="form-control"
                                            onChange={(e) => setBrand(e.target.value)}
                                        ></input>
                                    </div>
                                    <div class="mb-3">
                                        <label for="formFileMultiple" class="form-label">
                                            Ảnh
                                        </label>
                                        <input
                                            class="form-control"
                                            type="file"
                                            id="formFileMultiple"
                                            onChange={handleFileInputChange}
                                            multiple
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </section>
        </>
    );
};

export default AddProductMain;
