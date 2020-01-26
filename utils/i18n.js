// TODO
export default function i18n(tag, number) {
  return {
    anonymous: "Alguém",
    answer_button: "Responder",
    send: "Enviar",
    write_answer: "Sua resposta",
    ["not answered"]:
      number > 1 ? `${number} não respondida` : `${number} não respondidas`,
    more: "mais",
    asked: "perguntou",
    ["tweet your answer"]: "tweet sua resposta",
    ["you dont have any questions"]: "Você não tem perguntas",
    ["maybe sharing your profile will help"]:
      "Talvez compartilhar seu perfil ajude"
  }[tag];
}
