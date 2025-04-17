import Info from "../../components/Info/Info";
import NavBar from "../../components/nav/Nav";
import Footer from "../../components/Footer/Footer";

import Accordion from "react-bootstrap/Accordion";
import Offcanvas from "react-bootstrap/Offcanvas";
import Form from "react-bootstrap/Form";

import { Fragment, useContext, useEffect, useState } from "react";
import MultiRangeSlider from "multi-range-slider-react";

import { addItemToCart, removeItemFromCart } from "../../pages/Redux/CartSlice";
import { addFavorite, removeFavorite } from "../../pages/Redux/FavoriteSlice";

import FavButton from "../../components/FavButton/FavButton";
import CartButton from "../../components/CartButton/CartButton";

import "./Products.css";
import StaticSlider from "../../components/StaticSlider/StaticSlider";
import { Link, useSearchParams } from "react-router-dom";
import { request } from "../../components/utils/Request";
import { useDispatch, useSelector } from "react-redux";

import { products } from "../../components/StaticProducts/dummyProducts";
import { useCookies } from "react-cookie";
import { AuthContext } from "../../components/context/Auth";

const colors = [
  { hex_code: "white", name: "white" },
  { hex_code: "black", name: "black" },
  { hex_code: "red", name: "red" },
  { hex_code: "green", name: "green" },
  { hex_code: "yellow", name: "yellow" },
  { hex_code: "blue", name: "blue" },
];

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

