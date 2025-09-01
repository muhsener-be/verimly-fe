import React from "react";


const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-start p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      {/* İkon Bölümü */}
      <div className="p-3 bg-emerald-50 rounded-md">
        {/* Dışarıdan gelen ikonun rengini burada ayarlıyoruz */}
        {React.cloneElement(icon, { className: "h-6 w-6 text-emerald-600" })}
      </div>

      {/* Metin Bölümü */}
      <h3 className="mt-4 text-lg font-bold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;