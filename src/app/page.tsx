"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Bot,
  Briefcase,
  Target,
  Users,
  Zap,
  Star,
  CheckCircle,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  motion,
  AnimatePresence,
  useInView,
  type Variants,
  type Easing,
} from "framer-motion";
import { useRef } from "react";

const features = [
  {
    icon: <Bot className="h-8 w-8 text-blue-400" />,
    title: "AI Career Advisor",
    description:
      "Get personalized career advice powered by advanced AI that understands your goals and background.",
  },
  {
    icon: <Target className="h-8 w-8 text-purple-400" />,
    title: "Smart Job Matching",
    description:
      "Find opportunities that perfectly match your skills, experience, and career aspirations.",
  },
  {
    icon: <Zap className="h-8 w-8 text-blue-400" />,
    title: "Skill Gap Analysis",
    description:
      "Identify the skills you need to reach your career goals and get learning recommendations.",
  },
  {
    icon: <Briefcase className="h-8 w-8 text-purple-400" />,
    title: "Career Planning",
    description:
      "Create a personalized roadmap to achieve your career objectives with actionable steps.",
  },
  {
    icon: <Users className="h-8 w-8 text-blue-400" />,
    title: "Industry Insights",
    description:
      "Stay updated with the latest trends and opportunities in your field of interest.",
  },
  {
    icon: <Star className="h-8 w-8 text-purple-400" />,
    title: "Resume Optimization",
    description:
      "Get AI-powered suggestions to improve your resume and increase your chances of landing interviews.",
  },
];

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    filter: "blur(10px)",
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.25, 0, 1] as Easing,
    },
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const heroVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1.2,
      ease: [0.25, 0.25, 0, 1] as Easing,
    },
  },
};

const fadeInUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.25, 0.25, 0, 1] as Easing,
    },
  },
};

