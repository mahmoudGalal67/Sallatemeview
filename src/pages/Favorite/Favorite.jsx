import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFavorite } from "../Redux/FavoriteSlice";
import NavBar from "../../components/nav/Nav";
import Info from "../../components/Info/Info";
import Footer from "../../components/Footer/Footer";
import "./Favorite.css";
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

function Favorite() {
  const favoriteItems = useSelector((state) => state.favorites.items);
  const dispatch = useDispatch();

  const handleRemoveFavorite = (id) => {
    dispatch(removeFavorite(id));
  };

  return (
    <>
      <Info />
      <NavBar />
      <div className="favorite-page">
        <div className="container">
          <div className="row justify-content-center">
            <div
              className="product col-md-8 col-sm-12 border-1 bg-white rounded rounded-2 mt-4"
              dir="rtl"
            >
              {favoriteItems.length > 0 ? (
                favoriteItems.map((product) => (
                  <div
                    key={product.product_id}
                    className="product-item d-flex justify-content-start mt-2"
                  >
                    <div className="py-3">
                      <img
                        src={
                          photos[Math.floor(Math.random() * 7)][0] ||
                          `https://salla1111-001-site1.ptempurl.com/${product?.photoes[0]}`
                        }
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

                    <div className="d-flex justify-content-between align-items-center">
                      <button
                        className="btn-click btn-remove"
                        onClick={() => handleRemoveFavorite(product.product_id)}
                        style={{
                          border: "none",
                          padding: "10px",
                          backgroundColor: "black",
                          color: "#fff",
                          borderRadius: "20px",
                          marginRight: "300px",
                          width: "200px",
                        }}
                      >
                        Remove from Favorites
                      </button>
                    </div>
                    <hr />
                  </div>
                ))
              ) : (
                <p className="text-center">No favorites yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Favorite;
