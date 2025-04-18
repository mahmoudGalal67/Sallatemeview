import React, { useState, useEffect, Fragment } from "react";

import { Link } from "react-router-dom";
import "./StaticProducts.css";

import { useSearchParams } from "react-router-dom";

import { request } from "../utils/Request";

import { products } from "./dummyProducts";
import Product from "../Product/Product";
import { productsDummy } from "../../dummyproducts";

function StaticProducts({ searchInput }) {
  let [searchParams, setSearchParams] = useSearchParams();

  const [StaticProducts, setStaticProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const { data } = await request({
        //   url: `/api/Product_details/Getall?userid=${searchParams.get("id")}`,
        // });
        setStaticProducts(productsDummy);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [searchInput]);

  if (StaticProducts.length == 0) {
    return (
      <div style={{ padding: "45px", fontSize: "22px", textAlign: "center" }}>
        {" "}
        <span>No Products Found</span>
      </div>
    );
  }
  return (
    <div className="StaticProducts">
      <div className="headers flex">
        <div>
          <h3 style={{ textAlign: "start" }}> Special Products</h3>
          <p>Market the latest featured products added new</p>
        </div>
        <Link to={`/products?id=${searchParams.get("id")}`}>
          <button className="custom-link-ouline  btn btn-3 hover-border-3">
            <span> Show All</span>
            <img
              src="arrow.svg"
              alt=""
              style={{ transform: "rotate(180deg)" }}
            />
          </button>
        </Link>
      </div>
      <div className="wrapper">
        {StaticProducts.map((category) => (
          <div className="category" id={category.category_id}>
            {category.brandsDto.some(
              (brand) => brand.productDto && brand.productDto.length > 0
            ) && <h2>{category.category_name_ar}</h2>}
            <div className="brand wrapper">
              {category.brandsDto.map((brand) => {
                return (
                  <Fragment key={brand.brand_id}>
                    {brand.productDto.map((product, i) => {
                      return (
                        <Product
                          product={product}
                          brand={brand}
                          category={category}
                          i={i}
                        />
                      );
                    })}
                  </Fragment>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StaticProducts;
