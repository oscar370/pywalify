import { Toast } from "@/components/toast";

export function setToastError(label: string) {
  new Toast().show(label, "error");
}
