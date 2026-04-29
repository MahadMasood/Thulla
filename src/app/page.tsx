import { getPlayers } from '@/actions/playerActions';
import LeaderboardClient from '@/components/LeaderboardClient';
import AddPlayerForm from '@/components/AddPlayerForm';
import LockUI from '@/components/LockUI';
import './page.css';

export default async function Home() {
  const result = await getPlayers();
  
  const hasError = !result.success;
  const isMongoMissing = hasError && result.error?.includes('MONGODB_URI');

  return (
    <main className="container">
      <LockUI />
      <header className="header">
        <h1 className="title text-gradient">Thulla Leaderboard</h1>
        <p className="subtitle playful-bounce">Track the one jo roti khilayega 🫓💸</p>
      </header>

      {isMongoMissing ? (
        <div className="glass-panel error-panel">
          <h2>Database Not Connected</h2>
          <p>Please add your MONGODB_URI to the .env.local file to connect to the database.</p>
        </div>
      ) : hasError ? (
        <div className="glass-panel error-panel">
          <h2>Error</h2>
          <p>{result.error}</p>
        </div>
      ) : (
        <div className="content-grid">
          <section className="leaderboard-section">
            <LeaderboardClient initialPlayers={result.players || []} />
          </section>
          
          <aside className="sidebar">
            <div className="glass-panel form-panel">
              <h2 className="form-title">Add New Player</h2>
              <AddPlayerForm />
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
