import { Link } from "react-router-dom";
import { Pyramid, Landmark, BookOpen } from "lucide-react";

const governorFeatures = [
  {
    Icon: Pyramid,
    value: "5000+",
    label: "Years of History Preserved",
  },
  {
    Icon: Landmark,
    value: "200",
    label: "Historical Monuments Documented",
  },
  {
    Icon: BookOpen,
    value: "100+",
    label: "Cultural Stories Shared",
  },
];

export default function FeaturesTwo() {
  return (
    <section className="relative">
      <div className="relative xl:unset container">
        <div className="layout-pt-xl layout-pb-xl rounded-12">
          {/* Background Image */}
          <div className="sectionBg">
            <img
              src="/img/about/1/1.png"
              alt="Historical Background"
              className="img-ratio rounded-12 md:rounded-0"
            />
          </div>

          <div className="row y-gap-30 justify-center items-center">
            {/* Left Content */}
            <div className="col-lg-4 col-md-6">
              <h2 data-aos="fade-up" className="text-40 lh-13">
                Preserve Egypt's Heritage
                <br className="md:d-none" />
                For Future Generations
              </h2>

              <p data-aos="fade-up" className="mt-10">
                As a governor, you play a crucial role in protecting and promoting
                Egypt's cultural and historical legacy. Document landmarks,
                share stories, and ensure that these treasures remain part of our
                national pride.
              </p>
              <button
                data-aos="fade-right"
                className="button -md -dark-1 bg-accent-1 text-white mt-60 md:mt-30"
              >
                <Link to="/add-historical-place" className="d-flex align-items-center">
                  Add Historical Place
                  <i className="icon-arrow-top-right ml-10"></i>
                </Link>
              </button>
            </div>

            {/* Right Content */}
            <div className="col-md-6">
              <div data-aos="fade-left" className="featuresGrid">
                {governorFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="featuresGrid__item px-40 py-40 text-center bg-white rounded-12"
                  >
                    <feature.Icon
                      className="text-accent-1"
                      size={48}
                    />
                    <div className="text-40 fw-700 text-accent-1 mt-20 lh-14">
                      {feature.value}
                    </div>
                    <div className="feature-label">{feature.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}