import admin from 'firebase-admin';

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      console.warn("FIREBASE CREDENTIALS MISSING. FIREBASE WILL NOT WORK.");
    }
  } catch (error) {
    console.error('Firebase Admin Initialization Error', error.stack);
  }
}

const firestore = admin.apps.length ? admin.firestore() : null;

export async function addQR(qr, userEmail) {
  if (!userEmail || !firestore) return null;
  qr.userEmail = userEmail;
  await firestore.collection('qrs').doc(qr.id).set(qr);
  return qr;
}

export async function getQR(id) {
  if (!firestore) return null;
  const doc = await firestore.collection('qrs').doc(id).get();
  return doc.exists ? doc.data() : null;
}

export async function incrementScan(id) {
  if (!firestore) return;
  const ref = firestore.collection('qrs').doc(id);
  await firestore.runTransaction(async (t) => {
    const doc = await t.get(ref);
    if (doc.exists) {
      t.update(ref, { scans: (doc.data().scans || 0) + 1 });
    }
  });
}

export async function updateQR(id, newData, userEmail) {
  if (!firestore) return null;
  const ref = firestore.collection('qrs').doc(id);
  const doc = await ref.get();
  if (doc.exists && doc.data().userEmail === userEmail) {
    await ref.update(newData);
    return { ...doc.data(), ...newData };
  }
  return null;
}

export async function deleteQR(id, userEmail) {
  if (!firestore) return false;
  const ref = firestore.collection('qrs').doc(id);
  const doc = await ref.get();
  if (doc.exists && doc.data().userEmail === userEmail) {
    await ref.delete();
    return true;
  }
  return false;
}

export async function clearAllQRsByUser(userEmail) {
  if (!userEmail || !firestore) return false;
  const snapshot = await firestore.collection('qrs').where('userEmail', '==', userEmail).get();
  if (snapshot.empty) return true;
  
  const batch = firestore.batch();
  snapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });
  await batch.commit();
  return true;
}

export async function getAllQRsByUser(userEmail) {
  if (!userEmail || !firestore) return [];
  const snapshot = await firestore.collection('qrs').where('userEmail', '==', userEmail).get();
  return snapshot.docs.map(doc => doc.data());
}

export async function syncUserProfileQR(userEmail) {
  if (!userEmail || !firestore) return null;
  const snapshot = await firestore.collection('qrs')
    .where('userEmail', '==', userEmail)
    .where('isProfileQR', '==', true)
    .limit(1)
    .get();

  if (snapshot.empty) {
    const uniqueHash = Array.from(userEmail).reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) | 0, 0);
    const newProfileQR = {
      id: `p-${Math.abs(uniqueHash).toString(16).substring(0, 8)}`,
      name: 'Dynamic Profile Link',
      type: 'link',
      targetData: 'https://example.com',
      scans: 0,
      createdAt: new Date().toISOString(),
      userEmail: userEmail,
      isProfileQR: true,
    };
    await firestore.collection('qrs').doc(newProfileQR.id).set(newProfileQR);
    return newProfileQR;
  }
  return snapshot.docs[0].data();
}
