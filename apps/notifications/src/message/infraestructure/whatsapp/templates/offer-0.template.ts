export const sundayOfferTemplate = () => {
  return {
    name: 'domingo_pestanas',
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
              link: 'https://bety-asstes.s3.us-east-1.amazonaws.com/SALE1.png',
            },
          },
        ],
      },
    ],
  };
};
