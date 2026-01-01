import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StaggerContainer, FadeUp } from "@/components/PageTransition";
import { ParticleBackground } from "@/components/ParticleBackground";
import { toast } from "sonner";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      name: "Basic",
      icon: Sparkles,
      price: billingCycle === "monthly" ? 5 : 50,
      credits: 10,
      description: "Perfect for trying out emotion recognition",
      features: [
        "10 emotion predictions",
        "Basic emotion analysis",
        "24/7 support",
        "7-day history",
      ],
      popular: false,
    },
    {
      name: "Advanced",
      icon: Zap,
      price: billingCycle === "monthly" ? 25 : 250,
      credits: 100,
      description: "For regular self-reflection and insight",
      features: [
        "100 emotion predictions",
        "Mixed emotion detection",
        "AI-powered insights",
        "30-day history",
        "Telegram integration",
        "Priority support",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      icon: Crown,
      price: billingCycle === "monthly" ? 50 : 500,
      credits: 1000,
      description: "Unlimited emotional intelligence",
      features: [
        "1000 emotion predictions",
        "Advanced analytics",
        "Team dashboard",
        "Unlimited history",
        "API access",
        "Custom integrations",
        "Dedicated support",
      ],
      popular: false,
    },
  ];

  const handleSubscribe = (planName: string) => {
    toast.info(`Redirecting to payment for ${planName} plan...`);
    // In production, this would integrate with Razorpay
  };

  return (
    <div className="page-container pt-24 pb-20">
      <ParticleBackground className="fixed inset-0 -z-10 opacity-30" />

      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <StaggerContainer className="text-center mb-16">
          <FadeUp>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
              Simple, Transparent <span className="gradient-text">Pricing</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Choose the plan that fits your emotional wellness journey. All plans include our core AI emotion recognition technology.
            </p>
          </FadeUp>

          {/* Billing Toggle */}
          <FadeUp delay={0.2}>
            <div className="inline-flex items-center gap-3 bg-muted rounded-full p-1.5">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  billingCycle === "monthly"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  billingCycle === "yearly"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Yearly
                <span className="ml-2 text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </FadeUp>
        </StaggerContainer>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className={`relative glass-card rounded-3xl p-8 ${
                plan.popular ? "ring-2 ring-primary" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
                  <plan.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-display font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
                </div>
                <p className="text-sm text-primary mt-2">{plan.credits} credits included</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSubscribe(plan.name)}
                className={`w-full rounded-xl py-6 ${
                  plan.popular ? "glow-effect" : ""
                }`}
                variant={plan.popular ? "default" : "outline"}
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          ))}
        </div>

        {/* FAQ or Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground">
            All plans include a 7-day money-back guarantee.{" "}
            <a href="#" className="text-primary hover:underline">
              Contact us
            </a>{" "}
            for custom enterprise solutions.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;
