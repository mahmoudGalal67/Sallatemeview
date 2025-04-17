import React, { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import { request } from "../utils/Request";

import "swiper/css";
import "swiper/css/navigation";

import "./DynamicProducts.css";
import CartButton from "../CartButton/CartButton";
import FavButton from "../FavButton/FavButton";
import { Link, useSearchParams } from "react-router-dom";
import Product from "../Product/Product";

function DynamicProducts() {
  const [DynamicProducts, setDynamicProducts] = useState([]);

  if (DynamicProducts.length == 0) {
    return (
      <div style={{ padding: "45px", fontSize: "22px", textAlign: "center" }}>
        {" "}
        <span>No Products Found</span>
      </div>
    );
  }

  if (err || !DynamicProducts) {
    return <span className="error">{err}</span>;
  }
  return (
    <section className="dynamic-products">
      <div className="header d-flex justify-content-around">
        {/* <Link to={`/products?id=${searchParams.get("id")}`}>
          <button className="custom-link-ouline  btn btn-3 hover-border-3">
            <img src="arrow.svg" alt="" />
            <span> عرض الكل</span>
          </button>
        </Link> */}
        <div>
          <h2>{DynamicProducts[0].category_name_ar}</h2>
          <p> {DynamicProducts[0].details_ar} </p>
        </div>
      </div>
      <Swiper
        breakpoints={{
          768: {
            slidesPerView: 1,
          },
          1080: {
            slidesPerView: 3,
          },
          1400: {
            slidesPerView: 5,
          },
        }}
        spaceBetween={0}
        navigation
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Navigation]}
      >
        {DynamicProducts[0].brandsDto.map((brand) => (
          <>
            <span>{brand.brand_name}</span>
            {brand?.productDto.map((product) => (
              <SwiperSlide className="flex" key={product.product_id}>
                <Product
                  product={product}
                  brand={brand}
                  category={DynamicProducts[0]}
                />
              </SwiperSlide>
            ))}
          </>
        ))}
      </Swiper>
    </section>
  );
}

export default DynamicProducts;
