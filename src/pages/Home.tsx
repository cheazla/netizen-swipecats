import React, { useEffect, useState } from "react";

interface Cat {
  id: number;
  url: string;
  name: string;
  age: number;
  verified: boolean;
  hobbies: string[];
}

const names = [
  "Comot",
  "Tompok",
  "Comel",
  "Gebu",
  "Manja",
  "Leka",
  "Montel",
  "Ciki",
  "Lilo",
  "Boboi",
  "Mimi",
  "Ayam",
  "Ciko",
  "Jojo",
  "Totoy",
];

const hobbiesList = [
  "Drinks",
  "Sleeping",
  "Playing",
  "Cuddling",
  "Running",
  "Eating",
  "Chasing",
  "Stealing hearts",
  "Midnight zoomies",
  "Window staring",
  "Purring therapy",
  "Flirting with strangers",
  "Ignoring texts",
  "Being mysterious",
  "Making biscuits",
  "Ghosting then cuddling",
  "Pretending to help code",
];

const randomName = () => names[Math.floor(Math.random() * names.length)];
const randomAge = () => Math.floor(Math.random() * 10) + 1;
const randomVerified = () => Math.random() < 0.5;
const randomHobbies = () => {
  const shuffled = hobbiesList.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
};

const fetchCats = async (limit: number = 10): Promise<Cat[]> => {
  const cats: Cat[] = [];
  for (let i = 0; i < limit; i++) {
    cats.push({
      id: i + 1,
      url: `https://cataas.com/cat?${Date.now()}-${i}`,
      name: randomName(),
      age: randomAge(),
      verified: randomVerified(),
      hobbies: randomHobbies(),
    });
  }
  return cats;
};

