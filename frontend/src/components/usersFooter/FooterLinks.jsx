const sections = [
  {
    title: "Company",
    links: [
      { id: 1, text: "About Us", href: "#" },
      { id: 2, text: "Travel Guides", href: "#" },
      { id: 3, text: "Data Policy", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { id: 9, text: "Get in Touch", href: "#" },
      { id: 10, text: "Help center", href: "#" },
    ],
  },
];

export default function FooterLinks() {
  return (
    <>
      {sections.map((elm, i) => (
        <div key={i} className="col-lg-auto col-6">
          <h4 className="text-20 fw-500">{elm.title}</h4>

          <div className="y-gap-10 mt-20">
            {elm.links.map((elm2, i2) => (
              <a key={i2} className="d-block fw-500" href={elm2.href}>
                {elm2.text}
              </a>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
