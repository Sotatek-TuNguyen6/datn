import React, { useEffect, useState, useContext } from "react";
import Slider from "@mui/material/Slider";
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
import { Button } from "@mui/material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import bannerImg from "../../assets/images/banner1.jpg";
import { Link, useParams } from "react-router-dom";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

import { MyContext } from "../../App";

function valuetext(value) {
  return `${value}°C`;
}
const label = { inputProps: { "aria-label": "Checkbox demo" } };

const Sidebar = (props) => {
  const { handleSubCategoryClick } = props;
  const [value, setValue] = useState([100, 60000]);
  const [value2, setValue2] = useState(0);
  const [brandFilters, setBrandFilters] = React.useState([]);
  const [ratingsArr, setRatings] = React.useState([]);
  const [totalLength, setTotalLength] = useState([]);
  const [data, setData] = useState(props.data);

  let { id } = useParams();



  return (
    <>
      <div className={`sidebar open`}>
        <div className="card border-0 shadow res-hide">
          <h3>Category</h3>
          <div className="catList">
            {props?.data?.subCategories.length !== 0 &&
              props.data?.subCategories.map((item, index) => {
                return (
                  <Link to={``} onClick={() => handleSubCategoryClick(item.subCategoryName)}>
                    <div className="catItem d-flex align-items-center">
                      <span className="img">
                        <img
                          src="https://wp.alithemes.com/html/nest/demo/assets/imgs/theme/icons/category-1.svg"
                          width={30}
                        />
                      </span>
                      <h4 className="mb-0 ml-3 mr-3 text-capitalize">
                        {item.subCategoryName}
                      </h4>
                       <span className="d-flex align-items-center justify-content-center rounded-circle ml-auto">
                        {item.countProducts}
                      </span>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>

        {/* <div className="card border-0 shadow">
          <h3>Fill by price</h3>

          <RangeSlider
            value={value}
            onInput={setValue}
            min={100}
            max={60000}
            step={5}
          />

          <div className="d-flex pt-2 pb-2 priceRange">
            <span>
              From: <strong className="text-success">Rs: {value[0]}</strong>
            </span>
            <span className="ml-auto">
              From: <strong className="text-success">Rs: {value[1]}</strong>
            </span>
          </div>

          <div className="filters pt-5">
            <h5>Filter By Brand</h5>

            <ul className="mb-0">
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                name="radio-buttons-group"
              >
                {brandFilters.length !== 0 &&
                  brandFilters.map((item, index) => {
                    return (
                      <li key={index}>
                        {" "}
                        <FormControlLabel
                          value={item}
                          control={
                            <Radio onChange={() => filterByBrand(item)} />
                          }
                          label={item}
                        />
                      </li>
                    );
                  })}
              </RadioGroup>
            </ul>
          </div>

          <div className="filters pt-0">
            <h5>Filter By Ratings</h5>
            <ul>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                name="radio-buttons-group"
              >
                {ratingsArr.length !== 0 &&
                  ratingsArr.map((item, index) => {
                    return (
                      <li key={index}>
                        {" "}
                        <FormControlLabel
                          value={item}
                          control={
                            <Radio onChange={() => filterByRating(item)} />
                          }
                          label={item}
                        />
                      </li>
                    );
                  })}
              </RadioGroup>
            </ul>
          </div>

          <div className="d-flex filterWrapper">
            <Button
              className="btn btn-g w-100"
              onClick={() => context.openFilters()}
            >
              <FilterAltOutlinedIcon /> Filter
            </Button>
          </div>
        </div> */}

        <img src={bannerImg} className="w-100" />
      </div>
    </>
  );
};

export default Sidebar;
