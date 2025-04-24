import { baseEmailTemplate } from './base.email';

export const mfaEmailTemplate = (args: any) => {
  const { code } = args;
  return baseEmailTemplate(
    `<h1 style="color: #000000;">¡Hola!</h1>
  <p>Para continuar, por favor ingresa el siguiente código en la página de login:</p><br/>
  <div style="background-color:rgb(232, 231, 231); padding: 1rem; border-radius: 0.5rem; font-size: 1.5rem; text-align: center; color: #ff521a; font-weight: bold;">${code}</div>
  <p>Si tienes alguna pregunta, no dudes en contactarnos. ¡Gracias!</p>`,
  );
};
