import { useEffect, useState } from "react";

export const HomePage = () => {
  // TODO: Integrar lógica para obtener superhéroes desde la API
  // TODO: Implementar useState para almacenar la lista de superhéroes
  // TODO: Implementar función para recargar superhéroes
  const [user, setUser] = useState(null);
  const [superheroes, setSuperheroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/profile", {
        credentials: "include",
      });

      if (!response.ok) throw new Error("No autorizado");

      const data = await response.json();
      setUser(data);
    } catch (err) {
      setError("Error al obtener el perfil");
    }
  };

  const fetchSuperheroes = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/superheroes", {
        credentials: "include",
      });

      if (!response.ok) throw new Error("No se pudieron cargar los datos");

      const data = await response.json();
      setSuperheroes(data.data || []);
    } catch (err) {
      setError("Error al cargar superhéroes");
    }
  };

  const reloadSuperheroes = async () => {
    setReloading(true);
    await fetchSuperheroes();
    setReloading(false);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchProfile();
      await fetchSuperheroes();
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl font-semibold">
        Cargando...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-8">
      <h1 className="text-4xl font-bold text-center mt-8 mb-4 text-gray-800">
        Galería de Superhéroes
      </h1>

      <div className="flex justify-center mb-8">
        <button
          onClick={reloadSuperheroes}
          disabled={reloading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition-colors disabled:opacity-50"
        >
          {reloading ? "Recargando..." : "Recargar"}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4 text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {superheroes && superheroes.length > 0 ? (
          superheroes.map((hero) => (
            <div
              key={hero.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <img
                src={hero.image}
                alt={hero.superhero}
                className="h-64 object-cover w-full"
              />

              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {hero.superhero}
                </h3>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No hay superhéroes disponibles
          </div>
        )}
      </div>
    </div>
  );
};
