import react, { useContext } from "react";
import { CarContext } from "../App";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

import ContactUs from "../components/ContactUs";

const Detail = () => {
  const carContext = useContext(CarContext);
  const carInfo = carContext.carInfo;
  const images = carInfo.results.results.inline_images;
  const organics = carInfo.results.results.organic;


  // const finalCarousel = ()

  return (
    <div className="p-3 w-full">
      <h1 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5sxl dark:text-white text-center">{organics[0].title}</h1>
      <div className="w-5/12 mx-auto mt-7">
        <Carousel>
          <img className="rounded-lg" src={images[0].image} alt="No Image" />
          <img className="rounded-lg" src={images[1].image} alt="No Image" />
          <img className="rounded-lg" src={images[2].image} alt="No Image" />
          <img className="rounded-lg" src={images[3].image} alt="No Image" />
          <img className="rounded-lg" src={images[4].image} alt="No Image" />
          <img className="rounded-lg" src={images[5].image} alt="No Image" />
        </Carousel>
      </div>

      <div className="flex flex-col max-w-6xl mx-auto">
        <div className="overflow-x-auto">
          <div className="p-1.5 w-full inline-block align-middle">
            <div className="overflow-hidden border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                {/* <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                    >
                      Site Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                    >
                      Delete
                    </th>
                  </tr>
                </thead> */}
                <tbody className="divide-y divide-gray-200">
                  {
                    organics.map((organic, index) => (
                      // <p key={index}>{organic.site_title}</p>
                      index < 8 && (
                        <tr key={index}>
                          <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            <input id="default-checkbox" type="checkbox" value="" className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                            <a className="text-red-500 hover:text-red-700" href={organic.link}>
                              {organic.site_title}
                            </a>
                          </td>
                          <td className="px-6 py-4 text-sm text-center text-gray-800 whitespace-nowrap">
                            100$
                          </td>
                        </tr>
                      )
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <ContactUs />
    </div>
  );
};

export default Detail;