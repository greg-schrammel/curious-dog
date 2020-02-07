import * as firebase from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyBw5yTvyTUSblDBPnkdluPeIwjmepOo-fM',
  authDomain: `curiousdog-5b875.firebaseapp.com`,
  databaseURL: `https://curiousdog-5b875.firebaseio.com`,
  projectId: 'curiousdog-5b875',
  storageBucket: `curiousdog-5b875.appspot.com`,
  messagingSenderId: '237407996555',
  appId: '1:237407996555:web:0357597c75ddbac730a28e'
};

export default firebase.apps[0] || firebase.initializeApp(firebaseConfig);
