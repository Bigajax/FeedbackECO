import React, { useState } from 'react';
import Bubble from '../components/Bubble';
import QuestionCard from '../components/QuestionCard';
import RadioGroup from '../components/RadioGroup';
import Slider from '../components/Slider';
import CheckboxGroup from '../components/CheckboxGroup';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';

const FormPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    purpose: '',
    reflectionState: '',
    voiceQuality: 5,
    emotionalUnderstanding: '',
    reflectionUtility: 5,
    aesthetics: '',
    usability: '',
    emotionalChange: [] as string[],
    recommendation: '',
    experience: '',
    otherEmotion: ''
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const questions = [
    {
      id: 'welcome',
      title: '',
      component: (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-8">Eco</h1>
          <p className="mb-8 text-gray-700">
            Obrigado por usar a Eco. Sua opinião nos ajuda a melhorar a experiência.
          </p>
          <Button onClick={() => setCurrentStep(prev => prev + 1)} fullWidth>
            Iniciar Feedback
          </Button>
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
      title: 'A voz da Eco te ajudou a entrar em um estado de reflexão?',
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
      id: 'voiceQuality',
      title: 'A qualidade da voz e clareza da fala estavam satisfatórias?',
      component: (
        <RadioGroup
          name="voiceQuality"
          value={formData.voiceQuality.toString()}
          onChange={(value) => updateFormData('voiceQuality', parseInt(value))}
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
      id: 'emotionalUnderstanding',
      title: 'Você sentiu que a Eco entendeu seu estado emocional?',
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
      title: 'As respostas da Eco foram úteis para você refletir sobre si mesmo?',
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
      id: 'aesthetics',
      title: 'Como você avaliaria a estética e leveza do design da Eco?',
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
      id: 'usability',
      title: 'A experiência foi fácil de usar e intuitiva?',
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
      id: 'emotionalChange',
      title: 'Após a interação, você sentiu alguma mudança emocional?',
      component: (
        <div>
          <CheckboxGroup
            options={[
              { label: 'Mais calmo', value: 'calmer' },
              { label: 'Mais claro mentalmente', value: 'mentally_clearer' },
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
                formData.recommendation === i.toString()
                  ? 'border-blue-500 bg-blue-500 text-white'
                  : 'border-gray-300 hover:border-gray-400 text-gray-700'
              }`}
              onClick={() => updateFormData('recommendation', i.toString())}
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
          <p className="mb-8 text-gray-700">
            Suas respostas nos ajudarão a melhorar a experiência da Eco.
          </p>
          <Button onClick={() => setCurrentStep(0)} variant="secondary">
            Voltar ao início
          </Button>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const currentQuestion = questions[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex flex-col p-4">
      {currentStep === 0 ? <Bubble /> : null}
      
      {currentStep > 0 && currentStep < questions.length - 1 && (
        <div className="mb-4 max-w-md mx-auto w-full">
          <ProgressBar currentStep={currentStep} totalSteps={questions.length - 2} />
        </div>
      )}
      
      <QuestionCard 
        title={currentQuestion.title} 
        className={`${currentStep === 0 || currentStep === questions.length - 1 ? 'mt-4' : 'mt-8'}`}
      >
        {currentQuestion.component}
        
        {currentStep > 0 && currentStep < questions.length - 1 && (
          <div className="flex justify-between mt-8">
            <Button onClick={handlePrevious} variant="secondary">
              Voltar
            </Button>
            <Button onClick={handleNext}>
              Próxima
            </Button>
          </div>
        )}
      </QuestionCard>
    </div>
  );
};

export default FormPage;