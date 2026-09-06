import React from "react";
import MainBanner from "../components/MainBanner";
import Categories from "../components/Categories";
import BestSeller from "../components/BestSeller";
import BottomBanner from "../components/BottomBanner";
import Features from "../components/Features";

const Home = () => {
  return (
    <div className="mt-6 mb-12">
      <MainBanner />
      <Categories />
      <BestSeller />
      <BottomBanner />
      <Features />
    </div>
  );
};

export default Home;
