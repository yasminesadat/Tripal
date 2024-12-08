export default function Information() {
  return (
    <section className="layout-pt-lg">
      <div className="container">
        <div className="row y-gap-40 justify-between items-center">
          <div className="col-lg-6">
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                lineHeight: "1.4",
              }}
            >
              Egypt's Historical Legacy
            </h2>
            <br />
            <p
              style={{
                fontSize: "18px",
                lineHeight: "1.8",
              }}
            >
              <span
                style={{
                  fontWeight: "bold",
                  color: "var(--color-pink)",
                }}
              >
                Egypt
              </span>{" "}
              is home to countless treasures of history, from the{" "}
              <strong style={{ color: "var(--color-dark-purple)" }}>
                Great Pyramids of Giza
              </strong>{" "}
              to the{" "}
              <strong style={{ color: "var(--color-dark-purple)" }}>
                temples of Luxor
              </strong>
              . Your role in preserving these landmarks ensures future
              generations can marvel at Egypt's extraordinary legacy.
              <br />
              <br />
              <span style={{ fontStyle: "italic"}}>
                Let’s work together to keep Egypt’s history alive by documenting
                and sharing its remarkable stories.
              </span>
            </p>
            <ul
              style={{
                marginTop: "20px",
                listStyleType: "disc",
                fontSize: "16px",
              }}
            >
              <li style={{ marginBottom: "10px" }}>
                <strong style={{ color: "var(--color-pink)" }}>Fun Fact:</strong>{" "}
                The{" "}
                <span
                  style={{
                    fontWeight: "bold",
                    color: "var(--color-dark-purple)",
                  }}
                >
                  Great Pyramid of Giza
                </span>{" "}
                is over 4,500 years old!
              </li>
              <li>
                <strong style={{ color: "var(--color-pink)" }}>Did you know?</strong>{" "}
                <span
                  style={{
                    fontWeight: "bold",
                    color: "var(--color-dark-purple)",
                  }}
                >
                  Luxor
                </span>{" "}
                is often called the world’s largest open-air museum.
              </li>
            </ul>
          </div>

          {/* Right Side Content */}
          <div className="col-lg-5">
            <div
              style={{
                backgroundColor: "var(--color-light-purple)",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  color: "var(--color-dark-purple)",
                  fontSize: "24px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                How You Can Help
              </h3>
              <p style={{ fontSize: "16px" }}>
                By documenting and sharing Egypt’s historical landmarks, you
                contribute to preserving its culture and heritage for future
                generations. Let's take the first step today!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}