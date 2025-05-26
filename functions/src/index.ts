import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore'; // Importação adicionada

// Inicializa o app Firebase Admin se ainda não foi inicializado.
// Em um ambiente de Cloud Functions, as credenciais são carregadas automaticamente.
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Define as origens permitidas para CORS
// Em desenvolvimento, seu frontend Vite roda em localhost:5173 (ou outra porta)
// Em produção, seu frontend está em feedback-eco.vercel.app
const allowedOrigins = [
  'http://localhost:5173', // Para desenvolvimento local do seu frontend Vite
  'https://feedback-eco.vercel.app' // Para seu frontend em produção no Vercel
];

// Exporta uma função HTTP chamada 'submitFeedback'
export const submitFeedback = functions.https.onRequest(async (req, res) => {
  // Configurar CORS
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.set('Access-Control-Allow-Origin', origin);
  } else {
    // Para mais segurança, não defina o cabeçalho se a origem não for permitida.
    // Ou defina uma origem padrão como 'null' se você souber o que está fazendo.
    // res.set('Access-Control-Allow-Origin', 'null');
  }

  // Configurar métodos e cabeçalhos permitidos para CORS (essencial para requisições POST)
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Lidar com requisições OPTIONS (preflight requests)
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return; // Garante que a função retorne void
  }

  // 1. Garante que a requisição é um POST
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed', error: 'Only POST requests are allowed.' });
    return; // Garante que a função retorne void
  }

  // 2. Desestrutura os dados do corpo da requisição (req.body)
  const {
    q1_purpose_understanding,
    q2_voice_reflection_help,
    q3_voice_quality_clarity,
    q4_emotional_understanding,
    q5_responses_useful_reflection,
    q6_design_aesthetics,
    q7_ease_of_use,
    q8_emotional_change,        // Esperado como um array de strings
    q8_emotional_change_other,  // String opcional
    q9_recommendation_nps,
    q10_overall_experience_short
  } = req.body;

  // 3. Validação básica dos dados recebidos
  if (!q1_purpose_understanding || !q10_overall_experience_short || typeof q9_recommendation_nps === 'undefined') {
    res.status(400).json({ message: 'Missing required feedback fields. Please ensure all required fields are filled.' });
    return; // Garante que a função retorne void
  }

  try {
    // 4. Captura o IP do usuário (se disponível via cabeçalhos)
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

    // 5. Cria o objeto do documento para ser salvo no Firestore
    const feedbackData = {
      q1_purpose_understanding: q1_purpose_understanding,
      q2_voice_reflection_help: q2_voice_reflection_help,
      q3_voice_quality_clarity: q3_voice_quality_clarity !== undefined && q3_voice_quality_clarity !== null ? parseInt(q3_voice_quality_clarity) : null,
      q4_emotional_understanding: q4_emotional_understanding,
      q5_responses_useful_reflection: q5_responses_useful_reflection !== undefined && q5_responses_useful_reflection !== null ? parseInt(q5_responses_useful_reflection) : null,
      q6_design_aesthetics: q6_design_aesthetics,
      q7_ease_of_use: q7_ease_of_use,
      q8_emotional_change: q8_emotional_change || [],
      q8_emotional_change_other: q8_emotional_change_other || null,
      q9_recommendation_nps: q9_recommendation_nps !== undefined && q9_recommendation_nps !== null ? parseInt(q9_recommendation_nps) : null,
      q10_overall_experience_short: q10_overall_experience_short,
      timestamp: FieldValue.serverTimestamp(),
      ip_address: ipAddress
    };

    // 6. Adiciona o documento à coleção 'feedbacks'
    const docRef = await db.collection('feedbacks').add(feedbackData);

    // 7. Retorna uma resposta de sucesso
    res.status(200).json({
      message: 'Feedback submitted successfully!',
      id: docRef.id,
      data: feedbackData
    });
    return; // Garante que a função retorne void

  } catch (error: unknown) { // Alterado aqui: de 'Error' para 'unknown'
    // 8. Trata erros - Agora com verificação de tipo para 'error'
    if (error instanceof Error) {
        console.error('Error submitting feedback to Firebase:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    } else {
        console.error('An unexpected error occurred:', error);
        res.status(500).json({ message: 'Internal server error', error: 'An unexpected error occurred.' });
    }
    return; // Garante que a função retorne void
  }
});