/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ConsultationBookingModal from "@/src/components/home/ConsultationBookingModal";
import "./landing.css";

const PRODUCTS = [
  {
    id: 0,
    icon: "✈",
    shortTag: "01 / AIR CARGO",
    label: "Điều vận hàng không",
    tag: "01 / AIR CARGO OPERATIONS",
    title: "Điều vận\ntrong tầm nhìn.",
    desc: "Kết nối thông tin vận hành, lịch trình và trạng thái hàng hóa trên cùng một hành trình.",
    modalTitle: "Điều vận hàng không",
    modalIntro:
      "Tổ chức thông tin và các bước phối hợp trong hoạt động vận chuyển hàng không.",
    details: [
      [
        "01",
        "Thông tin chuyến & lô hàng",
        "Tập trung dữ liệu quan trọng để đội ngũ dễ theo dõi.",
      ],
      [
        "02",
        "Điều phối quy trình",
        "Hỗ trợ phối hợp giữa các bộ phận trong quá trình xử lý.",
      ],
      [
        "03",
        "Góc nhìn vận hành",
        "Giúp người phụ trách có thêm ngữ cảnh khi đưa ra quyết định.",
      ],
    ],
  },
  {
    id: 1,
    icon: "◎",
    shortTag: "02 / TRACK & TRACE",
    label: "Theo dõi vận đơn",
    tag: "02 / TRACK & TRACE",
    title: "Theo dõi từng\nchuyển động.",
    desc: "Tra cứu vận đơn và nắm bắt trạng thái lô hàng rõ ràng hơn trong suốt hành trình.",
    modalTitle: "Theo dõi vận đơn",
    modalIntro:
      "Đưa thông tin vận đơn đến gần hơn với người vận hành và khách hàng.",
    details: [
      ["01", "Tra cứu vận đơn", "Tìm kiếm nhanh theo mã HAWB / MAWB và mã đơn hàng."],
      [
        "02",
        "Trạng thái hành trình",
        "Theo dõi thông tin cập nhật theo từng chặng vận chuyển.",
      ],
      [
        "03",
        "Thông tin dự kiến",
        "Hiển thị mốc thời gian và các dữ liệu liên quan theo thời gian thực.",
      ],
    ],
  },
  {
    id: 2,
    icon: "▦",
    shortTag: "03 / WAREHOUSE",
    label: "Ga hàng hóa & kho vận",
    tag: "03 / WAREHOUSE & CARGO",
    title: "Vận hành kho\ncó kết nối.",
    desc: "Liên kết hoạt động tiếp nhận, phân loại, lưu kho và xử lý hàng hóa trong một luồng rõ ràng.",
    modalTitle: "Ga hàng hóa & kho vận",
    modalIntro:
      "Kết nối hoạt động tại nhà ga hàng hóa, kho và các điểm xử lý liên quan.",
    details: [
      [
        "01",
        "Tiếp nhận & phân loại",
        "Quản lý thông tin hàng hóa qua từng bước xử lý.",
      ],
      [
        "02",
        "Lưu kho thông minh",
        "Hỗ trợ quản lý hoạt động kho và dữ liệu hàng hóa chính xác.",
      ],
      [
        "03",
        "Luồng xử lý liền mạch",
        "Tạo sự đồng bộ giữa nhà ga, kho bãi và đội ngũ giao nhận.",
      ],
    ],
  },
  {
    id: 3,
    icon: "⇢",
    shortTag: "04 / TRANSPORT",
    label: "Vận tải & kết nối",
    tag: "04 / TRANSPORT & CONNECTIVITY",
    title: "Mọi chặng đường\ncùng một nhịp.",
    desc: "Kết nối vận tải và thông tin giao nhận để hành trình hàng hóa được theo dõi xuyên suốt hơn.",
    modalTitle: "Vận tải & kết nối",
    modalIntro:
      "Tạo liên kết giữa các chặng vận chuyển và các điểm giao nhận trong chuỗi logistics.",
    details: [
      [
        "01",
        "Kết nối điểm đi – đến",
        "Làm rõ các điểm trung chuyển trong hành trình.",
      ],
      [
        "02",
        "Thông tin vận tải",
        "Tập trung thông tin phục vụ điều phối đội xe và giám sát.",
      ],
      [
        "03",
        "Chứng từ & đối soát",
        "Liên kết với các thông tin tra cứu, chứng từ và hóa đơn.",
      ],
    ],
  },
];

