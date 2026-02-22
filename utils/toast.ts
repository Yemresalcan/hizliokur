export type ToastType = 'success' | 'error' | 'info';

export interface ToastEvent {
  id: number;
  message: string;
  type: ToastType;
}

export const showToast = (message: string, type: ToastType = 'info'): void => {
  window.dispatchEvent(
    new CustomEvent<ToastEvent>('hizliokur:toast', {
      detail: { id: Date.now(), message, type },
    }),
  );
};
