export default function ValuesSection() {
  const items = [
    {
      title: "Livraison rapide",
      text: "Une organisation simple pour récupérer vos achats plus vite à Bamako.",
    },
    {
      title: "Orange Money",
      text: "Payez rapidement via Orange Money et gagnez du temps.",
    },
    {
      title: "Paiement en boutique",
      text: "Commandez en avance et payez directement à la boutique si besoin.",
    },
    {
      title: "Préparation du panier",
      text: "Votre panier peut être prêt avant votre arrivée.",
    },
  ];

  return (
    <section id="confiance" className="bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
            Pourquoi ils nous font confiance
          </p>
          <h2 className="text-3xl font-extrabold md:text-4xl">
            Une expérience plus rapide, plus simple, plus fiable
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-600 md:text-base">
            Une boutique pensée pour fluidifier vos achats, réduire votre temps
            d’attente et améliorer votre confort.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.title}
              className="group rounded-3xl bg-[#f8f5f0] p-5 shadow-sm transition duration-300 hover:-translate-y-2 hover:bg-black hover:text-white hover:shadow-[0_18px_35px_rgba(0,0,0,0.12)]"
            >
              <h3 className="text-sm font-bold md:text-base">{item.title}</h3>
              <p className="mt-3 text-xs leading-6 text-zinc-600 transition group-hover:text-white/80 md:text-sm">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}