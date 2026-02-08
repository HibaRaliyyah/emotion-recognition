import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Calendar, MessageSquare, Brain, Clock, AlertCircle, Camera, Send, Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { StaggerContainer, FadeUp } from "@/components/PageTransition";
import { ParticleBackground } from "@/components/ParticleBackground";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { emotionAPI, authAPI } from "@/lib/api";

interface EmotionRecord {
  _id: string;
  emotions: Record<string, number>;
  dominantEmotion: string;
  confidence: number;
  mixedEmotion?: string;
  explanation?: string;
  suggestions?: string[];
  createdAt: string;
}

const Dashboard = () => {
  const [emotionRecords, setEmotionRecords] = useState<EmotionRecord[]>([]);
  const [chatInsights, setChatInsights] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // AI Chat state
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [highlightInsights, setHighlightInsights] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Fetch emotion records
      try {
        const emotionsData = await emotionAPI.getRecords({ limit: 20 });
        setEmotionRecords(emotionsData.records || []);
      } catch (err: any) {
        console.error('Error fetching emotions:', err);
        toast.error('Failed to load emotion history');
      }

      // Fetch chat insights separately for resilience
      try {
        const insightsData = await emotionAPI.getChatInsights();
        setChatInsights(insightsData.insights || []);
      } catch (err: any) {
        console.error('Error fetching chat insights:', err);
        // We don't necessarily want to toast here if it's just a 401 or empty
        // but it helps debugging for now
        if (err.message !== 'Authentication required') {
          console.log('Chat insights fetch failed, but continuing dashboard load');
        }
      }

      setIsLoading(false);
    };

    if (authAPI.isAuthenticated()) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Calculate stats from real data
  const stats = (() => {
    const totalScans = emotionRecords.length;
    const insightsCount = chatInsights.length;

    if (totalScans === 0 && insightsCount === 0) {
      return [
        { label: "Total Scans", value: "0", icon: Brain, trend: "Start now" },
        { label: "Avg. Happiness", value: "-", icon: TrendingUp, trend: "-" },
        { label: "This Week", value: "0", icon: Calendar, trend: "0 scans" },
        { label: "Insights", value: "0", icon: MessageSquare, trend: "-" },
      ];
    }

    const avgHappiness = totalScans > 0
      ? Math.round(emotionRecords.reduce((sum, r) => sum + (r.emotions.happy || 0), 0) / totalScans)
      : 0;

    // Count records from this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const thisWeek = emotionRecords.filter(r => new Date(r.createdAt) > weekAgo).length;

    return [
      { label: "Total Scans", value: totalScans.toString(), icon: Brain, trend: `+${thisWeek} this week` },
      { label: "Avg. Happiness", value: totalScans > 0 ? `${avgHappiness}%` : "-", icon: TrendingUp, trend: avgHappiness > 50 ? "Good" : "Low" },
      { label: "This Week", value: thisWeek.toString(), icon: Calendar, trend: thisWeek > 0 ? "Active" : "Inactive" },
      { label: "Insights", value: insightsCount.toString(), icon: MessageSquare, trend: "AI Reflections" },
    ];
  })();

  // All 7 emotion types with their colors
  const emotionColors = {
    happy: '#FFD700',
    sad: '#6495ED',
    angry: '#FF4444',
    surprised: '#FF69B4',
    fearful: '#9370DB',
    disgusted: '#32CD32',
    neutral: '#A0A0A0',
  };

  // Calculate weekly data from real records
  const weeklyData = (() => {
    const defaultDay = { happy: 0, sad: 0, angry: 0, surprised: 0, fearful: 0, disgusted: 0, neutral: 0 };
    if (emotionRecords.length === 0) {
      return [
        { day: "Mon", ...defaultDay },
        { day: "Tue", ...defaultDay },
        { day: "Wed", ...defaultDay },
        { day: "Thu", ...defaultDay },
        { day: "Fri", ...defaultDay },
        { day: "Sat", ...defaultDay },
        { day: "Sun", ...defaultDay },
      ];
    }

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const emotionKeys = ['happy', 'sad', 'angry', 'surprised', 'fearful', 'disgusted', 'neutral'] as const;
    const dayData: Record<string, Record<string, number[]>> = {};

    days.forEach(day => {
      dayData[day] = {};
      emotionKeys.forEach(emotion => {
        dayData[day][emotion] = [];
      });
    });

    // Group records by day of week
    emotionRecords.forEach(record => {
      const day = days[new Date(record.createdAt).getDay()];
      emotionKeys.forEach(emotion => {
        dayData[day][emotion].push(record.emotions[emotion] || 0);
      });
    });

    // Calculate averages
    return days.map(day => {
      const result: Record<string, string | number> = { day };
      emotionKeys.forEach(emotion => {
        result[emotion] = dayData[day][emotion].length > 0
          ? Math.round(dayData[day][emotion].reduce((a, b) => a + b, 0) / dayData[day][emotion].length)
          : 0;
      });
      return result;
    });
  })();

  // Format recent emotions for display
  const recentEmotions = emotionRecords.slice(0, 4).map(record => {
    // Create a human-readable emotion label
    const getEmotionLabel = () => {
      if (record.mixedEmotion && record.mixedEmotion.trim() !== '') {
        return record.mixedEmotion;
      }
      // Format dominant emotion nicely if no mixed emotion
      const dominant = record.dominantEmotion;
      const confidence = Math.round(record.confidence);
      return `${dominant.charAt(0).toUpperCase() + dominant.slice(1)} (${confidence}%)`;
    };

    return {
      time: formatDistanceToNow(new Date(record.createdAt), { addSuffix: true }),
      emotionLabel: getEmotionLabel(),
      confidence: record.confidence,
    };
  });

  return (
    <div className="page-container pt-24 pb-20">
      <ParticleBackground className="fixed inset-0 -z-10 opacity-30" />

      <div className="max-w-7xl mx-auto px-4">
        <StaggerContainer>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <FadeUp>
              <h1 className="font-display text-4xl md:text-5xl font-bold">
                Welcome back, <span className="gradient-text">Explorer</span>
              </h1>
              <p className="text-muted-foreground mt-2">
                Here's what your emotional landscape looks like today.
              </p>
            </FadeUp>

            <FadeUp delay={0.1}>
              <Link to="/predict">
                <Button size="lg" className="rounded-2xl gap-2 font-semibold shadow-lg shadow-primary/20">
                  <Camera className="w-5 h-5" />
                  New Analysis
                </Button>
              </Link>
            </FadeUp>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <FadeUp key={stat.label} delay={0.1 + index * 0.05}>
                <Link to={stat.label === "Insights" ? "/insights" : "#"} className={stat.label === "Insights" ? "block cursor-pointer" : "pointer-events-none"}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    animate={stat.label === "Insights" && highlightInsights ? {
                      scale: [1, 1.05, 1],
                      boxShadow: [
                        "0 0 0 0 rgba(139, 92, 246, 0)",
                        "0 0 20px 5px rgba(139, 92, 246, 0.3)",
                        "0 0 0 0 rgba(139, 92, 246, 0)"
                      ]
                    } : {}}
                    transition={{ duration: 0.6 }}
                    className={`glass-card p-6 rounded-3xl ${stat.label === "Insights" && highlightInsights ? 'ring-2 ring-primary/50' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <stat.icon className="w-6 h-6 text-primary" />
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.includes('+') || stat.trend === 'Good' || stat.trend === 'Active'
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-primary/10 text-primary'
                        }`}>
                        {stat.trend}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <motion.h3
                      key={stat.value}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-2xl font-bold mt-1"
                    >
                      {stat.value}
                    </motion.h3>
                  </motion.div>
                </Link>
              </FadeUp>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Main Chart */}
            <FadeUp delay={0.3} className="lg:col-span-2">
              <div className="glass-card p-8 rounded-3xl h-[450px]">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      Emotional Trends
                    </h2>
                    <p className="text-sm text-muted-foreground">Your emotional frequencies over time</p>
                  </div>
                </div>

                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyData}>
                      <defs>
                        {Object.entries(emotionColors).map(([emotion, color]) => (
                          <linearGradient key={emotion} id={`color${emotion}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                        unit="%"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(23, 23, 23, 0.9)',
                          borderRadius: '16px',
                          border: '1px solid rgba(255,255,255,0.1)',
                          backdropFilter: 'blur(10px)'
                        }}
                        itemStyle={{ fontSize: '12px' }}
                      />
                      {Object.entries(emotionColors).map(([emotion, color]) => (
                        <Area
                          key={emotion}
                          type="monotone"
                          dataKey={emotion}
                          stroke={color}
                          fillOpacity={1}
                          fill={`url(#color${emotion})`}
                          strokeWidth={3}
                        />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </FadeUp>

            {/* Info Cards */}
            <div className="space-y-6">
              <FadeUp delay={0.4}>
                <div className="glass-card p-6 rounded-3xl">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Recent Analyses
                  </h2>
                  <div className="space-y-4">
                    {isLoading ? (
                      [1, 2, 3].map(i => <div key={i} className="h-16 animate-pulse bg-muted/20 rounded-2xl" />)
                    ) : emotionRecords.length === 0 ? (
                      <p className="text-center py-4 text-muted-foreground italic text-sm">No scans yet. Start your journey today!</p>
                    ) : (
                      emotionRecords.slice(0, 3).map((item, index) => (
                        <Link key={index} to="/insights">
                          <motion.div
                            whileHover={{ x: 5 }}
                            className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer"
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${(item.emotions.happy || 0) > 50 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-blue-500/20 text-blue-500'
                              }`}>
                              {Math.round(item.confidence)}%
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm truncate uppercase tracking-wider">{item.mixedEmotion || item.dominantEmotion}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                              </p>
                            </div>
                          </motion.div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              </FadeUp>

              <FadeUp delay={0.5}>
                <div className="glass-card overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20">
                  <div className="p-6">
                    <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-primary" />
                      Mood Insight
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {emotionRecords.length > 0
                        ? `You've been feeling quite ${emotionRecords[0].dominantEmotion} lately. Taking a few deep breaths might help you center yourself.`
                        : "Analyze your first emotion to receive personalized AI insights about your current mood patterns."
                      }
                    </p>
                  </div>
                  <div className="bg-primary/10 py-3 px-6 text-xs font-bold text-center text-primary uppercase tracking-[0.2em]">
                    Daily Recommendation
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>

          {/* AI Emotion Journal Chat Section */}
          <FadeUp delay={0.6}>
            <div className="glass-card rounded-[2rem] overflow-hidden border border-white/10 mb-12">
              <div className="grid lg:grid-cols-5 h-[600px]">
                {/* Chat Info Panel */}
                <div className="lg:col-span-2 bg-gradient-to-br from-primary/5 to-accent/5 p-8 flex flex-col justify-between border-r border-white/5">
                  <div>
                    <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
                      <MessageSquare className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-display font-bold mb-4">
                      Your Emotional <span className="gradient-text">Companion</span>
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Reflect, journal, and grow with AI-powered insights. Our companion understands your emotional patterns and provides empathetic guidance.
                    </p>

                    <div className="mt-8 space-y-4">
                      {[
                        "Analyze your recent mood patterns",
                        "Get personalized wellness tips",
                        "Safe space for reflection",
                        "Track your growth over time"
                      ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-xs text-muted-foreground italic">
                      "Growth is a journey, not a destination. Let's explore your emotional landscape together."
                    </p>
                  </div>
                </div>

                {/* Chat Interface */}
                <div className="lg:col-span-3 flex flex-col bg-black/20 h-full overflow-hidden">
                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-6 custom-scrollbar">
                    {chatMessages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center px-8 opacity-60">
                        <Brain className="w-16 h-16 text-muted-foreground/30 mb-6 animate-pulse" />
                        <h3 className="text-xl font-bold mb-2">Ready to grow?</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mb-8">
                          Start your session by sharing your thoughts or asking for an insight based on your history.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl bg-white/5 hover:bg-white/10 border-white/10"
                            onClick={() => setChatInput("How can I improve my mindfulness today?")}
                          >
                            Mindfulness tips
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {chatMessages.map((msg, i) => (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={i}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${msg.role === 'user'
                              ? 'bg-primary text-white rounded-tr-none'
                              : 'glass-card border-none rounded-tl-none leading-relaxed'
                              }`}>
                              {msg.content}
                            </div>
                          </motion.div>
                        ))}
                        {isChatLoading && (
                          <div className="flex justify-start">
                            <div className="glass-card border-none rounded-2xl rounded-tl-none p-4 flex gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Chat Input */}
                  <div className="p-6 border-t border-white/5">
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!chatInput.trim() || isChatLoading) return;

                        const message = chatInput;
                        setChatMessages(prev => [...prev, { role: 'user', content: message }]);
                        setChatInput('');
                        setIsChatLoading(true);

                        try {
                          const emotionContext = emotionRecords.slice(0, 5).map(r =>
                            `${r.mixedEmotion || r.dominantEmotion} (${r.confidence}% confidence) - ${formatDistanceToNow(new Date(r.createdAt), { addSuffix: true })}`
                          ).join('\n');

                          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/chat/journal`, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                            },
                            body: JSON.stringify({
                              message,
                              emotionContext,
                              history: chatMessages.slice(-6),
                            }),
                          });

                          if (!response.ok) throw new Error('Failed to get response');
                          const data = await response.json();
                          setChatMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);

                          // Update insights count instantly
                          const insightsResponse = await emotionAPI.getChatInsights();
                          setChatInsights(insightsResponse.insights || []);

                          // Show success feedback
                          toast.success('💡 Insight saved to your journal!');

                          // Highlight insights card briefly
                          setHighlightInsights(true);
                          setTimeout(() => setHighlightInsights(false), 2000);
                        } catch (err) {
                          console.error('Chat error:', err);
                          setChatMessages(prev => [...prev, {
                            role: 'assistant',
                            content: "I'm having trouble connecting right now. Please try again later."
                          }]);
                        } finally {
                          setIsChatLoading(false);
                        }
                      }}
                      className="flex gap-2"
                    >
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask about your emotions..."
                        className="flex-1 bg-muted/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        disabled={isChatLoading}
                      />
                      <Button
                        type="submit"
                        className="rounded-xl px-4"
                        disabled={!chatInput.trim() || isChatLoading}
                      >
                        {isChatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
        </StaggerContainer>
      </div>
    </div>
  );
};

export default Dashboard;
