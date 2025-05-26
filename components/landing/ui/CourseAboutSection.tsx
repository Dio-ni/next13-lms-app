    import { Info } from "lucide-react";

export const CourseAboutSection = () => {
  const paragraphs = [
    "Заманауи жағдайда білім беру жүйесіне ақпараттық-коммуникациялық технологияларды енгізудің өзектілігі азаймай отыр, оқытудың дәстүрлі түрлерін қашықтықтан оқыту технологияларымен толықтыратын оқу орындарының саны артуда.",
    "Мұғалімнің кәсіби құзыреттілігінің маңызды құрамдастарының бірі оның кәсіби-педагогикалық..."
  ];

  return (
    <section id="about-course" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Курс туралы</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {paragraphs.map((text, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Info className="h-6 w-6 text-primary" />
              </div>
              <p className="text-gray-700">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