export default function Home() {
  const isMobile = useIsMobile();
  const [isVideoReady, setIsVideoReady] = useState(false);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);
  const isInViewFeatures = useInView(featuresRef, {
    once: true,
    margin: "-100px",
  });
  const isInViewCta = useInView(ctaRef, { once: true, margin: "-100px" });

  const videoSrc = isMobile
    ? "/videos/landing-page-bg-mobile.webm"
    : "/videos/landing-page-bg2.webm";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <AnimatePresence>
        {!isVideoReady ? (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-white"
            >
              <motion.div
                className="flex items-center gap-3"
                initial={{ filter: "blur(10px)" }}
                animate={{ filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Image
                  className="animate-bounce"
                  src="/images/Rocket.png"
                  alt="rocket"
                  width={30}
                  height={30}
                />

                <span className="text-xl font-bold text-slate-100">
                  Welcome to JobPilot
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          <Navbar />
        )}
      </AnimatePresence>

      {/* Hero Section with Enhanced Animations */}
      <section className="relative h-screen w-full overflow-hidden bg-slate-950">
        <motion.video
          initial={{ scale: 1.1, filter: "blur(20px)" }}
          animate={{ scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 2, ease: "easeOut" }}
          autoPlay
          loop
          muted
          playsInline
          onCanPlay={() => setIsVideoReady(true)}
          className="h-full w-full object-cover"
        >
          <source src={videoSrc} type="video/webm" />
        </motion.video>

        {/* Animated Glow Effects */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-purple-900/10 to-slate-950/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        />

        <motion.div
          className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute top-1/3 right-1/4 h-80 w-80 rounded-full bg-purple-500/15 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Hero Content with Staggered Animation */}
        <div className="pointer-events-none absolute inset-x-0 bottom-20 items-center">
          <div className="flex h-full items-center justify-center px-6">
            <motion.div
              className="pointer-events-auto relative mx-auto max-w-4xl text-center"
              variants={containerVariants}
              initial="hidden"
              animate={isVideoReady ? "visible" : "hidden"}
            >
              {/* Animated Background Glows */}
              <motion.div
                className="absolute inset-0 h-36 w-96 rounded-full bg-red-500/40 blur-3xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute inset-x-32 h-36 w-96 rounded-full bg-green-500/30 blur-3xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
              <motion.div
                className="absolute inset-x-64 h-36 w-96 rounded-full bg-pink-500/30 blur-3xl"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 2,
                }}
              />

              <motion.div variants={heroVariants}>
                <Badge className="mb-6 border-blue-800/50 bg-blue-900/30 text-blue-300 shadow-lg shadow-blue-600/20 backdrop-blur-sm hover:bg-blue-800/30">
                  <Bot className="mr-2 h-4 w-4" />
                  Beta: Powered by Granite AI
                </Badge>
              </motion.div>

              <motion.h1
                className="mb-6 bg-gradient-to-b from-white via-blue-100 to-blue-300 bg-clip-text text-5xl font-bold text-white drop-shadow-2xl md:text-7xl"
                variants={heroVariants}
              >
                Your AI Career
                <br />
                <motion.span
                  className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  style={{ backgroundSize: "200% 200%" }}
                >
                  Copilot
                </motion.span>
              </motion.h1>

              <motion.p
                className="mx-auto mb-8 max-w-2xl text-xl text-slate-300 drop-shadow-lg md:text-2xl"
                variants={heroVariants}
              >
                Navigate your career journey with AI-powered guidance,
                personalized recommendations, and expert insights.
              </motion.p>

              <motion.div
                className="flex flex-col items-center justify-center gap-4 sm:flex-row"
                variants={heroVariants}
              >
                <Link href="/auth/register">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg text-white shadow-2xl ring-1 shadow-blue-600/40 ring-blue-500/30 transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-blue-600/60 hover:ring-blue-400/50"
                    >
                      Start Your Journey
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </Link>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-slate-600/50 bg-slate-900/20 px-8 py-4 text-lg text-slate-300 shadow-lg shadow-black/20 backdrop-blur-sm hover:bg-slate-800/50"
                  >
                    Watch Demo
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section with Scroll-Triggered Animations */}
      <section
        ref={featuresRef}
        id="features"
        className="relative overflow-hidden bg-slate-950 py-24"
      >
        {/* Animated Background Glow Effects */}
        <motion.div
          className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            className="mb-16 text-center"
            variants={fadeInUpVariants}
            initial="hidden"
            animate={isInViewFeatures ? "visible" : "hidden"}
          >
            <h2 className="mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-4xl font-bold text-white md:text-5xl">
              Supercharge Your Career
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-slate-400">
              Our AI-powered platform provides personalized career guidance, job
              matching, and skill development recommendations.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate={isInViewFeatures ? "visible" : "hidden"}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className="group"
              >
                <Card className="group relative overflow-hidden border-slate-800/50 bg-slate-900/50 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-600/20">
                  {/* Card Glow Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />

                  <CardContent className="relative z-10 p-6">
                    <motion.div
                      className="mb-4 w-fit rounded-lg bg-slate-800/50 p-3 shadow-lg shadow-blue-600/10"
                      whileHover={{
                        scale: 1.1,
                        rotate: [0, -5, 5, 0],
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="mb-3 text-xl font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section with Enhanced Animations */}
      <section
        ref={ctaRef}
        className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-purple-950 py-24"
      >
        {/* Enhanced Animated Glow Effects */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          style={{ backgroundSize: "200% 200%" }}
        />

        <motion.div
          className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-500/20 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInViewCta ? "visible" : "hidden"}
        >
          <motion.h2
            className="mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-4xl font-bold text-white md:text-5xl"
            variants={fadeInUpVariants}
          >
            Ready to Transform Your Career?
          </motion.h2>

          <motion.p
            className="mb-8 text-xl text-slate-300"
            variants={fadeInUpVariants}
          >
            Join thousands of professionals who are already using JobPilot to
            accelerate their career growth.
          </motion.p>

          <motion.div
            className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
            variants={fadeInUpVariants}
          >
            <Link href="/auth/register">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-base text-white shadow-2xl ring-1 shadow-blue-600/40 ring-blue-500/30 hover:from-blue-700 hover:to-purple-700 hover:ring-blue-400/50"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                variant="outline"
                className="border-slate-600/50 bg-slate-900/20 px-8 py-4 text-base text-slate-300 shadow-lg shadow-black/20 backdrop-blur-sm hover:bg-slate-800/50 hover:text-slate-200"
              >
                Schedule Demo
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-8 text-slate-400"
            variants={containerVariants}
          >
            {["Free to start", "No credit card required", "Cancel anytime"].map(
              (text, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2"
                  variants={cardVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <CheckCircle className="h-5 w-5 text-green-400 shadow-green-400/50 drop-shadow-lg" />
                  <span>{text}</span>
                </motion.div>
              ),
            )}
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <motion.nav
      className="fixed inset-x-0 top-5 z-50 mx-auto w-fit rounded-xl backdrop-blur-md"
      initial={{ y: -100, opacity: 0, filter: "blur(10px)" }}
      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: [0.25, 0.25, 0, 1] }}
    >
      <div className="mx-auto max-w-4xl rounded-xl border-b border-slate-800/30 bg-transparent px-6 backdrop-blur-md lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3 rounded-xl">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Image
              src="/images/Rocket.png"
              alt="rocket"
              width={30}
              height={30}
            />

            <span className="text-xl font-bold text-slate-100">JobPilot</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 lg:flex">
            <div className="group relative">
              <motion.button
                className="flex items-center gap-1 py-2 text-slate-300 transition-colors hover:text-blue-400"
                onMouseEnter={() => setActiveDropdown("features")}
                onMouseLeave={() => setActiveDropdown(null)}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                Features
                <motion.div
                  animate={{ rotate: activeDropdown === "features" ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.div>
              </motion.button>
              <AnimatePresence>
                {activeDropdown === "features" && (
                  <motion.div
                    className="absolute top-full left-0 mt-2 w-80 rounded-xl border border-slate-800/50 bg-slate-900/95 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl"
                    onMouseEnter={() => setActiveDropdown("features")}
                    onMouseLeave={() => setActiveDropdown(null)}
                    initial={{ opacity: 0, y: -10, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-4">
                      {[
                        {
                          title: "AI Guidance",
                          desc: "Get personalized career advice powered by AI",
                        },
                        {
                          title: "Job Matching",
                          desc: "Find opportunities that match your skills",
                        },
                        {
                          title: "Skill Analysis",
                          desc: "Identify gaps and get learning recommendations",
                        },
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ x: 5 }}
                        >
                          <h3 className="mb-2 font-semibold text-white">
                            {item.title}
                          </h3>
                          <p className="text-sm text-slate-400">{item.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {["Pricing", "About", "Blog"].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-slate-300 transition-colors hover:text-blue-400"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                {item}
              </motion.a>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden items-center space-x-4 lg:flex">
            <Link href="/auth/login">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  className="text-slate-300 hover:bg-slate-800/50 hover:text-blue-400"
                >
                  Login
                </Button>
              </motion.div>
            </Link>
            <Link href="https://github.com/Riciolus/jobpilot-ai">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="border-slate-700 bg-transparent text-slate-300 hover:bg-blue-950/50 hover:text-blue-300"
                >
                  Support
                </Button>
              </motion.div>
            </Link>
            <Link href="/auth/login">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg ring-1 shadow-blue-600/25 ring-blue-500/20 hover:from-blue-700 hover:to-blue-800">
                  Get Started
                </Button>
              </motion.div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <motion.button
            className="text-slate-300 hover:text-blue-400 lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-6 w-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="rounded-lg border-t border-slate-800/50 bg-slate-950/60 backdrop-blur-xl lg:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="space-y-1 px-2 pt-2 pb-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {["Features", "Pricing", "About"].map((item) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="block px-3 py-2 text-slate-300 hover:text-blue-400"
                    variants={cardVariants}
                    whileHover={{ x: 10 }}
                  >
                    {item}
                  </motion.a>
                ))}
                <motion.div
                  className="flex flex-col gap-2 px-3 pt-2"
                  variants={cardVariants}
                >
                  <Link href="/auth/login">
                    <Button
                      variant="outline"
                      className="w-full border-slate-700 bg-transparent text-slate-300 hover:bg-blue-950/50"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                      Get Started
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

const Footer = () => {
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, margin: "-100px" });

  return (
    <motion.footer
      ref={footerRef}
      className="border-t border-slate-800/50 bg-slate-950"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-8 md:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div
            className="col-span-1 md:col-span-2"
            variants={cardVariants}
          >
            <motion.div
              className="mb-4 flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="to-fuchisa-700 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-800 shadow-lg ring-1 shadow-blue-600/30 ring-blue-500/20">
                <Image
                  src="/images/Rocket.png"
                  alt="rocket"
                  width={30}
                  height={30}
                />
              </div>
              <span className="text-xl font-bold text-slate-100">JobPilot</span>
            </motion.div>
            <p className="mb-4 max-w-md text-slate-400">
              Your AI-powered career companion, helping professionals navigate
              their career journey with personalized guidance and insights.
            </p>
            <Badge className="border-blue-800/50 bg-blue-900/30 text-blue-300 shadow-lg shadow-blue-600/20 backdrop-blur-sm">
              Beta: Powered by Granite AI
            </Badge>
          </motion.div>

          {[
            {
              title: "Product",
              links: ["Features", "Pricing", "API", "Integrations"],
            },
            {
              title: "Company",
              links: ["About", "Blog", "Careers", "Contact"],
            },
          ].map((section, index) => (
            <motion.div key={section.title} variants={cardVariants}>
              <h3 className="mb-4 font-semibold text-white">{section.title}</h3>
              <ul className="space-y-2 text-slate-400">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link}
                    initial={{ opacity: 0, x: -20 }}
                    animate={
                      isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                    }
                    transition={{ delay: index * 0.1 + linkIndex * 0.05 }}
                  >
                    <motion.a
                      href="#"
                      className="transition-colors hover:text-blue-400"
                      whileHover={{ x: 5 }}
                    >
                      {link}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-12 border-t border-slate-800/50 pt-8 text-center text-slate-400"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p>&copy; 2025 JobPilot. All rights reserved.</p>
        </motion.div>
      </div>
    </motion.footer>
  );
};
