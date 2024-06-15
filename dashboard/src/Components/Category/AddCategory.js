import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Toast from "../LoadingError/Toast";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/LoadingError";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import * as CategoryService from "../../Services/CategoryService";

const AddProductMain = () => {
  const [name, setName] = useState("");
  const [subCategories, setSubCategories] = useState([{ name: '' }]);

  const toastId = React.useRef(null);
  const Toastobjects = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const mutationAddCategory = useMutationHooks(async (data) => {
    const { access_token, ...rests } = data;
    const res = await CategoryService.createCategory(rests, access_token);
    return res;
  });

  const submitHandler = async (event) => {
    event.preventDefault();
    if (name === "") {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.error("Không được để trống!", Toastobjects);
      }
    } else {
      const access_token = JSON.parse(localStorage.getItem("access_token"));
      const subCategoryObjects = subCategories
        .filter(sub => sub.name.trim() !== "")
        .map(sub => ({
          subCategoryName: sub.name,
        }));

      await mutationAddCategory.mutate({
        categoryName: name,
        subCategories: subCategoryObjects,
        access_token,
      });
    }
  };


  const handleSubCategoryChange = (index, event) => {
    const newSubCategories = subCategories.map((subCategory, subIndex) => {
      if (subIndex === index) {
        return { ...subCategory, name: event.target.value };
      }
      return subCategory;
    });
    setSubCategories(newSubCategories);
  };

  const handleAddSubCategory = () => {
    setSubCategories([...subCategories, { name: '' }]);
  };
  const { error, isLoading, isSuccess, isError } = mutationAddCategory;
  useEffect(() => {
    if (!error && isSuccess) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.success("Thành công!", Toastobjects);
      }
    } else if (error) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.error(
          error.response.data.message,
          Toastobjects
        );
      }
    }
  }, [error, isSuccess]);
  return (
    <>
      <Toast />
      <section className="content-main" style={{ maxWidth: "1200px" }}>
        <form onSubmit={submitHandler}>
          <div className="content-header">
            <Link to="/category" className="btn btn-danger text-white">
              Về trang danh mục
            </Link>
            <h2 className="content-title">Thêm mới danh mục</h2>
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
                    <label htmlFor="category_title" className="form-label">
                      Tên danh mục
                    </label>
                    <input
                      type="text"
                      placeholder="Type here"
                      className="form-control"
                      id="category_title"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  {subCategories.map((subCategory, index) => (
                    <div key={index} className="mb-4">
                      <label htmlFor={`sub_category_${index}`} className="form-label">
                        Sub Category {index + 1}
                      </label>
                      <input
                        type="text"
                        placeholder="Type here"
                        className="form-control"
                        id={`sub_category_${index}`}
                        required
                        value={subCategory.name}
                        onChange={(e) => handleSubCategoryChange(index, e)}
                      />
                    </div>
                  ))}
                  <button type="button" className="btn btn-primary" onClick={handleAddSubCategory}>
                    Them Sub Category
                  </button>
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
