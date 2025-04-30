import { useToast } from "@/hooks/useToast";
import { Toast, ToastTitle, ToastDescription } from "@/components/ui/Toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2 w-fit max-w-[420px] rounded-lg">
      {toasts.map(({ id, title, description }) => (
        <Toast key={id} className="bg-gray-900 text-white text-sm">
          <div className="flex flex-col gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
        </Toast>
      ))}
    </div>
  );
}
