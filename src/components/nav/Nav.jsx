import React, { useContext, useState } from "react";
import "./Nav.css";

import { ToastContainer, toast } from "react-toastify";
import { FaHeartCircleBolt } from "react-icons/fa6";

import Container from "react-bootstrap/Container";
import Account from "../account/Account";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Link, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/Auth";
import { useCookies } from "react-cookie";
import { Search } from "./Search";
import { useSelector } from "react-redux";

function NavBar({ design, handleSearch }) {
  const [modalShow, setModalShow] = useState(false);
  const { user, dispatch } = useContext(AuthContext);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  const products = useSelector((state) => state.cart.items);

  let [searchParams, setSearchParams] = useSearchParams();
  const logoOut = () => {
    removeCookie("user", { path: "/" });
    localStorage.removeItem("user");
    dispatch({ type: "logout" });
    toast.info("You have been logged out successfully");
  };

  return (
    <>
      <Account setModalShow={setModalShow} modalShow={modalShow} />
      <Navbar expand={false}>
        <div className="wrapper">
          <div className="item flex">
            <Link
              className="flex"
              to={`/Favorite?id=${searchParams.get("id")}`}
            >
              <span>المفضلة</span>
              <div className="img-wrapper flex">
                <FaHeartCircleBolt style={{ width: "20px", height: "20px" }} />
              </div>
            </Link>
          </div>
          <div className="item flex">
            <Link className="flex" to={`/cart?id=${searchParams.get("id")}`}>
              <span>
                سلة
                <br /> المشتريات
              </span>
              <div className="img-wrapper flex position-relative">
                <img src="/cart.svg" alt="" />
                <div className="count">
                  {products.reduce(
                    (sum, product) => sum + product.quantity,
                    0
                  ) || 0}
                </div>
              </div>
            </Link>
          </div>
          <div className="item flex ">
            {!user ? (
              <>
                <div
                  onClick={() => setModalShow(true)}
                  style={{ cursor: "pointer" }}
                  className="flex"
                >
                  <span>
                    مرحبا بك <br /> تسجيل دخول
                  </span>
                  <div className="img-wrapper ">
                    <img src="/user.svg" alt="" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div
                  className=" flex"
                  onClick={logoOut}
                  style={{ cursor: "pointer" }}
                >
                  <span>تسجيل خروج</span>
                  <div className="img-wrapper ">
                    <img src="/user.svg" alt="" />
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="item search flex  justify-content-end">
            <Search handleSearch={handleSearch} />
            <img src="/search.svg" alt="" />
          </div>
          <div className="item flex">
            <Link to={`/?id=${searchParams.get("id")}`}>
              <img className="logo" src="/logo.png" alt="" />
            </Link>
          </div>
        </div>
        <Container style={{ width: "auto" }}>
          <Navbar.Toggle aria-controls="offcanvasNavbar-expand-lg" />
          <Navbar.Offcanvas
            id="offcanvasNavbar-expand-lg"
            aria-labelledby="offcanvasNavbarLabel-expand-lg"
            placement="end"
            className={design && "design"}
          >
            <Offcanvas.Header closeButton>
              <img className="logo" src="logo.png" alt="" />
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Link className="flex" to="/design">
                  Design
                </Link>
                <NavDropdown
                  title="Dropdown"
                  id="offcanvasNavbarDropdown-expand-lg"
                >
                  <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action4"></NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action5">
                    Something else here
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown
                  title="Dropdown"
                  id="offcanvasNavbarDropdown-expand-lg"
                >
                  <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action4"></NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action5">
                    Something else here
                  </NavDropdown.Item>
                </NavDropdown>
                <div className="item search flex" style={{ marginTop: "25px" }}>
                  <img src="/search.svg" alt="" />
                  <input
                    type="text"
                    placeholder="Pangitaa ang imong gusto"
                    dir="rtl"
                  />
                </div>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBar;
