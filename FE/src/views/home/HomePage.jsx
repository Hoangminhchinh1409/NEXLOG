/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ConsultationBookingModal from "@/src/components/home/ConsultationBookingModal";
import { LANDING_COPY } from "./landingI18n";
import "./landing.css";

const LANG_STORAGE_KEY = "nexlog_lang";

function BrandLogo({ variant = "dark", onClick }) {
  return (
    <a
      href="#intro"
      onClick={onClick}
      className={`nx-logo ${variant === "dark" ? "nx-logo--dark" : "nx-logo--light"}`}
      aria-label="NEXLOG Smart Logistics"
    >
      <img src="/logo-icon.png" alt="Logo NEXLOG" className="nx-logo-icon" />
      <img src="/logo-text.png" alt="NEXLOG" className="nx-logo-text" />
    </a>
  );
}

function LanguageSwitch({ lang, onChange, variant = "dark" }) {
  return (
    <div
      className={`nx-lang-switch ${variant === "dark" ? "nx-lang-switch--dark" : "nx-lang-switch--light"}`}
      role="group"
      aria-label="Language switcher"
    >
      <button
        type="button"
        className={lang === "vi" ? "active" : ""}
        onClick={() => onChange("vi")}
        aria-pressed={lang === "vi"}
      >
        VI
      </button>
      <button
        type="button"
        className={lang === "en" ? "active" : ""}
        onClick={() => onChange("en")}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
    </div>
  );
}

