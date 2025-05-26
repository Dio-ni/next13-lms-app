import React from "react";
import { BookOpen, Users, Globe, Lightbulb, AlertCircle, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/landing/Footer";

const sections = [
  {
    id: 1,
    title: "ЖАOК-тың артықшылықтары",
    icon: <Globe className="w-6 h-6" />,
    items: [
      {
        title: "Қолжетімділік",
        description: "Интернетке қосылу мүмкіндігі бар кез келген адам қатыса алады"
      },
      {
        title: "Икемділік", 
        description: "Курсты өз ыңғайына қарай өтуге болады"
      },
      {
        title: "Үнемділік",
        description: "Көптеген курстар тегін немесе арзан бағамен ұсынылады"
      },
      {
        title: "Әртүрлі тақырыптар",
        description: "Математикадан бастап, өнерге дейін сан алуан тақырыптар"
      }
    ]
  },
  {
    id: 2,
    title: "ЖАOК-тың кемшіліктері",
    icon: <AlertCircle className="w-6 h-6" />,
    items: [
      {
        title: "Мотивацияның төмендігі",
        description: "Курсты аяқтау үшін жеткілікті мотивация болмауы мүмкін"
      },
      {
        title: "Тәртіптің жетіспеуі",
        description: "Өздігінен оқу үшін тәртіпті болу қажет"
      },
      {
        title: "Интерактивтіліктің шектеулігі",
        description: "Дәстүрлі курстармен салыстырғанда интерактивтілік аз"
      },
      {
        title: "Кері байланыстың болмауы",
        description: "Оқытушыдан жеке кері байланыс алу мүмкін емес"
      }
    ]
  },
  {
    id: 3,
    title: "Сапа және аккредиттеу",
    icon: <Award className="w-6 h-6" />,
    items: [
      {
        title: "Сапа бақылауы",
        description: "Курс сапасын бақылау әлі де өзекті мәселе"
      },
      {
        title: "Аккредиттеу мәселелері",
        description: "Барлық курстар аккредиттелген емес"
      },
      {
        title: "Стандарттардың жетіспеуі",
        description: "Бірыңғай білім беру стандарттары қажет"
      }
    ]
  },
  {
    id: 4,
    title: "Білім беруге әсері және болашағы",
    icon: <Lightbulb className="w-6 h-6" />,
    items: [
      {
        title: "Білімнің қолжетімділігі",
        description: "Көпшілік үшін білім алу мүмкіндігін арттырды"
      },
      {
        title: "Жаңа оқыту әдістері",
        description: "Инновациялық оқыту технологияларын енгізуде"
      },
      {
        title: "Үздіксіз білім алу",
        description: "Өмір бойы білім алуға мүмкіндік береді"
      },
      {
        title: "Технологияның дамуы",
        description: "Виртуалды шындық және AI технологиялары"
      }
    ]
  }
];

const Index = () => {
  return (
    <>
    <div className="min-h-screen mt-20 bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 text-center mb-4">
            Жаппай ашық онлайн курстардың оң және теріс жақтары
          </h1>
          <p className="text-slate-600 text-center text-lg">
            ЖАOК-тың артықшылықтары мен кемшіліктерін қарастыру
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {sections.map((section) => (
          <Card key={section.id} className="bg-white shadow-sm border-0">
            <CardContent className="p-8">
              {/* Section Title */}
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-semibold text-slate-800">
                  {section.title}
                </h2>
              </div>

              {/* Section Items */}
              <div className="grid gap-6 md:grid-cols-2">
                {section.items.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="font-medium text-slate-800">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Summary */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">
              Қорытынды
            </h3>
            <p className="text-blue-700 leading-relaxed">
              ЖАOК білім беру саласында үлкен өзгерістерге алып келді. 
              Олардың артықшылықтары мен кемшіліктерін ескере отырып, 
              технологияның дамуымен бірге одан әрі жетіле түсуде.
            </p>
          </CardContent>
        </Card>
      </div>

      
      
            
    </div>
    <Footer /> {/* New Footer component */}
    </>
  );
};

export default Index;