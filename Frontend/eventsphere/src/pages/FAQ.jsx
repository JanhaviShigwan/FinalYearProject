import { useState } from "react";
import { ChevronDown, Sparkles, CircleHelp, LifeBuoy } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AnimatedSection from "../components/AnimatedSection";

const faqs = [
  { question: "What is EventSphere?", answer: "EventSphere is a college event management platform where students can explore, register, and participate in various college events like workshops, fests, seminars, competitions, and cultural activities." },
  { question: "Who can use this platform?", answer: "College students, event organizers, faculty coordinators, and the admin team can use EventSphere." },
  { question: "How do I register for an event?", answer: "Go to the Events page, select your desired event, click Register, fill in the required details, and confirm your registration." },
  { question: "Can I register for multiple events?", answer: "Yes! You can register for multiple events as long as seats are available." },
  { question: "How do I know if my registration is confirmed?", answer: "You will see a confirmation message on the website. If email integration is enabled, you will also receive a confirmation email." },
  { question: "Will I receive a certificate?", answer: "Yes, digital certificates are provided after successful participation if the event includes certification." },
  { question: "How can organizers create events?", answer: "Organizers can log in, go to their dashboard, click 'Create Event', fill in the details, and publish the event." },
  { question: "What if I forget my password?", answer: "Click on 'Forgot Password' on the login page and follow the instructions to reset your password." },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => setOpenIndex(openIndex === index ? null : index);

  const quickTags = ["Registration", "Account", "Events", "Certificates"];

  return (
    <div
      className="faq-wrapper faq-shell relative flex min-h-screen flex-col overflow-x-hidden"
    >
      <Navbar />

      <main className="relative z-[1] mx-auto w-full max-w-6xl flex-1 px-4 pb-14 pt-8 sm:px-6 lg:px-10 lg:pb-20 lg:pt-10">
        <AnimatedSection>
          <section className="faq-hero-card rounded-[32px] border border-white/85 px-6 py-9 shadow-[0_22px_60px_rgba(56,42,84,0.16)] backdrop-blur-md sm:px-10 sm:py-12">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#6B66A8]">
                <Sparkles size={14} />
                Help Center
              </span>

              <h1 className="mt-5 text-4xl font-extrabold leading-tight text-[#2F2C44] sm:text-5xl">
                Frequently Asked Questions
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#55526A] sm:text-lg">
                Find quick answers about registration, eligibility, profiles, and event participation in EventSphere.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                {quickTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#E8E2F7] bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#615D8E]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>

        <section className="mt-10 grid gap-6 xl:grid-cols-[1.55fr,0.9fr]">
          <AnimatedSection delay={0.05}>
            <div className="space-y-3.5 rounded-[26px] border border-white/85 bg-white/82 p-4 shadow-[0_10px_30px_rgba(47,36,76,0.12)] backdrop-blur-md sm:p-6">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;

                return (
                  <div
                    key={index}
                    className={`overflow-hidden rounded-2xl border transition-all duration-300 ${isOpen
                      ? "border-[#D8D1F4] bg-white shadow-[0_12px_26px_rgba(132,118,214,0.25)]"
                      : "border-[#EEE9F8] bg-white/96 shadow-[0_4px_14px_rgba(74,66,108,0.1)]"
                      }`}
                  >
                    <button
                      onClick={() => toggle(index)}
                      className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5 sm:py-5"
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${index}`}
                    >
                      <span className="text-sm font-semibold text-[#3F3D56] sm:text-base">{faq.question}</span>

                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all ${
                        isOpen ? "bg-[#FCE6DE] text-[#F08A6C]" : "bg-[#F2F0FC] text-[#7D79B3]"
                      }`}>
                        <ChevronDown className={`transition-all duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`} size={18} />
                      </span>
                    </button>

                    <div
                      id={`faq-answer-${index}`}
                      className={`overflow-hidden px-4 transition-all duration-300 sm:px-5 ${isOpen ? "max-h-44 pb-5" : "max-h-0 pb-0"}`}
                    >
                      <p className="rounded-xl bg-[#FAF9FF] px-3 py-3 text-sm leading-relaxed text-[#44415A] sm:text-[15px]">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <aside className="h-fit rounded-[26px] border border-white/85 bg-white/82 p-5 shadow-[0_10px_30px_rgba(47,36,76,0.12)] backdrop-blur-md sm:p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EEEAFE] text-[#7A76B2]">
                <CircleHelp size={22} />
              </div>

              <h2 className="mt-4 text-2xl font-bold text-[#2F2C44]">Still Need Help?</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#5E5B74]">
                If your query is not listed here, contact the admin team through your dashboard and we will assist you.
              </p>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-[#EAE6FA] bg-[#F9F7FF] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7F7AA8]">Tip</p>
                  <p className="mt-1 text-sm text-[#4A4763]">
                    Keep your profile complete to avoid registration issues.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#F4DCCD] bg-[#FFF4EF] p-4">
                  <div className="flex items-center gap-2 text-[#B45D44]">
                    <LifeBuoy size={16} />
                    <p className="text-xs font-semibold uppercase tracking-[0.12em]">Support</p>
                  </div>
                  <p className="mt-1 text-sm text-[#5A4A44]">
                    For urgent event issues, contact your coordinator directly.
                  </p>
                </div>
              </div>
            </aside>
          </AnimatedSection>
        </section>
      </main>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}