import { getDB } from "@/db";
import { setState } from "./appStore";

type ImageItem = {
  id: string;
  data: File;
};

const STORE_NAME = "image";
const CURRENT_IMAGE_ID = "current";

class ImageStore {
  private db!: IDBDatabase;

  constructor() {
    this.init();
  }

  private async init() {
    this.db = await getDB();
  }

  async addImage(image: File) {
    try {
      const operation = (store: IDBObjectStore) =>
        store.put({ id: CURRENT_IMAGE_ID, data: image });
      await this.handleTransaction("readwrite", operation);
      setState({ isImgInIDB: true });
    } catch (error) {
      console.error("Error adding image: ", error);
    }
  }

  async getImage() {
    try {
      const operation = (store: IDBObjectStore) => store.get(CURRENT_IMAGE_ID);
      const result = (await this.handleTransaction("readonly", operation)) as
        | ImageItem
        | undefined;

      if (!result) {
        return null;
      }

      const image = result.data;

      return image;
    } catch (error) {
      console.error("Error obtaining image: ", error);
      return null;
    }
  }

  private async handleTransaction(
    typeTxn: "readwrite" | "readonly",
    operation: (store: IDBObjectStore) => IDBRequest
  ) {
    return new Promise((resolve, reject) => {
      const txn = this.db.transaction(STORE_NAME, typeTxn);
      const store = txn.objectStore(STORE_NAME);
      const request = operation(store);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

const imageStore = new ImageStore();

export const addImage = (image: File) => imageStore.addImage(image);
export const getImage = () => imageStore.getImage();
