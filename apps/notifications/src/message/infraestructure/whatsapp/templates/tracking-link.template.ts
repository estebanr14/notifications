export const trackingLinkTemplate = (args: any) => {
  const { imageUrl, name, tracking } = args;
  return {
    name: 'tracking_link',
    namespace: 'bety',
    language: {
      code: 'es',
    },
    components: [
      {
        type: 'header',
        parameters: [
          {
            type: 'image',
            image: {
              link:
                imageUrl ||
                'https://bety-asstes.s3.us-east-1.amazonaws.com/logo2wpp.png',
            },
          },
        ],
      },
      {
        type: 'body',
        parameters: [
          {
            type: 'text',
            parameter_name: 'nombre',
            text: name,
          },
        ],
      },
      {
        type: 'button',
        sub_type: 'url',
        index: '0',
        parameters: [
          {
            type: 'text',
            text: tracking,
          },
        ],
      },
    ],
  };
};
