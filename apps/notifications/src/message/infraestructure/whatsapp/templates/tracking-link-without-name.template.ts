export const trackingLinkWithoutNameTemplate = (args: any) => {
  const { imageUrl, tracking } = args;
  return {
    name: 'tracking_link_without_name',
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
