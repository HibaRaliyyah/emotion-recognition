import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Calendar, MessageSquare, Brain, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { StaggerContainer, FadeUp } from "@/components/PageTransition";
import { ParticleBackground } from "@/components/ParticleBackground";

const Dashboard = () => {
  // Mock data for charts
  const weeklyData = [
    { day: "Mon", happy: 65, sad: 20, neutral: 15 },
    { day: "Tue", happy: 55, sad: 30, neutral: 15 },
    { day: "Wed", happy: 70, sad: 15, neutral: 15 },
    { day: "Thu", happy: 45, sad: 35, neutral: 20 },
    { day: "Fri", happy: 80, sad: 10, neutral: 10 },
    { day: "Sat", happy: 75, sad: 15, neutral: 10 },
    { day: "Sun", happy: 85, sad: 5, neutral: 10 },
  ];

  const recentEmotions = [
    { time: "2 hours ago", emotion: "Contented Curiosity", dominant: "Happy", percentage: 72 },
    { time: "Yesterday", emotion: "Peaceful Neutrality", dominant: "Neutral", percentage: 65 },
    { time: "2 days ago", emotion: "Hopeful Anticipation", dominant: "Surprise", percentage: 58 },
    { time: "3 days ago", emotion: "Calm Reflection", dominant: "Neutral", percentage: 70 },
  ];

  const stats = [
    { label: "Total Scans", value: "47", icon: Brain, trend: "+12%" },
    { label: "Avg. Happiness", value: "68%", icon: TrendingUp, trend: "+5%" },
    { label: "Streak", value: "7 days", icon: Calendar, trend: "Perfect" },
    { label: "Insights", value: "23", icon: MessageSquare, trend: "+3" },
  ];

  return (
    <div className="page-container pt-24 pb-20">
      <ParticleBackground className="fixed inset-0 -z-10 opacity-30" />

      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <StaggerContainer className="mb-12">
          <FadeUp>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Your <span className="gradient-text">Dashboard</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="text-muted-foreground">
              Track your emotional journey and gain insights over time.
            </p>
          </FadeUp>
        </StaggerContainer>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="glass-card rounded-2xl p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                  {stat.trend}
                </span>
              </div>
              <p className="text-2xl font-display font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 glass-card rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-semibold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Weekly Emotion Trends
              </h2>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="happyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--emotion-happy))" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(var(--emotion-happy))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="sadGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--emotion-sad))" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(var(--emotion-sad))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="happy"
                    stroke="hsl(var(--emotion-happy))"
                    fill="url(#happyGradient)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="sad"
                    stroke="hsl(var(--emotion-sad))"
                    fill="url(#sadGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emotion-happy" />
                <span className="text-sm text-muted-foreground">Happy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emotion-sad" />
                <span className="text-sm text-muted-foreground">Sad</span>
              </div>
            </div>
          </motion.div>

          {/* Recent Emotions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-3xl p-6"
          >
            <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Recent Analyses
            </h2>

            <div className="space-y-4">
              {recentEmotions.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-medium text-sm">{item.emotion}</span>
                    <span className="text-xs text-muted-foreground">{item.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                    <span className="text-xs font-medium text-primary">{item.percentage}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Dominant: {item.dominant}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Chat Interface Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 glass-card rounded-3xl p-6"
        >
          <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Emotion Reflections
          </h2>

          <div className="bg-muted/50 rounded-2xl p-8 text-center">
            <Brain className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground mb-2">Your AI-powered emotion journal</p>
            <p className="text-sm text-muted-foreground/70">
              Chat with our AI to reflect on your emotional patterns and receive personalized insights.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
