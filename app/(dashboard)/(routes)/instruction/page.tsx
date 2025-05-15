import React from "react";
import Image from "next/image";
const steps = [
  {
    title: "1. Платформадағы рөлдер",
    image: "/images/roles.png",
    description: "Тіркелгеннен кейін сізге студент немесе оқытушы мәртебесі беріледі. Студент курсқа жазылып, оны өтуі мүмкін, ал оқытушы курс жасауға мүмкіндігі бар. Жаныңыздағы рөлдер ауыстыру түймесі арқылы рөлді өзгертуге болады."
  },
  {
    title: "2. Менің курстарым (Оқытушы рөлі)",
    image: "/images/step1.png",
    description: "Оқытушы рөлінде 'Менің курстарым' бетінен жасалған курстарды және олардың күйін көре аласыз. Курстар 'жасалған' күйінде болуы мүмкін, бұл курстар әлі жарияланбағанын білдіреді."
  },
  {
    title: "3. Курсты жасау",
    image: "/images/step2.png",
    description: "Курс жасау үшін 'Курс жасау' түймесін басып, оның атауын, сипаттамасын енгізіп, суретін жүктеңіз. Осыдан кейін курс редакциялау терезесі ашылып, міндетті түрде толықтыру қажет: атау, сипаттама, сурет, модуль жасау және кем дегенде бір сабақ."
  },
  {
    title: "4. Курстың модульдері мен бөлімдері",
    image: "/images/step3.png",
    description: "Курс жасалғаннан кейін бірнеше модульдер қосуға болады. Модуль атауын енгізіп, бөлімдер құрыңыз. Әр бөлімде кемінде бір сабақ болуы керек."
  },
  {
    title: "5. Сабақтар мен контент",
    image: "/images/step4.png",
    description: "Әр модульде сабақтар жасауға болады. Сабақ үшін атау енгізіп, сипаттама, бейнемазмұн, суреттер немесе файлдарды тіркеуге болады. Сабақты редакциялау үшін сабақты таңдап, қасындағы қарындаш белгісін басыңыз, ол редакциялау бетін ашады."
  },
  {
    title: "6. Сабақты редакциялау",
    image: "/images/step5.png",
    description: "Сабақты редакциялау кезінде сабақтың атауы мен сипаттамасын толтырыңыз, бейнемазмұнға сілтеме қосып, сурет немесе басқа материалдарды жүктеңіз. Содан кейін өзгертулерді сақтаңыз."
  },
  {
    title: "7. Сертификат және жариялау",
    image: "/images/step6.png",
    description: "Курстың сертификатын қосу мүмкіндігі бар. Барлық қадамдарды аяқтағаннан кейін 'Жариялау' түймесін басып, курсты пайдаланушыларға қолжетімді етіңіз."
  }
];

const InstructionPage = () => {
  return (
    <div className="max-w-5xl mx-auto py-[150px] px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Курс жасау нұсқаулығы</h1>
      <div className="space-y-12">
        {steps.map((step, index) => (
          <div key={index} className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">{step.title}</h2>
            {step.image && (
              <div className="relative w-full aspect-video h-auto rounded-lg mb-4 border">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>


            )}
            <p className="text-gray-700">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstructionPage;
