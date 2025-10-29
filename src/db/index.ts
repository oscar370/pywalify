let db: IDBDatabase | null = null;

const initDB = async () => {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open("appDB", 1);

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;

      if (!dbInstance.objectStoreNames.contains("image")) {
        dbInstance.createObjectStore("image", {
          keyPath: "id",
          autoIncrement: false,
        });
      }
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onerror = () => reject(request.error);
  });
};

initDB();

export async function getDB() {
  if (!db) await initDB();
  return db as IDBDatabase;
}
