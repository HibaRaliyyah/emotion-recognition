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
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Blur blobs */}
        <div className="blur-blob w-96 h-96 bg-primary/20 top-20 -left-48" />
        <div className="blur-blob w-80 h-80 bg-accent/20 bottom-20 -right-40" />
        <div className="blur-blob w-64 h-64 bg-primary/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <HeroScene />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <StaggerContainer>
            <FadeUp>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI-Powered Emotion Recognition</span>
              </motion.div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
                Understand Your
                <span className="block gradient-text">Emotions</span>
              </h1>
            </FadeUp>

            <FadeUp delay={0.2}>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                Harness the power of advanced AI to recognize, understand, and track facial emotions.
                Gain deeper insights into emotional well-being with our cutting-edge platform.
              </p>
            </FadeUp>

            <FadeUp delay={0.3}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/predict">
                  <Button size="lg" className="rounded-xl px-8 py-6 text-lg font-semibold glow-effect group">
                    Predict Emotion
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="lg" className="rounded-xl px-8 py-6 text-lg font-semibold">
                    Learn More
                  </Button>
                </Link>
              </div>
            </FadeUp>
          </StaggerContainer>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
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
      <section className="relative py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <StaggerContainer className="text-center mb-16">
            <FadeUp>
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
                Why Choose <span className="gradient-text">InnerGlow</span>?
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our platform combines cutting-edge AI with thoughtful design to provide the most accurate and insightful emotion recognition experience.
              </p>
            </FadeUp>
          </StaggerContainer>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass-card rounded-2xl p-6 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-12 text-center relative overflow-hidden"
          >
            <div className="blur-blob w-64 h-64 bg-primary/20 -top-32 -left-32" />
            <div className="blur-blob w-64 h-64 bg-accent/20 -bottom-32 -right-32" />

            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Ready to Understand Your Emotions?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Start your journey to emotional awareness today. Try our AI-powered emotion recognition for free.
              </p>
              <Link to="/predict">
                <Button size="lg" className="rounded-xl px-8 py-6 text-lg font-semibold glow-effect">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
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
