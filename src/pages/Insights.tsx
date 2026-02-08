import { motion } from "framer-motion";
import { Brain, Calendar, Clock, ChevronRight, MessageCircle, Sparkles, ArrowLeft } from "lucide-react";
import { StaggerContainer, FadeUp } from "@/components/PageTransition";
import { ParticleBackground } from "@/components/ParticleBackground";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { emotionAPI, EmotionRecord } from "@/lib/api";

const Insights = () => {
    const [chatInsights, setChatInsights] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedInsight, setSelectedInsight] = useState<any | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const insightsData = await emotionAPI.getChatInsights();
                setChatInsights(insightsData.insights || []);
            } catch (err: any) {
                console.error('Error fetching data:', err);
                // More specific error messages
                if (err.message.includes('Authentication') || err.message.includes('401') || err.message.includes('No token')) {
                    toast.error('Please log in to view your chat history');
                } else {
                    toast.error('Failed to load chat insights');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Set default selection
    useEffect(() => {
        if (chatInsights.length > 0 && !selectedInsight) {
            setSelectedInsight(chatInsights[0]);
        }
    }, [chatInsights]);

    return (
        <div className="page-container pt-24 pb-20">
            <ParticleBackground className="fixed inset-0 -z-10 opacity-30" />

            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <StaggerContainer className="mb-12">
                    <div className="flex items-center gap-4 mb-6">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(-1)}
                            className="rounded-full bg-muted/50 hover:bg-muted"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <FadeUp>
                            <h1 className="font-display text-4xl md:text-5xl font-bold">
                                Chat <span className="gradient-text">History</span>
                            </h1>
                        </FadeUp>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <FadeUp delay={0.1}>
                            <p className="text-muted-foreground">
                                Review your conversations with your AI emotional companion.
                            </p>
                        </FadeUp>
                    </div>
                </StaggerContainer>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* List Section */}
                    <div className="lg:col-span-1 space-y-4">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <MessageCircle className="w-5 h-5 text-primary" /> Your Conversations
                        </h2>

                        {isLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="glass-card rounded-2xl p-4 animate-pulse h-24" />
                                ))}
                            </div>
                        ) : chatInsights.length === 0 ? (
                            <EmptyState type="reflections" />
                        ) : (
                            chatInsights.map((insight) => (
                                <ReflectionCard
                                    key={insight._id}
                                    insight={insight}
                                    isActive={selectedInsight?._id === insight._id}
                                    onClick={() => setSelectedInsight(insight)}
                                />
                            ))
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="lg:col-span-2">
                        {selectedInsight ? (
                            <ReflectionDetail insight={selectedInsight} />
                        ) : (
                            <PlaceholderState type="Conversation" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sub-components for cleaner structure
const EmptyState = ({ type }: { type: 'analyses' | 'reflections' }) => (
    <div className="glass-card rounded-2xl p-8 text-center">
        {type === 'analyses' ? (
            <Brain className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
        ) : (
            <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
        )}
        <p className="text-muted-foreground">No {type} found yet.</p>
        <Link to={type === 'analyses' ? "/predict" : "/dashboard"} className="mt-4 inline-block">
            <Button variant="outline" size="sm">
                {type === 'analyses' ? 'Start an analysis' : 'Chat with Companion'}
            </Button>
        </Link>
    </div>
);

const AnalysisCard = ({ record, isActive, onClick }: any) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`glass-card rounded-2xl p-4 cursor-pointer transition-all border-2 ${isActive ? 'border-primary bg-primary/5' : 'border-transparent'
            }`}
    >
        <div className="flex justify-between items-start mb-2">
            <span className="font-bold text-sm gradient-text truncate mr-2">
                {record.mixedEmotion || record.dominantEmotion}
            </span>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                {formatDistanceToNow(new Date(record.createdAt), { addSuffix: true })}
            </span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-primary" />
                <span>{record.suggestions?.length || 0} suggestions</span>
            </div>
            <ChevronRight className="w-4 h-4" />
        </div>
    </motion.div>
);

const ReflectionCard = ({ insight, isActive, onClick }: any) => {
    // Check if insight is new (created within last 5 minutes)
    const isNew = (Date.now() - new Date(insight.createdAt).getTime()) < 5 * 60 * 1000;

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`glass-card rounded-2xl p-4 cursor-pointer transition-all border-2 relative ${isActive ? 'border-primary bg-primary/5' : 'border-transparent'
                }`}
        >
            {isNew && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                    NEW
                </span>
            )}
            <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-sm text-white truncate mr-2">
                    {insight.userMessage.length > 30 ? insight.userMessage.substring(0, 30) + '...' : insight.userMessage}
                </span>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(insight.createdAt), { addSuffix: true })}
                </span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3 text-primary" />
                    <span className="truncate max-w-[150px]">{insight.aiReply.substring(0, 40)}...</span>
                </div>
                <ChevronRight className="w-4 h-4" />
            </div>
        </motion.div>
    );
};

