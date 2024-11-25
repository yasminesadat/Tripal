import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";


const images = [
  "https://creativelayers.net/themes/viatours-html/img/tourSingle/2/2.png",
  "https://creativelayers.net/themes/viatours-html/img/tourSingle/2/1.png",
  "https://creativelayers.net/themes/viatours-html/img/tourSingle/2/3.png",
  "https://creativelayers.net/themes/viatours-html/img/tourSingle/2/1.png",
  "https://creativelayers.net/themes/viatours-html/img/hero/1/1.png",
  "https://creativelayers.net/themes/viatours-html/img/tourCards/1/3.png",
];
export default function AdvertiserGallery() {
  return (
    <div className="relative">
      <div className="container">
        <div className="row justify-center">
          <div className="col-lg-8">
            <div className="js-section-slider">
              <div className="swiper-wrapper" style={{ height: "438px" }}>
                <Swiper
                  spaceBetween={10}
                  className="w-100 overflow-visible"
                  style={{ maxWidth: "100%" }}
                  loop={true}
                  navigation={{
                    prevEl: ".js-slider1-prev7",
                    nextEl: ".js-slider1-next7",
                  }}
                  modules={[Navigation, Pagination]}
                  slidesPerView={1}
                  initialSlide={1}
                >
                  {images.map((elm, i) => (
                    <SwiperSlide key={i}>
                      <div className="swiper-slide">
                        <img
                          src={elm}
                          alt="image"
                          className="img-cover rounded-12"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className="navAbsolute -type-2">
                <button className="navAbsolute__button bg-white js-sliderMain-prev js-slider1-prev7">
                  <i className="icon-arrow-left text-14"></i>
                </button>

                <button className="navAbsolute__button bg-white js-sliderMain-next js-slider1-next7">
                  <i className="icon-arrow-right text-14"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
