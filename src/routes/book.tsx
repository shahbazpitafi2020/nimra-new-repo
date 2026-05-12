import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book An Appointment — Dr. Nimra Rehman" },
      { name: "description", content: "Book an in-person or video consultation with Dr. Nimra Rehman, MBBS, RMP." },
    ],
  }),
  component: BookPage,
});

function BookPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const dates = [
    [27, 28, 29, 30, 1, 2, 3],
    [4, 5, 6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15, 16, 17],
    [18, 19, 20, 21, 22, 23, 24],
    [25, 26, 27, 28, 29, 30, 31],
  ];

  return (
    <div className="py-16">
      <div className="container mx-auto max-w-3xl px-6">
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-secondary/60 px-6 py-4">
            <div className="font-semibold text-foreground">Service Duration: 15 Minutes</div>
            <div className="font-semibold text-teal">Price: PKR 2,000</div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-teal p-8 text-white shadow-lg">
          <h2 className="text-center text-xl font-semibold">Pick date & time</h2>
          <div className="mt-6 flex items-center justify-between">
            <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10"><ChevronLeft /></button>
            <div className="font-display text-xl">May 2026</div>
            <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10"><ChevronRight /></button>
          </div>

          <div className="mt-6 grid grid-cols-7 gap-2 text-center text-sm">
            {days.map((d, i) => <div key={i} className="py-2 opacity-70">{d}</div>)}
            {dates.flat().map((d, i) => {
              const row = Math.floor(i / 7);
              const isCurrentMonth = !(row === 0 && d > 20) && !(row === 4 && d < 25 && i > 30);
              const disabled = !isCurrentMonth || (row === 1) || (row === 0);
              return (
                <button
                  key={i}
                  disabled={disabled}
                  onClick={() => setSelected(d)}
                  className={`rounded-lg py-2.5 transition ${
                    disabled ? "opacity-40 line-through" :
                    selected === d ? "bg-white font-bold text-teal" :
                    "hover:bg-white/15"
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>

          {selected && (
            <div className="mt-8 rounded-xl bg-white/10 p-6">
              <p className="text-center text-sm">Available slots on {selected} May 2026:</p>
              <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {["10:00 AM", "11:30 AM", "01:00 PM", "03:30 PM", "05:00 PM", "06:30 PM"].map((t) => (
                  <button key={t} className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-teal hover:bg-secondary">
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
