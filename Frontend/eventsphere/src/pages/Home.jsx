import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Users,
  Code,
  Music,
  Trophy,
  Zap,
  Lightbulb,
  CalendarDays,
  MapPin,
  UserPlus,
  Search,
  MousePointerClick,
  BarChart3,
  LayoutDashboard,
  Bell,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import hackathon from "../assets/hackathon.png";
import API_URL from "../api";
import AnimatedSection from "../components/AnimatedSection";

const FALLBACK_HERO_EVENTS = [
  {
    _id: "fallback-hackathon",
    eventName: "Hackathon Sprint 2026",
    shortDescription: "Build fast, collaborate hard, and pitch ambitious ideas in a 24-hour coding sprint.",
    category: "Technical",
    venue: "Main Auditorium",
    date: "2026-03-25",
    time: "09:00",
    registeredUsers: 180,
    totalCapacity: 250,
    eventImage: hackathon,
    isFeatured: true,
  },
  {
    _id: "fallback-cultural",
    eventName: "Cultural Night",
    shortDescription: "A vibrant evening of music, performance, and campus creativity.",
    category: "Cultural",
    venue: "Open Amphitheatre",
    date: "2026-04-10",
    time: "18:30",
    registeredUsers: 320,
    totalCapacity: 500,
    eventImage: hackathon,
    isTrending: true,
  },
  {
    _id: "fallback-ai",
    eventName: "AI Workshop",
    shortDescription: "Hands-on sessions covering ML basics, models, and practical demos.",
    category: "Workshop",
    venue: "CS Lab Block B",
    date: "2026-04-05",
    time: "11:00",
    registeredUsers: 95,
    totalCapacity: 120,
    eventImage: hackathon,
  },
  {
    _id: "fallback-sports",
    eventName: "Intercollege Sports Meet",
    shortDescription: "Competitive team events and high-energy participation across multiple sports.",
    category: "Sports",
    venue: "College Sports Ground",
    date: "2026-04-18",
    time: "08:00",
    registeredUsers: 210,
    totalCapacity: 300,
    eventImage: hackathon,
  },
];

const CATEGORY_CARDS = [
  {
    title: "Technical",
    category: "Technical",
    description: "Coding contests and product innovation.",
    bg: "bg-[#e9e7fc]",
    icon: Code,
  },
  {
    title: "Cultural",
    category: "Cultural",
    description: "Dance, music, and creative performances.",
    bg: "bg-[#F3D7D2]",
    icon: Music,
  },
  {
    title: "Sports",
    category: "Sports",
    description: "Competition, teamwork, and campus energy.",
    bg: "bg-[#D8E8D1]",
    icon: Trophy,
  },
  {
    title: "Workshops",
    category: "Workshop",
    description: "Skill-building sessions led by experts.",
    bg: "bg-[#EEEAE4]",
    icon: Lightbulb,
  },
  {
    title: "Hackathons",
    category: "Hackathon",
    description: "Rapid build challenges for ambitious teams.",
    bg: "bg-[#ECEBFF]",
    icon: Zap,
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    icon: UserPlus,
    step: "STEP 01",
    title: "Create Account",
    desc: "Sign up using your student credentials.",
    bg: "bg-[#D8E8D1]",
  },
  {
    icon: Search,
    step: "STEP 02",
    title: "Explore Events",
    desc: "Browse trending events and open complete details instantly.",
    bg: "bg-[#EED8D6]",
  },
  {
    icon: MousePointerClick,
    step: "STEP 03",
    title: "Register Instantly",
    desc: "Reserve your seat with a simple, fast registration flow.",
    bg: "bg-[#EDEBE8]",
  },
  {
    icon: BarChart3,
    step: "STEP 04",
    title: "Participate and Track",
    desc: "Manage registrations and event activity from your dashboard.",
    bg: "bg-[#F4F4F4]",
  },
];

