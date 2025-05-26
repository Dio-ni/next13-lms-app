
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Author1 from "@/public/author1.png";
import Author2 from "@/public/author2.png";
import Image from "next/image";
export const InstructorsSection = () => {
  const instructors = [
    {
      name: "Шрымбай Дана Абилахатовна",
      img: Author1,
      title: "«Информатика мұғалімдерін даярлау» БББ докторанты",
      expertise: "Онлайн оқыту әдістемесі",
      description: "10 жылдық тәжірибесі бар, 50+ онлайн курс авторы"
    },
    
  ];

  return (
    <section id="instructors" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">АВТОР ТУРАЛЫ МӘЛІМЕТ</h2>
        <div className="flex justify-center ">
          {instructors.map((instructor, index) => (
            <Card key={index} className="border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="relative w-24 h-24 bg-gray-200 rounded-full overflow-hidden mx-auto mb-4">
                  <Image
                    src={instructor.img.src}
                    alt={instructor.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <h3 className="text-xl font-semibold text-center">{instructor.name}</h3>
                <p className="text-primary text-center">{instructor.title}</p>
              </CardHeader>
              {/* <CardContent>
                <p className="font-medium mb-2">{instructor.expertise}</p>
                <p className="text-gray-600">{instructor.description}</p>
              </CardContent> */}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
