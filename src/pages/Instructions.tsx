import { motion } from "framer-motion";
import { Camera, MousePointer, BarChart3, MessageSquare, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StaggerContainer, FadeUp } from "@/components/PageTransition";
import { ParticleBackground } from "@/components/ParticleBackground";

const Instructions = () => {
  const steps = [
    {
      icon: Camera,
      title: "Start Your Camera",
      description: "Click the 'Start Camera' button and grant permission for your browser to access your webcam.",
      tips: ["Use good lighting for best results", "Position your face in the center", "Your privacy is protected - no images are stored"],
    },
    {
      icon: MousePointer,
      title: "Capture & Analyze",
      description: "Click 'Capture' to freeze your expression, then select 'Analyze Emotion' to process your image.",
      tips: ["Stay still for 2-3 seconds", "Express naturally, don't force", "Our AI processes everything in real-time"],
    },
    {
      icon: BarChart3,
      title: "Explore Your Emotions",
      description: "Review your 'Emotion Analysis' breakdown and 'Detected Mixed Emotion' label for deep clarity.",
      tips: ["Detailed percentage breakdown", "Mixed emotion detection", "Real-time confidence scores"],
    },
    {
      icon: MessageSquare,
      title: "Sync & Track",
      description: "Explore your full emotional history and track your well-being over time in the Dashboard.",
      tips: ["Personalized AI explanations", "Gentle, supportive suggestions", "Track historical trends over time"],
    },
  ];

  const emotions = [
    { name: "Happy", color: "bg-emotion-happy", description: "Joy, contentment, amusement" },
    { name: "Sad", color: "bg-emotion-sad", description: "Sorrow, grief, disappointment" },
    { name: "Fear", color: "bg-emotion-fear", description: "Anxiety, worry, nervousness" },
    { name: "Anger", color: "bg-emotion-anger", description: "Frustration, irritation, rage" },
    { name: "Neutral", color: "bg-emotion-neutral", description: "Calm, balanced, composed" },
    { name: "Surprise", color: "bg-emotion-surprise", description: "Amazement, shock, wonder" },
  ];

  return (
    <div className="page-container pt-24">
      <ParticleBackground className="fixed inset-0 -z-10 opacity-50" />

      {/* Hero */}
      <section className="relative py-20 px-4">
        <div className="blur-blob w-96 h-96 bg-accent/15 top-0 left-0" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <StaggerContainer>
            <FadeUp>
              <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
                How It <span className="gradient-text">Works</span>
              </h1>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get started with InnerGlow in four simple steps. Our intuitive interface guides you through the entire emotion recognition process.
              </p>
            </FadeUp>
          </StaggerContainer>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="glass-card rounded-3xl p-8 relative overflow-hidden group hover:scale-[1.02] transition-transform"
              >
                <div className="blur-blob w-48 h-48 bg-primary/10 -top-24 -right-24 group-hover:bg-primary/20 transition-colors" />

                <div className="relative z-10 grid md:grid-cols-[auto,1fr,1fr] gap-8 items-start">
                  {/* Step number and icon */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-effect">
                        <step.icon className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                        <span className="font-display font-bold text-primary">{index + 1}</span>
                      </div>
                    </div>
                  </div>

                  {/* Main content */}
                  <div>
                    <h3 className="font-display text-2xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>

                  {/* Tips */}
                  <div className="bg-muted/50 rounded-2xl p-5">
                    <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">Tips</h4>
                    <ul className="space-y-2">
                      {step.tips.map((tip) => (
                        <li key={tip} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Emotions Guide */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <StaggerContainer className="text-center mb-12">
            <FadeUp>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Emotions We <span className="gradient-text">Detect</span>
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-muted-foreground">
                Our AI recognizes the six universal emotions identified by psychological research.
              </p>
            </FadeUp>
          </StaggerContainer>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {emotions.map((emotion, index) => (
              <motion.div
                key={emotion.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.05 }}
                className="glass-card rounded-2xl p-5 flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-xl ${emotion.color} flex items-center justify-center`}>
                  <span className="text-2xl">
                    {emotion.name === "Happy" && "😊"}
                    {emotion.name === "Sad" && "😢"}
                    {emotion.name === "Fear" && "😨"}
                    {emotion.name === "Anger" && "😠"}
                    {emotion.name === "Neutral" && "😐"}
                    {emotion.name === "Surprise" && "😲"}
                  </span>
                </div>
                <div>
                  <h3 className="font-display font-semibold">{emotion.name}</h3>
                  <p className="text-xs text-muted-foreground">{emotion.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto glass-card rounded-3xl p-12 text-center"
        >
          <h2 className="font-display text-3xl font-bold mb-4">Ready to Try?</h2>
          <p className="text-muted-foreground mb-8">
            Start your emotion recognition journey now. It's quick, easy, and insightful.
          </p>
          <Link to="/predict">
            <Button size="lg" className="rounded-xl px-8 py-6 text-lg font-semibold glow-effect">
              Start Prediction
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Instructions;