const JOURNEY_STEPS = [
  {
    num: "01",
    title: "Tiếp nhận & điều phối",
    desc: "Tổ chức thông tin lô hàng, lịch trình và nhu cầu vận chuyển.",
    micro: "PLAN / BOOK",
  },
  {
    num: "02",
    title: "Vận hành & giám sát",
    desc: "Theo dõi trạng thái vận đơn, hoạt động ga hàng hóa và các điểm trung chuyển.",
    micro: "OPERATE / TRACK",
  },
  {
    num: "03",
    title: "Kho vận & giao nhận",
    desc: "Kết nối hoạt động lưu kho, vận tải và thông tin giao nhận trên hành trình.",
    micro: "WAREHOUSE / DELIVER",
  },
  {
    num: "04",
    title: "Đối soát & minh bạch",
    desc: "Hỗ trợ tra cứu chứng từ, hóa đơn và thông tin cần thiết cho khách hàng.",
    micro: "REVIEW / COMPLETE",
  },
];

const ENTERPRISE_TRIALS = [
  {
    id: "tc-1",
    slotClass: "nx-tc-1",
    src: "/images/trials/trial-1.jpg",
    badge: "PILOT · SAIGON FREIGHT",
    title: "Đội ngũ điều vận dùng thử",
    desc: "Nhóm điều phối của doanh nghiệp logistics trải nghiệm bảng điều khiển tuyến vận tải NEXLOG trong buổi dùng thử thực tế.",
  },
  {
    id: "tc-2",
    slotClass: "nx-tc-2",
    src: "/images/trials/trial-2.jpg",
    badge: "DEMO · VIETAIR CARGO",
    title: "Trải nghiệm theo dõi vận đơn",
    desc: "Giám đốc chuỗi cung ứng kiểm thử luồng theo dõi vận đơn hàng không và cảnh báo trạng thái trực tiếp cùng chuyên gia NEXLOG.",
  },
  {
    id: "tc-3",
    slotClass: "nx-tc-3",
    src: "/images/trials/trial-3.jpg",
    badge: "TRIAL · SGN CARGO HUB",
    title: "Thử nghiệm quản lý kho vận",
    desc: "Quản lý kho hàng kiểm tra thao tác tiếp nhận và đối soát hàng hóa trên thiết bị di động ngay tại ga hàng hóa.",
  },
  {
    id: "tc-4",
    slotClass: "nx-tc-4",
    src: "/images/trials/trial-4.jpg",
    badge: "WORKSHOP · MEKONG LOGISTICS",
    title: "Buổi onboarding doanh nghiệp",
    desc: "Các doanh nghiệp đối tác tham gia phiên trải nghiệm thực tế và đóng góp phản hồi trực tiếp cho đội ngũ sản phẩm NEXLOG.",
  },
  {
    id: "tc-5",
    slotClass: "nx-tc-5",
    src: "/images/trials/trial-5.jpg",
    badge: "CONTROL TOWER · ASIALINK",
    title: "Vận hành thử trung tâm điều phối",
    desc: "Kiểm thử màn hình trung tâm điều phối đa tuyến theo thời gian thực để đánh giá tốc độ phản ứng vận hành.",
  },
  {
    id: "tc-6",
    slotClass: "nx-tc-6",
    src: "/images/trials/trial-6.jpg",
    badge: "PARTNER · PACIFIC FORWARDING",
    title: "Hợp tác triển khai thực tế",
    desc: "Đại diện doanh nghiệp hoàn tất phiên dùng thử sản phẩm và thống nhất lộ trình kết nối hệ thống cùng NEXLOG.",
  },
];

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

