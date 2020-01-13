import { Machine, assign } from "xstate";

function sendAnswer() {
  return new Promise();
}

export default Machine(
  {
    id: "question",
    initial: "idle",
    context: {
      shouldShareOnTwitter: true
    },
    states: {
      idle: {
        on: {
          answer: "answering"
        }
      },
      answering: {
        on: {
          cancel: "idle",
          sendAnswer: "sending"
        }
      },
      sending: {
        invoke: {
          id: "sendingAnswer",
          src: "sendAnswer",
          onDone: "success",
          onError: "failure"
        }
      },
      failure: {
        on: {
          retry: "sending"
        }
      },
      success: {}
    },
    on: {
      toggleShareOnTwitter: {
        actions: assign({
          shouldShareOnTwitter: ({ shouldShareOnTwitter }) =>
            !shouldShareOnTwitter
        })
      }
    }
  },
  {
    services: {
      sendAnswer: (context, event) => sendAnswer(event.answer)
    }
  }
);
