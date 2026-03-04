import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { JeepSqlite } from 'jeep-sqlite/dist/components/jeep-sqlite';
import { muscles, exercises } from './data/gymData';

// Define custom elements for web support
customElements.define('jeep-sqlite', JeepSqlite);

let sqlite: SQLiteConnection;
let db: SQLiteDBConnection;

const DB_NAME = 'gym_db';

export async function initDatabase() {
  try {
    sqlite = new SQLiteConnection(CapacitorSQLite);

    // Create/Open database
    if (Capacitor.getPlatform() === 'web') {
      // Create jeep-sqlite element
      const jeepSqlite = document.createElement('jeep-sqlite');
      document.body.appendChild(jeepSqlite);
      await customElements.whenDefined('jeep-sqlite');
      await sqlite.initWebStore();
    }

    const ret = await sqlite.checkConnectionsConsistency();
    const isConn = (await sqlite.isConnection(DB_NAME, false)).result;

    if (ret.result && isConn) {
      db = await sqlite.retrieveConnection(DB_NAME, false);
    } else {
      db = await sqlite.createConnection(DB_NAME, false, 'no-encryption', 1, false);
    }

    await db.open();

    // Create Tables
    await db.execute(`
      CREATE TABLE IF NOT EXISTS muscles (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        "group" TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS exercises (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        primary_muscles TEXT NOT NULL,
        secondary_muscles TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS routines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS routine_exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        routine_id INTEGER NOT NULL,
        exercise_id TEXT NOT NULL,
        "order" INTEGER NOT NULL,
        FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE,
        FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS workouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        routine_id INTEGER,
        start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        end_time DATETIME,
        FOREIGN KEY (routine_id) REFERENCES routines(id)
      );

      CREATE TABLE IF NOT EXISTS workout_sets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workout_id INTEGER NOT NULL,
        exercise_id TEXT NOT NULL,
        set_number INTEGER NOT NULL,
        reps INTEGER NOT NULL,
        weight REAL NOT NULL,
        completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE,
        FOREIGN KEY (exercise_id) REFERENCES exercises(id)
      );
    `);

    // Seed Data if empty
    const res = await db.query('SELECT count(*) as c FROM exercises');
    if (res.values && res.values[0].c === 0) {
      console.log('Seeding database...');
      
      // Muscles
      for (const m of muscles) {
        await db.run('INSERT INTO muscles (id, name, "group") VALUES (?, ?, ?)', [m.id, m.name, m.group]);
      }

      // Exercises
      for (const e of exercises) {
        await db.run(
          'INSERT INTO exercises (id, name, primary_muscles, secondary_muscles) VALUES (?, ?, ?, ?)',
          [e.id, e.name, JSON.stringify(e.primaryMuscles), JSON.stringify(e.secondaryMuscles)]
        );
      }

      // Default Routines
      const routines = [
        {
          name: 'Full Body A',
          exercises: ['squat', 'bench_press', 'bent_over_row', 'overhead_press', 'bicep_curl', 'tricep_pushdown']
        },
        {
          name: 'Upper Body Power',
          exercises: ['bench_press', 'bent_over_row', 'overhead_press', 'pullups', 'skullcrushers', 'bicep_curl']
        },
        {
          name: 'Lower Body Power',
          exercises: ['squat', 'romanian_deadlift', 'leg_press', 'leg_curl', 'calf_raise', 'plank']
        }
      ];

      for (const r of routines) {
        const res = await db.run('INSERT INTO routines (name) VALUES (?)', [r.name]);
        const routineId = res.changes?.lastId;
        
        if (routineId) {
          for (let idx = 0; idx < r.exercises.length; idx++) {
            const exId = r.exercises[idx];
            await db.run('INSERT INTO routine_exercises (routine_id, exercise_id, "order") VALUES (?, ?, ?)', [routineId, exId, idx]);
          }
        }
      }
    }

    if (Capacitor.getPlatform() === 'web') {
      await sqlite.saveToStore(DB_NAME);
    }

  } catch (err) {
    console.error('Database initialization failed:', err);
  }
}

export const getDB = () => db;
