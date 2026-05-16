import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Shield, Zap, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroScene } from "@/components/HeroScene";
import { ParticleBackground } from "@/components/ParticleBackground";
import { StaggerContainer, FadeUp } from "@/components/PageTransition";

const Home = () => {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Analysis",
      description: "Advanced deep learning models detect subtle emotional expressions with high accuracy.",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your data stays yours. All processing happens securely with full encryption.",
    },
    {
      icon: Zap,
      title: "Real-Time Detection",
      description: "Instant emotion recognition with millisecond response times.",
    },
    {
      icon: BarChart3,
      title: "Detailed Insights",
      description: "Track emotional patterns over time with comprehensive analytics.",
    },
  ];

  return (
    <div className="page-container">
      <ParticleBackground className="fixed inset-0 -z-10" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-12 overflow-hidden">
        {/* Blur blobs — smaller on mobile */}
        <div className="blur-blob w-48 h-48 sm:w-96 sm:h-96 bg-primary/20 top-20 -left-24 sm:-left-48" />
        <div className="blur-blob w-40 h-40 sm:w-80 sm:h-80 bg-accent/20 bottom-20 -right-20 sm:-right-40" />
        <div className="blur-blob w-32 h-32 sm:w-64 sm:h-64 bg-primary/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <HeroScene />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <StaggerContainer>
            <FadeUp>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 sm:mb-8"
              >
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                <span className="text-xs sm:text-sm font-medium text-primary">AI-Powered Emotion Recognition</span>
              </motion.div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-4 sm:mb-6">
                Understand Your
                <span className="block gradient-text">Emotions</span>
              </h1>
            </FadeUp>

            <FadeUp delay={0.2}>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 px-2">
                Harness the power of advanced AI to recognize, understand, and track facial emotions.
                Gain deeper insights into emotional well-being with our cutting-edge platform.
              </p>
            </FadeUp>

            <FadeUp delay={0.3}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
                <Link to="/predict" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto rounded-xl px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold glow-effect group">
                    Predict Emotion
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/about" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-xl px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold">
                    Learn More
                  </Button>
                </Link>
              </div>
            </FadeUp>
          </StaggerContainer>

          {/* Scroll indicator — hidden on very small screens */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2"
            >
              <motion.div className="w-1.5 h-3 rounded-full bg-primary" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <StaggerContainer className="text-center mb-10 sm:mb-16">
            <FadeUp>
              <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4">
                Why Choose <span className="gradient-text">InnerGlow</span>?
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
                Our platform combines cutting-edge AI with thoughtful design to provide the most accurate and insightful emotion recognition experience.
              </p>
            </FadeUp>
          </StaggerContainer>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass-card rounded-2xl p-5 sm:p-6 group cursor-pointer"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg sm:text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 text-center relative overflow-hidden"
          >
            <div className="blur-blob w-32 h-32 sm:w-64 sm:h-64 bg-primary/20 -top-16 sm:-top-32 -left-16 sm:-left-32" />
            <div className="blur-blob w-32 h-32 sm:w-64 sm:h-64 bg-accent/20 -bottom-16 sm:-bottom-32 -right-16 sm:-right-32" />

            <div className="relative z-10">
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                Ready to Understand Your Emotions?
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-xl mx-auto px-2">
                Start your journey to emotional awareness today. Try our AI-powered emotion recognition for free.
              </p>
              <Link to="/predict" className="inline-block w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto rounded-xl px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold glow-effect">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