const Home: React.FC = () => {
  const [cats, setCats] = useState<Cat[]>([]);
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState<Cat[]>([]);
  const [drag, setDrag] = useState({
    x: 0,
    y: 0,
    startX: 0,
    startY: 0,
    isDragging: false,
  });

  const SWIPE_THRESHOLD = 100;

  useEffect(() => {
    fetchCats().then(setCats);
  }, []);

  const remainingCats = cats.slice(index);
  const finished = remainingCats.length === 0;

  const handleDragStart = (x: number, y: number) => {
    setDrag({ x: 0, y: 0, startX: x, startY: y, isDragging: true });
  };

  const handleDragMove = (x: number, y: number) => {
    if (!drag.isDragging) return;
    setDrag((prev) => ({ ...prev, x: x - prev.startX, y: y - prev.startY }));
  };

  const handleDragEnd = () => {
    if (!drag.isDragging) return;
    if (drag.x > SWIPE_THRESHOLD) swipeRight();
    else if (drag.x < -SWIPE_THRESHOLD) swipeLeft();
    setDrag({ x: 0, y: 0, startX: 0, startY: 0, isDragging: false });
  };

  const swipeRight = () => {
    const current = remainingCats[0];
    if (current) setLiked([...liked, current]);
    setIndex(index + 1);
  };

  const swipeLeft = () => {
    setIndex(index + 1);
  };

  const restart = () => {
    setIndex(0);
    setLiked([]);
  };

  return (
    <div style={styles.container}>
      <div style={styles.backgroundGradient}></div>

      <div style={styles.header}>
        <div style={styles.headerGlass}>
          <h1 style={styles.title}>Pawsitive</h1>
          <p style={styles.subtitle}>Find your purrfect match</p>
        </div>
      </div>

      {!finished ? (
        <div style={styles.content}>
          <div style={styles.deck}>
            {remainingCats
              .slice(0, 3)
              .reverse()
              .map((cat, idx) => {
                const isTop = idx === 0;
                const rotation = drag.x * 0.08;
                const opacity = 1 - Math.abs(drag.x) / 300;

                const style = isTop
                  ? {
                      ...styles.card,
                      transform: `translate(${drag.x}px, ${drag.y}px) rotate(${rotation}deg)`,
                      zIndex: 3 - idx,
                      opacity: drag.isDragging ? opacity : 1,
                    }
                  : {
                      ...styles.card,
                      transform: `scale(${1 - idx * 0.05}) translateY(${
                        idx * 12
                      }px)`,
                      zIndex: 3 - idx,
                      opacity: 1 - idx * 0.2,
                    };

                return (
                  <div
                    key={cat.id}
                    style={style}
                    onMouseDown={
                      isTop
                        ? (e) => handleDragStart(e.clientX, e.clientY)
                        : undefined
                    }
                    onMouseMove={
                      isTop
                        ? (e) => handleDragMove(e.clientX, e.clientY)
                        : undefined
                    }
                    onMouseUp={isTop ? handleDragEnd : undefined}
                    onMouseLeave={isTop ? handleDragEnd : undefined}
                    onTouchStart={
                      isTop
                        ? (e) =>
                            handleDragStart(
                              e.touches[0].clientX,
                              e.touches[0].clientY
                            )
                        : undefined
                    }
                    onTouchMove={
                      isTop
                        ? (e) =>
                            handleDragMove(
                              e.touches[0].clientX,
                              e.touches[0].clientY
                            )
                        : undefined
                    }
                    onTouchEnd={isTop ? handleDragEnd : undefined}
                  >
                    <img src={cat.url} style={styles.cardImg} alt="Cat" />
                    <div style={styles.cardOverlay}>
                      <div style={styles.cardInfo}>
                        <span style={styles.catNumber}>
                          {cat.name}, {cat.age}
                          {cat.verified && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              style={{
                                backgroundColor: "#00BFFF",
                                borderRadius: "50%",
                                marginLeft: 6,
                                verticalAlign: "middle",
                              }}
                            >
                              <circle cx="12" cy="12" r="10" fill="#00BFFF" />
                              <polyline points="9 12 11 14 15 10" />
                            </svg>
                          )}
                        </span>

                        <span
                          style={{
                            fontSize: "clamp(12px, 3vw, 14px)",
                            color: "white",
                            marginTop: 2,
                          }}
                        ></span>
                        <div style={styles.hobbiesContainer}>
                          {cat.hobbies.map((hobby, idx) => (
                            <span key={idx} style={styles.hobbyBubble}>
                              {hobby}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {isTop && drag.isDragging && (
                      <>
                        <div
                          style={{
                            ...styles.swipeIndicator,
                            ...styles.likeIndicator,
                            opacity:
                              drag.x > 30 ? Math.min(drag.x / 100, 1) : 0,
                          }}
                        >
                          LIKE
                        </div>
                        <div
                          style={{
                            ...styles.swipeIndicator,
                            ...styles.nopeIndicator,
                            opacity:
                              drag.x < -30
                                ? Math.min(Math.abs(drag.x) / 100, 1)
                                : 0,
                          }}
                        >
                          NOPE
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
          </div>

          <div style={styles.actions}>
            <button
              style={{ ...styles.actionBtn, ...styles.passBtn }}
              onClick={swipeLeft}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <button
              style={{ ...styles.actionBtn, ...styles.likeBtn }}
              onClick={swipeRight}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                strokeWidth="2.5"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>

          <div style={styles.progress}>
            <div
              style={{
                ...styles.progressBar,
                width: `${(index / cats.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      ) : (
        <div style={styles.summary}>
          <div style={styles.summaryCard}>
            <div style={styles.summaryIcon}>🎉</div>
            <h2 style={styles.summaryTitle}>All Done!</h2>
            <p style={styles.summaryText}>
              You loved <span style={styles.highlight}>{liked.length}</span>{" "}
              adorable {liked.length === 1 ? "cat" : "cats"}
            </p>

            <div style={styles.likedGrid}>
              {liked.map((cat) => (
                <div key={cat.id} style={styles.likedCard}>
                  <img src={cat.url} style={styles.likedImg} alt="Liked cat" />
                </div>
              ))}
            </div>

            <button style={styles.restartBtn} onClick={restart}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                style={{ marginRight: 8 }}
              >
                <polyline points="23 4 23 10 17 10"></polyline>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
    background: "linear-gradient(135deg, #000 0%, #fff 100%)",
    position: "relative",
    overflow: "hidden",
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "radial-gradient(circle at 20% 80%, rgba(255, 107, 107, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(78, 205, 196, 0.3) 0%, transparent 50%)",
    zIndex: 0,
  },
  header: {
    width: "90%",
    padding: "20px",
    zIndex: 10,
  },
  headerGlass: {
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "clamp(16px, 5vw, 24px)",
    textAlign: "center",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  },
  title: {
    margin: 0,
    fontSize: "clamp(28px, 6vw, 36px)",
    fontWeight: "700",
    color: "white",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    margin: "8px 0 0",
    fontSize: "clamp(14px, 3vw, 16px)",
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.85)",
    letterSpacing: "0.3px",
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: "min(500px, 90vw)",
    padding: "clamp(12px, 4vw, 20px)",
    position: "relative",
    zIndex: 1,
  },
  deck: {
    width: "100%",
    height: "clamp(400px, 60vh, 600px)",
    maxHeight: "calc(100vh - 300px)",
    position: "relative",
    marginBottom: "clamp(24px, 5vh, 40px)",
  },
  card: {
    width: "100%",
    height: "100%",
    borderRadius: "clamp(20px, 5vw, 32px)",
    overflow: "hidden",
    position: "absolute",
    transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    cursor: "grab",
    userSelect: "none",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    background: "white",
  },
  cardImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    pointerEvents: "none",
  },
  cardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)",
    padding: "clamp(16px, 4vw, 24px)",
    pointerEvents: "none",
  },
  cardInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  catNumber: {
    fontSize: "clamp(16px, 3.5vw, 18px)",
    fontWeight: "600",
    color: "white",
    textShadow: "0 2px 8px rgba(0,0,0,0.3)",
  },
  swipeIndicator: {
    position: "absolute",
    top: "clamp(24px, 5vh, 40px)",
    padding: "clamp(8px, 2vw, 12px) clamp(16px, 4vw, 24px)",
    borderRadius: "clamp(12px, 3vw, 16px)",
    fontSize: "clamp(18px, 4vw, 24px)",
    fontWeight: "800",
    letterSpacing: "2px",
    border: "clamp(3px, 0.5vw, 4px) solid",
    pointerEvents: "none",
  },
  likeIndicator: {
    right: "clamp(20px, 5vw, 40px)",
    color: "#4cd137",
    borderColor: "#4cd137",
    transform: "rotate(20deg)",
  },
  nopeIndicator: {
    left: "clamp(20px, 5vw, 40px)",
    color: "#ff5e5e",
    borderColor: "#ff5e5e",
    transform: "rotate(-20deg)",
  },
  actions: {
    display: "flex",
    gap: "clamp(16px, 4vw, 24px)",
    marginBottom: "clamp(16px, 3vh, 24px)",
  },
  actionBtn: {
    width: "clamp(56px, 12vw, 70px)",
    height: "clamp(56px, 12vw, 70px)",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
  },
  passBtn: {
    color: "#ff5e5e",
  },
  likeBtn: {
    color: "#ff6b9d",
    transform: "scale(1.15)",
    boxShadow: "0 12px 32px rgba(255, 107, 157, 0.4)",
  },
  progress: {
    width: "100%",
    height: "6px",
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: "10px",
    overflow: "hidden",
    backdropFilter: "blur(10px)",
  },
  progressBar: {
    height: "100%",
    background: "linear-gradient(90deg, #4cd137, #00d2ff)",
    borderRadius: "10px",
    transition: "width 0.3s ease",
  },
  summary: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: "min(600px, 95vw)",
    padding: "clamp(12px, 3vw, 20px)",
    zIndex: 1,
  },
  summaryCard: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "clamp(20px, 5vw, 32px)",
    padding: "clamp(24px, 6vw, 48px) clamp(16px, 4vw, 32px)",
    textAlign: "center",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
    width: "100%",
  },
  summaryIcon: {
    fontSize: "clamp(38px, 10vw, 54px)",
    marginBottom: "clamp(12px, 3vh, 16px)",
  },
  summaryTitle: {
    margin: "0 0 12px",
    fontSize: "clamp(20px, 6vw, 28px)",
    fontWeight: "700",
    color: "#2d3436",
    letterSpacing: "-0.5px",
  },
  summaryText: {
    margin: "0 0 clamp(18px, 4vh, 30px)",
    fontSize: "clamp(16px, 3.5vw, 18px)",
    color: "#636e72",
    fontWeight: "500",
  },
  highlight: {
    color: "#667eea",
    fontWeight: "700",
    fontSize: "clamp(18px, 4vw, 22px)",
  },
  likedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "clamp(8px, 2vw, 12px)",
    marginBottom: "clamp(20px, 4vh, 32px)",
    maxHeight: "min(200px, 50vh)",
    overflowY: "auto",
    padding: "4px",
  },

  likedCard: {
    borderRadius: "clamp(12px, 3vw, 20px)",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s ease",
    cursor: "pointer",
  },
  likedImg: {
    width: "100%",
    height: "clamp(60px, 20vw, 80px)",
    objectFit: "cover",
    display: "block",
  },
  restartBtn: {
    padding: "clamp(12px, 3vw, 16px) clamp(24px, 6vw, 36px)",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    borderRadius: "clamp(16px, 4vw, 20px)",
    border: "none",
    fontSize: "clamp(16px, 3.5vw, 18px)",
    fontWeight: "600",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
  },

  hobbiesContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginTop: "6px",
  },
  hobbyBubble: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "white",
    padding: "4px 10px",
    borderRadius: "16px",
    fontSize: "12px",
    fontWeight: 500,
    textAlign: "center",
    whiteSpace: "nowrap",
    backdropFilter: "blur(6px)",
  },
};
