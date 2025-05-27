const Quote: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-sky-100 px-4">
    <div className="w-full max-w-xl bg-white/80 p-10 rounded-3xl shadow-2xl text-center backdrop-blur-md border border-slate-200">
      <blockquote className="text-2xl sm:text-3xl font-serif text-slate-800 mb-6 leading-relaxed">
        “Stories aren’t just words on a page.
        <br className="hidden sm:inline" />
        They’re your voice echoing in the world.”
      </blockquote>
      <cite className="block text-sky-600 font-semibold text-base sm:text-lg">— Medium Clone</cite>
    </div>
  </div>
)

export default Quote
