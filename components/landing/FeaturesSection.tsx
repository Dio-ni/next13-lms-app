
import { Book, Award, Video, Users } from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: <Book className="h-8 w-8 text-primary" />,
      title: "Модульдік құрылым",
      description: "Әр курс бөлімдер мен модульдерге бөлінген, оқуды ыңғайлы етеді"
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "Сертификаттау",
      description: "Курсты аяқтағаннан кейін сертификат алыңыз"
    },
    {
      icon: <Video className="h-8 w-8 text-primary" />,
      title: "Видео сабақтар",
      description: "Сапалы видео материалдар мен интерактивті тапсырмалар"
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Тәжірибелі оқытушылар",
      description: "Өз саласының білікті мамандарынан білім алыңыз"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Платформа мүмкіндіктері</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
