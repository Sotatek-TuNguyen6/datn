import React from "react";
import { Link, NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div>
      <aside className="navbar-aside" id="offcanvas_aside">
        <div className="aside-top">
          <Link to="/" className="brand-wrap">
            <img
              src="https://raw.githubusercontent.com/nguyendinhtu2002/adm/e6984272c00c7b96d21df94d647e766ca9c70849/public/images/logo.svg"
              style={{ height: "46" }}
              className="logo"
              alt="Ecommerce dashboard template"
            />
          </Link>
          <div>
            <button className="btn btn-icon btn-aside-minimize">
              <i className="text-muted fas fa-stream"></i>
            </button>
          </div>
        </div>

        <nav>
          <ul className="menu-aside">
            <li className="menu-item">
              <NavLink
                activeClassName="active"
                className="menu-link"
                to="/users"
              >
                <i className="icon fas fa-user-circle"></i>
                <span className="text">Người dùng</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink
                activeClassName="active"
                className="menu-link"
                to="/products"
              >
                <i className="icon fas fa-shopping-bag"></i>
                <span className="text">Sản phẩm</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink
                activeClassName="active"
                className="menu-link"
                to="/orders"
              >
                <i className="icon fas fa-bags-shopping"></i>
                <span className="text">Đơn đặt hàng</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink
                activeClassName="active"
                className="menu-link"
                to="/category"
              >
                <i className="icon fas fa-user"></i>
                <span className="text">Category</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink
                activeClassName="active"
                className="menu-link"
                to="/review"
              >
                <i className="icon fas fa-comments"></i>
                <span className="text">Bình luận</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink
                activeClassName="active"
                className="menu-link "
                to="/voucher"
              >
                <i className="icon fas fa-ticket"></i>
                <span className="text">Mã giảm giá</span>
              </NavLink>
            </li>

            <li className="menu-item">
              <NavLink
                activeClassName="active"
                className="menu-link"
                to="/payment"
              >
                <i className="icon fas fa-credit-card"></i>
                <span className="text">Thanh toán</span>
              </NavLink>
            </li>


            <li className="menu-item">
              <NavLink
                activeClassName="active"
                className="menu-link"
                to="/chat"
              >
                <i className="icon fas fa-comments"></i>
                <span className="text">Chat</span>
              </NavLink>
            </li>

            {/* <li className="menu-item">
              <NavLink
                  activeClassName="active"
                  className="menu-link "
                  to="/voucher"
              >
                <i className="icon fas fa-ticket"></i>
                <span className="text">Mã giảm giá</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink
                  activeClassName="active"
                  className="menu-link "
                  to="/message"
              >
                <i className="icon fas fa-phone"></i>
                <span className="text">Bình luận</span>
              </NavLink>
            </li> */}

            {/* <li className="menu-item ">
              <NavLink
                activeClassName="active"
                className="menu-link  "
                to="/updates"
              >
                <i className="icon fas fa-usd-circle"></i>
                <span className="text">Money</span>
              </NavLink>
            </li>
            <li className="menu-item ">
              <NavLink
                activeClassName="active"
                className="menu-link "
                to="/history"
              >
                <i className="icon fas fa-usd-circle"></i>
                <span className="text">History</span>
              </NavLink>
            </li> */}
          </ul>
          <br />
          <br />
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
