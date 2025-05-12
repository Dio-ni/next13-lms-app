
import { CheckCircle } from "lucide-react";

export const ComparisonSection = () => {
  const benefits = [
    "Өз қарқыныңызбен оқу мүмкіндігі",
    "Кез-келген жерден қолжетімділік",
    "Интерактивті оқу материалдары",
    "Тәжірибелі оқытушылардан кеңес алу",
    "Сертификат алу мүмкіндігі",
    "Форум арқылы талқылау"
  ];

  return (
    <section id="comparison" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">ЖАОК артықшылықтары</h2>
        <div className="max-w-3xl mx-auto">
          <div className="grid gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm">
                <CheckCircle className="h-6 w-6 text-primary shrink-0" />
                <p>{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
