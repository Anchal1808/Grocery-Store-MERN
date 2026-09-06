import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const BottomBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="mt-20 relative rounded-2xl overflow-hidden shadow-sm">
      <img
        src={assets.bottom_banner_image}
        alt="Special offer banner"
        className="w-full hidden md:block object-cover max-h-80"
      />
      <img
        src={assets.bottom_banner_image_sm}
        alt="Special offer banner"
        className="w-full md:hidden object-cover"
      />
      <div className="absolute inset-0 flex flex-col justify-center items-start px-6 sm:px-12 lg:px-16 bg-gradient-to-r from-black/40 via-transparent to-transparent text-white">
        <span className="text-xs uppercase tracking-widest font-semibold bg-primary text-white px-2.5 py-1 rounded-full mb-3">
          Special Offer
        </span>
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold max-w-md leading-snug">
          Get Up to 30% Off on Fresh Organics
        </h3>
        <p className="text-sm sm:text-base text-gray-200 mt-2 max-w-sm hidden sm:block">
          Order now and receive farm-fresh fruits, veggies & dairy right at your doorstep.
        </p>
        <button
          onClick={() => {
            navigate("/products");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="mt-4 px-6 py-2.5 bg-primary hover:bg-primary-dull text-white font-semibold rounded-lg text-sm transition shadow cursor-pointer"
        >
          Shop Deals
        </button>
      </div>
    </section>
  );
};

export default BottomBanner;
