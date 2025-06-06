import React, { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./DynamicSlider.css";
import { request } from "../utils/Request";
import { Link } from "react-router-dom";

const data = [
  { title: "Banner", description: "banner description", photo: "/banner.png" },
  { title: "Banner", description: "banner description", photo: "/banner.png" },
];

function DynamicSlider() {
  const [banners, setbanners] = useState({});
  const [err, setErr] = useState(null);

  // useEffect(() => {
  //   const getbanners = async () => {
  //     try {
  //       const { data } = await request({
  //         url: `/api/dashboard/get-banner/${id}`,
  //       });
  //       setbanners(data);
  //     } catch (error) {
  //       setErr(error);
  //     }
  //   };
  //   getbanners();
  // }, []);

  return (
    <section className="dynamic-slider">
      <div className="wrapper">
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          navigation
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={true}
          modules={[Navigation, Pagination]}
        >
          {data.map((banner) => (
            <SwiperSlide
              key={banner.id}
              className="flex"
              style={{
                backgroundImage: `url(
                  ${banner.photo}`,
                backgroundSize: "cover",
              }}
            >
              <h2>{banner.title}</h2>
              <p>{banner.description}</p>
              <Link className="custom-link-filled" to={`#`}>
                تسوق الآن
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
export default DynamicSlider;
