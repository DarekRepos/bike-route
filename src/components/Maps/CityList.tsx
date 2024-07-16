import React, { Component, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import type { CityData } from './types'; // Assuming CityData type is defined

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import PrevArrow from './PrevArrow';
import NextArrow from './NextArrow';


//TODO: aroows next and prevoiusdont work
interface Props {
  cityData: CityData | null;
  onCityClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  selectedCityId: string | null;
}

const CityList: React.FC<Props> = ({ cityData, onCityClick, selectedCityId}) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />
  };

  const sliderRef = useRef<Slider>(null);
  console.log("city id=",Number(selectedCityId));

  useEffect(() => {
    if (sliderRef.current && selectedCityId) {
      sliderRef.current.slickGoTo(Number(selectedCityId)-1);
    }
  }, [selectedCityId, cityData]);

  
  if (!cityData) {
    return <div>Loading city data...</div>;
  }

  return (
    <Slider {...settings} ref={sliderRef}>
      {cityData.features.map((city) => (
        <div key={city.properties.Cityname} className="city-item">
          <button
            id={city.properties.Cityname}
            onClick={onCityClick}
            className="link-button"
            aria-label={`View details for ${city.properties.Cityname}`}
          >
            {city.properties.Cityname}
          </button>
        </div>
      ))}
    </Slider>
  );
};

export default CityList;
