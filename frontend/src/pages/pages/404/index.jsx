import GuestHeader from "@/components/layout/header/GuestHeader";
import MetaComponent from "@/components/common/MetaComponent";
import FooterThree from "@/components/layout/footers/FooterThree";
import { useNavigate } from "react-router-dom";
const metadata = {
  title: "Not found || Tripal",
  description: "Tripal",
};

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <>
      <MetaComponent meta={metadata} />
      <main>
        <GuestHeader />
        <section className="nopage mt-header">
          <div className="container">
            <div className="row y-gap-30 justify-between items-center">
              <div className="col-xl-6 col-lg-6">
                <img src="/img/404/1.svg" alt="image" />
              </div>
              <div className="col-xl-5 col-lg-6">
                <div className="nopage__content pr-30 lg:pr-0">
                  <h1>
                    40<span style={{ color: '#e0829d' }}>4</span>
                  </h1>
                  <h2 style={{ color: '#8f5774', fontSize: '30px', fontWeight: 700 }}>
                    Oops! It looks like you're lost.
                  </h2>
                  <p style={{ color: '#036264' }}>
                    The page you're looking for isn't available. Try again or go back to the homepage.
                  </p>
                  <button onClick={() => navigate('/')}
                    className="button -md -dark-1 mt-25"
                    style={{
                      backgroundColor: '#e0829d',
                      color: 'white'
                    }}
                  >
                    Go back to homepage
                    <i className="icon-arrow-top-right ml-10"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <FooterThree />
      </main>
    </>
  );
}