import { sections } from "@/data/help";

export default function Activity() {
  return (
    <>
      <style>{`
        .help-card {
          background-color: white;
          border-color: #5a9ea0 !important;
          transition: all 0.3s ease;
        }

        .help-card:hover {
          border-color: #036264 !important;
          transform: translateY(-5px);
          box-shadow: 0 4px 15px rgba(3, 98, 100, 0.1);
        }

        .help-card h3 {
          color: #8f5774;
          font-weight: 500;
        }

        .help-card .mt-10 {
          color: #11302a;
          line-height: 1.6;
        }

        .help-card img {
          width: 60px;
          height: 60px;
          object-fit: contain;
        }

        @media (max-width: 991px) {
          .help-card {
            padding: 30px !important;
          }
        }
      `}</style>

      <section className="layout-pt-md">
        <div className="container">
          <div className="row y-gap-30">
            {sections.map((elm, i) => (
              <div key={i} className="col-lg-4 col-md-6">
                <div className="help-card px-50 py-45 border-1 rounded-12">
                  <img src={elm.imgSrc} alt="image" className="mb-20" />
                  <h3 className="text-18 fw-500">{elm.title}</h3>
                  <div className="mt-10">{elm.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}