const STUDENT_BENEFITS = [
  {
    title: "Smart Dashboard",
    desc: "Access registrations, schedules, and updates in one place.",
    border: "border-t-[#9B96E5]",
    icon: LayoutDashboard,
  },
  {
    title: "Seamless Registration",
    desc: "Join events quickly without long or confusing forms.",
    border: "border-t-[#F08A6C]",
    icon: Zap,
  },
  {
    title: "Real-Time Updates",
    desc: "Get reminders and important changes the moment they happen.",
    border: "border-t-[#D8E8D1]",
    icon: Bell,
  },
  {
    title: "Secure and Reliable",
    desc: "Modern architecture keeps student data protected and accessible.",
    border: "border-t-[#EED8D6]",
    icon: ShieldCheck,
  },
];

const resolveEventImage = (image) => {
  if (!image) return hackathon;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("/")) return `${API_URL.replace(/\/api$/, "")}${image}`;

  return image;
};

const getEventDateObject = (event) => {
  const parsed = new Date(`${event.date} ${event.time || ""}`);
  if (!Number.isNaN(parsed.getTime())) return parsed;

  const fallback = new Date(event.date);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
};

const formatEventDate = (event) => {
  const eventDate = getEventDateObject(event);

  if (!eventDate) return event.date || "Date to be announced";

  return eventDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const truncateText = (text, limit) => {
  if (!text) return "Details will be announced soon.";
  if (text.length <= limit) return text;

  return `${text.slice(0, limit).trim()}...`;
};

const normalizeHeroEvent = (event, fallback) => ({
  _id: event._id || fallback._id,
  eventName: event.eventName || fallback.eventName,
  shortDescription: event.shortDescription || fallback.shortDescription,
  category: event.category || fallback.category,
  venue: event.venue || fallback.venue,
  date: event.date || fallback.date,
  time: event.time || fallback.time,
  registeredUsers: Number(event.registeredUsers) || fallback.registeredUsers,
  totalCapacity: Number(event.totalCapacity) || fallback.totalCapacity,
  eventImage: resolveEventImage(event.eventImage || fallback.eventImage),
  isFeatured: Boolean(event.isFeatured),
  isTrending: Boolean(event.isTrending),
});

const buildHeroEvents = (events) => {
  const prioritized = [...events].sort((left, right) => {
    const featuredDiff = Number(Boolean(right.isFeatured)) - Number(Boolean(left.isFeatured));
    if (featuredDiff !== 0) return featuredDiff;

    const trendingDiff = Number(Boolean(right.isTrending)) - Number(Boolean(left.isTrending));
    if (trendingDiff !== 0) return trendingDiff;

    const leftTime = getEventDateObject(left)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    const rightTime = getEventDateObject(right)?.getTime() ?? Number.MAX_SAFE_INTEGER;

    return leftTime - rightTime;
  });

  const selected = prioritized
    .slice(0, 4)
    .map((event, index) => normalizeHeroEvent(event, FALLBACK_HERO_EVENTS[index]));

  while (selected.length < 4) {
    const fallback = FALLBACK_HERO_EVENTS[selected.length % FALLBACK_HERO_EVENTS.length];
    selected.push({
      ...fallback,
      _id: `${fallback._id}-${selected.length}`,
      eventImage: resolveEventImage(fallback.eventImage),
    });
  }

  return selected;
};

export default function Home() {
  const navigate = useNavigate();
  const [heroEvents, setHeroEvents] = useState(FALLBACK_HERO_EVENTS);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  const handleCategoryClick = (category) => {
    navigate(`/events?category=${category}`);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchHeroEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/events`);

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();

        if (isMounted && Array.isArray(data) && data.length > 0) {
          setHeroEvents(buildHeroEvents(data));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchHeroEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (heroEvents.length < 2) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveHeroIndex((currentIndex) => (currentIndex + 1) % heroEvents.length);
    }, 3200);

    return () => window.clearInterval(intervalId);
  }, [heroEvents.length]);

  const primarySpotlight = heroEvents[0] || FALLBACK_HERO_EVENTS[0];
  const secondarySpotlights = heroEvents.slice(1, 3);
  const stackedHeroEvents = heroEvents
    .map((event, index) => ({
      event,
      offset: (index - activeHeroIndex + heroEvents.length) % heroEvents.length,
    }))
    .sort((left, right) => right.offset - left.offset);

  return (
    <>
      {/* home-wrapper: pseudo-element grid/glow + keyframes live in index.css */}
      <div className="home-wrapper text-[#3F3D56]">
        <Navbar />

        {/* ================= HERO ================= */}
        <section className="home-hero-section flex min-h-[calc(100vh-84px)] items-center py-10 lg:py-14">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="home-hero-layout gap-10 lg:gap-14">
              <AnimatedSection>
                <div className="home-hero-copy max-w-[640px]">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[#6E69AA] shadow-sm">
                    <Sparkles size={14} />
                    Live Campus Calendar
                  </span>

                  <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] text-[#2F2C44] sm:text-6xl lg:text-[72px]">
                    Discover,
                    <br />
                    Register, and
                    <br />
                    Experience Events
                    <br />
                    <span className="text-[#9B96E5]">Seamlessly</span>
                  </h1>

                  <p className="mt-6 max-w-[580px] text-base leading-[1.9] text-[#646279] sm:text-lg">
                    Explore trending campus events, register faster, and stay connected through one polished student-first platform.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      to="/events"
                      className="inline-flex items-center gap-2 rounded-[18px] bg-[#F08A6C] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(240,138,108,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_28px_rgba(240,138,108,0.35)] sm:text-base"
                    >
                      Explore Events
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.08}>
                <div className="home-hero-showcase px-1 sm:px-2">
                  <div className="home-hero-stack-scene">
                    <div className="home-hero-stack-stage">
                      {stackedHeroEvents.map(({ event, offset }) => (
                        <Link
                          key={event._id}
                          to={`/events/${event._id}`}
                          className={`home-hero-stack-deck-card overflow-hidden rounded-[28px] border border-white/85 bg-white shadow-[0_18px_35px_rgba(55,42,88,0.18)] ${offset === 0 ? "is-active" : "pointer-events-none"}`}
                          style={{
                            "--card-offset": offset,
                            zIndex: heroEvents.length - offset,
                          }}
                        >
                          <div className="relative h-[250px] overflow-hidden sm:h-[300px]">
                            <img
                              src={event.eventImage}
                              alt={event.eventName}
                              className="h-full w-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                            <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#4F4A7D]">
                              {event.category}
                            </span>

                            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                              <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/75">
                                {formatEventDate(event)}
                              </p>
                              <h3 className="mt-2 text-2xl font-bold leading-tight">{event.eventName}</h3>
                            </div>
                          </div>

                          <div className="p-5">
                            <p className="min-h-[48px] text-sm leading-relaxed text-[#68667D] sm:text-[15px]">
                              {truncateText(event.shortDescription, 88)}
                            </p>

                            <div className="mt-4 space-y-2 text-sm text-[#4C4963]">
                              <div className="flex items-center gap-2">
                                <MapPin size={15} className="text-[#F08A6C]" />
                                <span className="truncate">{event.venue}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users size={15} className="text-[#8B86D2]" />
                                <span>{event.registeredUsers}/{event.totalCapacity} registered</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>

                    <div className="mt-5 flex justify-center gap-2">
                      {heroEvents.map((event, index) => (
                        <span
                          key={`${event._id}-dot`}
                          className={`h-2.5 rounded-full transition-all duration-300 ${index === activeHeroIndex ? "w-8 bg-[#8D88D4]" : "w-2.5 bg-[#D8D4F1]"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* ================= BROWSE CATEGORIES ================= */}
        <AnimatedSection delay={0.04}>
          <section className="py-12 lg:py-16">
            <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10">

              <div className="relative mb-16 text-center lg:mb-20">
                <h2 className="section-underline mb-4 text-[38px] font-extrabold leading-tight tracking-tight text-[#3F3D56] sm:text-[48px]">
                  Browse Categories
                </h2>
                <p className="mx-auto max-w-[600px] text-base leading-relaxed text-[#6B6A80] sm:text-lg">
                  Find events that match your interests and campus energy.
                </p>
              </div>

              <div className="home-category-grid mt-10">
                {CATEGORY_CARDS.map(({ title, category, description, bg, icon: Icon }) => (
                  <button
                    key={category}
                    type="button"
                    className={`home-category-card h-[240px] rounded-[28px] px-[30px] py-10 text-center shadow-[0_6px_14px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_22px_rgba(0,0,0,0.06)] ${bg}`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    <Icon size={24} className="mx-auto mb-[22px] h-10 w-10 rounded-full bg-white p-[7px] text-[#3F3D56] shadow-[0_4px_10px_rgba(0,0,0,0.06)]" strokeWidth={2.2} />
                    <h3 className="mb-2 text-xl font-semibold text-[#3F3D56]">{title}</h3>
                    <p className="mx-auto max-w-[170px] text-sm leading-snug text-[#6B6A80]">{description}</p>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* ================= TRENDING EVENTS ================= */}
        <AnimatedSection delay={0.05}>
          <section className="py-12 lg:py-16">
            <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10">

              <div className="relative mb-16 text-center lg:mb-20">
                <h2 className="section-underline mb-4 text-[38px] font-extrabold leading-tight tracking-tight text-[#3F3D56] sm:text-[48px]">
                  Trending Events
                </h2>
                <p className="mx-auto max-w-[600px] text-base leading-relaxed text-[#6B6A80] sm:text-lg">
                  Explore the most popular events happening across campus right now.
                </p>
              </div>

              {/* trending-grid: 1.5fr/1fr cannot be expressed in standard Tailwind — kept in index.css */}
              <div className="trending-grid items-stretch gap-[30px]">

                <div className="flex min-h-[500px] flex-col justify-between rounded-[30px] border border-white/85 bg-white/80 p-6 shadow-[0_18px_45px_rgba(60,45,95,0.1)] backdrop-blur-sm sm:p-8">
                  <div>
                    <div className="relative overflow-hidden rounded-[24px]">
                      <img
                        src={primarySpotlight.eventImage}
                        alt={primarySpotlight.eventName}
                        className="h-[260px] w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <span className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#5A558B]">
                        {primarySpotlight.category}
                      </span>
                    </div>

                    <h3 className="mt-6 text-[28px] font-bold text-[#3F3D56]">{primarySpotlight.eventName}</h3>
                    <p className="mt-3 text-base leading-relaxed text-[#6B6A80]">
                      {truncateText(primarySpotlight.shortDescription, 150)}
                    </p>
                  </div>

                  <div className="mt-6">
                    <div className="flex flex-col gap-3.5 text-[15px]">
                      <div className="flex items-center gap-2.5 text-[#5E5D72]">
                        <CalendarDays size={18} className="text-[#9B96E5]" />
                        <span>{formatEventDate(primarySpotlight)}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-[#5E5D72]">
                        <MapPin size={18} className="text-[#F08A6C]" />
                        <span>{primarySpotlight.venue}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-[#5E5D72]">
                        <Users size={18} className="text-[#5C8A5C]" />
                        <span>{primarySpotlight.registeredUsers} registered</span>
                      </div>
                    </div>

                    <Link
                      to={`/events/${primarySpotlight._id}`}
                      className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#8F8AD6] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#7a75c2] hover:shadow-[0_8px_15px_rgba(143,138,214,0.25)]"
                    >
                      View Details
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>

                <div className="flex flex-col gap-[30px]">
                  {secondarySpotlights.map((event) => (
                    <div
                      key={event._id}
                      className="flex flex-1 flex-col justify-between rounded-[28px] border border-white/85 bg-white/82 p-[25px] shadow-[0_12px_30px_rgba(60,45,95,0.08)] backdrop-blur-sm"
                    >
                      <div className="flex gap-4">
                        <img
                          src={event.eventImage}
                          alt={event.eventName}
                          className="h-[104px] w-[104px] rounded-[20px] object-cover"
                          referrerPolicy="no-referrer"
                        />

                        <div className="min-w-0 flex-1">
                          <span className="inline-block rounded-full bg-[#F3EEFF] px-3 py-1 text-xs font-semibold text-[#7A77C8]">
                            {event.category}
                          </span>
                          <h3 className="mt-2.5 text-xl font-bold text-[#3F3D56]">{event.eventName}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-[#6B6A80]">
                            {truncateText(event.shortDescription, 72)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5">
                        <div className="flex flex-col gap-3.5 text-[15px]">
                          <div className="flex items-center gap-2.5 text-[#5E5D72]">
                            <CalendarDays size={16} className="text-[#9B96E5]" />
                            <span>{formatEventDate(event)}</span>
                          </div>
                          <div className="flex items-center gap-2.5 text-[#5E5D72]">
                            <MapPin size={18} className="text-[#F08A6C]" />
                            <span>{event.venue}</span>
                          </div>
                          <div className="flex items-center gap-2.5 text-[#5E5D72]">
                            <Users size={16} className="text-[#5C8A5C]" />
                            <span>{event.registeredUsers} registered</span>
                          </div>
                        </div>

                        <Link
                          to={`/events/${event._id}`}
                          className="mt-[28px] inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#8F8AD6] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#7a75c2] hover:shadow-[0_8px_15px_rgba(143,138,214,0.25)]"
                        >
                          View Event
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* ================= HOW IT WORKS ================= */}
        <AnimatedSection delay={0.06}>
          <section className="py-12 lg:py-16">
            <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10">

              <div className="relative mb-16 text-center lg:mb-20">
                <h2 className="section-underline mb-4 text-[38px] font-extrabold leading-tight tracking-tight text-[#3F3D56] sm:text-[48px]">
                  How It Works
                </h2>
                <p className="mx-auto max-w-[600px] text-base leading-relaxed text-[#6B6A80] sm:text-lg">
                  Get started in four simple steps and never miss an event again.
                </p>
              </div>

              {/* timeline-track: ::before vertical line lives in index.css */}
              <div className="timeline-track relative mx-auto flex max-w-[720px] flex-col gap-[28px] pt-6 sm:gap-[50px] sm:pl-[100px] sm:pt-10">

                {HOW_IT_WORKS_STEPS.map(({ icon: Icon, step, title, desc, bg }) => (
                  <div key={step} className="relative">
                    <div className="mb-4 flex h-[62px] w-[62px] items-center justify-center rounded-full bg-white text-[#8C89D9] shadow-[0_6px_18px_rgba(0,0,0,0.05)] sm:absolute sm:-left-[100px] sm:top-1/2 sm:mb-0 sm:h-[70px] sm:w-[70px] sm:-translate-y-1/2">
                      <Icon size={22} />
                    </div>
                    <div className={`w-full cursor-pointer rounded-[30px] px-7 py-7 text-start shadow-[0_8px_20px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_18px_35px_rgba(0,0,0,0.08)] sm:px-11 sm:py-9 ${bg}`}>
                      <span className="text-xs font-bold tracking-widest text-[#F08A6C]">{step}</span>
                      <h3 className="mt-2.5 text-[22px] font-bold text-[#3F3D56]">{title}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-[#6B6A80]">{desc}</p>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* ================= WHY STUDENTS ================= */}
        <AnimatedSection delay={0.07}>
          <section className="py-12 lg:py-16">
            <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10">

              <div className="relative mb-16 text-center lg:mb-20">
                <h2 className="section-underline mb-4 text-[38px] font-extrabold leading-tight tracking-tight text-[#3F3D56] sm:text-[48px]">
                  Why Students Prefer Our Platform
                </h2>
                <p className="mx-auto max-w-[600px] text-base leading-relaxed text-[#6B6A80] sm:text-lg">
                  Everything you need to make the most of your campus experience.
                </p>
              </div>

              <div className="home-benefit-grid mt-[40px] lg:mt-[60px]">
                {STUDENT_BENEFITS.map(({ title, desc, border, icon: Icon }) => (
                  <div
                    key={title}
                    className={`flex items-start gap-[22px] rounded-[28px] border-t-[6px] bg-white px-7 py-7 shadow-[0_8px_18px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_30px_rgba(0,0,0,0.08)] sm:px-10 sm:py-9 ${border}`}
                  >
                    <Icon size={20} className="h-[46px] min-w-[46px] w-[46px] rounded-[14px] bg-[#F4F3FF] p-3 text-[#8C89D9]" />
                    <div>
                      <h3 className="mb-1.5 text-xl font-bold text-[#3F3D56]">{title}</h3>
                      <p className="text-[15px] leading-relaxed text-[#6B6A80]">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>

        <Footer />
      </div>
    </>
  );
}