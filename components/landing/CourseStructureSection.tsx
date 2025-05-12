
import { BookOpen, Video, MessageCircle, Award } from "lucide-react";

export const CourseStructureSection = () => {
  const steps = [
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: "Модульдік құрылым",
      description: "Әр курс бірнеше модульге бөлінген"
    },
    {
      icon: <Video className="h-8 w-8 text-primary" />,
      title: "Видео сабақтар",
      description: "Әр модульде видео дәрістер бар"
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-primary" />,
      title: "Тапсырмалар",
      description: "Практикалық жұмыстар мен тесттер"
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "Сертификаттау",
      description: "Курсты аяқтау сертификаты"
    }
  ];

  return (
    <section id="structure" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Курс құрылымы</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 flex items-center justify-center bg-primary/10 rounded-full">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
