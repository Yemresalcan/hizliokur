const DB_NAME = 'hizliokur_db';
const STORE_NAME = 'pdfs';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

const openDb = (): Promise<IDBDatabase> => {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE_NAME);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => {
      dbPromise = null;
      reject(req.error);
    };
  });
  return dbPromise;
};

const withStore = <T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> =>
  openDb().then(
    db =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, mode);
        const req = fn(tx.objectStore(STORE_NAME));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      }),
  );

export const savePdf = (bookId: string, file: File): Promise<IDBValidKey> =>
  withStore('readwrite', store => store.put(file, bookId));

export const getPdf = (bookId: string): Promise<File | null> =>
  withStore<File | undefined>('readonly', store => store.get(bookId)).then(r => r ?? null);

export const deletePdf = (bookId: string): Promise<IDBValidKey> =>
  withStore('readwrite', store => store.delete(bookId) as unknown as IDBRequest<IDBValidKey>);
