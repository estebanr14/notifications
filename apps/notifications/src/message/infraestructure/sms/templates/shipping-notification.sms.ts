export const shippingNotificationSms = (args: any) => {
  const { trackingUrl } = args;
  return `🚚✨ Tu pedido de Bety ya está en manos de nuestra transportadora 📦\n
  Puedes seguir su avance en el siguiente enlace: ${trackingUrl} \n
  ¡Gracias por confiar en nosotros!`;
};
