import * as functions from 'firebase-functions';
import * as cors from 'cors';
import { db } from './utils/admin';

const corsHandler = cors({ origin: true });

type Score = {
  id: string;
  difficulty: number;
  score: number;
  user: string;
  createdAt: string;
};

export const getScores = functions.https.onRequest((request, response) => {
  corsHandler(request, response, () => {});
  if (request.method !== 'GET') {
    response.status(400).send('Unsupported method');
    return;
  }
  db.collection('scores')
    .orderBy('createdAt', 'desc')
    .get()
    .then((data) => {
      const scores: Score[] = [];
      data.forEach((doc) => {
        scores.push({
          id: doc.id,
          difficulty: doc.data().difficulty,
          score: doc.data().score,
          user: doc.data().user,
          createdAt: doc.data().createdAt,
        });
      });
      return response.json(scores);
    })
    .catch((err) => {
      console.error(err);
      response.status(500).json({ error: err.code });
    });
});

export const submitScore = functions.https.onRequest((request, response) => {
  corsHandler(request, response, () => {});
  if (request.method !== 'POST') {
    response.status(400).send('Unsupported method');
    return;
  }
  if (request.body.user.trim() === '') {
    response.status(400).json({ user: 'Must not be empty' });
    return;
  }
  const newScore = {
    user: request.body.user,
    difficulty: request.body.difficulty,
    score: request.body.score,
    createdAt: new Date().toISOString(),
  };
  db.collection('scores')
    .add(newScore)
    .then((doc) => {
      return response.json({ ...newScore, id: doc.id });
    })
    .catch((err) => {
      console.error(err);
      response.status(500).json({ error: 'Something went wrong' });
    });
});
