export default function AboutSection() {
  return (
    <section id="qui-sommes-nous" className="bg-white py-14">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-2 md:px-6">
        <div className="rounded-[2rem] bg-[#f8f5f0] p-6 shadow-sm">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
            Qui sommes-nous
          </p>
          <h2 className="text-3xl font-extrabold md:text-4xl">
            Une boutique pensée pour simplifier vos achats
          </h2>
          <p className="mt-4 text-sm leading-7 text-zinc-600 md:text-base">
            YOYO SERVICES est une boutique alimentaire moderne basée à Bamako, Mali.
            Nous voulons rendre l’achat plus simple, plus rapide et plus
            pratique, avec une préparation du panier avant votre arrivée et des
            moyens de paiement adaptés comme Orange Money.
          </p>
        </div>

        <div className="rounded-[2rem] bg-black p-6 text-white shadow-sm">
          <h3 className="text-2xl font-extrabold">Notre mission</h3>
          <p className="mt-4 text-sm leading-7 text-white/80 md:text-base">
            Vous permettre de trouver rapidement vos produits, de préparer votre
            panier à l’avance, et de gagner du temps au quotidien grâce à une
            expérience simple, mobile et premium.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-wider text-orange-400">
                Ville
              </p>
              <p className="mt-2 font-bold">Bamako, Mali</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-wider text-orange-400">
                Contact
              </p>
              <p className="mt-2 font-bold">+223 77 45 32 17</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}