export default function HomePage() {
  const [activeProduct, setActiveProduct] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showFloatPlane, setShowFloatPlane] = useState(false);

  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [activeTrialPhoto, setActiveTrialPhoto] = useState(null);
  const [consultationOpen, setConsultationOpen] = useState(false);

  const [contactInView, setContactInView] = useState(false);
  const [leadEmail, setLeadEmail] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const contactRef = useRef(null);
  const modalVideoRef = useRef(null);
  const toastTimerRef = useRef(null);

  const currentProduct = PRODUCTS[activeProduct];

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
      Boolean(activeTrialPhoto);
    document.body.style.overflow = anyModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [videoModalOpen, productModalOpen, galleryModalOpen, activeTrialPhoto]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setVideoModalOpen(false);
        setProductModalOpen(false);
        setGalleryModalOpen(false);
        setActiveTrialPhoto(null);
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
    setToastMessage(
      `Cảm ơn bạn! Email ${trimmed} đã được ghi nhận — đội ngũ NEXLOG sẽ sớm liên hệ.`,
    );
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
                Hệ thống
              </a>
              <a
                href="#journey"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("#journey");
                }}
              >
                Giải pháp
              </a>
              <a
                href="#people"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("#people");
                }}
              >
                Con người
              </a>
              <Link href="/blog">Tin tức</Link>
            </nav>
            <button
              type="button"
              className="nx-top-cta"
              onClick={() => scrollTo("#contact")}
            >
              Kết nối với chúng tôi&nbsp; ↗
            </button>
          </div>
        </div>

        <div className="nx-intro-content">
          <div className="nx-intro-copy">
            <div className="nx-eyebrow">
              <span className="nx-dot" /> SMART LOGISTICS EXPERIENCE · 01 / 04
            </div>
            <h1>
              Every move.
              <br />
              <em>In sync.</em>
            </h1>
            <p className="nx-intro-lead">
              Một hệ thống. Một góc nhìn xuyên suốt. NEXLOG kết nối các mắt xích
              logistics hàng không để mỗi chuyển động trở nên rõ ràng và chủ
              động hơn.
            </p>
            <div className="nx-actions">
              <button
                type="button"
                className="nx-btn nx-btn-orange"
                onClick={() => setVideoModalOpen(true)}
              >
                ▶&nbsp; Xem video giới thiệu
              </button>
              <button
                type="button"
                className="nx-btn nx-btn-glass"
                onClick={() => scrollTo("#home")}
              >
                Khám phá NEXLOG <span className="nx-arrow">↘</span>
              </button>
            </div>
            <div className="nx-intro-meta">A clearer way to move cargo</div>
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
                <div className="nx-tiny">Cargo control tower</div>
                <strong>360°</strong>
                <span>One connected view</span>
                <div className="nx-core-stat">
                  <span>VISIBILITY</span>
                  <b>● LIVE</b>
                </div>
              </div>
            </div>
            <div className="nx-flight-label nx-label-a">
              ORIGIN <b>SGN · VIETNAM</b>
            </div>
            <div className="nx-flight-label nx-label-b">
              DESTINATION <b>GLOBAL NETWORK</b>
            </div>
          </div>
        </div>

        <div className="nx-scroll-cue">
          <i /> Scroll to explore
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
              Tổng quan
            </a>
            <a
              href="#platform"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#platform");
              }}
            >
              Hệ thống
            </a>
            <a
              href="#journey"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#journey");
              }}
            >
              Giải pháp
            </a>
            <a
              href="#people"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#people");
              }}
            >
              Khách hàng
            </a>
            <Link href="/blog">Tin tức</Link>
          </nav>
          <div className="nx-nav-actions">
            <Link href="/login" className="nx-nav-login">
              Đăng nhập
            </Link>
            <button
              type="button"
              className="nx-nav-demo"
              onClick={() => setConsultationOpen(true)}
            >
              ĐẶT LỊCH TƯ VẤN ↗
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
                <div className="nx-kicker">01 — THE BIG PICTURE</div>
                <div className="nx-statement-foot">
                  <b>01 / 04</b>
                  <span>From complexity to clarity</span>
                </div>
              </div>
              <div className="nx-statement-cta">
                <button
                  type="button"
                  className="nx-btn nx-btn-orange"
                  onClick={() => setConsultationOpen(true)}
                >
                  + Tạo đơn vận chuyển <span className="nx-arrow">↗</span>
                </button>
                <span className="nx-statement-cta-note">
                  Gửi yêu cầu trực tuyến &amp; nhận báo giá nhanh
                </span>
              </div>
            </div>
            <div className="nx-reveal">
              <h2>
                Logistics không chỉ là di chuyển. Đó là{" "}
                <span>kết nối mọi quyết định.</span>
              </h2>
              <p className="nx-statement-copy">
                Từ điều vận hàng không, theo dõi vận đơn đến hoạt động kho vận
                và vận tải — NEXLOG hướng tới việc đưa dữ liệu, quy trình và con
                người về cùng một nhịp vận hành.
              </p>
            </div>
          </div>
        </section>

        {/* MARQUEE (moved under 01 / 04) */}
        <div
          className="nx-ticker"
          aria-label="Khách hàng, nhãn hàng và đối tác hợp tác cùng NEXLOG"
        >
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
                <div className="nx-kicker">02 — EXPLORE THE PLATFORM</div>
                <h2>
                  Một hệ thống.
                  <br />
                  <span style={{ color: "var(--blue)" }}>Nhiều điểm chạm.</span>
                </h2>
              </div>
              <p>
                Chọn một điểm trên hành trình để khám phá cách NEXLOG hỗ trợ
                từng mắt xích trong hoạt động logistics.
              </p>
            </div>

            <div className="nx-product-layout">
              <div className="nx-product-list nx-reveal">
                {PRODUCTS.map((item) => (
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
                  aria-label="Xem chi tiết giải pháp"
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
                    EXPLORE MODULE ↗
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
                <div className="nx-kicker">03 — ONE CONNECTED JOURNEY</div>
                <h2>
                  Điểm chạm nào
                  <br />
                  cũng có <em>ý nghĩa.</em>
                </h2>
              </div>
              <p>
                NEXLOG kết nối những hoạt động thường ngày thành một dòng chảy
                thống nhất — từ lúc tiếp nhận thông tin, xử lý hàng hóa đến khi
                hoàn tất vận chuyển.
              </p>
            </div>

            <button
              type="button"
              className="nx-plane-marker"
              onClick={() => setProductModalOpen(true)}
              aria-label="Mở thông tin sản phẩm"
            >
              <span>✈</span>
              <small>CHẠM ĐỂ KHÁM PHÁ</small>
            </button>

            <div className="nx-route-track nx-reveal">
              {JOURNEY_STEPS.map((step) => (
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
                <div className="nx-kicker">04 — PEOPLE BEHIND EVERY MOVE</div>
                <h2>Công nghệ tốt bắt đầu từ những con người thật.</h2>
              </div>
              <p>
                Một hệ thống chỉ thực sự có giá trị khi giúp đội ngũ phối hợp
                tốt hơn trong từng quyết định mỗi ngày.
              </p>
            </div>

            <div className="nx-people-grid nx-reveal">
              <article className="nx-person-card">
                <img
                  loading="lazy"
                  src="/images/trials/trial-1.jpg"
                  alt="Nhân sự vận hành theo dõi hoạt động hàng hóa"
                />
                <div className="nx-caption">
                  <small>OPERATIONS TEAM</small>
                  <strong>Nhìn rõ từng mắt xích</strong>
                </div>
              </article>
              <article className="nx-person-card">
                <img
                  loading="lazy"
                  src="/images/trials/trial-2.jpg"
                  alt="Nhân viên điều phối theo dõi dữ liệu vận chuyển"
                />
                <div className="nx-caption">
                  <small>CONTROL &amp; VISIBILITY</small>
                  <strong>Chủ động trong điều phối</strong>
                </div>
              </article>
              <article className="nx-person-card">
                <img
                  loading="lazy"
                  src="/images/trials/trial-3.jpg"
                  alt="Nhân sự làm việc tại nhà ga hàng hóa"
                />
                <div className="nx-caption">
                  <small>CARGO HANDLING</small>
                  <strong>Vận hành liền mạch</strong>
                </div>
              </article>
            </div>

            <div className="nx-people-cta nx-reveal">
              <button
                type="button"
                className="nx-btn nx-btn-outline"
                onClick={() => setGalleryModalOpen(true)}
              >
                Xem thêm câu chuyện doanh nghiệp{" "}
                <span className="nx-arrow">↗</span>
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
          {/* Desktop / Wide Orbiting Enterprise Trial Photos */}
          <div
            className="nx-trial-orbit-layer"
            aria-label="Hình ảnh các doanh nghiệp đến dùng thử sản phẩm NEXLOG"
          >
            {ENTERPRISE_TRIALS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`nx-trial-card ${item.slotClass}`}
                onClick={() => setActiveTrialPhoto(item)}
                aria-label={`Xem ảnh dùng thử: ${item.title}`}
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
            <div className="nx-kicker">YOUR NEXT MOVE STARTS HERE</div>
            <h2>
              LET ME BE<span>YOUR NEXLOG.</span>
            </h2>
            <p className="nx-contact-desc">
              Cùng các doanh nghiệp tiên phong trải nghiệm trực tiếp hệ thống
              NEXLOG. Chia sẻ email doanh nghiệp của bạn để đặt lịch dùng thử
              sản phẩm.
            </p>
            <form className="nx-lead-form" onSubmit={handleLeadSubmit}>
              <input
                type="email"
                value={leadEmail}
                onChange={(e) => setLeadEmail(e.target.value)}
                placeholder="Nhập email của bạn (ví dụ: name@company.com)"
                required
                aria-label="Email doanh nghiệp"
              />
              <button type="submit">ĐĂNG KÝ DÙNG THỬ&nbsp; ↗</button>
            </form>
            <div className="nx-form-note">
              Hoặc{" "}
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
                đặt lịch tư vấn chi tiết ngay tại đây
              </button>{" "}
              cho <b>hành trình của bạn.</b>
            </div>

            <div className="nx-trial-badge-row">
              <span className="nx-trial-pill">
                <span className="nx-dot" /> ENTERPRISE TRIALS · CÁC DOANH NGHIỆP
                TRẢI NGHIỆM NEXLOG
              </span>
            </div>

            {/* Responsive pop-in grid for Tablet / Mobile */}
            <div className="nx-trial-mobile-grid">
              {ENTERPRISE_TRIALS.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  className="nx-trial-mobile-card"
                  style={{ "--delay": `${0.08 * (idx + 1)}s` }}
                  onClick={() => setActiveTrialPhoto(item)}
                  aria-label={`Xem ảnh dùng thử: ${item.title}`}
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
            <p>
              NEXLOG — Smart logistics. Clearer decisions. Better connected
              journeys.
            </p>
            <div className="nx-footer-links">
              <Link href="/blog">Tin tức</Link>
              <Link href="/login">Cổng hệ thống ↗</Link>
            </div>
          </div>
          <div className="nx-footer-bottom">
            <span>© 2026 NEXLOG · SMART LOGISTICS PLATFORM</span>
            <span>DESIGNED TO MOVE FORWARD</span>
          </div>
        </div>
      </footer>

      {/* FLOATING PLANE BUTTON */}
      <button
        type="button"
        className={`nx-float-plane ${showFloatPlane ? "show" : ""}`}
        onClick={() => scrollTo("#platform")}
        aria-label="Khám phá giải pháp"
      >
        ✈
      </button>

      {/* VIDEO MODAL */}
      {videoModalOpen && (
        <div
          className="nx-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Video giới thiệu NEXLOG"
          onClick={(e) => {
            if (e.target === e.currentTarget) setVideoModalOpen(false);
          }}
        >
          <div className="nx-modal-panel nx-video-panel">
            <button
              type="button"
              className="nx-modal-close"
              onClick={() => setVideoModalOpen(false)}
              aria-label="Đóng"
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
              <div className="nx-eyebrow">NEXLOG · INTRO FILM</div>
              <p>
                Trải nghiệm tổng quan về hệ sinh thái điều vận và logistics
                thông minh NEXLOG.
              </p>
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
          aria-label="Thông tin giải pháp"
          onClick={(e) => {
            if (e.target === e.currentTarget) setProductModalOpen(false);
          }}
        >
          <div className="nx-modal-panel">
            <button
              type="button"
              className="nx-modal-close"
              onClick={() => setProductModalOpen(false)}
              aria-label="Đóng"
            >
              ×
            </button>
            <div className="nx-product-modal-content">
              <div>
                <div className="nx-kicker">NEXLOG PLATFORM</div>
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
          aria-label="Câu chuyện doanh nghiệp dùng thử"
          onClick={(e) => {
            if (e.target === e.currentTarget) setGalleryModalOpen(false);
          }}
        >
          <div className="nx-modal-panel nx-gallery-panel">
            <button
              type="button"
              className="nx-modal-close"
              onClick={() => setGalleryModalOpen(false)}
              aria-label="Đóng"
            >
              ×
            </button>
            <div
              className="nx-gallery-photo g1"
              data-label="PILOT · SAIGON FREIGHT"
            >
              <img
                src="/images/trials/trial-1.jpg"
                alt="Doanh nghiệp trải nghiệm NEXLOG"
              />
            </div>
            <div
              className="nx-gallery-photo g2"
              data-label="DEMO · VIETAIR CARGO"
            >
              <img
                src="/images/trials/trial-2.jpg"
                alt="Doanh nghiệp theo dõi vận đơn"
              />
            </div>
            <div
              className="nx-gallery-photo g3"
              data-label="TRIAL · SGN CARGO HUB"
            >
              <img
                src="/images/trials/trial-3.jpg"
                alt="Thử nghiệm quản lý kho vận"
              />
            </div>
            <div
              className="nx-gallery-photo g4"
              data-label="WORKSHOP · MEKONG LOGISTICS"
            >
              <img
                src="/images/trials/trial-4.jpg"
                alt="Đối tác doanh nghiệp NEXLOG"
              />
            </div>
            <div className="nx-gallery-center">
              <div className="nx-eyebrow">PEOPLE · PROCESS · PROGRESS</div>
              <h2>
                Better connected.
                <br />
                Better together.
              </h2>
              <p>
                Những khoảnh khắc thực tế khi các doanh nghiệp vận tải &amp;
                logistics đến trải nghiệm và đồng hành cùng NEXLOG.
              </p>
              <button
                type="button"
                className="nx-btn nx-btn-orange"
                onClick={() => {
                  setGalleryModalOpen(false);
                  scrollTo("#contact");
                }}
              >
                Bắt đầu câu chuyện của bạn ↗
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
            if (e.target === e.currentTarget) setActiveTrialPhoto(null);
          }}
        >
          <div className="nx-modal-panel nx-lightbox-panel">
            <button
              type="button"
              className="nx-modal-close"
              onClick={() => setActiveTrialPhoto(null)}
              aria-label="Đóng"
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
