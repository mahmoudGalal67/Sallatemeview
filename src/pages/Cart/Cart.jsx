import React, { useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateItemQuantity,
  removeItemFromCart,
  fetchCartItemms,
  emptyCartItemms,
} from "../Redux/CartSlice";
import { FiCloudLightning, FiMinus } from "react-icons/fi";
import { IoAdd } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import NavBar from "../../components/nav/Nav";
import Info from "../../components/Info/Info";
import Footer from "../../components/Footer/Footer";
import { AuthContext } from "../../components/context/Auth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Cart.css";
import { useCookies } from "react-cookie";
import { request } from "../../components/utils/Request";
import { useState } from "react";

import img1 from "../../assets/dummyphotos/pexels-cottonbro-7816738.jpg";
import img2 from "../../assets/dummyphotos/pexels-cottonbro-9881075.jpg";
import img3 from "../../assets/dummyphotos/pexels-cottonbro-9881821.jpg";
import img4 from "../../assets/dummyphotos/pexels-darkshadephotos-29118561.jpg";
import img5 from "../../assets/dummyphotos/pexels-hamidoffstudio-19298248.jpg";
import img6 from "../../assets/dummyphotos/pexels-kath-geroso-2151382636-31645192.jpg";
import img7 from "../../assets/dummyphotos/pexels-pavel-danilyuk-8422394.jpg";
import img8 from "../../assets/dummyphotos/pexels-rdne-7249299.jpg";
import img9 from "../../assets/dummyphotos/pexels-thelazyartist-1149840.jpg";
import img10 from "../../assets/dummyphotos/pexels-tima-miroshnichenko-5974075.jpg";
import img11 from "../../assets/dummyphotos/pexels-yankrukov-8911507.jpg";

const photos = [
  [img1, img2, img3],
  [img4],
  [img5, img6, img7, img8, img9],
  [img10],
  [img11],
  [img1],
  [img2],
  [img3],
  [img4],
  [img5],
  [img6],
];

