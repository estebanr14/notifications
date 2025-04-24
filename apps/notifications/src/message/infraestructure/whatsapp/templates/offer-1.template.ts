export const offer1Template = () => {
  return {
    name: 'offer1',
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
              link: 'https://bety-asstes.s3.us-east-1.amazonaws.com/offer2.png',
            },
          },
        ],
      },
    ],
  };
};