const AnalysisDetail = ({ record }: { record: EmotionRecord }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        key={record._id}
        className="glass-card rounded-3xl p-8"
    >
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
                <h2 className="font-display text-3xl font-bold gradient-text mb-2">
                    {record.mixedEmotion || record.dominantEmotion}
                </h2>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(record.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(record.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>
            <div className="bg-primary/10 text-primary px-4 py-2 rounded-full font-bold">
                {Math.round(record.confidence)}% Confidence
            </div>
        </div>

        <div className="space-y-8">
            <section>
                <h3 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    Analysis Explanation
                </h3>
                <div className="bg-muted/30 rounded-2xl p-6 text-muted-foreground leading-relaxed border border-border/50">
                    {record.explanation || "No detailed explanation available for this analysis."}
                </div>
            </section>

            <section>
                <h3 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Personalized Suggestions
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                    {record.suggestions && record.suggestions.length > 0 ? (
                        record.suggestions.map((suggestion, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-muted/50 rounded-2xl p-5 border border-border/50 flex gap-4"
                            >
                                <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm">
                                    {index + 1}
                                </span>
                                <p className="text-sm text-muted-foreground">{suggestion}</p>
                            </motion.div>
                        ))
                    ) : (
                        <p className="text-muted-foreground col-span-2 italic">No specific suggestions for this mood.</p>
                    )}
                </div>
            </section>
        </div>
    </motion.div>
);

const ReflectionDetail = ({ insight }: { insight: any }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        key={insight._id}
        className="glass-card rounded-3xl p-8"
    >
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
                <h2 className="font-display text-3xl font-bold text-white mb-2">
                    AI Reflection
                </h2>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(insight.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(insight.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>
        </div>

        <div className="space-y-8">
            <section>
                <h3 className="font-display text-lg font-semibold mb-3 text-primary/80">Your Thought</h3>
                <div className="bg-primary/5 rounded-2xl p-6 text-white border border-primary/10 italic">
                    "{insight.userMessage}"
                </div>
            </section>

            <section>
                <h3 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    AI Guidance
                </h3>
                <div className="bg-muted/30 rounded-2xl p-6 text-muted-foreground leading-relaxed border border-border/50">
                    {insight.aiReply}
                </div>
            </section>

            {insight.emotionContext && (
                <section>
                    <h3 className="font-display text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-widest">Context Considered</h3>
                    <div className="text-xs text-muted-foreground/60 p-4 border border-white/5 rounded-xl bg-black/20">
                        {insight.emotionContext}
                    </div>
                </section>
            )}
        </div>
    </motion.div>
);

const PlaceholderState = ({ type }: { type: string }) => (
    <div className="h-full min-h-[400px] glass-card rounded-3xl p-8 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Sparkles className="w-10 h-10 text-primary animate-pulse" />
        </div>
        <h3 className="font-display text-2xl font-bold mb-2">Select a {type}</h3>
        <p className="text-muted-foreground max-w-sm">
            Choose a {type.toLowerCase()} from the list to view the detailed personal journey.
        </p>
    </div>
);

export default Insights;
