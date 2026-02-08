import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Loader2, RefreshCw, Sparkles, MessageCircle, AlertCircle, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StaggerContainer, FadeUp } from "@/components/PageTransition";
import { ParticleBackground } from "@/components/ParticleBackground";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface EmotionResult {
  emotion: string;
  percentage: number;
  color: string;
}

interface AnalysisResult {
  emotions: EmotionResult[];
  mixedEmotion: string;
  explanation: string;
  suggestions: string[];
}

const Predict = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      toast.error("Unable to access camera. Please grant permission.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  }, []);

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL("image/jpeg");
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  }, [stopCamera]);

  const saveEmotionRecord = useCallback(async (analysisResult: AnalysisResult) => {
    try {
      // Transform emotions array to match database schema
      // Map display names back to database keys
      const emotionNameMap: Record<string, string> = {
        'happy': 'happy',
        'sad': 'sad',
        'anger': 'angry',
        'surprise': 'surprised',
        'fear': 'fearful',
        'disgust': 'disgusted',
        'neutral': 'neutral',
      };

      const emotionsObj: Record<string, number> = {};
      analysisResult.emotions.forEach(e => {
        const emotionKey = e.emotion.toLowerCase();
        const dbKey = emotionNameMap[emotionKey] || emotionKey;
        emotionsObj[dbKey] = e.percentage;
      });

      console.log('💾 Attempting to save emotion record:', {
        emotionsObj,
        dominantEmotion: analysisResult.emotions[0]?.emotion.toLowerCase(),
        mixedEmotion: analysisResult.mixedEmotion,
        suggestionsCount: analysisResult.suggestions?.length
      });

      // Get auth token if available
      const authToken = localStorage.getItem('authToken');

      const response = await fetch('/api/emotions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
        },
        body: JSON.stringify({
          emotions: emotionsObj,
          dominantEmotion: analysisResult.emotions[0]?.emotion.toLowerCase() || 'neutral',
          confidence: analysisResult.emotions[0]?.percentage || 0,
          mixedEmotion: analysisResult.mixedEmotion,
          explanation: analysisResult.explanation,
          suggestions: analysisResult.suggestions,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Emotion record saved to database:', data);
        toast.success('Emotion saved to your history!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Failed to save emotion record:', response.status, errorData);
        toast.error('Could not save to history');
      }
    } catch (error) {
      console.error('Error saving emotion record:', error);
      // Don't show error to user - saving is secondary to analysis
    }
  }, []);

  const analyzeEmotion = useCallback(async () => {
    if (!capturedImage) return;

    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/emotions/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: capturedImage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to analyze emotion');
      }

      const apiResult = await response.json();

      setResult(apiResult);
      toast.success("Emotion analysis complete!");

      // Auto-save the emotion record to database
      await saveEmotionRecord(apiResult);
    } catch (error: any) {
      console.error('Emotion analysis error:', error);
      toast.error(error.message || 'Failed to analyze emotion. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [capturedImage, saveEmotionRecord]);

  const reset = useCallback(() => {
    setCapturedImage(null);
    setResult(null);
    startCamera();
  }, [startCamera]);

  return (
    <div className="page-container pt-24 pb-20">
      <ParticleBackground className="fixed inset-0 -z-10 opacity-30" />

      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <StaggerContainer className="text-center mb-12">
          <FadeUp>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Emotion <span className="gradient-text">Prediction</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Capture your expression and let our AI reveal the emotions behind it with detailed insights and personalized suggestions.
            </p>
          </FadeUp>
        </StaggerContainer>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Camera Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-3xl p-6 relative overflow-hidden"
          >
            <div className="blur-blob w-48 h-48 bg-primary/10 -top-24 -left-24" />

            <div className="relative z-10">
              <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                Camera Feed
              </h2>

              {/* Video/Image Container */}
              <div className="relative aspect-video bg-muted rounded-2xl overflow-hidden mb-4">
                {!isStreaming && !capturedImage && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                    <Camera className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-center">Click "Start Camera" to begin</p>
                  </div>
                )}

                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${isStreaming ? "" : "hidden"}`}
                />

                {capturedImage && (
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="w-full h-full object-cover"
                  />
                )}

                <canvas ref={canvasRef} className="hidden" />
              </div>

              {/* Controls */}
              <div className="flex flex-wrap gap-3">
                {!isStreaming && !capturedImage && (
                  <Button onClick={startCamera} className="rounded-xl flex-1">
                    <Camera className="w-4 h-4 mr-2" />
                    Start Camera
                  </Button>
                )}

                {isStreaming && (
                  <>
                    <Button onClick={captureImage} className="rounded-xl flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/30">
                      <Camera className="w-4 h-4 mr-2" />
                      Capture
                    </Button>
                    <Button variant="outline" onClick={stopCamera} className="rounded-xl">
                      Stop
                    </Button>
                  </>
                )}

                {capturedImage && !isAnalyzing && !result && (
                  <>
                    <Button
                      onClick={analyzeEmotion}
                      className="rounded-xl flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/30"
                      disabled={isAnalyzing}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Capture & Analyze Emotion
                    </Button>
                    <Button variant="outline" onClick={reset} className="rounded-xl">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </>
                )}

                {result && (
                  <>
                    <Button
                      onClick={() => navigate('/dashboard')}
                      className="rounded-xl flex-1 glow-effect"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Go to Dashboard
                    </Button>
                    <Button variant="outline" onClick={reset} className="rounded-xl">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      New Analysis
                    </Button>
                  </>
                )}

                {isAnalyzing && (
                  <Button disabled className="rounded-xl flex-1">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Emotion Bars */}
            <div className="glass-card rounded-3xl p-6">
              <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Emotion Analysis
              </h2>

              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {/* Mixed Emotion Label */}
                    <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 border border-primary/20 mb-6">
                      <p className="text-sm text-muted-foreground mb-1">Detected Mixed Emotion</p>
                      <p className="font-display text-2xl font-bold gradient-text">{result.mixedEmotion}</p>
                    </div>

                    {/* Emotion Bars */}
                    {result.emotions.map((emotion, index) => (
                      <motion.div
                        key={emotion.emotion}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{emotion.emotion}</span>
                          <span className="text-muted-foreground">{emotion.percentage}%</span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${emotion.percentage}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                            className={`h-full rounded-full ${emotion.color}`}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 text-muted-foreground"
                  >
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Capture an image and analyze to see emotion breakdown</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Insights */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="glass-card rounded-3xl p-6"
                >
                  <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    AI Insights
                  </h2>

                  <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    <p className="text-foreground/90 mb-6 leading-relaxed">
                      {result.explanation}
                    </p>

                    <h3 className="font-semibold mb-3">Gentle Suggestions</h3>
                    <ul className="space-y-3">
                      {result.suggestions.map((suggestion, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="flex items-start gap-3 text-sm"
                        >
                          <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-medium text-xs">
                            {index + 1}
                          </span>
                          <span className="text-foreground/80">{suggestion}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>


                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Predict;
