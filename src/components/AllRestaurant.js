import React, { useState, useRef, useEffect } from "react";
import { CDN_URL } from "../utils/constant";
import RestaurantCard, { withOffers } from "./RestaurantCard";
import { Link } from "react-router-dom";
import { CORS_PROXY_URL } from "../utils/constant";

const AllRestaurant = ({ cardData }) => {
  const [menuCards, setMenuCards] = useState(
    cardData[4]?.card?.card?.gridElements?.infoWithStyle?.restaurants
  );
  const title = cardData[2]?.card?.card?.title;

  //HOC
  const RestaurantCardWithOffer = withOffers(RestaurantCard);

  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchData();
        }
      },
      { threshold: 1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget]);

  const { lat, lng } = JSON.parse(localStorage.getItem("swgy_userLocation"));

  const fetchData = async () => {
    const data = await fetch(`/api/fetchSwiggy?lat=${lat}&lng=${lng}`);
    const json = await data.json();
    json.data.cards;
    console.log(menuCards);
    setMenuCards((menuCards) => [
      ...menuCards,
      ...json?.data?.cards[4]?.card?.card?.gridElements?.infoWithStyle
        ?.restaurants,
    ]);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8 mt-[35px]">
        <h1 className="font-bold text-2xl">{title}</h1>
      </div>
      <div className="grid grid-cols-4 gap-8">
        {menuCards?.map((res, index) => {
          const offer = res.info.aggregatedDiscountInfoV3;
          return (
            <Link to={"/restaurant/" + res.info.id} key={index}>
              {offer === undefined ? (
                <RestaurantCard restaurant={res} />
              ) : (
                <RestaurantCardWithOffer restaurant={res} width="246px" />
              )}
            </Link>
          );
        })}
      </div>
      <div ref={observerTarget}></div>
    </>
  );
};

export default AllRestaurant;
