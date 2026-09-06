import React from "react";
import { features } from "../assets/assets";

const Features = () => {
  return (
    <section className="mt-20 py-10 border-y border-gray-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4 rounded-xl hover:bg-primary/5 transition duration-200"
          >
            <div className="w-12 h-12 flex-shrink-0 bg-primary/10 rounded-xl flex items-center justify-center p-2.5">
              <img src={feature.icon} alt={feature.title} className="w-full h-full object-contain" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-base">{feature.title}</h4>
              <p className="text-gray-500 text-xs sm:text-sm mt-1 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
