'use server';

import { revalidatePath } from 'next/cache';
import connectToDatabase from '@/lib/mongodb';
import Player from '@/models/Player';

function verifyPin(pin: string) {
  const adminPin = process.env.ADMIN_PIN;
  if (!adminPin) return true; // If no PIN is set in .env.local, allow it
  if (pin !== adminPin) {
    throw new Error('Incorrect PIN. You are not authorized.');
  }
}

export async function checkPin(pin: string) {
  const adminPin = process.env.ADMIN_PIN;
  if (!adminPin) return true;
  return pin === adminPin;
}

export async function getPlayers() {
  try {
    await connectToDatabase();
    // Sort players by losses descending (worst at the top)
    const players = await Player.find({}).sort({ losses: -1 }).lean();
    return {
      success: true,
      players: players.map((p: any) => ({
        _id: p._id.toString(),
        name: p.name,
        losses: p.losses,
      })),
    };
  } catch (error: any) {
    console.error('Error fetching players:', error);
    return { success: false, error: error.message };
  }
}

export async function addPlayer(name: string, pin: string) {
  try {
    verifyPin(pin);
    await connectToDatabase();

    if (!name || name.trim() === '') {
      return { success: false, error: 'Name is required' };
    }

    const existingPlayer = await Player.findOne({ name: name.trim() });
    if (existingPlayer) {
      return { success: false, error: 'Player already exists' };
    }

    await Player.create({ name: name.trim() });
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('Error adding player:', error);
    return { success: false, error: error.message };
  }
}

export async function recordLoss(playerId: string, pin: string) {
  try {
    verifyPin(pin);
    await connectToDatabase();
    await Player.findByIdAndUpdate(playerId, { $inc: { losses: 1 } });
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('Error recording loss:', error);
    return { success: false, error: error.message };
  }
}

export async function decreaseLoss(playerId: string, pin: string) {
  try {
    verifyPin(pin);
    await connectToDatabase();
    await Player.findOneAndUpdate(
      { _id: playerId, losses: { $gt: 0 } }, 
      { $inc: { losses: -1 } }
    );
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('Error decreasing loss:', error);
    return { success: false, error: error.message };
  }
}
