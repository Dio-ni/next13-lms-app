'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import toast from "react-hot-toast";

export function CourseFeedbackForm({ courseId }: { courseId: string }) {
  const [position, setPosition] = useState("");
  const [timeSpent, setTimeSpent] = useState("");
  const [impression, setImpression] = useState("");
  const [otherImpression, setOtherImpression] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [suggestions, setSuggestions] = useState("");

  const handleSubmit = async () => {
  try {
    const res = await fetch(`/api/courses/${courseId}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        position,
        timeSpent,
        impression: impression === "Басқа" ? otherImpression : impression,
        difficulty,
        suggestions,
      }),
    });
    if (!res.ok) throw new Error("Сақтау кезінде қате кетті");
    toast.success("Сауалнама сәтті сақталды!");

    // ✅ Очистка полей формы
    setPosition("");
    setTimeSpent("");
    setImpression("");
    setOtherImpression("");
    setDifficulty("");
    setSuggestions("");

  } catch (e) {
    console.error(e);
    toast.error("Қате пайда болды");
  }
};


  return (
    <div className="border rounded-lg p-6 space-y-6 bg-background">
      <h2 className="text-2xl font-bold">Сауалнама</h2>
      <div className="space-y-2">
        <label className="font-medium">1. Сіздің лауазымыңыз</label>
        <Input value={position} onChange={(e) => setPosition(e.target.value)} />
      </div>

      <div className="space-y-2">
        <label className="font-medium">2. Қорытынды жұмысты аяқтауға қанша уақыт кетті?</label>
        <RadioGroup value={timeSpent} onValueChange={setTimeSpent} className="space-y-1">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="бірнеше сағат" id="time1" />
    <label htmlFor="time1" className="text-sm">бірнеше сағат</label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="күн" id="time2" />
    <label htmlFor="time2" className="text-sm">күн</label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="2-3 күн" id="time3" />
    <label htmlFor="time3" className="text-sm">2-3 күн</label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="апта" id="time4" />
    <label htmlFor="time4" className="text-sm">апта</label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="орындай алмады" id="time5" />
    <label htmlFor="time5" className="text-sm">орындай алмады</label>
  </div>
</RadioGroup>

      </div>

      <div className="space-y-2">
        <label className="font-medium">3. Сіздің курстан алған жалпы әсеріңіз</label>
        <RadioGroup value={impression} onValueChange={setImpression} className="space-y-2">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="Курс ұнады" id="impression1" />
    <label htmlFor="impression1" className="text-sm">Курс ұнады</label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="Сертификат алу үшін ғана жүрді" id="impression2" />
    <label htmlFor="impression2" className="text-sm">Сертификат алу үшін ғана жүрді</label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="Курс ұнамады, материалды беру түсініксіз" id="impression3" />
    <label htmlFor="impression3" className="text-sm">Курс ұнамады, материалды беру түсініксіз</label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="Басқа" id="impression4" />
    <label htmlFor="impression4" className="text-sm">Басқа</label>
  </div>
</RadioGroup>


        {impression === "Басқа" && (
          <Input
            value={otherImpression}
            onChange={(e) => setOtherImpression(e.target.value)}
            placeholder="Өз жауабыңыз"
          />
        )}
      </div>

      <div className="space-y-2">
        <label className="font-medium">4. Ең үлкен қиындықтарға не себеп болды?</label>
        <Textarea value={difficulty} onChange={(e) => setDifficulty(e.target.value)} />
      </div>

      <div className="space-y-2">
        <label className="font-medium">5. Осы курсты өзгерту бойынша ұсыныстарыңыз?</label>
        <Textarea value={suggestions} onChange={(e) => setSuggestions(e.target.value)} />
      </div>

      <Button onClick={handleSubmit}>Сауалнаманы жіберу</Button>
    </div>
  );
}
