'use client';
import { addDoc, collection, Firestore } from 'firebase/firestore';

// Define a type for our score data
export interface Score {
  userId: string;
  name: string;
  score: number;
  game: string;
  createdAt: Date;
}

export const addScore = async (db: Firestore, scoreData: Score) => {
  try {
    const scoresCollection = collection(db, 'scores');
    await addDoc(scoresCollection, scoreData);
  } catch (error) {
    console.error('Error adding score:', error);
    // Optionally, re-throw the error or handle it as needed
    throw error;
  }
};
