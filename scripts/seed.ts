import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { files } from '../db/schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

// file_id matches the audio filename (without .mp3) in public/audio/
// trueScore is the self-reported Kinsey Scale (1-5) from Master Spreadsheet.csv
const SEED_DATA = [
  { fileId: 'Aaron_Paul_Ingham',            trueScore: 1 },
  { fileId: 'Abe_Ian_Kim',                  trueScore: 1 },
  { fileId: 'Abner_Valentine_Lo',           trueScore: 4 },
  { fileId: 'Andrew_Yingchen_Gu',           trueScore: 1 },
  { fileId: 'Asher_Kibble_Ibria',           trueScore: 5 },
  { fileId: 'Azad_Pars_Salaam',             trueScore: 5 },
  { fileId: 'Big_Ey_Cai',                   trueScore: 1 },
  { fileId: 'Billiam_Traincar_Zhu',         trueScore: 3 },
  { fileId: 'Bob_Nicolas_Gonzalo',          trueScore: 4 },
  { fileId: 'Chris_Chandler_King',          trueScore: 1 },
  { fileId: 'Chris_Jason_Paulson',          trueScore: 2 },
  { fileId: 'Chris_Topher_Hu',              trueScore: 4 },
  { fileId: 'Damian_Ubiel_Torcuato',        trueScore: 5 },
  { fileId: 'Darryl_David_Miller',          trueScore: 3 },
  { fileId: 'David_Aaron_Beauregard',       trueScore: 1 },
  { fileId: 'Edward_Scissorhands_Salamander', trueScore: 5 },
  { fileId: 'Ethan_Nguyen_Nguyen',          trueScore: 1 },
  { fileId: 'Franklin_Kampbell_Freeman',    trueScore: 5 },
  { fileId: 'Ishaan_Arav_Arun',             trueScore: 5 },
  { fileId: 'Ishmael_Michael_Cabrera',      trueScore: 1 },
  { fileId: 'James_Edward_Granton',         trueScore: 1 },
  { fileId: 'James_Landon_Gallway',         trueScore: 3 },
  { fileId: 'Jason_Fan_Yew',                trueScore: 1 },
  { fileId: 'Jason_Jerome_Cao',             trueScore: 5 },
  { fileId: 'Johnny_Gabe_Young',            trueScore: 1 },
  { fileId: 'Joss_Andrew_Section',          trueScore: 5 },
  { fileId: 'Josue_Benedicto_Marti',        trueScore: 1 },
  { fileId: 'Juniper_Jim_Sha',              trueScore: 1 },
  { fileId: 'Kamal_Chandan_Obterre',        trueScore: 4 },
  { fileId: 'Keith_Tadeo_Muna',             trueScore: 2 },
  { fileId: 'Leandro_Rado_Sanchez',         trueScore: 1 },
  { fileId: 'Matthew_Easton_Paulson',       trueScore: 3 },
  { fileId: 'Matthew_Enlai_Zhang',          trueScore: 1 },
  { fileId: 'Micheal_Kawoori_Obterra',      trueScore: 5 },
  { fileId: 'Nicholas_Andrew_Falhosh',      trueScore: 2 },
  { fileId: 'Preed_Odathi_Ghandi',          trueScore: 1 },
  { fileId: 'Rahul_Ibhan_Ramiz',            trueScore: 5 },
  { fileId: 'Randall_Larry_McGaren',        trueScore: 5 },
  { fileId: 'Ryouma_Naru_Kouya',            trueScore: 1 },
  { fileId: 'Sahil_Krishna_Bhat',           trueScore: 1 },
  { fileId: 'Shangdong_Bill_Kang',          trueScore: 2 },
  { fileId: 'Shannon_Steven_Palley',        trueScore: 1 },
  { fileId: 'Sipoon_Lance_Kim',             trueScore: 3 },
  { fileId: 'Thane_Manny_Manuel',           trueScore: 5 },
  { fileId: 'Theo_Jasper_Zhang',            trueScore: 1 },
  { fileId: 'Thomas_Harries_Huckstable',    trueScore: 5 },
  { fileId: 'Tollbooth_Jerome_Malcomb',     trueScore: 2 },
  { fileId: 'Willard_Gary_Barry',           trueScore: 4 },
  { fileId: 'Yinfan_Fred_Ha',               trueScore: 1 },
  { fileId: 'Zeke_Thane_Painter',           trueScore: 1 },
];

async function seed() {
  console.log('Seeding files table...');
  await db.insert(files).values(SEED_DATA).onConflictDoNothing();
  console.log(`Done — inserted up to ${SEED_DATA.length} rows (skipped any duplicates).`);
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
