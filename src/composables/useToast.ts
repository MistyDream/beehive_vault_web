import { toast } from 'vue-sonner';

export function useToast() {
  const error: typeof toast.error = (message, options) =>
    toast.error(message, { important: true, ...options });

  return { ...toast, error };
}
