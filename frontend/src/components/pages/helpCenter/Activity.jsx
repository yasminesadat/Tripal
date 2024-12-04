import { sections } from "@/data/help";

import React from "react";


export default function Activity() {
  return (
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
  );
}

// Styles
const styles = `
:root {
  --color-dark-purple: #8f5774;
  --color-light-purple: #dac4d0;
  --color-pink: #e0829d;
  --color-stone: #036264;
  --color-stone-light: #5a9ea0;
  --color-footer: #e5f8f8;
  --color-dark-green: #11302a;
}

.help-card {
  background-color: white;
  border-color: var(--color-stone-light) !important;
  transition: all 0.3s ease;
}

.help-card:hover {
  border-color: var(--color-stone) !important;
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(3, 98, 100, 0.1);
}

.help-card h3 {
  color: var(--color-dark-purple);
  font-weight: 500;
}

.help-card .mt-10 {
  color: var(--color-dark-green);
  line-height: 1.6;
}

.help-card img {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.layout-pt-md {
  padding-top: 60px;
}

.y-gap-30 > * {
  margin-top: 30px;
  margin-bottom: 30px;
}

/* Responsive adjustments */
@media (max-width: 991px) {
  .help-card {
    padding: 30px !important;
  }
}
`;

// Create style element and append to head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}