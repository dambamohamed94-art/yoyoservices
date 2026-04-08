"use client";

import { useEffect, useState } from "react";

type OrderItem = {
  id: string;
  productNameSnapshot: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

type Payment = {
  id: string;
  provider: string;
  validationCode?: string | null;
  customerPhone: string;
  amount: number;
  status: string;
};

type Order = {
  id: string;
  reference: string;
  status: string;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string;
  customerDistrict: string;
  totalAmount: number;
  paymentMethod: string;
  validationCode?: string | null;
  createdAt: string;
  items: OrderItem[];
  payment?: Payment | null;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function getOrderStatusClass(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "CONFIRMED":
      return "bg-blue-100 text-blue-800";
    case "PAID":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    case "AWAITING_VALIDATION":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-zinc-100 text-zinc-700";
  }
}

function getPaymentStatusClass(status?: string) {
  switch (status) {
    case "INITIATED":
      return "bg-zinc-100 text-zinc-700";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "SUBMITTED":
      return "bg-orange-100 text-orange-800";
    case "VERIFIED":
      return "bg-green-100 text-green-800";
    case "FAILED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-zinc-100 text-zinc-700";
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadOrders() {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        cache: "no-store",
      });
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Erreur chargement commandes:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      setUpdatingId(id);

      await fetch(`${API_URL}/orders/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      await loadOrders();
    } catch (error) {
      console.error("Erreur mise à jour statut:", error);
    } finally {
      setUpdatingId(null);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <main className="min-h-screen bg-[#f8f5f0] px-4 py-10 text-[#111111]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
            Admin
          </p>
          <h1 className="text-3xl font-extrabold md:text-4xl">
            Suivi des commandes
          </h1>
          <p className="mt-3 text-sm text-zinc-600">
            Gérez les commandes clients, les paiements et les statuts de YOYO
            SERVICES.
          </p>
        </div>

        {loading ? (
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            Chargement des commandes...
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            Aucune commande trouvée.
          </div>
        ) : (
          <div className="grid gap-5">
            {orders.map((order) => (
              <section
                key={order.id}
                className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm"
              >
                <div className="grid gap-5 lg:grid-cols-[1.3fr_0.9fr]">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-extrabold">
                        {order.reference}
                      </h2>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${getOrderStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>

                      {order.payment?.status && (
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getPaymentStatusClass(
                            order.payment.status
                          )}`}
                        >
                          Paiement {order.payment.status}
                        </span>
                      )}
                    </div>

                    <div className="mt-5 grid gap-3 text-sm text-zinc-700 md:grid-cols-2">
                      <p>
                        <span className="font-semibold">Client :</span>{" "}
                        {order.customerFirstName} {order.customerLastName}
                      </p>
                      <p>
                        <span className="font-semibold">Téléphone :</span>{" "}
                        {order.customerPhone}
                      </p>
                      <p>
                        <span className="font-semibold">Quartier :</span>{" "}
                        {order.customerDistrict}
                      </p>
                      <p>
                        <span className="font-semibold">Paiement :</span>{" "}
                        {order.paymentMethod}
                      </p>
                      <p>
                        <span className="font-semibold">
                          Code validation :
                        </span>{" "}
                        {order.validationCode || "-"}
                      </p>
                      <p>
                        <span className="font-semibold">Date :</span>{" "}
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="mt-6">
                      <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-orange-500">
                        Articles commandés
                      </h3>

                      <div className="grid gap-3">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="rounded-[1.5rem] bg-[#f8f5f0] p-4"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="font-bold">
                                  {item.productNameSnapshot}
                                </p>
                                <p className="mt-1 text-sm text-zinc-600">
                                  {item.quantity} × {item.unitPrice} FCFA
                                </p>
                              </div>

                              <p className="text-sm font-extrabold text-orange-500">
                                {item.lineTotal} FCFA
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <aside className="rounded-[2rem] bg-black p-5 text-white">
                    <p className="text-sm text-white/70">Montant total</p>
                    <p className="mt-2 text-3xl font-extrabold">
                      {order.totalAmount} FCFA
                    </p>

                    <div className="mt-6 grid gap-3">
                      <button
                        disabled={updatingId === order.id}
                        onClick={() => updateStatus(order.id, "CONFIRMED")}
                        className="rounded-full bg-green-600 px-4 py-3 text-sm font-semibold transition hover:bg-green-700 disabled:opacity-60"
                      >
                        Confirmer
                      </button>

                      <button
                        disabled={updatingId === order.id}
                        onClick={() => updateStatus(order.id, "PAID")}
                        className="rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold transition hover:bg-blue-700 disabled:opacity-60"
                      >
                        Marquer payé
                      </button>

                      <button
                        disabled={updatingId === order.id}
                        onClick={() => updateStatus(order.id, "CANCELLED")}
                        className="rounded-full bg-red-600 px-4 py-3 text-sm font-semibold transition hover:bg-red-700 disabled:opacity-60"
                      >
                        Annuler
                      </button>
                    </div>

                    {order.payment && (
                      <div className="mt-6 rounded-[1.5rem] bg-white/10 p-4 text-sm">
                        <p>
                          <span className="font-semibold">Paiement :</span>{" "}
                          {order.payment.status}
                        </p>
                        <p className="mt-2">
                          <span className="font-semibold">Téléphone :</span>{" "}
                          {order.payment.customerPhone}
                        </p>
                        <p className="mt-2">
                          <span className="font-semibold">Montant :</span>{" "}
                          {order.payment.amount} FCFA
                        </p>
                        <p className="mt-2">
                          <span className="font-semibold">Code :</span>{" "}
                          {order.payment.validationCode || "-"}
                        </p>
                      </div>
                    )}
                  </aside>
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}