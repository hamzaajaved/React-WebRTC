import firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  // FIREBASE CONFIG HERE
  apiKey: "AIzaSyD0yaydjIL4b9WniGSt6H8J9Z1zjDrp3Ic",
  authDomain: "videochat-9c65d.firebaseapp.com",
  projectId: "videochat-9c65d",
  storageBucket: "videochat-9c65d.appspot.com",
  messagingSenderId: "597017536024",
  appId: "1:597017536024:web:e62681919e5e402b1a856d",
  measurementId: "G-WE1RXEGFG1",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const firestore = firebase.firestore();

const createOffer = async (peerConnection) => {
  const callDoc = firestore.collection("calls").doc();
  const offerCandidates = callDoc.collection("offerCandidates");
  const answerCandidates = callDoc.collection("answerCandidates");

  peerConnection.onicecandidate = (event) => {
    event.candidate && offerCandidates.add(event.candidate.toJSON());
  };

  const offerDescription = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offerDescription);

  const offer = {
    sdp: offerDescription.sdp,
    type: offerDescription.type,
  };

  await callDoc.set({ offer });

  callDoc.onSnapshot((snapshot) => {
    const data = snapshot.data();
    if (!peerConnection.currentRemoteDescription && data?.answer) {
      const answerDescription = new RTCSessionDescription(data.answer);
      peerConnection.setRemoteDescription(answerDescription);
    }
  });

  answerCandidates.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const candidate = new RTCIceCandidate(change.doc.data());
        peerConnection.addIceCandidate(candidate);
      }
    });
  });

  return callDoc.id;
};

const checkIfUserExists = async (joinCode) => {

  // TODO: Implement checkIfUserExists
  return true;
}

const createAnswer = async (peerConnection, joinCode) => {
  const callDoc = firestore.collection("calls").doc(joinCode);
  const answerCandidates = callDoc.collection("answerCandidates");
  const offerCandidates = callDoc.collection("offerCandidates");

  peerConnection.onicecandidate = (event) => {
    event.candidate && answerCandidates.add(event.candidate.toJSON());
  };

  const callData = (await callDoc.get()).data();

  const offerDescription = callData.offer;
  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(offerDescription)
  );

  const answerDescription = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answerDescription);

  const answer = {
    type: answerDescription.type,
    sdp: answerDescription.sdp,
  };

  await callDoc.update({ answer });

  offerCandidates.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        let data = change.doc.data();
        peerConnection.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });
};

const deleteOffer = async (peerConnection, joinCode) => {
  peerConnection.close();

  if (joinCode) {
    let roomRef = firestore.collection("calls").doc(joinCode);
    await roomRef
      .collection("answerCandidates")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete();
        });
      });
    await roomRef
      .collection("offerCandidates")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete();
        });
      });

    await roomRef.delete();
  }
  window.location.replace("/")
};

export { createOffer, createAnswer, deleteOffer, checkIfUserExists };
