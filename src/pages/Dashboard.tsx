import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Calendar, MessageSquare, Brain, Clock, AlertCircle, Camera, Send, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
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
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [highlightInsights, setHighlightInsights] = useState(false);
  const [showChatInfo, setShowChatInfo] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const emotionsData = await emotionAPI.getRecords({ limit: 20 });
        setEmotionRecords(emotionsData.records || []);
      } catch (err: any) {
        console.error('Error fetching emotions:', err);
        toast.error('Failed to load emotion history');
      }
      try {
        const insightsData = await emotionAPI.getChatInsights();
        setChatInsights(insightsData.insights || []);
      } catch (err: any) {
        console.error('Error fetching chat insights:', err);
      }
      setIsLoading(false);
    };
    if (authAPI.isAuthenticated()) fetchData();
    else setIsLoading(false);
  }, []);

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
      ? Math.round(emotionRecords.reduce((sum, r) => sum + (r.emotions.happy || 0), 0) / totalScans) : 0;
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

  const emotionColors = {
    happy: '#FFD700', sad: '#6495ED', angry: '#FF4444',
    surprised: '#FF69B4', fearful: '#9370DB', disgusted: '#32CD32', neutral: '#A0A0A0',
  };

  const weeklyData = (() => {
    const defaultDay = { happy: 0, sad: 0, angry: 0, surprised: 0, fearful: 0, disgusted: 0, neutral: 0 };
    if (emotionRecords.length === 0) {
      return ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(day => ({ day, ...defaultDay }));
    }
    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const emotionKeys = ['happy','sad','angry','surprised','fearful','disgusted','neutral'] as const;
    const dayData: Record<string, Record<string, number[]>> = {};
    days.forEach(day => {
      dayData[day] = {};
      emotionKeys.forEach(e => { dayData[day][e] = []; });
    });
    emotionRecords.forEach(record => {
      const day = days[new Date(record.createdAt).getDay()];
      emotionKeys.forEach(e => { dayData[day][e].push(record.emotions[e] || 0); });
    });
    return days.map(day => {
      const result: Record<string, string | number> = { day };
      emotionKeys.forEach(e => {
        result[e] = dayData[day][e].length > 0
          ? Math.round(dayData[day][e].reduce((a, b) => a + b, 0) / dayData[day][e].length) : 0;
      });
      return result;
    });
  })();

  const handleChatSubmit = async (e: React.FormEvent) => {
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
      const response = await fetch(`/api/chat/journal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ message, emotionContext, history: chatMessages.slice(-6) }),
      });
      if (!response.ok) throw new Error('Failed to get response');
      const data = await response.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      const insightsResponse = await emotionAPI.getChatInsights();
      setChatInsights(insightsResponse.insights || []);
      toast.success('Insight saved to your journal!');
      setHighlightInsights(true);
      setTimeout(() => setHighlightInsights(false), 2000);
    } catch (err) {
      console.error('Chat error:', err);
      setChatMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="page-container pt-20 sm:pt-24 pb-16 sm:pb-20">
      <ParticleBackground className="fixed inset-0 -z-10 opacity-30" />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <StaggerContainer>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-12">
            <FadeUp>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold">
                Welcome back, <span className="gradient-text">Explorer</span>
              </h1>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                Here's what your emotional landscape looks like today.
              </p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <Link to="/predict">
                <Button size="lg" className="rounded-2xl gap-2 font-semibold shadow-lg shadow-primary/20 w-full sm:w-auto">
                  <Camera className="w-5 h-5" />
                  New Analysis
                </Button>
              </Link>
            </FadeUp>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12">
            {stats.map((stat, index) => (
              <FadeUp key={stat.label} delay={0.1 + index * 0.05}>
                <Link to={stat.label === "Insights" ? "/insights" : "#"} className={stat.label === "Insights" ? "block cursor-pointer" : "pointer-events-none"}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    animate={stat.label === "Insights" && highlightInsights ? {
                      scale: [1, 1.05, 1],
                      boxShadow: ["0 0 0 0 rgba(139, 92, 246, 0)", "0 0 20px 5px rgba(139, 92, 246, 0.3)", "0 0 0 0 rgba(139, 92, 246, 0)"]
                    } : {}}
                    transition={{ duration: 0.6 }}
                    className={`glass-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl ${stat.label === "Insights" && highlightInsights ? 'ring-2 ring-primary/50' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center">
                        <stat.icon className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
                      </div>
                      <span className={`text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${stat.trend.includes('+') || stat.trend === 'Good' || stat.trend === 'Active'
                        ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'}`}>
                        {stat.trend}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                    <motion.h3 key={stat.value} initial={{ scale: 1.2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      className="text-xl sm:text-2xl font-bold mt-1">{stat.value}</motion.h3>
                  </motion.div>
                </Link>
              </FadeUp>
            ))}
          </div>

          {/* Chart + Info Cards */}
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <FadeUp delay={0.3} className="lg:col-span-2">
              <div className="glass-card p-4 sm:p-8 rounded-2xl sm:rounded-3xl">
                <div className="flex items-center justify-between mb-4 sm:mb-8">
                  <div>
                    <h2 className="text-base sm:text-xl font-bold flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      Emotional Trends
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">Your emotional frequencies over time</p>
                  </div>
                </div>
                <div className="h-48 sm:h-64 lg:h-[320px] w-full">
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
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} unit="%" width={32} />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(23,23,23,0.9)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
                        itemStyle={{ fontSize: '12px' }} labelStyle={{ color: '#ffffff' }}
                      />
                      {Object.entries(emotionColors).map(([emotion, color]) => (
                        <Area key={emotion} type="monotone" dataKey={emotion} stroke={color} fillOpacity={1} fill={`url(#color${emotion})`} strokeWidth={2} />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </FadeUp>

            <div className="space-y-4 sm:space-y-6">
              <FadeUp delay={0.4}>
                <div className="glass-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl">
                  <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    Recent Analyses
                  </h2>
                  <div className="space-y-3">
                    {isLoading ? (
                      [1,2,3].map(i => <div key={i} className="h-14 animate-pulse bg-muted/20 rounded-2xl" />)
                    ) : emotionRecords.length === 0 ? (
                      <p className="text-center py-4 text-muted-foreground italic text-xs sm:text-sm">No scans yet. Start your journey today!</p>
                    ) : (
                      emotionRecords.slice(0, 3).map((item, index) => (
                        <Link key={index} to="/insights">
                          <motion.div whileHover={{ x: 5 }}
                            className="flex items-center gap-3 p-2.5 sm:p-3 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer">
                            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${(item.emotions.happy || 0) > 50 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-blue-500/20 text-blue-500'}`}>
                              {Math.round(item.confidence)}%
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-xs sm:text-sm truncate uppercase tracking-wider">{item.mixedEmotion || item.dominantEmotion}</p>
                              <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</p>
                            </div>
                          </motion.div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              </FadeUp>

              <FadeUp delay={0.5}>
                <div className="glass-card overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20">
                  <div className="p-4 sm:p-6">
                    <h2 className="text-base sm:text-lg font-bold mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      Mood Insight
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {emotionRecords.length > 0
                        ? `You've been feeling quite ${emotionRecords[0].dominantEmotion} lately. Taking a few deep breaths might help you center yourself.`
                        : "Analyze your first emotion to receive personalized AI insights about your current mood patterns."}
                    </p>
                  </div>
                  <div className="bg-primary/10 py-2.5 sm:py-3 px-4 sm:px-6 text-xs font-bold text-center text-primary uppercase tracking-[0.2em]">
                    Daily Recommendation
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>

          {/* AI Chat Section */}
          <FadeUp delay={0.6}>
            <div className="glass-card rounded-2xl sm:rounded-[2rem] overflow-hidden border border-white/10 mb-8 sm:mb-12">
              {/* Mobile: collapsible info toggle */}
              <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/5 bg-gradient-to-r from-primary/5 to-accent/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-bold text-sm">Emotional Companion</h2>
                    <p className="text-xs text-muted-foreground">AI-powered support</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChatInfo(!showChatInfo)}
                  className="text-xs text-primary font-medium px-3 py-1.5 rounded-lg bg-primary/10"
                >
                  {showChatInfo ? 'Hide' : 'About'}
                </button>
              </div>

              {/* Mobile info panel (collapsible) */}
              {showChatInfo && (
                <div className="lg:hidden p-4 bg-gradient-to-br from-primary/5 to-accent/5 border-b border-white/5 text-sm text-muted-foreground space-y-2">
                  <p>Reflect, journal, and grow with AI-powered insights tailored to your emotional patterns.</p>
                  {["Analyze your recent mood patterns","Get personalized wellness tips","Safe space for reflection"].map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />{f}
                    </div>
                  ))}
                </div>
              )}

              <div className="grid lg:grid-cols-5 h-auto lg:h-[600px]">
                {/* Desktop Info Panel */}
                <div className="hidden lg:flex lg:col-span-2 bg-gradient-to-br from-primary/5 to-accent/5 p-8 flex-col justify-between border-r border-white/5">
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
                      {["Analyze your recent mood patterns","Get personalized wellness tips","Safe space for reflection","Track your growth over time"].map((feature, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />{feature}
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
                <div className="lg:col-span-3 flex flex-col bg-black/20 min-h-[400px] lg:h-full overflow-hidden">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 space-y-4 sm:space-y-6 custom-scrollbar">
                    {chatMessages.length === 0 ? (
                      <div className="h-full min-h-[280px] flex flex-col items-center justify-center text-center px-4 sm:px-8 opacity-60">
                        <Brain className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground/30 mb-4 sm:mb-6 animate-pulse" />
                        <h3 className="text-lg sm:text-xl font-bold mb-2">Ready to grow?</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground max-w-xs mb-6 sm:mb-8">
                          Start your session by sharing your thoughts or asking for an insight based on your history.
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                          <Button variant="outline" size="sm" className="rounded-xl bg-white/5 hover:bg-white/10 border-white/10 text-xs sm:text-sm"
                            onClick={() => setChatInput("How can I improve my mindfulness today?")}>
                            Mindfulness tips
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 sm:space-y-6">
                        {chatMessages.map((msg, i) => (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[90%] sm:max-w-[85%] p-3 sm:p-4 rounded-2xl text-xs sm:text-sm ${msg.role === 'user'
                              ? 'bg-primary text-white rounded-tr-none'
                              : 'glass-card border-none rounded-tl-none leading-relaxed'}`}>
                              {msg.role === 'assistant' ? (
                                <div className="space-y-2">
                                  {msg.content.split(/\n(?=\d+\.\s)|\n\n/).filter(Boolean).map((block, bi) => {
                                    const listMatch = block.match(/^(\d+)\.\s(.+)$/s);
                                    if (listMatch) {
                                      const [, num, rest] = listMatch;
                                      return (
                                        <div key={bi} className="flex items-start gap-2 sm:gap-3">
                                          <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/20 text-primary text-[10px] sm:text-xs font-bold flex items-center justify-center mt-0.5">{num}</span>
                                          <span className="flex-1" dangerouslySetInnerHTML={{ __html: rest.replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>') }} />
                                        </div>
                                      );
                                    }
                                    return <p key={bi} dangerouslySetInnerHTML={{ __html: block.replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>') }} />;
                                  })}
                                </div>
                              ) : msg.content}
                            </div>
                          </motion.div>
                        ))}
                        {isChatLoading && (
                          <div className="flex justify-start">
                            <div className="glass-card border-none rounded-2xl rounded-tl-none p-3 sm:p-4 flex gap-2">
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
                  <div className="p-3 sm:p-6 border-t border-white/5">
                    <form onSubmit={handleChatSubmit} className="flex gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask about your emotions..."
                        className="flex-1 bg-muted/50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 min-w-0"
                        disabled={isChatLoading}
                      />
                      <Button type="submit" className="rounded-xl px-3 sm:px-4 flex-shrink-0" disabled={!chatInput.trim() || isChatLoading}>
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
