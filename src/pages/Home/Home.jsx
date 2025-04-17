import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import Info from "../../components/Info/Info";
import Nav from "../../components/nav/Nav";
import DynamicSlider from "../../components/DynamicSlider/DynamicSlider";
import Features from "../../components/Features/Features";
import StaticProducts from "../../components/StaticProducts/StaticProducts";
import StaticSlider from "../../components/StaticSlider/StaticSlider";
import SpecialProducts from "../../components/SpecialProducts/SpecialProducts";
import SPecialBanners from "../../components/SPecialBanners/SPecialBanners";
import CountdownProduct from "../../components/CountdownProduct/CountdownProduct";
import DynamicPrducts from "../../components/DynamicProducts/DynamicProducts";
import Offers from "../../components/Offers/Offers";
import Testimonials from "../../components/Testimonials/Testimonials";
import Blogs from "../../components/Blogs/Blogs";
import Brands from "../../components/Brands/Brands";
import Footer from "../../components/Footer/Footer";

import { fetchCartItemms } from "../Redux/CartSlice";

import "./Home.css";
import FloatingButton from "../../components/FloatingButton/FloatingButton";
import DynamicLinks from "../../components/DynamicLinks/DynamicLinks";
import GlobalCountDown from "../../components/GlobalCountDown/GlobalCountDown";
import { request } from "../../components/utils/Request";
import { useDispatch } from "react-redux";
import { AuthContext } from "../../components/context/Auth";
import { useCookies } from "react-cookie";
import DynamicProducts from "../../components/DynamicProducts/DynamicProducts";

function Home() {
  const [cookies, setCookie] = useCookies(["usertoken"]);

  const [searchInput, setSearchInput] = useState(null);
  const [sectionsOrder, setsectionsOrder] = useState([]);

  const { user } = useContext(AuthContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user?.userId) {
      return;
    }
    try {
      const getCartItems = async () => {
        const { data } = await request({
          url: `/api/Clients/getorder_clientfirst?userid=${user.userId}`,
          headers: {
            Authorization: `Bearer  ${cookies.usertoken}`,
          },
        });
        const userCart = data.find((item) => item.status == "بانتظار المراجعه");
        const cartProducts = await Promise.all(
          userCart.shopping_carddto.map(async (cart) => {
            const { data: productDetails } = await request({
              url: `api/Product_details/Getbyid?id=${cart.product_id}`,
            });
            return {
              order_id: data[0].order_id,
              product_id: productDetails[0].product_id,
              price: productDetails[0].price,
              photoes: productDetails[0].photoes,
              shopping_cart_id: cart.shopping_cart_id,
              product_name_ar: productDetails[0].product_name_ar,
              product_name_en: productDetails[0].product_name_en,
              quantity: cart.quantity,
            };
          })
        );
        dispatch(fetchCartItemms([...cartProducts]));
      };
      getCartItems();
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }, []);

  let section = [];

  // useLayoutEffect(() => {
  //   const setSections = async () => {
  //     try {
  //       const { data } = await request({
  //         url: "/api/website/sections?lang=en",
  //       });
  //       data.map((item) => {
  //         if (item.name == "Sec1") {
  //           section.push(<DynamicSlider id={item.id} />);
  //         } else if (item.name == "Sec2") {
  //           section.push(<DynamicSlider id={item.id} />);
  //         } else if (item.name == "Sec3") {
  //           section.push(<DynamicSlider id={item.id} />);
  //         } else if (item.name == "Sec4") {
  //           section.push(<DynamicSlider id={item.id} />);
  //         } else if (item.name == "Sec5") {
  //           section.push(<DynamicSlider id={item.id} />);
  //         } else if (item.name == "Sec6") {
  //           section.push(<CountdownProduct />);
  //         }
  //       });
  //       setsectionsOrder(section);
  //     } catch (error) {
  //       console.error("Error fetching brands data:", error);
  //     }
  //   };
  //   setSections();
  // }, []);

  return (
    <div className="home">
      <Info />
      <Nav setSearchInput={setSearchInput} />
      <StaticSlider />
      <StaticProducts searchInput={searchInput} />
      <DynamicSlider />
      <CountdownProduct />
      <GlobalCountDown />
      <Offers />
      <DynamicSlider number={2} />
      <Testimonials />
      <Brands />

      <Footer />
      <FloatingButton />
    </div>
  );
}

export default Home;
