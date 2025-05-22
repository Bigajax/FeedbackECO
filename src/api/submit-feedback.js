// api/submit-feedback.js
import * as admin from 'firebase-admin';

// Importa o conteúdo da chave de serviço do Firebase das variáveis de ambiente
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Inicializa o app Firebase Admin se ainda não foi inicializado
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  // 1. Garante que a requisição é um POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed', error: 'Only POST requests are allowed.' });
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

  // 3. Validação básica dos dados recebidos (pode adicionar mais aqui)
  if (!q1_purpose_understanding || !q10_overall_experience_short) {
    return res.status(400).json({ message: 'Missing required feedback fields. Please ensure Q1 and Q10 are filled.' });
  }

  try {
    // 4. Captura o IP do usuário (se disponível via cabeçalhos do Vercel)
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // 5. Cria o objeto do documento para ser salvo no Firestore
    const feedbackData = {
      q1_purpose_understanding: q1_purpose_understanding,
      q2_voice_reflection_help: q2_voice_reflection_help,
      q3_voice_quality_clarity: q3_voice_quality_clarity ? parseInt(q3_voice_quality_clarity) : null,
      q4_emotional_understanding: q4_emotional_understanding,
      q5_responses_useful_reflection: q5_responses_useful_reflection ? parseInt(q5_responses_useful_reflection) : null,
      q6_design_aesthetics: q6_design_aesthetics,
      q7_ease_of_use: q7_ease_of_use,
      q8_emotional_change: q8_emotional_change || [],
      q8_emotional_change_other: q8_emotional_change_other || null,
      q9_recommendation_nps: q9_recommendation_nps ? parseInt(q9_recommendation_nps) : null,
      q10_overall_experience_short: q10_overall_experience_short,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      ip_address: ipAddress
    };

    // 6. Adiciona o documento à coleção 'feedbacks'
    const docRef = await db.collection('feedbacks').add(feedbackData);

    // 7. Retorna uma resposta de sucesso
    return res.status(200).json({
      message: 'Feedback submitted successfully!',
      id: docRef.id,
      data: feedbackData
    });

  } catch (error) {
    // 8. Trata erros
    console.error('Error submitting feedback to Firebase:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}