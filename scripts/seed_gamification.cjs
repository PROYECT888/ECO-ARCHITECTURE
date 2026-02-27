
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedGamification() {
    console.log('🌱 Seeding Gamification Data...');

    // 1. Get Outlets
    const { data: outlets, error: outletError } = await supabase.from('outlets').select('id, name');
    if (outletError || !outlets) {
        console.error('Error fetching outlets:', outletError);
        return;
    }

    console.log(`Found ${outlets.length} outlets.`);

    // 2. Create Actions
    const actions = [
        { display_name: 'Waste Audit Completed', points_value: 150 },
        { display_name: 'Plastic-Free Shift', points_value: 100 },
        { display_name: 'Energy Saving Mode', points_value: 75 },
        { display_name: 'Compost Contribution', points_value: 50 },
        { display_name: 'Sustainable Sourcing', points_value: 200 }
    ];

    const createdActionIds = [];
    for (const action of actions) {
        // Upsert actions one by one since we don't have constraints
        const { data, error } = await supabase
            .from('gamification_actions')
            .upsert(action, { onConflict: 'display_name' })
            .select()
            .single();

        if (data) createdActionIds.push(data);
    }

    console.log(`Managed actions.`);

    // 3. Create Ledger Entries (Randomly distribute points)
    const ledgerEntries = [];
    const now = new Date();

    for (const outlet of outlets) {
        // Generate 5-10 random entries per outlet
        const numEntries = Math.floor(Math.random() * 6) + 5;

        for (let i = 0; i < numEntries; i++) {
            const randomAction = createdActionIds[Math.floor(Math.random() * createdActionIds.length)];
            const timeOffset = Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 7); // Random time within last 7 days
            const createdAt = new Date(now.getTime() - timeOffset).toISOString();

            ledgerEntries.push({
                outlet_id: outlet.id,
                action_id: randomAction.id,
                points_awarded: randomAction.points_value,
                created_at: createdAt
            });
        }
    }

    const { error: ledgerError } = await supabase
        .from('gamification_ledger')
        .insert(ledgerEntries);

    if (ledgerError) {
        console.error('Error seeding ledger:', ledgerError);
    } else {
        console.log(`✅ Successfully seeded ${ledgerEntries.length} ledger entries.`);
    }
}

seedGamification();
