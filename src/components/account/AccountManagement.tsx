import React, { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  subscriptionEnd: Date;
}

const AccountManagement: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    // Exemple de récupération utilisateur (à remplacer par ton API ou Firebase)
    const fakeUser: User = {
      id: "1",
      name: "Abdel",
      email: "abdel@example.com",
      subscriptionEnd: new Date("2025-09-15"), // date de fin d'abonnement
    };

    setUser(fakeUser);

    // Calcul des jours restants
    const today = new Date();
    const diff = fakeUser.subscriptionEnd.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    setDaysLeft(days);
  }, []);

  const handleRenew = () => {
    alert("Redirection vers la page de renouvellement...");
    // Ici tu rediriges vers ta page de paiement/abonnement
  };

  if (!user) return <p>Chargement...</p>;

  // Si abonnement expiré → blocage
  if (daysLeft !== null && daysLeft <= 0) {
    return (
      <div className="p-6 bg-red-100 text-red-800 text-center rounded-lg">
        <h2>Compte bloqué ❌</h2>
        <p>Votre abonnement a expiré. Merci de le renouveler.</p>
        <button
          onClick={handleRenew}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
        >
          Renouveler
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Gestion du compte</h1>
      <p>Bienvenue {user.name} 👋</p>
      <p>Email : {user.email}</p>
      <p>Abonnement actif jusqu’au : {user.subscriptionEnd.toDateString()}</p>

      {/* Alerte 5 jours avant la fin */}
      {daysLeft !== null && daysLeft <= 5 && daysLeft > 0 && (
        <div className="mt-4 p-4 bg-orange-100 text-orange-800 rounded-lg">
          <p>
            ⚠️ Attention : votre abonnement expire dans {daysLeft} jour
            {daysLeft > 1 ? "s" : ""}.
          </p>
          <button
            onClick={handleRenew}
            className="mt-2 px-3 py-1 bg-orange-500 text-white rounded"
          >
            Renouveler maintenant
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountManagement;
