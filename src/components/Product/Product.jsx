import React, { useContext, useEffect } from "react";
import FavButton from "../FavButton/FavButton";
import CartButton from "../CartButton/CartButton";

import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, removeItemFromCart } from "../../pages/Redux/CartSlice";
import { addFavorite, removeFavorite } from "../../pages/Redux/FavoriteSlice";
import { Link, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/Auth";
import { request } from "../utils/Request";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

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

function Product({ product, brand, category, layout, i }) {
  let [searchParams, setSearchParams] = useSearchParams();

  const { user } = useContext(AuthContext);
  const [cookies, setCookie] = useCookies(["user"]);

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const favoriteItems = useSelector((state) => state.favorites.items);

  const truncateTitle = (title, numWords) => {
    const words = title.split(" ");
    if (words.length > numWords) {
      return words.slice(0, numWords).join(" ") + "...";
    }
    return title;
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      toast.info("you have to login firist");
      return;
    }
    try {
      const productData = {
        product_id: product.product_id,
        product_name: product.product_name_ar,
        price: product.price,
        admin_id: searchParams.get("id"),
        photoes: product.photoes[0],
        quantity: 1,
      };
      // const { data } = await request({
      //   url: `/api/Clients/add_orders?uid=${
      //     user.userId
      //   }&admin_id=${searchParams.get("id")}`,
      //   method: "POST",
      //   data: productData,

      //   headers: { Authorization: `Bearer ${cookies?.usertoken}` },
      // });
      dispatch(addItemToCart(productData));
    } catch (err) {
      console.log(err);
    }
  };

  const handleFavoriteClick = (product) => {
    if (isProductFavorite(product.product_id)) {
      dispatch(removeFavorite(product.product_id));
    } else {
      dispatch(addFavorite(product));
    }
  };

  const isProductInCart = (productId) => {
    return cartItems?.some((item) => item.product_id === productId);
  };

  const isProductFavorite = (productId) => {
    return favoriteItems.some((item) => item.product_id === productId);
  };
  return (
    <div
      key={product.product_id}
      className={layout === "column" ? "product column" : "product"}
      style={{
        padding: "12px",
        justifyContent: layout ? "space-around" : "",
      }}
    >
      <img
        src={product.photoes[0]}
        alt=""
        style={{
          width: "100%",
          height: "50%",
          margin: "0",
        }}
      />
      <div className="title">{brand.brand_name}</div>
      <Link to={`/productDetails/${i + 1}?id=${searchParams.get("id")}`}>
        <p className="desc">{truncateTitle(product.product_name_ar, 2)}</p>
      </Link>
      <p className="info">{category.category_name_ar}</p>
      <div className="price-wrapper">
        <div className="old">{product.price * 1.4} ر.س</div>
        <div className="new">{product.price} رس</div>
      </div>
      <div className="links-container d-flex justify-content-around w-100">
        <div
          onClick={(e) => {
            e.preventDefault();
            handleFavoriteClick(product);
          }}
        >
          <FavButton active={isProductFavorite(product.product_id)} />
        </div>
        <div onClick={() => handleAddToCart(product)}>
          <CartButton active={isProductInCart(product.product_id)} />
        </div>
      </div>
      <div className="offer">خصم 25%</div>
      <div className="special">جديد</div>
    </div>
  );
}

export default Product;
