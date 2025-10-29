import { Toast } from "@/components/toast";

export function setToastDone(label: string) {
  const toast = new Toast();
  toast.show(label, "success");
}
