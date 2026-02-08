import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { connectDB } from '../utils/db.js';
import ChatInsight from '../../src/models/ChatInsight.js';
import { formatDistanceToNow } from 'date-fns';

/**
 * Handle chat journal messages and save insights
 */
export const handleChatJournal = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { message, emotionContext, history } = req.body;
        console.log('📝 Received chat message:', message);

        const userId = req.userId;
        console.log('👤 Chat User ID:', userId || 'Anonymous');

        // Build the system prompt
        const systemPrompt = `You are a compassionate and insightful AI emotion counselor for an emotion tracking app called InnerGlow. 
Your role is to help users understand their emotional patterns and provide supportive, personalized insights.

Guidelines:
- Be warm, empathetic, and supportive
- Provide actionable suggestions when appropriate
- Reference the user's emotion history when relevant
- Keep responses concise (2-4 sentences unless more detail is needed)
- Use a conversational, friendly tone
- Never be judgmental about emotions
- Encourage emotional awareness and self-reflection

${emotionContext ? `User's recent emotion history:\n${emotionContext}` : 'User has no recent emotion history yet.'}`;

        // Call OpenRouter API
        const openRouterKey = process.env.OPENROUTER_API_KEY;

        if (!openRouterKey) {
            res.json({
                reply: "I'm here to help you understand your emotions! While I'm setting up, try exploring your emotion history on the dashboard. Each emotion you track helps build a picture of your emotional journey. 💜"
            });
            return;
        }

        const messages = [
            { role: 'system', content: systemPrompt },
            ...(history || []).map((h: any) => ({
                role: h.role,
                content: h.content
            })),
            { role: 'user', content: message }
        ];

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openRouterKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:5173',
            },
            body: JSON.stringify({
                model: 'openai/gpt-4o-mini',
                messages,
                max_tokens: 300,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('OpenRouter error:', errorData);
            throw new Error('Failed to get AI response');
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || "I'm here to support you on your emotional journey. How are you feeling today?";

        // Save the insight if user is authenticated
        if (userId) {
            try {
                await connectDB();
                await ChatInsight.create({
                    userId,
                    userMessage: message,
                    aiReply: reply,
                    emotionContext
                });
                console.log(`✅ Saved chat insight for user: ${userId}`);
            } catch (dbError) {
                console.error('Failed to save chat insight to DB:', dbError);
            }
        }

        res.json({ reply });
    } catch (error: any) {
        console.error('Chat journal error:', error);
        res.status(500).json({
            error: 'Failed to process chat',
            reply: "I'm having a moment of quiet reflection. Please try again in a bit! 🌿"
        });
    }
};

/**
 * Get chat insights for the current user
 */
export const getChatInsights = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        await connectDB();
        const userId = req.userId;
        console.log('🔍 Fetching insights for user:', userId);

        if (!userId) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        const insights = await ChatInsight.find({ userId }).sort({ createdAt: -1 });
        console.log(`✅ Found ${insights.length} insights`);
        res.json({ insights });
    } catch (error: any) {
        console.error('❌ Get chat insights error:', error);
        res.status(500).json({ error: 'Failed to retrieve chat insights' });
    }
};
