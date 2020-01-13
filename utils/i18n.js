// TODO
export default function i18n(tag, number) {
  return {
    anonymous: "Alguém",
    answer_button: "Responder",
    send: "Enviar",
    write_answer: "Sua resposta:",
    to_answer:
      number > 1 ? `${number} não respondida` : `${number} não respondidas`,
    more: "mais"
  }[tag];
}
