import React, { useState, useEffect } from 'react';
import QuestionCard from '../components/QuestionCard';
import RadioGroup from '../components/RadioGroup';
import CheckboxGroup from '../components/CheckboxGroup';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';

const FormPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    purpose: '',
    reflectionState: '',
    voiceQuality: 0,
    emotionalUnderstanding: '',
    reflectionUtility: 0,
    aesthetics: '',
    usability: '',
    emotionalChange: [] as string[],
    recommendation: 0,
    experience: '',
    otherEmotion: ''
  });

  const [animateOrb, setAnimateOrb] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (currentStep === 0) {
      const timer = setTimeout(() => setAnimateOrb(true), 300);
      return () => clearTimeout(timer);
    } else {
      setAnimateOrb(false);
    }
    setShowErrorMessage(false);
    if (currentStep === 0) setSubmissionStatus('idle');
  }, [currentStep]);

  const orbBaseColor = '#7A9EBF';

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setShowErrorMessage(false);
  };

  const isCurrentQuestionAnswered = () => {
    const currentQuestionId = questions[currentStep].id;
    const answer = formData[currentQuestionId as keyof typeof formData];

    if (currentQuestionId === 'welcome' || currentQuestionId === 'thankYou') {
      return true;
    } else if (
      currentQuestionId === 'purpose' ||
      currentQuestionId === 'reflectionState' ||
      currentQuestionId === 'emotionalUnderstanding' ||
      currentQuestionId === 'aesthetics' ||
      currentQuestionId === 'usability'
    ) {
      return typeof answer === 'string' && answer !== '';
    } else if (
      currentQuestionId === 'voiceQuality' ||
      currentQuestionId === 'reflectionUtility' ||
      currentQuestionId === 'recommendation'
    ) {
      return answer !== 0 && answer !== null && answer !== undefined;
    } else if (currentQuestionId === 'emotionalChange') {
      const hasCheckboxSelected = (answer as string[]).length > 0;
      const hasOtherText = formData.otherEmotion.trim() !== '';
      return hasCheckboxSelected || hasOtherText;
    } else if (currentQuestionId === 'experience') {
      return typeof answer === 'string' && answer.trim() !== '';
    }
    return false;
  };

  const submitFeedback = async () => {
    setSubmissionStatus('loading');
    try {
      const payload = {
        q1_purpose_understanding: formData.purpose,
        q2_voice_reflection_help: formData.reflectionState,
        q3_voice_quality_clarity: formData.voiceQuality,
        q4_emotional_understanding: formData.emotionalUnderstanding,
        q5_responses_useful_reflection: formData.reflectionUtility,
        q6_design_aesthetics: formData.aesthetics,
        q7_ease_of_use: formData.usability,
        q8_emotional_change: formData.emotionalChange,
        q8_emotional_change_other: formData.otherEmotion,
        q9_recommendation_nps: formData.recommendation,
        q10_overall_experience_short: formData.experience,
      };

      const response = await fetch('http://127.0.0.1:5001/eco6-11d1c/us-central1/submitFeedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error((await response.json()).message || 'Failed to submit feedback.');

      await response.json();
      setSubmissionStatus('success');
    } catch (error: any) {
      console.error('Error submitting feedback:', error.message);
      setSubmissionStatus('error');
    }
  };

  const handleNext = () => {
    if (currentStep === questions.length - 2 && isCurrentQuestionAnswered()) {
      submitFeedback();
      setCurrentStep(prev => prev + 1);
    } else if (currentStep < questions.length - 1) {
      if (isCurrentQuestionAnswered()) {
        setCurrentStep(prev => prev + 1);
        setShowErrorMessage(false);
      } else {
        setShowErrorMessage(true);
      }
    } else if (currentStep === questions.length - 1) {
      setCurrentStep(0);
      setSubmissionStatus('idle');
      setFormData({
        purpose: '',
        reflectionState: '',
        voiceQuality: 0,
        emotionalUnderstanding: '',
        reflectionUtility: 0,
        aesthetics: '',
        usability: '',
        emotionalChange: [],
        recommendation: 0,
        experience: '',
        otherEmotion: ''
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setShowErrorMessage(false);
      setSubmissionStatus('idle');
    }
  };

  const questions = [
    {
      id: 'welcome',
      title: '',
      component: (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-8">ECO</h1>
          <p className="mb-2 text-gray-700">Obrigado por usar a Eco.</p>
          <p className="mb-8 text-gray-700">Sua opinião nos ajuda a melhorar a experiência.</p>
          <button
            onClick={handleNext}
            className="px-8 py-4 rounded-xl bg-white text-gray-800 font-medium text-lg transition-all hover:scale-105 duration-300 shadow-sm hover:shadow-md shadow-gray-300/50 hover:shadow-gray-400/50 w-full"
          >
            Iniciar Feedback
          </button>
        </div>
      )
    },
    {
      id: 'purpose',
      title: 'Você entendeu o propósito da Eco como uma IA para autoconhecimento e reflexão emocional?',
      component: (
        <RadioGroup
          name="purpose"
          value={formData.purpose}
          onChange={(value) => updateFormData('purpose', value)}
          options={[
            { label: 'Não entendi', value: 'not_understood' },
            { label: 'Entendi parcialmente', value: 'partially_understood' },
            { label: 'Sim, entendi claramente', value: 'clearly_understood' },
            { label: 'Sim, e me conectei com a proposta', value: 'connected' }
          ]}
          layout="vertical"
        />
      )
    },
    {
      id: 'reflectionState',
      title: 'Conversar com a Eco te ajudou a entrar em um estado de reflexão?',
      component: (
        <RadioGroup
          name="reflectionState"
          value={formData.reflectionState}
          onChange={(value) => updateFormData('reflectionState', value)}
          options={[
            { label: 'Nada', value: 'nothing' },
            { label: 'Pouco', value: 'little' },
            { label: 'Mediano', value: 'medium' },
            { label: 'Bastante', value: 'quite' },
            { label: 'Muito', value: 'very_much' }
          ]}
        />
      )
    },
    {
      id: 'emotionalUnderstanding',
      title: 'Você sentiu que a Eco entendeu bem o que você estava sentindo ou pensando?',
      component: (
        <RadioGroup
          name="emotionalUnderstanding"
          value={formData.emotionalUnderstanding}
          onChange={(value) => updateFormData('emotionalUnderstanding', value)}
          options={[
            { label: 'Nada', value: 'nothing' },
            { label: 'Pouco', value: 'little' },
            { label: 'Mediano', value: 'medium' },
            { label: 'Bastante', value: 'quite' },
            { label: 'Totalmente', value: 'totally' }
          ]}
        />
      )
    },
    {
      id: 'reflectionUtility',
      title: 'As respostas da Eco te ajudaram a refletir sobre si mesmo ou se conhecer melhor?',
      component: (
        <RadioGroup
          name="reflectionUtility"
          value={formData.reflectionUtility.toString()}
          onChange={(value) => updateFormData('reflectionUtility', parseInt(value))}
          options={[
            { label: '1', value: '1' },
            { label: '2', value: '2' },
            { label: '3', value: '3' },
            { label: '4', value: '4' },
            { label: '5', value: '5' }
          ]}
        />
      )
    },
    {
      id: 'usability',
      title: 'Foi fácil e intuitivo conversar e navegar pela Eco?',
      component: (
        <RadioGroup
          name="usability"
          value={formData.usability}
          onChange={(value) => updateFormData('usability', value)}
          options={[
            { label: 'Difícil', value: 'difficult' },
            { label: 'Pouco intuitiva', value: 'slightly_intuitive' },
            { label: 'Mediana', value: 'medium' },
            { label: 'Intuitiva', value: 'intuitive' },
            { label: 'Muito intuitiva', value: 'very_intuitive' }
          ]}
          layout="vertical"
        />
      )
    },
    {
      id: 'aesthetics',
      title: 'O design da Eco te passou uma sensação agradável e leve?',
      component: (
        <RadioGroup
          name="aesthetics"
          value={formData.aesthetics}
          onChange={(value) => updateFormData('aesthetics', value)}
          options={[
            { label: 'Muito desagradável', value: 'very_unpleasant' },
            { label: 'Desagradável', value: 'unpleasant' },
            { label: 'Neutra', value: 'neutral' },
            { label: 'Agradável', value: 'pleasant' },
            { label: 'Muito agradável', value: 'very_pleasant' }
          ]}
        />
      )
    },
    {
      id: 'emotionalChange',
      title: 'Após a interação, você sentiu alguma mudança emocional?',
      component: (
        <div>
          <CheckboxGroup
            options={[
              { label: 'Mais calmo', value: 'calmer' },
              { label: 'Mais claro mentalmente', value: 'mentally_clearer' },
              { label: 'Mais consciente', value: 'more_aware' },
              { label: 'Confuso', value: 'confused' },
              { label: 'Nenhuma mudança', value: 'no_change' }
            ]}
            selectedValues={formData.emotionalChange}
            onChange={(values) => updateFormData('emotionalChange', values)}
          />
          <div className="mt-4">
            <TextInput
              placeholder="Outro..."
              value={formData.otherEmotion}
              onChange={(value) => updateFormData('otherEmotion', value)}
            />
          </div>
        </div>
      )
    },
    {
      id: 'recommendation',
      title: 'De 0 a 10, o quanto você recomendaria a Eco para alguém que busca se conhecer melhor?',
      component: (
        <div className="flex flex-wrap justify-center gap-2">
          {Array.from({ length: 11 }).map((_, i) => (
            <button
              key={i}
              className={`w-10 h-10 rounded-full border transition-all duration-300 ${
                formData.recommendation === i
                  ? 'border-blue-500 bg-blue-500 text-white'
                  : 'border-gray-300 hover:border-gray-400 text-gray-700'
              }`}
              onClick={() => updateFormData('recommendation', i)}
            >
              {i}
            </button>
          ))}
        </div>
      )
    },
    {
      id: 'experience',
      title: 'Em uma palavra ou frase curta, como você descreveria sua experiência com a Eco?',
      component: (
        <TextInput
          placeholder="Ex: Transformadora, Reveladora..."
          value={formData.experience}
          onChange={(value) => updateFormData('experience', value)}
        />
      )
    },
    {
      id: 'thankYou',
      title: '',
      component: (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Obrigado pelo seu feedback!</h2>
          {submissionStatus === 'loading' && (
            <p className="text-gray-600 mb-4">Enviando seu feedback...</p>
          )}
          {submissionStatus === 'success' && (
            <p className="text-green-600 font-bold mb-4">Feedback enviado com sucesso!</p>
          )}
          {submissionStatus === 'error' && (
            <p className="text-red-600 font-bold mb-4">Erro ao enviar feedback. Tente novamente.</p>
          )}
          <p className="mb-8 text-gray-700">
            Suas respostas nos ajudarão a melhorar a experiência da Eco.
          </p>
          <button
            onClick={handleNext}
            className="px-8 py-4 rounded-xl bg-white text-gray-800 font-medium text-lg transition-all hover:scale-105 duration-300 shadow-sm hover:shadow-md shadow-gray-300/50 hover:shadow-gray-400/50"
          >
            Voltar ao início
          </button>
        </div>
      )
    }
  ];

  const currentQuestion = questions[currentStep];

  return (
    <div className="min-h-screen bg-[#F8F6FA] flex flex-col p-4 relative">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] md:w-[20vw] md:h-[20vw] rounded-full bg-[#E0BBE4] opacity-20 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-[45vw] h-[45vw] md:w-[25vw] md:h-[25vw] rounded-full bg-[#957DAD] opacity-20 blur-[120px] animate-pulse delay-1000"></div>
      </div>
      <div className="z-10 flex flex-col flex-grow items-center justify-center pt-8 pb-4">
        {currentStep === 0 && (
          <div
            className={`relative mb-8 transition-all duration-1000 ${
              animateOrb ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
            }`}
            style={{ width: '192px', height: '192px' }}
          >
            <div className="glass-bubble-container relative w-full h-full floating">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle at 30% 30%, white 0%, ${orbBaseColor}10 30%, ${orbBaseColor}20 60%, ${orbBaseColor}30 100%)`,
                  boxShadow: `0 8px 32px 0 rgba(31, 38, 135, 0.2), inset 0 -10px 20px 0 ${orbBaseColor}30, inset 0 10px 20px 0 rgba(255, 255, 255, 0.7)`,
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                }}
              />
              <div
                className="absolute bottom-0 left-1/2 w-3/4 h-4 rounded-full transform -translate-x-1/2 translate-y-10 opacity-40"
                style={{
                  background: `radial-gradient(ellipse at center, ${orbBaseColor}80 0%, transparent 70%)`,
                  filter: 'blur(4px)',
                }}
              />
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  border: `1px solid ${orbBaseColor}30`,
                  animation: 'pulse 2s infinite',
                }}
              />
            </div>
          </div>
        )}
        {currentStep > 0 && currentStep < questions.length - 1 && (
          <div className="mb-4 max-w-md mx-auto w-full">
            <ProgressBar currentStep={currentStep} totalSteps={questions.length - 2} />
          </div>
        )}
        <QuestionCard
          title={currentQuestion.title}
          className={`${currentStep === 0 || currentStep === questions.length - 1 ? '' : 'mt-8'}`}
        >
          {currentQuestion.component}
          {currentStep > 0 && currentStep < questions.length - 1 && (
            <div className="flex flex-col items-center mt-8">
              {showErrorMessage && (
                <p className="text-red-500 text-sm mb-2">Escolha uma opção para seguir.</p>
              )}
              <div className="flex justify-between w-full">
                <Button onClick={handlePrevious} variant="secondary">Voltar</Button>
                <Button onClick={handleNext}>Próxima</Button>
              </div>
            </div>
          )}
        </QuestionCard>
      </div>
    </div>
  );
};

export default FormPage;
