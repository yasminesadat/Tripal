import Pagination from "../common/Pagination";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useState } from "react";
import { messageSanders } from "@/data/dashboard";  // Assuming this has message details

export default function Messages({ complaint }) {
  const [sideBarOpen, setSideBarOpen] = useState(false);

  // Assuming `complaint.replies` holds the messages array
  const replies = complaint.replies;

  return (
    <>
      <div
        className={`dashboard ${sideBarOpen ? "-is-sidebar-visible" : ""} js-dashboard`}
      >
        <Sidebar setSideBarOpen={setSideBarOpen} />

        <div className="dashboard__content">
          <Header setSideBarOpen={setSideBarOpen} />

          <div className="dashboard__content_content">
            <h1 className="text-30">Complaint Details</h1>
            <p className="">{complaint.title}</p>
            <div className="row y-gap-30 pt-60">
              <div className="col-lg-4">
                <div className="rounded-12 bg-white shadow-2 px-40 pt-40 pb-30">
                  <div className="dbSearch">
                    <i className="icon-search text-16"></i>
                    <input type="search" placeholder="Search" />
                  </div>
                  <div className="row y-gap-30 pt-30">
                    {messageSanders.map((elm, i) => (
                      <div key={i} className="col-12">
                        <div className="row x-gap-10 y-gap-10 justify-between">
                          <div className="col-auto">
                            <div className="d-flex items-center">
                              <img
                                src={elm.image}
                                alt="image"
                                className="size-50 rounded-full"
                              />
                              <div className="ml-10">
                                <h5 className="text-15 lh-13 fw-500">{elm.name}</h5>
                                <div className="text-14 lh-13">{elm.role}</div>
                              </div>
                            </div>
                          </div>

                          <div className="col-auto">
                            <div className="d-flex flex-column items-end md:items-start">
                              <div className="text-14">{elm.time}</div>
                              {elm.badgeText && (
                                <div
                                  className={`size-16 flex-center rounded-full ${elm.badgeColor ? elm.badgeColor : ""} text-8 text-white`}
                                >
                                  {elm.badgeText}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-lg-8">
                <div className="rounded-12 bg-white shadow-2 px-40 pt-20 pb-30">
                  <div className="row x-gap-10 y-gap-10 justify-between items-center pb-20 border-1-bottom">
                    <div className="col-auto">
                      <div className="d-flex items-center">
                        <img
                          src="/img/dashboard/messages/main/4.png"
                          alt="image"
                          className="size-50 rounded-full"
                        />
                        <div className="ml-10">
                          <h5 className="text-15 lh-13 fw-500">Arlene McCoy</h5>
                          <div className="text-14 lh-13">Active</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Mapping of Replies */}
                  {replies.map((reply, index) => (
                    <div key={index} className={`row pt-20 ${index % 2 === 0 ? '' : 'justify-end text-right'}`}>
                      <div className="col-lg-6">
                        <div className={`d-flex items-center ${index % 2 === 0 ? '' : 'justify-end'}`}>
                          <img
                            src={reply.userImage}
                            alt="image"
                            className="size-50 rounded-full"
                          />
                          <h5 className={`ml-10 text-15 fw-500 ${index % 2 === 0 ? '' : 'mr-10'}`}>{reply.userName}</h5>
                          <div className="text-14 ml-5">{reply.time}</div>
                        </div>

                        <div className={`text-14 ${index % 2 === 0 ? 'bg-light-1' : 'bg-accent-1-05'} rounded-12 py-20 px-30 mt-15`}>
                          {reply.message}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="mt-40 mb-30 border-1-top"></div>

                  <div className="row y-gap-20 justify-between items-center">
                    <div className="col-auto">
                      <input type="text" placeholder="Type a Message" />
                    </div>

                    <div className="col-auto">
                      <button className="button -md -dark-1 bg-accent-1 text-white">
                        Send Message
                        <i className="icon-arrow-top-right text-16 ml-10"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center pt-30">
              © Copyright Viatours {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
