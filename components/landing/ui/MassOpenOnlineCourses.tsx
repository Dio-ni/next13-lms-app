import React from "react";

const MassOpenOnlineCourses: React.FC = () => {
  return (
    <section className="max-w-3xl mx-auto m-10 p-6 bg-white shadow-lg rounded-2xl text-gray-800 space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-blue-700 mb-2">Жаппай ашық онлайн курстар (ЖАОК)</h1>
        <p className="text-gray-600">
          ЖАОК – интернет арқылы қашықтықтан білім берудің ашық және жаппай формасы.
        </p>
      </header>

      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg shadow">
          <p>
            ЖАОК төрт бөлек терминнен тұрады:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><b>Жаппай:</b> білім алушылар санына шектеу жоқ.</li>
            <li><b>Ашық:</b> барлығына қол жетімді.</li>
            <li><b>Онлайн:</b> барлық материалдар электронды түрде.</li>
            <li><b>Курс:</b> құрылымы мен уақыты бар оқыту формасы.</li>
          </ul>
        </div>

        <div className="bg-green-50 p-4 rounded-lg shadow">
          <p>
            Қысқаша айтқанда, ЖАОК – бұл электрондық оқыту технологиялары арқылы жаппай қатысуға арналған
            Интернет-курстар. Олар интерактивті тапсырмалармен, оқытушылармен және студенттер арасындағы байланыспен ерекшеленеді.
          </p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-yellow-700">Онлайн курстардың түрлері</h2>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Қысқа мерзімді (3-15 минуттық сабақтар)</li>
            <li>Орта мерзімді (бірнеше күннен бірнеше аптаға дейін)</li>
            <li>Ұзақ мерзімді (бірнеше айға созылады)</li>
          </ul>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-purple-700">ЖАОК тарихы</h2>
          <p>
            MIT оқу материалдарын 2001 жылы ақысыз жариялаудан басталды. 2011 жылы Стэнфордта
            профессор Себастьян Трун жасанды интеллект бойынша курс жасап, 160 елден 190 мың адам қатысты.
          </p>
        </div>

        <div className="bg-pink-50 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-pink-700">Интерактивтілігі</h2>
          <p>
            Қатысушылар бір-бірінің жұмыстарын тексеріп, пікірлер қалдыра алады.
          </p>
        </div>

        <div className="bg-indigo-50 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-indigo-700">Оқытудың еркін кестесі</h2>
          <p>
            Тыңдаушылар дәрістерді ыңғайлы уақытта көріп, өз қарқынымен үй тапсырмаларын орындай алады.
          </p>
        </div>

        <div className="bg-red-50 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-red-700">Онлайн оқытудың және ЖАОК-тың кемшіліктері</h2>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Материалды өз бетімен меңгеру қажет.</li>
            <li>Тапсырмаларды орындау барысын толық бақылау жоқ.</li>
          </ul>
        </div>

        <div className="bg-teal-50 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-teal-700">ЖАОК артықшылықтары</h2>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Интернетке қосылған кез келген адам үшін ашық.</li>
            <li>Икемділік – кез келген уақытта, кез келген жерден оқу.</li>
            <li>Арзан – дәстүрлі оқудан әлдеқайда қолжетімді.</li>
            <li>Көптеген курстар мен оқытушыларды таңдау мүмкіндігі.</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default MassOpenOnlineCourses;
