export const womensDayTemplate = (args: any) => {
  const { imageUrl, discount, couponName } = args;
  return {
    name: 'women',
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
                'https://bety-asstes.s3.us-east-1.amazonaws.com/womens-6.png',
            },
          },
        ],
      },
      {
        type: 'body',
        parameters: [
          {
            type: 'text',
            text: discount,
          },
          {
            type: 'text',
            text: couponName,
          },
        ],
      },
    ],
  };
};
