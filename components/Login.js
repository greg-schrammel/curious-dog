import React from 'react';
import {
  Button,
  ModalOverlay,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton
} from '@chakra-ui/core';
import { FaTwitter } from 'react-icons/fa';

import { Machine, sendParent } from 'xstate';
import { useMachine } from 'lib/useMachine';

import { loginWithTwitter } from 'lib/auth';

const loginMachine = Machine({
  id: 'login',
  initial: 'idle',
  states: {
    idle: {
      on: {
        start: 'loading'
      }
    },
    loading: {
      invoke: {
        src: 'login',
        onDone: {
          target: 'completed',
          actions: sendParent('userLogin', { user: (_ctx, e) => e })
        },
        onError: 'failed'
      }
    },
    failed: {
      initial: 'showingError',
      states: {
        showingError: {},
        hiddenError: {}
      },
      on: {
        start: 'loading',
        hideError: 'failed.hiddenError',
        showError: 'failed.showingError'
      }
    },
    completed: {
      type: 'final'
    }
  }
});

function TwitterButton({ children, onClick, isLoading }) {
  return (
    <Button
      backgroundColor="twitter.500"
      rounded="full"
      color="white"
      leftIcon={FaTwitter}
      loadingText="esperando twitter"
      onClick={onClick}
      isLoading={isLoading}
    >
      {children}
    </Button>
  );
}

export function LoginWithTwitter() {
  const [state, send] = useMachine(loginMachine, {
    services: {
      login: () => loginWithTwitter(twitterProvider)
    }
  });
  return (
    <>
      <TwitterButton onClick={() => send('start')} isLoading={state.matches('loading')}>
        Entrar
      </TwitterButton>
      <Modal onClose={() => send('hideError')} isOpen={state.matches('failed.showingError')}>
        <ModalOverlay />
        <ModalContent rounded="lg" width="80%">
          <ModalHeader>Deu algo errado</ModalHeader>
          <ModalCloseButton />
          <ModalFooter>
            <TwitterButton onClick={() => send('start')} isLoading={state.matches('loading')}>
              Tentar dnv
            </TwitterButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
