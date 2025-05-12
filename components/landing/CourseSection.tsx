
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users } from "lucide-react";

export const CourseSection = () => {
  return (
    <section id="courses" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Танымал курстар</h2>
        <div className="max-w-4xl mx-auto">
          <div className="feature-card">
            <h3 className="text-2xl font-bold mb-4">
              Жаппай ашық онлайн курс әзірлеу негіздері
            </h3>
            <div className="flex flex-wrap gap-4 mb-4">
              <span className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                8 апта
              </span>
              <span className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                Өз қарқыныңызбен
              </span>
              <span className="flex items-center text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                Барлығына қолжетімді
              </span>
            </div>
            <p className="text-gray-600 mb-6">
              Бұл курс болашақ оқытушыларға арналған және онлайн курстарды құру мен басқарудың негізгі принциптерін үйретеді. ЖАОК форматының ерекшеліктері мен артықшылықтарын түсінуге көмектеседі.
            </p>
            <div className="space-y-4">
              <h4 className="font-semibold">Негізгі тақырыптар:</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>ЖАОК түсінігі және оның білім берудегі рөлі</li>
                <li>Онлайн курстарды жобалау және құру</li>
                <li>Интерактивті материалдарды дайындау</li>
                <li>Студенттермен жұмыс істеу әдістемесі</li>
              </ul>
            </div>
            <div className="mt-6">
              <Button className="bg-primary text-white">
                Курсқа жазылу
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
