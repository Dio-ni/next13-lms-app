
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="min-h-screen hero-pattern flex items-center pt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
            Білім алудың жаңа деңгейі
          </h1>
          <p className="text-xl text-gray-600 md:text-2xl">
            Заманауи онлайн курстар арқылы өзіңіздің кәсіби дағдыларыңызды дамытыңыз
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary text-white">
              <GraduationCap className="mr-2 h-5 w-5" />
              Тіркелу
            </Button>
            <Button size="lg" variant="outline">
              Толығырақ
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
