import { useState, useEffect, useRef } from "react";
import { interpret, State } from "xstate";

export function useConstant(fn) {
  const ref = useRef();

  if (!ref.current) {
    ref.current = { v: fn() };
  }

  return ref.current.v;
}

export function useMachine(machine, options = {}) {
  if (process.env.NODE_ENV !== "production") {
    const [initialMachine] = useState(machine);
    if (machine !== initialMachine) {
      throw new Error(
        "Machine given to `useMachine` has changed between renders. This is not supported and might lead to unexpected results.\n" +
          "Please make sure that you pass the same Machine as argument each time."
      );
    }
  }
  const {
    context,
    guards,
    actions,
    activities,
    services,
    delays,
    state: rehydratedState,
    ...interpreterOptions
  } = options;

  const service = useConstant(() => {
    const machineConfig = {
      context,
      guards,
      actions,
      activities,
      services,
      delays
    };
    const createdMachine = machine.withConfig(
      machineConfig,
      Object.assign(Object.assign({}, machine.context), context)
    );
    return interpret(createdMachine, interpreterOptions).start(
      rehydratedState ? State.create(rehydratedState) : undefined
    );
  });
  const [current, setCurrent] = useState(service.state);
  useEffect(() => {
    service.onTransition(state => {
      if (state.changed) {
        setCurrent(state);
      }
    });
    // if service.state has not changed React should just bail out from this update
    setCurrent(service.state);
    return () => {
      service.stop();
    };
  }, []);
  // Make sure actions and services are kept updated when they change.
  // This mutation assignment is safe because the service instance is only used
  // in one place -- this hook's caller.
  useEffect(() => {
    Object.assign(service.machine.options.actions, actions);
  }, [actions]);
  useEffect(() => {
    Object.assign(service.machine.options.services, services);
  }, [services]);
  return [current, service.send, service];
}
