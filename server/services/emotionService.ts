/**
 * Service for communicating with the external emotion recognition API
 */

const EMOTION_API_URL = process.env.EMOTION_API_URL || 'https://facial-emotion-recognition-production-6ffd.up.railway.app/predict';
const USE_MOCK_API = process.env.USE_MOCK_EMOTION_API === 'true';

// OpenRouter AI Configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Debug logging
console.log('🔧 Emotion Service Configuration:');
console.log('  - EMOTION_API_URL:', EMOTION_API_URL);
console.log('  - USE_MOCK_EMOTION_API env value:', process.env.USE_MOCK_EMOTION_API);
console.log('  - USE_MOCK_API (computed):', USE_MOCK_API);
console.log('  - OPENROUTER_MODEL:', OPENROUTER_MODEL);
console.log('  - OPENROUTER_API_KEY:', OPENROUTER_API_KEY ? '✓ Set' : '✗ Not set');

interface ExternalAPIResponse {
    dominant_emotion: string;
    confidence: number;
    all_emotions: Record<string, number>;
}

interface EmotionPrediction {
    dominantEmotion: string;
    confidence: number;
    emotions: Array<{
        emotion: string;
        percentage: number;
        color: string;
    }>;
    mixedEmotion: string;
    explanation: string;
    suggestions: string[];
    dataSource: 'mock' | 'railway_api';
}

// Emotion color mapping
const emotionColors: Record<string, string> = {
    happy: 'bg-emotion-happy',
    sad: 'bg-emotion-sad',
    angry: 'bg-emotion-anger',
    surprised: 'bg-emotion-surprise',
    fearful: 'bg-emotion-fear',
    disgusted: 'bg-emotion-disgust',
    neutral: 'bg-emotion-neutral',
};

// Emotion display name mapping
const emotionDisplayNames: Record<string, string> = {
    happy: 'Happy',
    sad: 'Sad',
    angry: 'Anger',
    surprised: 'Surprise',
    fearful: 'Fear',
    disgusted: 'Disgust',
    neutral: 'Neutral',
};

/**
 * Generate mixed emotion label based on top emotions
 */
function generateMixedEmotion(emotions: Array<{ emotion: string; percentage: number }>): string {
    const [first, second] = emotions.slice(0, 2);

    console.log('generateMixedEmotion called with:', {
        firstEmotion: first?.emotion,
        firstPercentage: first?.percentage,
        secondEmotion: second?.emotion,
        secondPercentage: second?.percentage,
        emotionsLength: emotions.length
    });

    // Defensive check: ensure we have valid emotion data
    if (!first) {
        console.warn('⚠️ No emotion data available, returning Neutral');
        return 'Neutral';
    }

    if (!first.emotion) {
        console.error('❌ First emotion has no emotion field!', first);
        return 'Unknown';
    }

    if (!second || !second.emotion) {
        console.warn('Not enough emotion data for mixed emotion, returning single emotion');
        return emotionDisplayNames[first.emotion] || first.emotion;
    }

    if (first.percentage > 70) {
        return emotionDisplayNames[first.emotion] || first.emotion;
    }

    const mixedEmotionMap: Record<string, Record<string, string>> = {
        happy: {
            surprised: 'Delighted Joy',
            neutral: 'Contented Calm',
            sad: 'Bittersweet',
        },
        sad: {
            angry: 'Frustrated Sadness',
            fearful: 'Anxious Sadness',
            neutral: 'Melancholy',
        },
        angry: {
            disgusted: 'Indignant Anger',
            fearful: 'Defensive Anger',
        },
        surprised: {
            happy: 'Pleasant Surprise',
            fearful: 'Startled Surprise',
        },
    };

    const key = mixedEmotionMap[first.emotion]?.[second.emotion];
    if (key) {
        console.log('✓ Using predefined mixed emotion:', key);
        return key;
    }

    // Fallback with proper handling of undefined emotion names
    const firstName = emotionDisplayNames[first.emotion] || first.emotion || 'Unknown';
    const secondName = emotionDisplayNames[second.emotion] || second.emotion || 'Unknown';
    const result = `${firstName} with ${secondName}`;
    console.log('✓ Using fallback mixed emotion:', result);
    return result;
}

/**
 * Generate AI explanation based on emotion distribution
 */
