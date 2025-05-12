
import { GraduationCap, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const UserRolesSection = () => {
  const roles = [
    {
      icon: <GraduationCap className="h-8 w-8 text-primary" />,
      title: "Студент",
      features: [
        "Курстарға қолжетімділік",
        "Тесттерді тапсыру",
        "Сертификат алу",
        "Форумдарға қатысу",
      ]
    },
    {
      icon: <Pencil className="h-8 w-8 text-primary" />,
      title: "Оқытушы",
      features: [
        "Курстарды құру және өңдеу",
        "Модульдер мен бөлімдерді басқару",
        "Сабақтарды жүктеу",
        "Студенттермен байланыс",
      ]
    }
  ];

  return (
    <section id="roles" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Пайдаланушы рөлдері</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {roles.map((role, index) => (
            <Card key={index} className="border-2">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  {role.icon}
                  <CardTitle className="text-2xl">{role.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {role.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
