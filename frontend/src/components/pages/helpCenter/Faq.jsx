import  { useState } from "react";
import { faqData } from "@/data/tourSingleContent";

export default function Faq() {
  const [currentActiveFaq, setCurrentActiveFaq] = useState(0);

  return (
    <>
      <style>
        {`
          :root {
            --color-dark-purple: #8f5774;
            --color-light-purple: #dac4d0;
            --color-pink: #e0829d;
            --color-stone: #036264;
            --color-stone-light: #5a9ea0;
            --color-footer: #e5f8f8;
            --color-dark-green: #11302a;
          }

          .accordion.-simple {
            --accordion-bg: var(--color-footer);
            --accordion-active: var(--color-stone);
            --accordion-text: var(--color-dark-green);
            --accordion-icon-bg: var(--color-light-purple);
            --accordion-hover: var(--color-stone-light);
          }

          .accordion.-simple .accordion__item {
            background-color: var(--accordion-bg);
            transition: all 0.3s ease;
            border-color: var(--color-stone) !important;
          }

          .accordion.-simple .accordion__item.is-active {
            background-color: white;
            border: 2px solid var(--accordion-active) !important;
          }

          .accordion.-simple .accordion__button {
            cursor: pointer;
          }

          .accordion.-simple .accordion__button .button {
            color: var(--accordion-text);
            font-weight: 500;
          }

          .accordion.-simple .accordion__icon {
            background-color: var(--accordion-icon-bg);
            transition: all 0.3s ease;
            color: var(--color-dark-purple) !important;
          }

          .accordion.-simple .accordion__item.is-active .accordion__icon {
            background-color: var(--color-dark-purple) !important;
            color: white;
          }

          .accordion.-simple .accordion__content {
            max-height: 0;
            overflow: hidden;
            transition: all 0.3s ease;
          }

          .accordion.-simple .accordion__content p {
            color: var(--color-dark-green);
            line-height: 1.6;
          }

          .accordion.-simple .accordion__item:hover:not(.is-active) {
            background-color: var(--color-footer) !important;
            border-color: var(--accordion-hover) !important;
          }

          .text-30 {
            color: var(--color-dark-purple);
            font-weight: 600;
          }

          .accordion__item .icon-plus {
            display: block;
          }

          .accordion__item .icon-minus {
            display: none;
          }

          .accordion__item.is-active .icon-plus {
            display: none;
          }

          .accordion__item.is-active .icon-minus {
            display: block;
          }

          .layout-pt-xl {
            padding-top: 60px;
          }

          .layout-pb-xl {
            padding-bottom: 60px;
          }

          .pt-40 {
            padding-top: 40px;
          }

          .rounded-12 {
            border-radius: 12px;
          }

          .size-30 {
            width: 30px;
            height: 30px;
          }

          .rounded-full {
            border-radius: 50%;
          }

          .flex-center {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          @media (max-width: 768px) {
            .md\\:text-24 {
              font-size: 24px;
            }
          }

          .accordion__icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: var(--color-light-purple) !important;
            transition: all 0.3s ease;
          }

          .accordion__icon i {
            color: var(--color-light-purple) !important;
            font-size: 14px;
          }

          .accordion__icon:hover {
            background-color: var(--color-light-purple) !important;
          }

          .accordion__icon:hover i {
            color: var(--color-light-purple) !important;
          }

          .is-active .accordion__icon {
            background-color: var(--color-light-purple) !important;
          }

          .accordion__item.is-active .accordion__icon i {
            color: var(--color-light-purple) !important;
          }

          .is-active .accordion__icon i {
            color: var(--color-light-purple) !important;
          }
        `}
      </style>

      <section className="layout-pt-xl layout-pb-xl">
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <h2 className="text-30 md:text-24">Frequently Asked Questions</h2>
            </div>
          </div>

          <div className="row justify-center pt-40">
            <div className="col-xl-8 col-lg-10">
              <div className="accordion -simple row y-gap-20 js-accordion">
                {faqData.map((elm, i) => (
                  <div key={i} className="col-12">
                    <div
                      className={`accordion__item px-20 py-15 border-1 rounded-12 ${currentActiveFaq == i ? "is-active" : ""
                        }`}
                    >
                      <div
                        className="accordion__button d-flex items-center justify-between"
                        onClick={() =>
                          setCurrentActiveFaq((pre) => (pre == i ? -1 : i))
                        }
                      >
                        <div className="button text-16 text-dark-1">
                          {elm.question}
                        </div>

                        <div className="accordion__icon size-30 flex-center rounded-full">
                          <i className="icon-plus"></i>
                          <i className="icon-minus"></i>
                        </div>
                      </div>

                      <div
                        className="accordion__content"
                        style={
                          currentActiveFaq == i ? { maxHeight: "150px" } : {}
                        }
                      >
                        <div className="pt-20">
                          <p>{elm.answer}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}