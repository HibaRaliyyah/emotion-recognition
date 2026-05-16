import { motion } from "framer-motion";
import { Heart, Brain, Users, Target, Sparkles, Shield } from "lucide-react";
import { StaggerContainer, FadeUp, SlideIn } from "@/components/PageTransition";
import { ParticleBackground } from "@/components/ParticleBackground";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Emotional Well-being",
      description: "We believe understanding emotions is the first step to better mental health and stronger relationships.",
    },
    {
      icon: Brain,
      title: "AI with Empathy",
      description: "Our AI is designed not just to detect emotions, but to provide meaningful, supportive insights.",
    },
    {
      icon: Shield,
      title: "Privacy & Trust",
      description: "Your emotional data is sacred. We employ the highest security standards to protect your privacy.",
    },
    {
      icon: Users,
      title: "Human Connection",
      description: "Technology that brings people closer by fostering emotional understanding and empathy.",
    },
  ];

  const timeline = [
    { year: "2023", title: "The Vision", description: "Founded with a mission to make emotional intelligence accessible to everyone." },
    { year: "2024", title: "AI Breakthrough", description: "Developed our proprietary emotion recognition model with 95%+ accuracy." },
    { year: "2025", title: "Global Launch", description: "Expanded to serve users worldwide with multi-language support." },
    { year: "Future", title: "Continuous Growth", description: "Committed to advancing emotional AI for a more empathetic world." },
  ];

  return (
    <div className="page-container pt-20 sm:pt-24">
      <ParticleBackground className="fixed inset-0 -z-10 opacity-50" />

      {/* Hero */}
      <section className="relative py-12 sm:py-20 px-4 sm:px-6">
        <div className="blur-blob w-48 h-48 sm:w-96 sm:h-96 bg-primary/15 top-0 right-0" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <StaggerContainer>
            <FadeUp>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Our Story</span>
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
                Making Emotions
                <span className="block gradient-text">Understandable</span>
              </h1>
            </FadeUp>

            <FadeUp delay={0.2}>
              <p className="text-sm sm:text-lg text-muted-foreground max-w-3xl mx-auto px-2">
                InnerGlow was born from a simple belief: understanding our emotions is the foundation of personal growth,
                better relationships, and improved mental health. We harness the power of AI to make this understanding accessible to everyone.
              </p>
            </FadeUp>
          </StaggerContainer>
        </div>
      </section>

      {/* Mission */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <SlideIn direction="left">
              <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
                <div className="blur-blob w-48 h-48 bg-accent/20 -bottom-24 -right-24" />
                <div className="relative z-10">
                  <Target className="w-12 h-12 text-primary mb-6" />
                  <h2 className="font-display text-3xl font-bold mb-4">Our Mission</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    To democratize emotional intelligence through accessible, accurate, and empathetic AI technology.
                    We envision a world where everyone can understand their emotions better, leading to improved mental health,
                    stronger relationships, and more empathetic communities.
                  </p>
                </div>
              </div>
            </SlideIn>

            <SlideIn direction="right" delay={0.2}>
              <div className="space-y-6">
                {values.slice(0, 2).map((value, index) => (
                  <motion.div
                    key={value.title}
                    whileHover={{ x: 10 }}
                    className="glass-card rounded-2xl p-6 flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                      <value.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold mb-1">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </SlideIn>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 relative">
        <div className="blur-blob w-40 h-40 sm:w-80 sm:h-80 bg-primary/10 top-1/2 left-0 -translate-y-1/2" />
        <div className="max-w-6xl mx-auto relative z-10">
          <StaggerContainer className="text-center mb-8 sm:mb-12">
            <FadeUp>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                What We <span className="gradient-text">Stand For</span>
              </h2>
            </FadeUp>
          </StaggerContainer>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className="glass-card rounded-2xl p-4 sm:p-6 text-center group"
              >
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                  <value.icon className="w-5 h-5 sm:w-7 sm:h-7 text-primary-foreground" />
                </div>
                <h3 className="font-display text-sm sm:text-lg font-semibold mb-1 sm:mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <StaggerContainer className="text-center mb-10 sm:mb-16">
            <FadeUp>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                Our <span className="gradient-text">Journey</span>
              </h2>
            </FadeUp>
          </StaggerContainer>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary -translate-x-1/2 hidden md:block" />
            <div className="space-y-6 sm:space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className={`flex items-center gap-4 sm:gap-8 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 inline-block">
                      <span className="text-xl sm:text-2xl font-display font-bold gradient-text">{item.year}</span>
                      <h3 className="font-display text-base sm:text-xl font-semibold mt-1 sm:mt-2">{item.title}</h3>
                      <p className="text-muted-foreground text-xs sm:text-sm mt-1">{item.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex w-4 h-4 rounded-full bg-primary glow-effect flex-shrink-0" />
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