function generateExplanation(emotions: Array<{ emotion: string; percentage: number }>): string {
    const [first] = emotions;

    const explanations: Record<string, string> = {
        happy: "Your expression shows genuine happiness and positive energy. This suggests you're in a good emotional state and feeling content with your current situation.",
        sad: "Your expression indicates sadness or low mood. This is a natural emotion that everyone experiences. Remember that it's okay to feel this way, and reaching out for support can help.",
        angry: "Your expression shows signs of anger or frustration. These feelings are valid responses to challenging situations. Consider taking a moment to breathe and address what's bothering you.",
        surprised: "Your expression shows surprise or astonishment. You might be reacting to unexpected news or experiencing something novel and interesting.",
        fearful: "Your expression indicates fear or anxiety. If you're feeling overwhelmed, remember that these feelings are temporary and seeking support can be helpful.",
        disgusted: "Your expression shows disgust or strong disapproval. This emotion often signals a boundary or value that's important to you.",
        neutral: "Your expression appears neutral and calm. This balanced emotional state can be a sign of composure and emotional stability.",
    };

    return explanations[first.emotion] || "Your emotional expression is unique and complex.";
}

/**
 * Generate personalized suggestions based on dominant emotion
 */
function generateSuggestions(dominantEmotion: string): string[] {
    const suggestionMap: Record<string, string[]> = {
        happy: [
            'Share this positive energy with someone you care about',
            'Take a moment to appreciate what\'s bringing you joy',
            'Channel this energy into a creative or productive activity',
        ],
        sad: [
            'Reach out to a trusted friend or family member',
            'Engage in a gentle activity that usually brings you comfort',
            'Remember that it\'s okay to feel sad - be kind to yourself',
        ],
        angry: [
            'Take some deep breaths and give yourself space to calm down',
            'Express your feelings through journaling or physical activity',
            'Consider what might help resolve the situation causing frustration',
        ],
        surprised: [
            'Take a moment to process what just happened',
            'Share your surprise with others who might appreciate it',
            'Embrace the unexpected - it often leads to growth',
        ],
        fearful: [
            'Ground yourself with deep breathing or mindfulness',
            'Talk to someone you trust about what\'s worrying you',
            'Break down what\'s causing fear into smaller, manageable parts',
        ],
        disgusted: [
            'Remove yourself from the situation if possible',
            'Identify what boundary or value is being violated',
            'Practice self-care and activities that bring you comfort',
        ],
        neutral: [
            'Enjoy this moment of calm and balance',
            'Use this stable state to reflect on your goals',
            'Consider engaging in something meaningful to you',
        ],
    };

    return suggestionMap[dominantEmotion] || [
        'Take time to understand your emotional state',
        'Practice self-awareness and mindfulness',
        'Consider keeping an emotion journal',
    ];
}

/**
 * Generate AI-powered mixed emotion label using OpenRouter
 */
