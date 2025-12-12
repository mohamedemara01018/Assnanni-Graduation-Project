import React from "react";

const Governorates = () => {
  return (
    <>
      <select
        id="governorate"
        name="governorate"
        className="bg-gray-50 placeholder:text-slate-400 text-gray-500  border-slate-200 rounded-lg appearance-none pl-3 pr-8 py-2 transition duration-300 ease  focus:outline-slate-600 outline-3 hover:border-slate-300 shadow-sm focus:shadow-md cursor-pointer"
      >
        <option value="">Choose a governorate</option>
        <option value="alexandria">Alexandria</option>
        <option value="aswan">Aswan</option>
        <option value="assiut">Assiut</option>
        <option value="beheira">Beheira</option>
        <option value="beni_suef">Beni Suef</option>
        <option value="cairo">Cairo</option>
        <option value="dakahlia">Dakahlia</option>
        <option value="damietta">Damietta</option>
        <option value="fayoum">Fayoum</option>
        <option value="gharbia">Gharbia</option>
        <option value="giza">Giza</option>
        <option value="ismailia">Ismailia</option>
        <option value="kafr_el_sheikh">Kafr el-Sheikh</option>
        <option value="luxor">Luxor</option>
        <option value="matrouh">Matrouh</option>
        <option value="minya">Minya</option>
        <option value="menofia">Menofia</option>
        <option value="new_valley">New Valley</option>
        <option value="north_sinai">North Sinai</option>
        <option value="port_said">Port Said</option>
        <option value="qalyubia">Qalyubia</option>
        <option value="qena">Qena</option>
        <option value="red_sea">Red Sea</option>
        <option value="al_sharqia">Al Sharqia</option>
        <option value="sohag">Sohag</option>
        <option value="south_sinai">South Sinai</option>
        <option value="suez">Suez</option>
      </select>
    </>
  );
};

export default Governorates;
