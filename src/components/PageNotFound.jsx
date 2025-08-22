export const PageNotFound = () => {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "#fafbfc",
                fontFamily: "Segoe UI, Arial, sans-serif",
            }}
        >
            <div
                style={{
                    borderRadius: "12px",
                    textAlign: "center",
                    maxWidth: "400px",
                    width: "100%",
                }}
            >
                <div style={{ marginBottom: "24px" }}>
                    <svg
                        width="96"
                        height="96"
                        viewBox="0 0 96 96"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ display: "block", margin: "0 auto" }}
                    >
                        <circle cx="48" cy="48" r="44" stroke="#bbb" strokeWidth="4" fill="#fafbfc" />
                        <circle cx="38" cy="44" r="5" fill="#bbb" />
                        <circle cx="58" cy="44" r="5" fill="#bbb" />
                        <path
                            d="M36 64c2.5-4 7.5-6 12-6s9.5 2 12 6"
                            stroke="#bbb"
                            strokeWidth="3"
                            strokeLinecap="round"
                            fill="none"
                        />
                    </svg>
                </div>
                <div style={{ fontSize: "2.5rem", color: "#888", fontWeight: 600, marginBottom: "8px" }}>
                    404
                </div>
                <div style={{ fontSize: "1.25rem", color: "#888", marginBottom: "8px" }}>
                    Page not found
                </div>
                <div style={{ color: "#888", fontSize: "0.98rem", marginBottom: "24px", lineHeight: 1.5 }}>
                    The page you are looking for doesn't exist.<br />
                    Go back, or head over to <a href="/dashboard" style={{ color: "#4e73df", textDecoration: "underline" }}>earthco.com</a> to choose a new direction.
                </div>
            </div>
        </div>
    );
};
