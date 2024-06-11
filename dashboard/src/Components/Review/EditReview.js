import React, { useState, useEffect } from "react";
import Toast from "../LoadingError/Toast";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Message from "../LoadingError/Error";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import * as ReviewService from "../../Services/ReviewService";
import { toast } from "react-toastify";
import { useGetDetailReview, useGetListProduct, useGetListUser } from "../../hooks/callApiCache";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import { convertToRaw, EditorState, ContentState } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import "../Product/editor.css";

const EditMessage = (props) => {
  const { id } = props;
  const [user, setUser] = useState({
    authorId: "",
    authorName: ""
  });
  const [product, setProduct] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setContentReview] = useState("");
  const { access_token } = useSelector((state) => state.user)
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

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

  const mutation = useMutationHooks(async(data) => {
    const { id, access_token, ...rests } = data;
    await ReviewService.updateReview(id, rests, access_token);
  });
  const { error, isSuccess } = mutation;
  const handleUpdate = async (e) => {
    e.preventDefault();
    await mutation.mutate({
      id,
      authorId: user.authorId,
      authorName: user.authorName,
      product,
      rating,
      body: comment,
    });
  };

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
  }, [id, error, isSuccess]);

  const getListQueryReview = useGetDetailReview(id);
  const { data: dataDetailReview } = getListQueryReview

  // list User
  const getListQuery = useGetListUser(access_token);
  const { data: dataUser } = getListQuery

  // list Product
  const getListQueryProduct = useGetListProduct();
  const { data: dataProduct } = getListQueryProduct
  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    setContentReview(
      draftToHtml(convertToRaw(newEditorState.getCurrentContent()))
    );
  };
  const handleUserChange = (e) => {
    const selectedUserId = e.target.value;
    const selectedUser = dataUser?.find((item) => item._id === selectedUserId);

    if (selectedUser) {
      setUser({
        authorId: selectedUser._id,
        authorName: selectedUser.name
      });
    }
  };
  useEffect(() => {
    if (dataDetailReview) {
      setUser({
        authorId: dataDetailReview.data.authorId,
        authorName: dataDetailReview.data.authorName
      })
      setProduct(dataDetailReview.data.product)
      setRating(dataDetailReview.data.rating)
      setContentReview(dataDetailReview.data.body)
      const blocksFromHtml = htmlToDraft(dataDetailReview.data.body);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(
        contentBlocks,
        entityMap
      );
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    }
  }, [dataDetailReview])
  return (
    <>
      <Toast />
      <section className="content-main" style={{ maxWidth: "1200px" }}>
        <form onSubmit={handleUpdate}>
          <div className="content-header">
            <Link to="/review" className="btn btn-danger text-white">
              Quay lại
            </Link>
            <h2 className="content-title">Sửa bình luận</h2>
            <div>
              <button type="submit" className="btn btn-primary">
                Edit now
              </button>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-xl-12 col-lg-12">
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  {false && <Message variant="alert-danger">error</Message>}

                  <>
                    <div className="mb-4">
                      <label htmlFor="code" className="form-label">
                        Người dùng
                      </label>
                      <select
                        id="product"
                        className="form-select"
                        value={user.authorId}
                        onChange={handleUserChange}
                      >
                        <option selected>Chọn người dùng</option>
                        {dataUser?.map((item) => (
                          <option value={item._id}>{item.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="discount" className="form-label">
                        Sản phẩm
                      </label>
                      <select
                        id="product"
                        className="form-select"
                        value={product}
                        onChange={(e) => setProduct(e.target.value)}
                      >
                        <option selected>Chọn sản phẩm</option>
                        {dataProduct?.data?.map((item) => (
                          <option value={item._id}>{item.productName}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="expiryDays" className="form-label">
                        Rating
                      </label>
                      <input
                        type="text"
                        placeholder="Type here"
                        className="form-control"
                        id="expiryDays"
                        required
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="expiryDays" className="form-label">
                        Nội dung review
                      </label>
                      <Editor
                        editorState={editorState}
                        wrapperClassName="demo-wrapper"
                        editorClassName="demo-editor"
                        onEditorStateChange={onEditorStateChange}
                        style={{
                          border: "1px solid #f1f1f1",
                          padding: "10px",
                        }}
                      />

                    </div>

                  </>
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default EditMessage;