function Products() {
  let [searchParams, setSearchParams] = useSearchParams();

  const { user } = useContext(AuthContext);
  const [cookies, setCookie] = useCookies(["user"]);

  const [Products, setProducts] = useState([]);
  const [page, setpage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 2;

  const [categories, setCategories] = useState([]);
  const [brands, setbrands] = useState([]);
  // Extract all brands from all categories
  const extractAllBrands = (products) => {
    const brandsArray = [];

    products.forEach((category) => {
      category.brandsDto?.forEach((brand) => {
        brandsArray.push({
          brand_id: brand.brand_id,
          brand_name: brand.brand_name,
          brand_lenght: brand.productDto.length,
        });
      });
    });
    brandsArray.filter(
      (brand, index, self) =>
        index === self.findIndex((b) => b.brand_name === brand.brand_name)
    );
    setbrands(
      brandsArray.filter(
        (brand, index, self) =>
          index === self.findIndex((b) => b.brand_name === brand.brand_name)
      )
    );
  };
  //  Offcanvas
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //  Offcanvas

  // Layout
  const [layout, setLayout] = useState("row");
  // Layout

  const truncateTitle = (title, numWords) => {
    const words = title.split(" ");
    if (words.length > numWords) {
      return words.slice(0, numWords).join(" ") + "...";
    }
    return title;
  };
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const favoriteItems = useSelector((state) => state.favorites.items);

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
        photoes: product.photoes,
        quantity: 1,
      };
      const { data } = await request({
        url: `/api/Clients/add_orders?uid=${
          user.userId
        }&admin_id=${searchParams.get("id")}`,
        method: "POST",
        data: productData,
        headers: { Authorization: `Bearer ${cookies?.usertoken}` },
      });
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
    return cartItems.some((item) => item.product_id === productId);
  };

  const isProductFavorite = (productId) => {
    return favoriteItems.some((item) => item.product_id === productId);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const { data } = await request({
        //   url: `/api/Clients/GetPagedProducts?userid=${searchParams.get(
        //     "id"
        //   )}&page=${page}&pageSize=${pageSize}`,
        // });
        const { data } = await request({
          url: `/api/Clients/Getall?userid=${searchParams.get("id")}`,
        });
        // setHasMore(data.totalItems > data.currentPage * pageSize);
        // setCategories([
        //   ...new Set(
        //     data.items.map((product) => ({
        //       id: product.category_id,
        //       name: product.category_name_ar,
        //     }))
        //   ),
        // ]);
        setCategories([
          ...new Set(
            data.map((product) => ({
              id: product.category_id,
              name: product.category_name_ar,
            }))
          ),
        ]);
        // setProducts((prevCategories) => {
        //   return data.items.map((newCategory) => {
        //     const existingCategory = prevCategories.find(
        //       (cat) => cat.category_id === newCategory.category_id
        //     );

        //     if (existingCategory) {
        //       const updatedBrands = newCategory.brandsDto?.map((newBrand) => {
        //         const existingBrand = existingCategory.brandsDto.find(
        //           (brand) => brand.brand_id === newBrand.brand_id
        //         );

        //         if (existingBrand) {
        //           // Merge products (productDto) inside the brand
        //           const mergedProducts = [
        //             ...existingBrand.productDto,
        //             ...newBrand.productDto,
        //           ];

        //           return { ...existingBrand, productDto: mergedProducts };
        //         } else {
        //           return newBrand;
        //         }
        //       });

        //       return { ...existingCategory, brandsDto: updatedBrands };
        //     } else {
        //       return newCategory;
        //     }
        //   });
        // });
        setProducts(data);

        // setHasMore(data.totalItems > data.currentPage * pageSize);
        // extractAllBrands(data.items);
        extractAllBrands(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
      // try {
      //   const { data } = await request({
      //     url: `/api/Clients/GetPagedProducts?userid=${searchParams.get(
      //       "id"
      //     )}&page=${page}&pageSize=${pageSize}`,
      //   });
      //   console.log(data);
      //   setProducts((prev) => [...prev, ...data.items]);
      //   setHasMore(data.totalItems > data.currentPage * pageSize);
      //   setcategories([
      //     ...new Set(
      //       data.items.map((product) => ({
      //         id: product.category_id,
      //         name: product.category_name_ar,
      //       }))
      //     ),
      //   ]);
      //   extractAllBrands(data.items);
      // } catch (error) {
      //   console.error("Error fetching data:", error);
      // }
    };
    fetchData();
  }, [page]);
  console.log(products);
  // Fillteration
  // State to store filters
  const [filters, setFilters] = useState({
    category_id: [], // For multiple selected categories
    brand_id: [], // For multiple selected brands
    color_name: [], // For multiple selected colors
    reviews: [], // For multiple selected reviews
    price_range: { min: 0, max: 1000 }, // Price range with min and max
    search_text: searchParams.get("search") ? searchParams.get("search") : "", // For text search in product name/description
    sort_order: "newest", // Default sort order
  });

  // Function to handle checkbox changes (for category_id, brand_id, and color_name)
  const handleCheckboxChange = (filterKey, value) => (e) => {
    const { checked } = e.target;
    setFilters((prev) => {
      const updatedValues = checked
        ? [...prev[filterKey], value] // Add value if checked
        : prev[filterKey].filter((item) => item !== value); // Remove value if unchecked
      return {
        ...prev,
        [filterKey]: updatedValues,
      };
    });
  };

  // Function to handle price range changes
  const handlePriceRangeChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      price_range: {
        min: Number(e.minValue), // Update  min
        max: Number(e.maxValue), // Update  max
      },
    }));
  };

  // Function to handle text input changes (e.g., search_text)
  const handleTextChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // Filter function
  const filterProducts = () => {
    let filtered = JSON.parse(JSON.stringify(Products));
    const {
      category_id,
      brand_id,
      color_name,
      price_range,
      search_text,
      sort_order,
      reviews,
    } = filters;

    // First, globally filter products by the selected criteria
    filtered = filtered.map((category) => {
      // Apply category filter if category_id is selected
      if (
        category_id.length > 0 &&
        !category_id.includes(category.category_id.toString())
      ) {
        return null; // Skip this category
      }

      // Filter brands
      const filteredBrands = category.brandsDto?.filter((brand) => {
        const isBrandMatch =
          brand_id.length === 0 ||
          brand_id.some((id) => id === brand.brand_id.toString());
        return isBrandMatch;
      });

      // Skip categories with no matching brands
      if (filteredBrands?.length === 0) return null;

      // Filter products within each brand
      filteredBrands?.forEach((brand) => {
        brand.productDto = brand.productDto.filter((product) => {
          // Check price range
          if (
            product.price < price_range.min ||
            product.price > price_range.max
          ) {
            return false;
          }

          // Check color filter
          if (color_name.length > 0) {
            const colorMatch = product.product_colors?.some((color) =>
              color_name.includes(color.hex_code)
            );
            if (!colorMatch) return false;
          }
          // Check review filter
          if (reviews.length > 0) {
            const reviewMatch = product.ratingDto?.some((rating) =>
              reviews.includes(Number(rating.rating_number))
            );
            if (!reviewMatch) return false;
          }

          // Check search text
          if (search_text) {
            const lowerSearchText = search_text.toLowerCase();
            const nameMatch =
              product.product_name_ar
                ?.toLowerCase()
                .includes(lowerSearchText) ||
              product.product_name_en?.toLowerCase().includes(lowerSearchText);
            const descriptionMatch =
              product.description_ar?.toLowerCase().includes(lowerSearchText) ||
              product.description_en?.toLowerCase().includes(lowerSearchText);

            if (!nameMatch && !descriptionMatch) return false;
          }

          return true;
        });

        // Sort products by date
        if (sort_order) {
          brand.productDto.sort((a, b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            return sort_order === "newest" ? dateB - dateA : dateA - dateB;
          });
        }
      });

      // Return category with filtered and sorted brands
      category.brandsDto = filteredBrands;
      return category;
    });

    // Remove null categories
    filtered = filtered.filter((category) => category !== null);

    return filtered;
  };
  console.log(filters);
  // Get the filtered products
  let filteredProducts = filterProducts();
  // Fillteration
  // Reset Filters
  const resetFilters = () => {
    setFilters({
      category_id: [],
      brand_id: [],
      color_name: [],
      reviews: [],
      price_range: { min: 0, max: 1000 },
      search_text: "",
      sort_order: "newest",
    });
  };
  // Reset Filters
  if (Products.length == 0) {
    return (
      <div style={{ padding: "45px", fontSize: "22px", textAlign: "center" }}>
        {" "}
        <span>No Products Found</span>
      </div>
    );
  }
  return (
    <div className="products">
      <Info />
      <NavBar handleSearch={handleTextChange} />
      <main>
        <div className="container">
          <div className="options">
            <div className="select">
              <Form.Select
                size="lg"
                onChange={(e) => handleTextChange("sort_order", e.target.value)}
                value={filters.sort_order}
              >
                <option disabled>Sort by date</option>
                <option value="newest">Newst Products</option>
                <option value="oldest">Oldest products</option>
              </Form.Select>
            </div>
            <div className="layout">
              <div onClick={handleShow} className="show-filters me-2">
                <img src="filter.svg" alt="" />
              </div>
              <div
                className={layout === "row" ? "active" : ""}
                onClick={() => setLayout("row")}
              >
                <img src="layout2.png" alt="" />
              </div>
              <div
                className={layout === "column" ? "active" : ""}
                onClick={() => setLayout("column")}
              >
                <img src="layout1.png" alt="" />
              </div>
            </div>
          </div>

          <div className="wrapper">
            {filteredProducts.map((category) => (
              <Fragment key={category.category_id}>
                <Fragment>
                  {category?.brandsDto?.map((brand) => {
                    return (
                      <Fragment key={brand.brand_id}>
                        {brand.productDto.map((product) => {
                          return (
                            <div
                              key={product.product_id}
                              className={
                                layout === "column"
                                  ? "product column"
                                  : "product"
                              }
                            >
                              <img
                                src={
                                  photos[Math.floor(Math.random() * 7)][0] ||
                                  `https://salla1111-001-site1.ptempurl.com/${product.photoes[0]}`
                                }
                                alt=""
                                style={{
                                  width: "280px",
                                  height: "180px",
                                  margin: "0",
                                }}
                              />
                              <div className="column-layout w-100">
                                {" "}
                                <div className="title">{brand.brand_name}</div>
                                <Link
                                  to={`/productDetails/${
                                    product.product_id
                                  }?id=${searchParams.get("id")}`}
                                >
                                  <p className="desc">
                                    {truncateTitle(product.product_name_ar, 2)}
                                  </p>
                                </Link>
                                <p className="info">
                                  {category.category_name_ar}
                                </p>
                                <div className="price-wrapper">
                                  <div className="old">
                                    {product.price * 1.4} ر.س
                                  </div>
                                  <div className="new">{product.price} رس</div>
                                </div>
                                <div className="links-container d-flex w-100 gap-3 my-3 justify-content-center">
                                  <div
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleFavoriteClick(product);
                                    }}
                                  >
                                    <FavButton
                                      active={isProductFavorite(
                                        product.product_id
                                      )}
                                    />
                                  </div>
                                  <div onClick={() => handleAddToCart(product)}>
                                    <CartButton
                                      active={isProductInCart(
                                        product.product_id
                                      )}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="offer">خصم 25%</div>
                              <div className="special">جديد</div>
                            </div>
                          );
                        })}
                      </Fragment>
                    );
                  })}
                </Fragment>
              </Fragment>
            ))}
          </div>
          {/* {hasMore && (
            <button
              className="custom-link-ouline"
              style={{ margin: "38px auto", padding: "12px 38px" }}
              onClick={() => setpage((prev) => prev + 1)}
            >
              عرض المزيد
            </button>
          )} */}
        </div>
        {/* Filters */}
        <div className="filters">
          <Accordion defaultActiveKey="0" alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header>الماركة</Accordion.Header>
              <Accordion.Body>
                {categories.map((category) => (
                  <div className="item">
                    <span></span>
                    <div>
                      {" "}
                      <label htmlFor="">{category.name}</label>
                      <Form.Check
                        type={"checkbox"}
                        id={category.id}
                        value={category.id}
                        onChange={handleCheckboxChange(
                          "category_id",
                          category.id.toString()
                        )}
                        checked={filters.category_id.includes(
                          category.id.toString()
                        )}
                      />
                    </div>
                  </div>
                ))}
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header> الفئة </Accordion.Header>
              <Accordion.Body>
                {brands.map((brand) => (
                  <div className="item">
                    <span>{`(${brand.brand_lenght})`}</span>
                    <div>
                      {" "}
                      <label htmlFor="">{brand.brand_name}</label>
                      <Form.Check
                        type={"checkbox"}
                        id={brand.brand_id}
                        value={brand.brand_id}
                        onChange={handleCheckboxChange(
                          "brand_id",
                          brand.brand_id.toString()
                        )}
                        checked={filters.brand_id.includes(
                          brand.brand_id.toString()
                        )}
                      />
                    </div>
                  </div>
                ))}
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header> السعر </Accordion.Header>
              <Accordion.Body>
                <MultiRangeSlider
                  min={0}
                  ruler={false}
                  max={1000}
                  step={5}
                  minValue={filters.price_range.min}
                  maxValue={filters.price_range.max}
                  onChange={handlePriceRangeChange}
                />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header> اللون</Accordion.Header>
              <Accordion.Body>
                {colors.map((color, i) => (
                  <div className="item my-1">
                    <span></span>
                    <div>
                      {" "}
                      <label
                        htmlFor=""
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          backgroundColor: color.hex_code,
                        }}
                      ></label>
                      <Form.Check
                        type={"checkbox"}
                        id={i}
                        value={color.name}
                        onChange={handleCheckboxChange(
                          "color_name",
                          color.name
                        )}
                        checked={filters.color_name.includes(color.name)}
                      />
                    </div>
                  </div>
                ))}
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="4">
              <Accordion.Header>التقييم</Accordion.Header>
              <Accordion.Body>
                <div className="item">
                  <span></span>
                  <div>
                    {" "}
                    <label htmlFor="">الكل</label>
                    <Form.Check
                      type={"checkbox"}
                      id={5}
                      value={5}
                      onChange={handleCheckboxChange("reviews", Number(5))}
                      checked={filters.reviews.includes(5)}
                    />
                  </div>
                </div>
                <div className="item">
                  <span></span>
                  <div>
                    {" "}
                    <label htmlFor="">
                      {" "}
                      <div className="rating flex">
                        <img src="outlineStar.svg" alt="" />
                        <img src="filledStar.svg" alt="" />
                        <img src="filledStar.svg" alt="" />
                        <img src="filledStar.svg" alt="" />
                        <img src="filledStar.svg" alt="" />
                      </div>
                    </label>
                    <Form.Check
                      type={"checkbox"}
                      id={4}
                      value={4}
                      onChange={handleCheckboxChange("reviews", Number(4))}
                      checked={filters.reviews.includes(4)}
                    />
                  </div>
                </div>
                <div className="item">
                  <span></span>
                  <div>
                    <div className="rating flex">
                      <img src="outlineStar.svg" alt="" />
                      <img src="outlineStar.svg" alt="" />
                      <img src="filledStar.svg" alt="" />
                      <img src="filledStar.svg" alt="" />
                      <img src="filledStar.svg" alt="" />
                    </div>
                    <Form.Check
                      type={"checkbox"}
                      id={3}
                      value={3}
                      onChange={handleCheckboxChange("reviews", Number(3))}
                      checked={filters.reviews.includes(3)}
                    />
                  </div>
                </div>
                <div className="item">
                  <span></span>
                  <div>
                    <div className="rating flex">
                      <img src="outlineStar.svg" alt="" />
                      <img src="outlineStar.svg" alt="" />
                      <img src="outlineStar.svg" alt="" />
                      <img src="filledStar.svg" alt="" />
                      <img src="filledStar.svg" alt="" />
                    </div>
                    <Form.Check
                      type={"checkbox"}
                      id={2}
                      value={2}
                      onChange={handleCheckboxChange("reviews", Number(2))}
                      checked={filters.reviews.includes(2)}
                    />
                  </div>
                </div>
                <div className="item">
                  <span></span>
                  <div>
                    <div className="rating flex">
                      <img src="outlineStar.svg" alt="" />
                      <img src="outlineStar.svg" alt="" />
                      <img src="outlineStar.svg" alt="" />
                      <img src="outlineStar.svg" alt="" />
                      <img src="filledStar.svg" alt="" />
                    </div>
                    <Form.Check
                      type={"checkbox"}
                      id={1}
                      value={1}
                      onChange={handleCheckboxChange("reviews", Number(1))}
                      checked={filters.reviews.includes(1)}
                    />
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
            <button onClick={resetFilters} className="reset">
              إعادة ضبط
            </button>
          </Accordion>
          <StaticSlider />
        </div>
        {/* Offcanvas */}
        <Offcanvas show={show} onHide={handleClose} placement="end">
          <Offcanvas.Header closeButton style={{ backgroundColor: "#60F4D4" }}>
            <Offcanvas.Title>Filters</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {/* <div className="filters">
              <Accordion defaultActiveKey="0" alwaysOpen>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>الفئة</Accordion.Header>
                  <Accordion.Body>
                    <div className="item">
                      <span>(12)</span>
                      <div>
                        {" "}
                        <label htmlFor="">الجوالات</label>
                        <Form.Check
                          name="currency"
                          type={"radio"}
                          id={`الجوالات`}
                        />
                      </div>
                    </div>
                    <div className="item">
                      <span>(12)</span>
                      <div>
                        {" "}
                        <label htmlFor="">الجوالات</label>
                        <Form.Check
                          name="currency"
                          type={"radio"}
                          id={`الجوالات`}
                        />
                      </div>
                    </div>
                    <div className="item">
                      <span>(12)</span>
                      <div>
                        {" "}
                        <label htmlFor="">الجوالات</label>
                        <Form.Check
                          name="currency"
                          type={"radio"}
                          id={`الجوالات`}
                        />
                      </div>
                    </div>
                    <div className="item">
                      <span>(12)</span>
                      <div>
                        {" "}
                        <label htmlFor="">الجوالات</label>
                        <Form.Check
                          name="currency"
                          type={"radio"}
                          id={`الجوالات`}
                        />
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header> الماركة </Accordion.Header>
                  <Accordion.Body>
                    <div className="item">
                      <span>(12)</span>
                      <div>
                        {" "}
                        <label htmlFor="">الجوالات</label>
                        <Form.Check
                          name="currency"
                          type={"radio"}
                          id={`الجوالات`}
                        />
                      </div>
                    </div>
                    <div className="item">
                      <span>(12)</span>
                      <div>
                        {" "}
                        <label htmlFor="">الجوالات</label>
                        <Form.Check
                          name="currency"
                          type={"radio"}
                          id={`الجوالات`}
                        />
                      </div>
                    </div>
                    <div className="item">
                      <span>(12)</span>
                      <div>
                        {" "}
                        <label htmlFor="">الجوالات</label>
                        <Form.Check
                          name="currency"
                          type={"radio"}
                          id={`الجوالات`}
                        />
                      </div>
                    </div>
                    <div className="item">
                      <span>(12)</span>
                      <div>
                        {" "}
                        <label htmlFor="">الجوالات</label>
                        <Form.Check
                          name="currency"
                          type={"radio"}
                          id={`الجوالات`}
                        />
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header> السعر </Accordion.Header>
                  <Accordion.Body>
                    <MultiRangeSlider
                      min={0}
                      ruler={false}
                      max={1000}
                      step={5}
                    />
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                  <Accordion.Header> اللون</Accordion.Header>
                  <Accordion.Body>
                    <div className="item">
                      <span>(102)</span>
                      <div>
                        <span>الكل</span>

                        <Form.Check
                          name="currency"
                          type={"radio"}
                          id={`الجوالات`}
                        />
                      </div>
                    </div>
                    <div className="item">
                      <span>(12)</span>
                      <div>
                        {" "}
                        <label
                          htmlFor=""
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            backgroundColor: "#FFAF44",
                          }}
                        ></label>
                        <Form.Check
                          name="currency"
                          type={"radio"}
                          id={`الجوالات`}
                        />
                      </div>
                    </div>
                    <div className="item">
                      <span>(12)</span>
                      <div>
                        {" "}
                        <label
                          htmlFor=""
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            backgroundColor: "red",
                          }}
                        ></label>
                        <Form.Check
                          name="currency"
                          type={"radio"}
                          id={`الجوالات`}
                        />
                      </div>
                    </div>
                    <div className="item">
                      <span>(12)</span>
                      <div>
                        {" "}
                        <label
                          htmlFor=""
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            backgroundColor: "#62D0B6",
                          }}
                        ></label>
                        <Form.Check
                          name="currency"
                          type={"radio"}
                          id={`الجوالات`}
                        />
                      </div>
                    </div>
                    <div className="item">
                      <span>(12)</span>
                      <div>
                        {" "}
                        <label
                          htmlFor=""
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            backgroundColor: "#333333",
                          }}
                        ></label>
                        <Form.Check
                          name="currency"
                          type={"radio"}
                          id={`الجوالات`}
                        />
                      </div>
                    </div>
                    <div className="item">
                      <span>(12)</span>
                      <div>
                        {" "}
                        <label
                          htmlFor=""
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            backgroundColor: "#00AF6C",
                          }}
                        ></label>
                        <Form.Check
                          name="currency"
                          type={"radio"}
                          id={`الجوالات`}
                        />
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="4">
                  <Accordion.Header>التقييم</Accordion.Header>
                  <Accordion.Body>
                    <div className="item">
                      <span>(12)</span>
                      <div>
                        {" "}
                        <label htmlFor="">الكل</label>
                        <Form.Check
                          name="currency"
                          type={"radio"}
                          id={`الجوالات`}
                        />
                      </div>
                    </div>
                    <div className="item">
                      <span>(12)</span>
                      <div>
                        {" "}
                        <label htmlFor="">
                          {" "}
                          <div className="rating flex">
                            <img src="outlineStar.svg" alt="" />
                            <img src="filledStar.svg" alt="" />
                            <img src="filledStar.svg" alt="" />
                            <img src="filledStar.svg" alt="" />
                            <img src="filledStar.svg" alt="" />
                          </div>
                        </label>
                        <Form.Check
                          name="currency"
                          type={"radio"}
                          id={`الجوالات`}
                        />
                      </div>
                    </div>
                    <div className="item">
                      <span>(12)</span>
                      <div>
                        <div className="rating flex">
                          <img src="outlineStar.svg" alt="" />
                          <img src="outlineStar.svg" alt="" />
                          <img src="filledStar.svg" alt="" />
                          <img src="filledStar.svg" alt="" />
                          <img src="filledStar.svg" alt="" />
                        </div>
                        <Form.Check
                          name="currency"
                          type={"radio"}
                          id={`الجوالات`}
                        />
                      </div>
                    </div>
                    <div className="item">
                      <span>(12)</span>
                      <div>
                        <div className="rating flex">
                          <img src="outlineStar.svg" alt="" />
                          <img src="outlineStar.svg" alt="" />
                          <img src="outlineStar.svg" alt="" />
                          <img src="filledStar.svg" alt="" />
                          <img src="filledStar.svg" alt="" />
                        </div>
                        <Form.Check
                          name="currency"
                          type={"radio"}
                          id={`الجوالات`}
                        />
                      </div>
                    </div>
                    <div className="item">
                      <span>(12)</span>
                      <div>
                        <div className="rating flex">
                          <img src="outlineStar.svg" alt="" />
                          <img src="outlineStar.svg" alt="" />
                          <img src="outlineStar.svg" alt="" />
                          <img src="outlineStar.svg" alt="" />
                          <img src="filledStar.svg" alt="" />
                        </div>
                        <Form.Check
                          name="currency"
                          type={"radio"}
                          id={`الجوالات`}
                        />
                      </div>
                    </div>
                    <button className="reset">إعادة ضبط</button>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div> */}
          </Offcanvas.Body>
        </Offcanvas>
        {/* Offcanvas */}
      </main>
      <Footer />
    </div>
  );
}

export default Products;
