import axios from "axios";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Loader } from "@mantine/core";
const FilterPage = () => {
  const [enableSubRegion, setEnableSubRegion] = useState(false);
  const [enableCountry, setEnableCountry] = useState(false);
  const [region, setRegion] = useState(null);
  const [subRegion, setSubRegion] = useState(null);
  const [country, setCountry] = useState(null);
  const [allData, setAllData] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const getAllData = () => {
    const response = axios
      .get("https://restcountries.com/v3.1/all")
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (err) {
        console.log(err);
      });
  };
  const getAllSub = (e) => {
    const response = axios
      .get(`https://restcountries.com/v3.1/region/${e}`)
      .then(function (response) {
        setAllData(response?.data);
        setEnableSubRegion(true);
        setShowLoader(false);
      })
      .catch(function (err) {
        console.log(err);
      });
  };
  const getAllCountry = (e) => {
    const response = axios
      .get(`https://restcountries.com/v3.1/subregion/${e}`)
      .then(function (response) {
        setAllData(response?.data);
        setEnableCountry(true);
        setShowLoader(false);
      })
      .catch(function (err) {
        console.log(err);
      });
  };
  console.log("country", country);
  const getFilteredData = (e) => {
    let filteredData = allData.filter((data) => {
      return data.name.common === country.value;
    });
    setAllData(filteredData);
  };

  const optionsRegion = [
    { value: "africa", label: "Africa" },
    { value: "america", label: "America" },
    { value: "antarctic", label: "Antarctic" },
    { value: "asia", label: "Asia" },
    { value: "europe", label: "Europe" },
    { value: "oceania", label: "Oceania" },
  ];

  function removewithfilter(arr) {
    let outputArray = arr.filter(function (v, i, self) {
      return i == self.indexOf(v);
    });
    return outputArray;
  }

  const optionsSubRegion2 = allData?.map((item, index) => {
    return item?.subregion;
  });
  const optionSubRegionFiltered = removewithfilter(optionsSubRegion2);
  const optionsSubRegion =
    optionSubRegionFiltered.length > 0
      ? optionSubRegionFiltered?.map((item, index) => {
          return { value: item, label: item };
        })
      : { value: "undefined", label: "Undefined" };

  const optionsCountry = allData?.map((item, index) => {
    return { value: item?.name?.common, label: item?.name?.common };
  });

  useEffect(() => {
    getAllData();
  }, []);
  useEffect(() => {
    getFilteredData();
  }, [country]);
  return (
    <div>
      <div className="flex justify-start gap-5 px-8 py-6 shadow-custom ">
        <Select
          options={optionsRegion}
          value={region}
          onChange={(e) => {
            setRegion(e);
            setShowLoader(true);
            getAllSub(e.value);
          }}
          placeholder="Select Region"
          className="w-1/2 text-sm"
        />
        <Select
          options={optionsSubRegion}
          value={subRegion}
          onChange={(e) => {
            setSubRegion(e);
            setShowLoader(true);
            getAllCountry(e.value);
          }}
          placeholder="Select Sub Region"
          isDisabled={!enableSubRegion}
          className="w-1/2 text-sm"
        />
        <Select
          options={optionsCountry}
          value={country}
          onChange={(e) => {
            setCountry(e);
          }}
          placeholder="Select Country"
          isDisabled={!enableCountry}
          className="w-1/2 text-sm"
        />
      </div>
      <div className="mt-5 px-8 py-6 shadow-custom ">
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-teal-700 text-white">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Region
                </th>
                <th scope="col" className="px-6 py-3">
                  Sub Region
                </th>
                <th scope="col" className="px-6 py-3">
                  Flag
                </th>
                <th scope="col" className="px-6 py-3">
                  Country Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Capital
                </th>
                <th scope="col" className="px-6 py-3">
                  Population
                </th>
              </tr>
            </thead>
            <tbody>
              <>
                {!showLoader ? (
                  allData?.length > 0 ? (
                    allData?.map((item, index) => {
                      return (
                        <tr
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                          key={index}
                        >
                          <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            {item?.region}
                          </th>
                          <td className="px-6 py-4">
                            {item.subregion ? item?.subregion : "-"}
                          </td>
                          <td className="px-6 py-4">
                            <img
                              src={item?.flags?.png}
                              alt="flag-icon"
                              width="40px"
                            />
                          </td>
                          <td className="px-6 py-4">{item?.name?.common}</td>
                          <td className="px-6 py-4">
                            {item?.capital?.length > 0 ? item?.capital[0] : "-"}
                          </td>
                          <td className="px-6 py-4">{item?.population}</td>
                        </tr>
                      );
                    })
                  ) : // <tr className="text-3xl text-black text-center py-5 flex justify-center items-center">
                  //   No Data Found!
                  // </tr>
                  null
                ) : (
                  <div className="w-full justify-center flex py-5">
                    <Loader />
                  </div>
                )}
              </>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FilterPage;
