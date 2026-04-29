'use server';

import { revalidatePath } from 'next/cache';
import connectToDatabase from '@/lib/mongodb';
import Player from '@/models/Player';

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

export async function addPlayer(formData: FormData) {
  try {
    await connectToDatabase();
    const name = formData.get('name') as string;

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

export async function recordLoss(playerId: string) {
  try {
    await connectToDatabase();
    await Player.findByIdAndUpdate(playerId, { $inc: { losses: 1 } });
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('Error recording loss:', error);
    return { success: false, error: error.message };
  }
}