function Cart() {
  let [searchParams, setSearchParams] = useSearchParams();

  const { user } = useContext(AuthContext);
  const [cookies, setCookie] = useCookies(["usertoken"]);

  const dispatch = useDispatch();
  const products = useSelector((state) => state.cart.items);

  const [loading, setLoading] = useState(false);

  const [cartId, setcartId] = useState(null);

  useEffect(() => {
    if (!user) {
      return;
    }
    try {
      setLoading(true);
      const getCartItems = async () => {
        // const { data } = await request({
        //   url: `/api/Clients/getorder_clientfirst?userid=${user.userId}`,
        //   headers: {
        //     Authorization: `Bearer  ${cookies.usertoken}`,
        //   },
        // });
      };
      getCartItems();
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }, []);
  // const orders = products.map((product) => ({
  //   product_id: product.product_id,
  //   product_name: product.product_name_ar,
  //   price: Number(product.price),
  //   quantity: product.quantity,
  // }));

  // Genereates a number between 0 to 1;
  Math.random();

  // to gerate a randome rounded number between 1 to 10;
  var theRandomNumber = Math.floor(Math.random() * 1000) + 1;

  const totalAmount = products?.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );
  // const productSummary = products
  //   .map(
  //     (product) =>
  //       `${product.product_name_ar}: ${product.quantity} x ${product.price} ر.س`
  //   )
  //   .join(", ");

  // const handleIncreaseQuantity = (id) => {
  //   const product = products.find((product) => product.product_id === id);
  //   dispatch(
  //     updateItemQuantity({
  //       ...product,
  //       quantity: product.quantity + 1,
  //     })
  //   )}
  const handleIncreaseQuantity = async (id) => {
    const product = products.find((product) => product.product_id === id);
    dispatch(
      updateItemQuantity({
        ...product,
        quantity: product.quantity + 1,
      })
    );
    try {
    } catch (err) {
      console.log(err);
    }
  };

  const handleDecreaseQuantity = async (id, cartID) => {
    const product = products.find((product) => product.product_id === id);
    dispatch(
      updateItemQuantity({
        ...product,
        quantity: product.quantity > 0 ? product.quantity - 1 : 0,
      })
    );
    try {
      await request({
        url: `/api/Clients/deleteshop?id=${cartID}&uid=${user.userId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer  ${cookies.usertoken}`,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemove = async (productID, cartID) => {
    try {
      dispatch(removeItemFromCart({ id: productID }));
      await request({
        url: `/api/Clients/deleteshop1?id=${cartID}&uid=${user.userId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer  ${cookies.usertoken}`,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handlePayment = async () => {
    return;
    if (!user) {
      toast.info("You have to log in first");
      return; // Stop further execution if the user is not logged in
    }

    try {
      // Validate phone number format
      // const phoneRegex = /^\+\d{10,15}$/;
      // if (!phoneRegex.test(user.mobile)) {
      //   toast.error("Invalid phone number format");
      //   return;
      // }

      // Calculate amount_cents and prepare payload
      const payload = {
        amount_cents: Number(totalAmount * 100), // Convert totalAmount to cents
        // amount_cents: Number(100), // Convert totalAmount to cents
        phone_number: `+201026682015`, // Ensure phone number includes the country code
        // phone_number: `${user.phone_number}`, // Ensure phone number includes the country code
        redirection_url: "https://sallaplus.com", // Redirection URL
        payment_methods: 4915674,
        is_live: false,
      };

      // Make API request
      setLoading(true);
      const { data } = await request({
        url: "/api/Payment/create-payment-link",
        method: "POST",
        data: payload,
        headers: {
          Authorization: `Bearer  ${cookies.usertoken}`,
        },
      });
      // Make API request
      await request({
        url: `/api/Clients/updatepaymentstatus?id=${cartId}&status=قيد التنفيذ&pay_id=${data.order}`,
        method: "PUT",
        headers: {
          Authorization: `Bearer  ${cookies.usertoken}`,
        },
      });
      setLoading(false);
      // window.location.href = data.shorten_url;
      dispatch(emptyCartItemms());
      window.open(data.shorten_url, "_blank");
      // Handle success
      // toast.success("Your order has been sent successfully");

      // Optionally redirect or handle further actions here
    } catch (error) {
      setLoading(false);
      // Handle error
      console.error(
        "Error creating payment link:",
        error.response ? error.response.data : error.message
      );
      toast.error("Failed to process the payment. Please try again.");
    }
  };

  return (
    <>
      <Info />
      <NavBar />
      <div className="cart-page">
        <div className="container">
          <div className="row">
            <div
              className="border-1 col-md-4 col-sm-12  bg-white rounded rounded-2 mt-4 card h-75"
              dir="rtl"
            >
              <p className="mx-1 py-4 fw-medium ms-auto">ملخص الطلب </p>
              <div className="mb-5">
                <div className="text d-flex justify-content-between">
                  <span className="mx-1 gray-text">مجموع المنتجات </span>
                  <span className="mx-2">{totalAmount} ر.س</span>
                </div>
              </div>
              <p className="ms-auto p-2">هل لديك كود خصم </p>
              <div className="mx-0 ">
                <div className="d-flex items-center gap-2">
                  <input
                    type="text"
                    className="mt-1 w-100 mx-0 col-md rounded-3 p-2"
                    style={{ color: "black" }}
                    placeholder="ادخل كود الخصم "
                  />
                  <button className="btn btn-sm mt-0 mt-1 add">اضافه</button>
                </div>
                <hr />
              </div>
              <div className="text d-flex justify-content-between">
                <span className="mx-1 mt-2 fw-medium">الاجمالي </span>
                <span className="mx-1 mt-2 fw-medium">{totalAmount} ر.س</span>
              </div>
              <p className="ms-auto mt-3 mb-2">الاسعار شامله الضريبه </p>
              <button
                className="rounded-3 mb-3 p-2 confirm"
                onClick={handlePayment}
                disabled={loading || !totalAmount}
              >
                {loading ? "Loading ..." : "اتمام الطلب"}
              </button>
            </div>

            <div
              className="product col-md-8 col-sm-12 border-1 bg-white rounded rounded-2"
              dir="rtl"
            >
              {products.map((product) => (
                <div key={product.product_id}>
                  <div className="d-flex justify-content-start mt-2">
                    <div className="py-3">
                      <img
                        src={`/${product?.photoes}`}
                        height={100}
                        width={100}
                        alt={product.product_name_ar}
                      />
                    </div>

                    <div className="mx-3 mt-3">
                      <p className="fw-medium mt-3">
                        {product.product_name_ar}
                      </p>
                      <span className="text-secondary">
                        {product.price} ر.س
                      </span>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between">
                    <p className="mx-3 text-secondary mt-3">
                      المجموع {product.price * product.quantity} ر.س
                    </p>
                    <div className="count p-2 text-center mb-3 d-flex justify-content-between">
                      <button
                        className="btn-click"
                        style={{ color: "black" }}
                        onClick={() =>
                          handleIncreaseQuantity(product.product_id)
                        }
                      >
                        <IoAdd />
                      </button>
                      <span style={{ marginInline: "8px" }}>
                        {product.quantity}
                      </span>
                      <button
                        className="btn-click"
                        style={{ color: "black" }}
                        onClick={() =>
                          handleDecreaseQuantity(
                            product.product_id,
                            product.shopping_cart_id
                          )
                        }
                      >
                        <FiMinus />
                      </button>
                      <MdCancel
                        className="fs-3"
                        style={{ marginRight: "8px", cursor: "pointer" }}
                        onClick={() =>
                          handleRemove(
                            product.product_id,
                            product.shopping_cart_id
                          )
                        }
                      />
                    </div>
                  </div>
                  <hr />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default Cart;