async function generateMixedEmotionWithAI(
    emotions: Array<{ emotion: string; percentage: number }>
): Promise<string> {
    // If no API key, fall back to original logic
    if (!OPENROUTER_API_KEY) {
        console.warn('⚠️  OpenRouter API key not set, using fallback logic');
        return generateMixedEmotion(emotions);
    }

    try {
        const emotionContext = emotions
            .map(e => `${e.emotion}: ${e.percentage}%`)
            .join('\n');

        const [first, second] = emotions.slice(0, 2);

        // Build the actual values to pass to AI
        const firstEmotion = first.emotion;
        const firstPercent = first.percentage;
        const secondEmotion = second?.emotion || 'none';
        const secondPercent = second?.percentage || 0;

        console.log('🎯 Emotion values for AI:', {
            first: `${firstEmotion} (${firstPercent}%)`,
            second: `${secondEmotion} (${secondPercent}%)`
        });

        // Determine the label based on clear logic BEFORE calling AI
        let suggestedLabel = '';

        // Check for specific mixed emotions first
        if ((firstEmotion === 'happy' && secondEmotion === 'sad' && secondPercent >= 10) ||
            (firstEmotion === 'sad' && secondEmotion === 'happy' && secondPercent >= 10)) {
            suggestedLabel = 'PAINFUL SMILE';
            console.log('✓ Detected: Painful Smile combination');
        } else if ((firstEmotion === 'surprised' && secondEmotion === 'happy' && secondPercent >= 12) ||
            (firstEmotion === 'happy' && secondEmotion === 'surprised' && secondPercent >= 12)) {
            suggestedLabel = 'SURPRISED HAPPY';
            console.log('✓ Detected: Surprised Happy combination');
        } else if ((firstEmotion === 'fearful' && secondEmotion === 'happy' && secondPercent >= 10) ||
            (firstEmotion === 'happy' && secondEmotion === 'fearful' && secondPercent >= 10)) {
            suggestedLabel = 'NERVOUS JOY';
            console.log('✓ Detected: Nervous Joy (fearful + happy)');
        } else if (firstEmotion === 'sad' && secondEmotion === 'angry' && secondPercent >= 12) {
            suggestedLabel = 'HURT AND ANGRY';
            console.log('✓ Detected: Hurt and Angry');
        } else if (firstEmotion === 'surprised' && secondEmotion === 'fearful' && secondPercent >= 12) {
            suggestedLabel = 'STARTLED FEAR';
            console.log('✓ Detected: Startled Fear');
        }

        const prompt = `You are analyzing a facial expression with these emotion percentages:

TOP EMOTIONS:
1. ${firstEmotion}: ${firstPercent}%
2. ${secondEmotion}: ${secondPercent}%

${emotionContext}

${suggestedLabel ? `REQUIRED LABEL TYPE: ${suggestedLabel}\nYou MUST create a label in this category. Examples for this type:` : 'Create a poetic 2-4 word emotion label based on these rules:'}

${suggestedLabel === 'PAINFUL SMILE' ? `
- "Painful Smile"
- "Bittersweet Smile"  
- "Forced Happiness"
- "Masked Sadness"
Choose one of these or create a similar label combining happiness and sadness.` : ''}

${suggestedLabel === 'SURPRISED HAPPY' ? `
- "Surprised Happy"
- "Delighted Shock"
- "Joyful Surprise"
- "Pleasant Surprise"
Choose one of these or create a similar label combining surprise and happiness.` : ''}

${suggestedLabel === 'NERVOUS JOY' ? `
- "Nervous Joy"
- "Anxious Excitement"
- "Fearful Happiness"
- "Tentative Joy"
Choose one of these or create a similar label combining fear/nervousness and happiness.` : ''}

${suggestedLabel === 'HURT AND ANGRY' ? `
- "Hurt and Angry"
- "Sorrowful Rage"
- "Betrayed Frustration"
Choose one of these or create a similar label combining sadness and anger.` : ''}

${suggestedLabel === 'STARTLED FEAR' ? `
- "Startled Fear"
- "Shocked Anxiety"
- "Fearful Surprise"
Choose one of these or create a similar label combining surprise and fear.` : ''}

${!suggestedLabel ? `GENERAL RULES:
- First check if this is a MIXED emotion (two emotions close in percentage)
- If ${firstEmotion} is dominant but ${secondEmotion} is significant (>10%), create a mixed label
- If ${firstEmotion} is strongly dominant (>40%), use a single emotion label
- Match the tone to the ACTUAL dominant emotion - don't make negative emotions sound positive

SINGLE EMOTION LABELS:
- Sad: "Quiet Sadness", "Melancholic Calm", "Gentle Grief"
- Angry: "Frustrated Tension", "Quiet Anger", "Restrained Fury"  
- Fearful: "Anxious Worry", "Quiet Fear", "Nervous Tension"
- Happy: "Gentle Joy", "Serene Contentment", "Peaceful Bliss"
- Surprised: "Startled Surprise", "Pleasant Surprise"
- Neutral: "Calm Composure", "Quiet Stillness"` : ''}

CRITICAL: Return ONLY a 2-4 word label. No quotes. No explanation.`;

        const response = await fetch(OPENROUTER_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://emotion-compass.app',
                'X-Title': 'Emotion Compass',
            },
            body: JSON.stringify({
                model: OPENROUTER_MODEL,
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                max_tokens: 30,
                temperature: 0.7,
            }),
            signal: AbortSignal.timeout(10000), // 10 second timeout
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('OpenRouter API error response:', errorText);
            throw new Error(`OpenRouter API failed with status ${response.status} `);
        }

        const data = await response.json();
        console.log('OpenRouter raw response:', JSON.stringify(data, null, 2));
        const aiLabel = data.choices?.[0]?.message?.content?.trim();

        console.log('✨ AI Response Details:', {
            hasChoices: !!data.choices,
            choicesLength: data.choices?.length,
            hasMessage: !!data.choices?.[0]?.message,
            hasContent: !!data.choices?.[0]?.message?.content,
            rawContent: data.choices?.[0]?.message?.content,
            trimmedContent: aiLabel
        });

        if (aiLabel && aiLabel.length > 0 && aiLabel.length < 50) {
            // Remove quotes if AI added them
            const cleanLabel = aiLabel.replace(/^["']|["']$/g, '');
            console.log('✨ AI-generated mixed emotion:', cleanLabel);
            return cleanLabel;
        }

        console.warn('⚠️ AI label invalid or empty, using fallback. Label:', aiLabel);
        // Fallback if response is invalid
        return generateMixedEmotion(emotions);
    } catch (error: any) {
        console.error('OpenRouter mixed emotion error:', error.message);
        console.error('Error stack:', error.stack);
        return generateMixedEmotion(emotions);
    }
}

/**
 * Generate AI-powered personalized suggestions using OpenRouter
 */
async function generateSuggestionsWithAI(
    dominantEmotion: string,
    emotions: Array<{ emotion: string; percentage: number }>,
    mixedEmotion: string
): Promise<string[]> {
    // If no API key, fall back to original logic
    if (!OPENROUTER_API_KEY) {
        console.warn('⚠️  OpenRouter API key not set, using fallback logic');
        return generateSuggestions(dominantEmotion);
    }

    try {
        const emotionContext = emotions
            .slice(0, 3)
            .map(e => `${e.emotion}: ${e.percentage}% `)
            .join('\n');

        const prompt = `You are an empathetic emotional support assistant.

The person's current emotional state is: "${mixedEmotion}"

Emotion distribution:
${emotionContext}

Based on this analysis, provide exactly 3 gentle, practical suggestions to help them navigate this emotional state.

            REQUIREMENTS:
• Each suggestion must be warm, supportive, and actionable
• Be specific and practical, not vague
• Keep each suggestion to 10 - 15 words
• Start with an action verb
• Use a gentle, positive tone
• Do NOT mention numbers, probabilities, or uncertainty
• Do NOT exaggerate or catastrophize
• Focus on immediate, helpful actions

OUTPUT FORMAT:
Return ONLY a JSON array of 3 strings.Example:
        ["Take a mindful walk to clear your thoughts", "Share your feelings with someone you trust", "Journal about what brings you comfort today"]

Provide ONLY the JSON array, nothing else.`;

        const response = await fetch(OPENROUTER_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY} `,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://emotion-compass.app',
                'X-Title': 'Emotion Compass',
            },
            body: JSON.stringify({
                model: OPENROUTER_MODEL,
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                max_tokens: 250,
                temperature: 0.7,
            }),
            signal: AbortSignal.timeout(15000), // 15 second timeout
        });

        if (!response.ok) {
            throw new Error(`OpenRouter API failed with status ${response.status} `);
        }

        const data = await response.json();
        console.log('✨ AI Suggestions Response:', {
            hasChoices: !!data.choices,
            choicesLength: data.choices?.length,
            hasMessage: !!data.choices?.[0]?.message,
            hasContent: !!data.choices?.[0]?.message?.content,
            rawContent: data.choices?.[0]?.message?.content?.substring(0, 200)
        });

        const aiResponse = data.choices?.[0]?.message?.content?.trim();

        if (aiResponse) {
            // Try to parse JSON array from response
            const jsonMatch = aiResponse.match(/\[.*\]/s);
            console.log('JSON match found:', !!jsonMatch, jsonMatch?.[0]?.substring(0, 100));

            if (jsonMatch) {
                try {
                    const suggestions = JSON.parse(jsonMatch[0]);
                    if (Array.isArray(suggestions) && suggestions.length >= 3) {
                        console.log('✨ AI-generated suggestions:', suggestions.slice(0, 3));
                        return suggestions.slice(0, 3);
                    } else {
                        console.warn('⚠️ Parsed suggestions but invalid format:', suggestions);
                    }
                } catch (parseError) {
                    console.error('❌ Failed to parse JSON suggestions:', parseError);
                }
            }
        }

        console.warn('⚠️ Using fallback suggestions');
        // Fallback if response is invalid
        return generateSuggestions(dominantEmotion);
    } catch (error: any) {
        console.error('OpenRouter suggestions error:', error.message);
        return generateSuggestions(dominantEmotion);
    }
}

/**
 * Generate mock emotion data for fallback
 */
function generateMockEmotionData(): ExternalAPIResponse {
    const emotions = ['happy', 'neutral', 'surprised', 'sad', 'angry', 'fearful', 'disgusted'];
    const dominant = emotions[Math.floor(Math.random() * 3)]; // Bias towards first 3 emotions

    const all_emotions: Record<string, number> = {};
    let remaining = 1.0;

    // Set dominant emotion
    const dominantValue = 0.4 + Math.random() * 0.35; // 40-75%
    all_emotions[dominant] = dominantValue;
    remaining -= dominantValue;

    // Distribute remaining probability
    emotions.filter(e => e !== dominant).forEach((emotion, index, arr) => {
        if (index === arr.length - 1) {
            all_emotions[emotion] = remaining;
        } else {
            const value = Math.random() * remaining * 0.5;
            all_emotions[emotion] = value;
            remaining -= value;
        }
    });

    return {
        dominant_emotion: dominant,
        confidence: all_emotions[dominant],
        all_emotions,
    };
}

/**
 * Predict emotion from base64 image
 */
export async function predictEmotion(base64Image: string): Promise<EmotionPrediction> {
    try {
        // DISABLED: Mock API to force real Railway API usage
        // if (USE_MOCK_API) {
        //     console.warn('⚠️  Using MOCK emotion detection (external API disabled)');
        //     const mockData = generateMockEmotionData();
        //     return processEmotionResponse(mockData, 'mock');
        // }

        // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

        console.log('🚀 Calling Railway API:', EMOTION_API_URL);
        const response = await fetch(EMOTION_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: base64Data,
            }),
            signal: AbortSignal.timeout(30000), // 30 second timeout
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `API request failed with status ${response.status} `);
        }

        const data: ExternalAPIResponse = await response.json();
        console.log('✅ Real API response received from Railway');
        return await processEmotionResponse(data, 'railway_api');
    } catch (error: any) {
        // Comprehensive error logging for debugging
        console.error('Emotion prediction error:', {
            message: error.message,
            name: error.name,
            code: error.code,
            cause: error.cause,
            causeName: error.cause?.name,
            causeCode: error.cause?.code,
            errno: error.errno,
            syscall: error.syscall
        });

        // DISABLED: Fallback to mock data on network errors to force real API usage
        // const isDNSError =
        //     error.cause?.code === 'ENOTFOUND' ||
        //     error.code === 'ENOTFOUND' ||
        //     error.syscall === 'getaddrinfo' ||
        //     error.message?.includes('getaddrinfo');

        // const isNetworkError =
        //     error.name === 'AbortError' ||
        //     error.name === 'TimeoutError' ||
        //     error.message?.includes('fetch failed') ||
        //     error.cause?.syscall === 'getaddrinfo';

        // if (isDNSError || isNetworkError) {
        //     console.warn('⚠️  External API unavailable, using MOCK emotion detection as fallback');
        //     const mockData = generateMockEmotionData();
        //     return processEmotionResponse(mockData, 'mock');
        // }

        // Handle specific error cases
        if (error.message?.includes('No face detected')) {
            throw new Error('No face detected in the image. Please ensure your face is clearly visible.');
        }

        throw new Error(error.message || 'Failed to analyze emotion. Please try again.');
    }
}

/**
 * Process emotion response data into application format
 */
async function processEmotionResponse(data: ExternalAPIResponse, source: 'mock' | 'railway_api'): Promise<EmotionPrediction> {
    console.log('🔄 Processing emotion response:', {
        dominant_emotion: data.dominant_emotion,
        confidence: data.confidence,
        emotion_keys: Object.keys(data.all_emotions)
    });

    // Transform the response to match our application format
    // Normalize emotion names to lowercase to match our maps
    const emotions = Object.entries(data.all_emotions)
        .map(([emotion, probability]) => ({
            emotion: emotion.toLowerCase(), // Normalize to lowercase
            percentage: Math.round(probability * 100),
            color: emotionColors[emotion.toLowerCase()] || 'bg-primary',
        }))
        .sort((a, b) => b.percentage - a.percentage);

    console.log('📊 Processed emotions:', emotions.slice(0, 3));

    // Use AI to generate mixed emotion and suggestions
    console.log('🤖 Starting AI generation...');
    console.log('  - OPENROUTER_API_KEY available:', !!OPENROUTER_API_KEY);
    console.log('  - API Key length:', OPENROUTER_API_KEY ? OPENROUTER_API_KEY.length : 0);

    const mixedEmotion = await generateMixedEmotionWithAI(emotions);
    console.log('  - Mixed emotion generated:', mixedEmotion);

    const explanation = generateExplanation(emotions);
    console.log('  - Explanation generated:', explanation?.substring(0, 50) + '...');

    const suggestions = await generateSuggestionsWithAI(data.dominant_emotion.toLowerCase(), emotions, mixedEmotion);
    console.log('  - Suggestions generated:', suggestions);

    console.log('✅ Final result:', { mixedEmotion, dominantEmotion: data.dominant_emotion, suggestionsCount: suggestions.length });

    return {
        dominantEmotion: data.dominant_emotion.toLowerCase(),
        confidence: Math.round(data.confidence * 100),
        emotions: emotions.map(e => ({
            ...e,
            emotion: emotionDisplayNames[e.emotion] || e.emotion,
        })),
        mixedEmotion,
        explanation,
        suggestions,
        dataSource: source,
    };
}