export default function HomePage({
  initialLang = "vi",
  initialCountry = "",
}) {
  const [lang, setLang] = useState(initialLang === "en" ? "en" : "vi");
  const [activeProduct, setActiveProduct] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showFloatPlane, setShowFloatPlane] = useState(false);

  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [activeTrialPhotoId, setActiveTrialPhotoId] = useState(null);
  const [consultationOpen, setConsultationOpen] = useState(false);

  const [contactInView, setContactInView] = useState(false);
  const [leadEmail, setLeadEmail] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const contactRef = useRef(null);
  const modalVideoRef = useRef(null);
  const toastTimerRef = useRef(null);

  const t = LANDING_COPY[lang] || LANDING_COPY.vi;
  const products = t.platform.products;
  const currentProduct = products[activeProduct] || products[0];
  const trials = t.contact.trials;
  const activeTrialPhoto = activeTrialPhotoId
    ? trials.find((item) => item.id === activeTrialPhotoId) || null
    : null;

  const handleLanguageChange = (nextLang) => {
    const normalized = nextLang === "en" ? "en" : "vi";
    setLang(normalized);
    try {
      document.cookie = `${LANG_STORAGE_KEY}=${normalized}; path=/; max-age=31536000; SameSite=Lax`;
      window.localStorage.setItem(LANG_STORAGE_KEY, normalized);
    } catch {
      // ignore storage errors
    }
  };

  // Tự động nhận diện quốc gia qua IP (/api/geo) khi chưa có cookie & chưa có Cloudflare header (ví dụ chạy local)
  useEffect(() => {
    if (initialCountry) return undefined;

    let cancelled = false;
    fetch("/api/geo", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        if (data.lang === "vi" || data.lang === "en") {
          setLang(data.lang);
        }
      })
      .catch(() => {
        // giữ nguyên ngôn ngữ mặc định nếu offline
      });

    return () => {
      cancelled = true;
    };
  }, [initialCountry]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const scrollTo = (selector) => {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 80);
      setShowFloatPlane(window.scrollY > 650);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const revealEls = document.querySelectorAll(".nx-reveal");
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    revealEls.forEach((el) => revealObserver.observe(el));

    const contactEl = contactRef.current;
    let contactObserver;
    if (contactEl) {
      contactObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setContactInView(true);
            }
          });
        },
        { threshold: 0.2 },
      );
      contactObserver.observe(contactEl);
    }

    return () => {
      revealObserver.disconnect();
      if (contactObserver) contactObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const anyModalOpen =
      videoModalOpen ||
      productModalOpen ||
      galleryModalOpen ||
      Boolean(activeTrialPhotoId);
    document.body.style.overflow = anyModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [videoModalOpen, productModalOpen, galleryModalOpen, activeTrialPhotoId]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setVideoModalOpen(false);
        setProductModalOpen(false);
        setGalleryModalOpen(false);
        setActiveTrialPhotoId(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!videoModalOpen && modalVideoRef.current) {
      modalVideoRef.current.pause();
      modalVideoRef.current.currentTime = 0;
    }
  }, [videoModalOpen]);

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    const trimmed = leadEmail.trim();
    if (!trimmed) return;
    setToastMessage(t.contact.toastSuccess(trimmed));
    setLeadEmail("");
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastMessage(""), 5000);
  };

  return (
    <div className="nx-landing">
      {/* HERO / INTRO FILM */}
      <section className="nx-intro" id="intro">
        <div className="nx-intro-video-wrap" aria-hidden="true">
          <video
            className="nx-intro-video"
            src="/videos/nexlog-intro.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
        <div className="nx-intro-grid" />

        <div className="nx-topbar">
          <div className="nx-wrap nx-topbar-inner">
            <BrandLogo
              variant="dark"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#intro");
              }}
            />
            <nav className="nx-toplinks">
              <a
                href="#platform"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("#platform");
                }}
              >
                {t.nav.platform}
              </a>
              <a
                href="#journey"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("#journey");
                }}
              >
                {t.nav.journey}
              </a>
              <a
                href="#people"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("#people");
                }}
              >
                {t.nav.people}
              </a>
              <Link href="/blog">{t.nav.blog}</Link>
            </nav>
            <div className="nx-topbar-actions">
              <LanguageSwitch
                lang={lang}
                onChange={handleLanguageChange}
                variant="dark"
              />
              <button
                type="button"
                className="nx-top-cta"
                onClick={() => scrollTo("#contact")}
              >
                {t.nav.connect}&nbsp; ↗
              </button>
            </div>
          </div>
        </div>

        <div className="nx-intro-content">
          <div className="nx-intro-copy">
            <div className="nx-eyebrow">
              <span className="nx-dot" /> {t.hero.eyebrow}
            </div>
            <h1>
              {t.hero.titleLine1}
              <br />
              <em>{t.hero.titleLine2}</em>
            </h1>
            <p className="nx-intro-lead">{t.hero.lead}</p>
            <div className="nx-actions">
              <button
                type="button"
                className="nx-btn nx-btn-orange"
                onClick={() => setVideoModalOpen(true)}
              >
                ▶&nbsp; {t.hero.watchVideo}
              </button>
              <button
                type="button"
                className="nx-btn nx-btn-glass"
                onClick={() => scrollTo("#home")}
              >
                {t.hero.explore} <span className="nx-arrow">↘</span>
              </button>
            </div>
            <div className="nx-intro-meta">{t.hero.meta}</div>
          </div>

          <div className="nx-flight-visual" aria-hidden="true">
            <div className="nx-orbit" />
            <svg className="nx-route" viewBox="0 0 500 420">
              <path d="M40 290 C110 70 220 60 270 180 S385 340 462 105" />
              <circle cx="40" cy="290" r="5" />
              <circle cx="462" cy="105" r="5" />
            </svg>
            <div className="nx-plane-fly">✈</div>
            <div className="nx-orbit-core">
              <div className="nx-core-card">
                <div className="nx-tiny">{t.hero.cardTiny}</div>
                <strong>360°</strong>
                <span>{t.hero.cardSub}</span>
                <div className="nx-core-stat">
                  <span>{t.hero.cardStatLabel}</span>
                  <b>{t.hero.cardStatVal}</b>
                </div>
              </div>
            </div>
            <div className="nx-flight-label nx-label-a">
              {t.hero.originLabel} <b>{t.hero.originVal}</b>
            </div>
            <div className="nx-flight-label nx-label-b">
              {t.hero.destLabel} <b>{t.hero.destVal}</b>
            </div>
          </div>
        </div>

        <div className="nx-scroll-cue">
          <i /> {t.hero.scrollCue}
        </div>
      </section>

      {/* STICKY HEADER */}
      <header className={`nx-site-header ${isScrolled ? "scrolled" : ""}`}>
        <div className="nx-wrap nx-nav-inner">
          <BrandLogo
            variant="light"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("#intro");
            }}
          />
          <nav className="nx-nav-links">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#home");
              }}
            >
              {t.nav.overview}
            </a>
            <a
              href="#platform"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#platform");
              }}
            >
              {t.nav.platform}
            </a>
            <a
              href="#journey"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#journey");
              }}
            >
              {t.nav.journey}
            </a>
            <a
              href="#people"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#people");
              }}
            >
              {t.nav.customers}
            </a>
            <Link href="/blog">{t.nav.blog}</Link>
          </nav>
          <div className="nx-nav-actions">
            <LanguageSwitch
              lang={lang}
              onChange={handleLanguageChange}
              variant="light"
            />
            <Link href="/login" className="nx-nav-login">
              {t.nav.login}
            </Link>
            <button
              type="button"
              className="nx-nav-demo"
              onClick={() => setConsultationOpen(true)}
            >
              {t.nav.bookDemo} ↗
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* 01 — STATEMENT */}
        <section className="nx-statement" id="home">
          <div className="nx-wrap nx-statement-grid">
            <div className="nx-reveal nx-statement-left">
              <div>
                <div className="nx-kicker">{t.statement.kicker}</div>
                <div className="nx-statement-foot">
                  <b>01 / 04</b>
                  <span>{t.statement.footSub}</span>
                </div>
              </div>
              <div className="nx-statement-cta">
                <button
                  type="button"
                  className="nx-btn nx-btn-orange"
                  onClick={() => setConsultationOpen(true)}
                >
                  {t.statement.createOrderBtn} <span className="nx-arrow">↗</span>
                </button>
                <span className="nx-statement-cta-note">
                  {t.statement.createOrderNote}
                </span>
              </div>
            </div>
            <div className="nx-reveal">
              <h2>
                {t.statement.headlineBefore}
                <span>{t.statement.headlineHighlight}</span>
              </h2>
              <p className="nx-statement-copy">{t.statement.copy}</p>
            </div>
          </div>
        </section>

        {/* MARQUEE (under 01 / 04) */}
        <div className="nx-ticker" aria-label={t.marqueeAria}>
          <div className="nx-ticker-track">
            <span>
              ALS CARGO <i>✳</i> VIETNAM AIRLINES CARGO <i>✳</i> SAMSUNG
              ELECTRONICS VN <i>✳</i> LG DISPLAY HAI PHONG <i>✳</i> FOXCONN
              VIETNAM <i>✳</i> CANON VIETNAM <i>✳</i> SAIGON FREIGHT <i>✳</i>{" "}
              VIETAIR CARGO <i>✳</i> MEKONG LOGISTICS <i>✳</i> PACIFIC
              FORWARDING <i>✳</i>
            </span>
            <span>
              ALS CARGO <i>✳</i> VIETNAM AIRLINES CARGO <i>✳</i> SAMSUNG
              ELECTRONICS VN <i>✳</i> LG DISPLAY HAI PHONG <i>✳</i> FOXCONN
              VIETNAM <i>✳</i> CANON VIETNAM <i>✳</i> SAIGON FREIGHT <i>✳</i>{" "}
              VIETAIR CARGO <i>✳</i> MEKONG LOGISTICS <i>✳</i> PACIFIC
              FORWARDING <i>✳</i>
            </span>
          </div>
        </div>

        {/* 02 — PLATFORM */}
        <section className="nx-platform" id="platform">
          <div className="nx-wrap">
            <div className="nx-platform-head nx-reveal">
              <div>
                <div className="nx-kicker">{t.platform.kicker}</div>
                <h2>
                  {t.platform.headlineLine1}
                  <br />
                  <span style={{ color: "var(--blue)" }}>
                    {t.platform.headlineLine2}
                  </span>
                </h2>
              </div>
              <p>{t.platform.lead}</p>
            </div>

            <div className="nx-product-layout">
              <div className="nx-product-list nx-reveal">
                {products.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`nx-product-item ${activeProduct === item.id ? "active" : ""}`}
                    onClick={() => setActiveProduct(item.id)}
                  >
                    <span className="nx-product-icon">{item.icon}</span>
                    <span>
                      <small>{item.shortTag}</small>
                      <strong>{item.label}</strong>
                    </span>
                    <span className="nx-plus">↗</span>
                  </button>
                ))}
              </div>

              <div className="nx-product-stage nx-reveal">
                <div className="nx-stage-grid" />
                <button
                  type="button"
                  className="nx-stage-open"
                  onClick={() => setProductModalOpen(true)}
                  aria-label={t.platform.openDetailAria}
                >
                  ↗
                </button>
                <div className="nx-stage-overlay">
                  <div className="nx-stage-text">
                    <div className="nx-eyebrow">{currentProduct.tag}</div>
                    <h3>
                      {currentProduct.title.split("\n").map((line, idx) => (
                        <React.Fragment key={idx}>
                          {line}
                          {idx === 0 && <br />}
                        </React.Fragment>
                      ))}
                    </h3>
                    <p>{currentProduct.desc}</p>
                  </div>
                  <button
                    type="button"
                    className="nx-stage-chip"
                    onClick={() => setProductModalOpen(true)}
                  >
                    {t.platform.exploreModule}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 03 — JOURNEY */}
        <section className="nx-route-section" id="journey">
          <div className="nx-wrap">
            <div className="nx-route-intro nx-reveal">
              <div>
                <div className="nx-kicker">{t.journey.kicker}</div>
                <h2>
                  {t.journey.headlineLine1}
                  <br />
                  {t.journey.headlineLine2Before}
                  <em>{t.journey.headlineLine2Em}</em>
                </h2>
              </div>
              <p>{t.journey.lead}</p>
            </div>

            <button
              type="button"
              className="nx-plane-marker"
              onClick={() => setProductModalOpen(true)}
              aria-label={t.journey.planeAria}
            >
              <span>✈</span>
              <small>{t.journey.planeHint}</small>
            </button>

            <div className="nx-route-track nx-reveal">
              {t.journey.steps.map((step) => (
                <div className="nx-route-row" key={step.num}>
                  <div className="nx-num">{step.num}</div>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </div>
                  <div className="nx-micro">{step.micro}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 04 — PEOPLE */}
        <section className="nx-people" id="people">
          <div className="nx-wrap">
            <div className="nx-people-head nx-reveal">
              <div>
                <div className="nx-kicker">{t.people.kicker}</div>
                <h2>{t.people.headline}</h2>
              </div>
              <p>{t.people.lead}</p>
            </div>

            <div className="nx-people-grid nx-reveal">
              {t.people.cards.map((card, idx) => (
                <article className="nx-person-card" key={idx}>
                  <img loading="lazy" src={card.src} alt={card.alt} />
                  <div className="nx-caption">
                    <small>{card.tag}</small>
                    <strong>{card.title}</strong>
                  </div>
                </article>
              ))}
            </div>

            <div className="nx-people-cta nx-reveal">
              <button
                type="button"
                className="nx-btn nx-btn-outline"
                onClick={() => setGalleryModalOpen(true)}
              >
                {t.people.moreBtn} <span className="nx-arrow">↗</span>
              </button>
            </div>
          </div>
        </section>

        {/* FINAL SECTION — ENTERPRISE TRIAL PHOTOS POP OUT & FLY INWARD TO CENTER */}
        <section
          className={`nx-contact ${contactInView ? "in-view" : ""}`}
          id="contact"
          ref={contactRef}
        >
          <div
            className="nx-trial-orbit-layer"
            aria-label={t.contact.orbitAria}
          >
            {trials.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`nx-trial-card ${item.slotClass}`}
                onClick={() => setActiveTrialPhotoId(item.id)}
                aria-label={item.title}
              >
                <img src={item.src} alt={item.title} loading="lazy" />
                <div className="nx-trial-card-label">
                  <small>{item.badge}</small>
                  <strong>{item.title}</strong>
                </div>
              </button>
            ))}
          </div>

          <div className="nx-wrap nx-contact-inner">
            <div className="nx-kicker">{t.contact.kicker}</div>
            <h2>
              {t.contact.headlineLine1}
              <span>{t.contact.headlineLine2}</span>
            </h2>
            <p className="nx-contact-desc">{t.contact.desc}</p>
            <form className="nx-lead-form" onSubmit={handleLeadSubmit}>
              <input
                type="email"
                value={leadEmail}
                onChange={(e) => setLeadEmail(e.target.value)}
                placeholder={t.contact.emailPlaceholder}
                required
                aria-label={t.contact.emailAria}
              />
              <button type="submit">{t.contact.submitBtn}&nbsp; ↗</button>
            </form>
            <div className="nx-form-note">
              {t.contact.notePrefix}
              <button
                type="button"
                onClick={() => setConsultationOpen(true)}
                style={{
                  background: "none",
                  border: 0,
                  color: "#8bd5e5",
                  fontWeight: 700,
                  textDecoration: "underline",
                  padding: 0,
                }}
              >
                {t.contact.noteLink}
              </button>
              {t.contact.noteSuffixBefore}
              <b>{t.contact.noteSuffixBold}</b>
            </div>

            <div className="nx-trial-badge-row">
              <span className="nx-trial-pill">
                <span className="nx-dot" /> {t.contact.trialPill}
              </span>
            </div>

            <div className="nx-trial-mobile-grid">
              {trials.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  className="nx-trial-mobile-card"
                  style={{ "--delay": `${0.08 * (idx + 1)}s` }}
                  onClick={() => setActiveTrialPhotoId(item.id)}
                  aria-label={item.title}
                >
                  <img src={item.src} alt={item.title} loading="lazy" />
                  <div className="nx-trial-card-label">
                    <small>{item.badge}</small>
                    <strong>{item.title}</strong>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="nx-footer">
        <div className="nx-wrap">
          <div className="nx-footer-top">
            <BrandLogo
              variant="dark"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#intro");
              }}
            />
            <p>{t.footer.tagline}</p>
            <div className="nx-footer-links">
              <Link href="/blog">{t.nav.blog}</Link>
              <Link href="/login">{t.footer.portalLink}</Link>
            </div>
          </div>
          <div className="nx-footer-bottom">
            <span>{t.footer.copyright}</span>
            <span>{t.footer.motto}</span>
          </div>
        </div>
      </footer>

      {/* FLOATING PLANE BUTTON */}
      <button
        type="button"
        className={`nx-float-plane ${showFloatPlane ? "show" : ""}`}
        onClick={() => scrollTo("#platform")}
        aria-label={t.modals.floatPlaneAria}
      >
        ✈
      </button>

      {/* VIDEO MODAL */}
      {videoModalOpen && (
        <div
          className="nx-modal"
          role="dialog"
          aria-modal="true"
          aria-label={t.modals.videoAria}
          onClick={(e) => {
            if (e.target === e.currentTarget) setVideoModalOpen(false);
          }}
        >
          <div className="nx-modal-panel nx-video-panel">
            <button
              type="button"
              className="nx-modal-close"
              onClick={() => setVideoModalOpen(false)}
              aria-label={t.modals.closeAria}
            >
              ×
            </button>
            <video
              ref={modalVideoRef}
              src="/videos/nexlog-intro.mp4"
              controls
              autoPlay
              playsInline
            />
            <div className="nx-video-caption">
              <div className="nx-eyebrow">{t.modals.videoEyebrow}</div>
              <p>{t.modals.videoCaption}</p>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT DETAIL MODAL */}
      {productModalOpen && (
        <div
          className="nx-modal"
          role="dialog"
          aria-modal="true"
          aria-label={t.modals.productAria}
          onClick={(e) => {
            if (e.target === e.currentTarget) setProductModalOpen(false);
          }}
        >
          <div className="nx-modal-panel">
            <button
              type="button"
              className="nx-modal-close"
              onClick={() => setProductModalOpen(false)}
              aria-label={t.modals.closeAria}
            >
              ×
            </button>
            <div className="nx-product-modal-content">
              <div>
                <div className="nx-kicker">{t.modals.productEyebrow}</div>
                <h2>{currentProduct.modalTitle}</h2>
                <p>{currentProduct.modalIntro}</p>
              </div>
              <div className="nx-detail-list">
                {currentProduct.details.map(([num, title, desc]) => (
                  <div className="nx-detail-line" key={num}>
                    <b>{num}</b>
                    <div>
                      <strong>{title}</strong>
                      <span>{desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GALLERY POP-IN MODAL */}
      {galleryModalOpen && (
        <div
          className="nx-modal"
          role="dialog"
          aria-modal="true"
          aria-label={t.modals.galleryAria}
          onClick={(e) => {
            if (e.target === e.currentTarget) setGalleryModalOpen(false);
          }}
        >
          <div className="nx-modal-panel nx-gallery-panel">
            <button
              type="button"
              className="nx-modal-close"
              onClick={() => setGalleryModalOpen(false)}
              aria-label={t.modals.closeAria}
            >
              ×
            </button>
            <div
              className="nx-gallery-photo g1"
              data-label={trials[0].badge}
            >
              <img
                src="/images/trials/trial-1.jpg"
                alt={trials[0].title}
              />
            </div>
            <div
              className="nx-gallery-photo g2"
              data-label={trials[1].badge}
            >
              <img
                src="/images/trials/trial-2.jpg"
                alt={trials[1].title}
              />
            </div>
            <div
              className="nx-gallery-photo g3"
              data-label={trials[2].badge}
            >
              <img
                src="/images/trials/trial-3.jpg"
                alt={trials[2].title}
              />
            </div>
            <div
              className="nx-gallery-photo g4"
              data-label={trials[3].badge}
            >
              <img
                src="/images/trials/trial-4.jpg"
                alt={trials[3].title}
              />
            </div>
            <div className="nx-gallery-center">
              <div className="nx-eyebrow">{t.modals.galleryEyebrow}</div>
              <h2>
                {t.modals.galleryTitleLine1}
                <br />
                {t.modals.galleryTitleLine2}
              </h2>
              <p>{t.modals.galleryDesc}</p>
              <button
                type="button"
                className="nx-btn nx-btn-orange"
                onClick={() => {
                  setGalleryModalOpen(false);
                  scrollTo("#contact");
                }}
              >
                {t.modals.galleryCta}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ENTERPRISE TRIAL PHOTO LIGHTBOX */}
      {activeTrialPhoto && (
        <div
          className="nx-modal"
          role="dialog"
          aria-modal="true"
          aria-label={activeTrialPhoto.title}
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveTrialPhotoId(null);
          }}
        >
          <div className="nx-modal-panel nx-lightbox-panel">
            <button
              type="button"
              className="nx-modal-close"
              onClick={() => setActiveTrialPhotoId(null)}
              aria-label={t.modals.closeAria}
            >
              ×
            </button>
            <img src={activeTrialPhoto.src} alt={activeTrialPhoto.title} />
            <div className="nx-lightbox-caption">
              <div className="nx-eyebrow">{activeTrialPhoto.badge}</div>
              <h3>{activeTrialPhoto.title}</h3>
              <p>{activeTrialPhoto.desc}</p>
            </div>
          </div>
        </div>
      )}

      {/* CONSULTATION BOOKING MODAL */}
      {consultationOpen && (
        <ConsultationBookingModal
          open={consultationOpen}
          onCancel={() => setConsultationOpen(false)}
        />
      )}

      {/* SUCCESS TOAST */}
      <div className={`nx-success ${toastMessage ? "show" : ""}`}>
        <i>✓</i>
        <span>{toastMessage}</span>
      </div>
    </div>
  );
}
