export const shipmentCompletedAdminsTemplate = (args: any) => {
  const {
    idLogisticProvider,
    idStore,
    name,
    email,
    phoneNumber,
    promotionCode,
  } = args;
  return {
    name: 'shipment_completed_admins',
    namespace: 'bety',
    language: {
      code: 'es',
    },
    components: [
      {
        type: 'body',
        parameters: [
          {
            type: 'text',
            text: idLogisticProvider,
          },
          {
            type: 'text',
            text: idStore,
          },
          {
            type: 'text',
            text: name || 'No name',
          },
          {
            type: 'text',
            text: email || 'No email',
          },
          {
            type: 'text',
            text: phoneNumber || 'No phone number',
          },
          {
            type: 'text',
            text: promotionCode || 'No promotion code',
          },
        ],
      },
    ],
  };
};
