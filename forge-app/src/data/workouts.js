export const DAYS = [
  {
    d: 1, t: 'HAMSTRINGS + GLUTES', m: 72,
    warmup: ['5 min incline walk', 'Hip circles x20', 'Glute bridges x15', 'Leg swings x12/side'],
    exercises: [
      { name: 'Romanian Deadlift', subtitle: 'Barbell — hip hinge focus', protocol: '4x8-10', tag: 'COMPOUND', sets: 4, cues: ['Soft knee bend', 'Hinge at hips', 'Bar close to legs', 'Squeeze glutes at top'] },
      { name: 'Bulgarian Split Squat', subtitle: 'DB — rear foot elevated', protocol: '3x10-12/side', tag: 'UNILATERAL', sets: 3, cues: ['Front shin vertical', 'Control the descent', 'Drive through heel'] },
      { name: 'Lying Leg Curl', subtitle: 'Machine — peak contraction', protocol: '4x10-12', tag: 'ISOLATION', sets: 4, cues: ['Full stretch at bottom', 'Squeeze hard at top', 'Slow eccentric 3 sec'] },
      { name: 'Hip Thrust', subtitle: 'Barbell — glute emphasis', protocol: '4x10-12', tag: 'COMPOUND', sets: 4, cues: ['Tuck chin', 'Full hip extension', 'Pause at top 1 sec'] },
      { name: 'Seated Leg Curl', subtitle: 'Machine — FST-7 finisher', protocol: '7x10-12', tag: 'FST-7', sets: 7, cues: ['45 sec rest between sets', 'Maintain form as fatigue builds', 'Stretch between sets'] },
    ]
  },
  {
    d: 2, t: 'CHEST + SIDE DELTS', m: 68,
    warmup: ['5 min light cardio', 'Band pull-aparts x20', 'Push-ups x15', 'Shoulder circles x15'],
    exercises: [
      { name: 'Incline Barbell Press', subtitle: '30° angle — upper chest focus', protocol: '4x6-8', tag: 'COMPOUND', sets: 4, cues: ['Retract scapula', 'Controlled descent', 'Drive through chest'] },
      { name: 'Flat Dumbbell Press', subtitle: 'Full ROM — squeeze at top', protocol: '4x8-10', tag: 'COMPOUND', sets: 4, cues: ['Elbows at 45°', 'Deep stretch at bottom', 'Press and squeeze'] },
      { name: 'Cable Fly', subtitle: 'Low to high — upper inner chest', protocol: '3x12-15', tag: 'ISOLATION', sets: 3, cues: ['Slight forward lean', 'Lead with pinkies', 'Squeeze at peak'] },
      { name: 'Lateral Raise', subtitle: 'DB — controlled tempo', protocol: '4x12-15', tag: 'ISOLATION', sets: 4, cues: ['Slight bend in elbow', 'Lead with elbow', 'Pause at top'] },
      { name: 'Machine Lateral Raise', subtitle: 'FST-7 finisher', protocol: '7x10-12', tag: 'FST-7', sets: 7, cues: ['45 sec rest', 'Keep tension constant', 'Partial reps if needed on last 2 sets'] },
    ]
  },
  {
    d: 3, t: 'BACK WIDTH + REAR DELTS', m: 75,
    warmup: ['5 min rowing machine', 'Band face pulls x20', 'Scapular pull-ups x10', 'Cat-cow x10'],
    exercises: [
      { name: 'Weighted Pull-Up', subtitle: 'Wide grip — lat stretch', protocol: '4x6-8', tag: 'COMPOUND', sets: 4, cues: ['Dead hang start', 'Drive elbows down', 'Chin over bar'] },
      { name: 'Barbell Row', subtitle: 'Overhand — upper back', protocol: '4x8-10', tag: 'COMPOUND', sets: 4, cues: ['45° torso angle', 'Pull to lower chest', 'Squeeze scapulae'] },
      { name: 'Single Arm DB Row', subtitle: 'Bench supported', protocol: '3x10-12/side', tag: 'UNILATERAL', sets: 3, cues: ['Full stretch at bottom', 'Row to hip', 'Control the negative'] },
      { name: 'Reverse Pec Deck', subtitle: 'Rear delt focus', protocol: '4x12-15', tag: 'ISOLATION', sets: 4, cues: ['Lead with elbows', 'Squeeze at contraction', 'Slow eccentric'] },
      { name: 'Straight Arm Pulldown', subtitle: 'Cable — FST-7 finisher', protocol: '7x10-12', tag: 'FST-7', sets: 7, cues: ['45 sec rest', 'Slight hip hinge', 'Feel the lat stretch'] },
    ]
  },
  {
    d: 4, t: 'REST + RECOVERY', m: 0,
    warmup: [],
    exercises: [],
    isRest: true,
    recovery: ['Light 20-30 min walk', 'Foam rolling full body', 'Stretching routine 15 min', 'Hydration focus — extra 500ml', 'Sleep priority — 8+ hours']
  },
  {
    d: 5, t: 'QUADS + CALVES', m: 70,
    warmup: ['5 min bike', 'Leg extensions x15 light', 'Bodyweight squats x15', 'Ankle circles x15'],
    exercises: [
      { name: 'Barbell Back Squat', subtitle: 'High bar — full depth', protocol: '5x5', tag: 'COMPOUND', sets: 5, cues: ['Brace core hard', 'Break at hips and knees', 'Drive through whole foot', 'Below parallel'] },
      { name: 'Leg Press', subtitle: 'Narrow stance — quad focus', protocol: '4x10-12', tag: 'COMPOUND', sets: 4, cues: ['Feet low on platform', 'Full ROM', 'Don\'t lock knees'] },
      { name: 'Leg Extension', subtitle: 'Machine — quad isolation', protocol: '4x12-15', tag: 'ISOLATION', sets: 4, cues: ['Pause at top 1 sec', 'Slow negative 3 sec', 'Full contraction'] },
      { name: 'Walking Lunge', subtitle: 'DB — functional strength', protocol: '3x12/side', tag: 'UNILATERAL', sets: 3, cues: ['Long stride', 'Knee tracks toe', 'Upright torso'] },
      { name: 'Standing Calf Raise', subtitle: 'Machine — FST-7 finisher', protocol: '7x12-15', tag: 'FST-7', sets: 7, cues: ['45 sec rest', 'Full stretch at bottom', 'Peak contraction at top', 'Alternate foot angle'] },
    ]
  },
  {
    d: 6, t: 'SHOULDERS + ARMS', m: 65,
    warmup: ['5 min jump rope', 'Band dislocates x15', 'Light DB press x12', 'Wrist circles x15'],
    exercises: [
      { name: 'Seated DB Overhead Press', subtitle: 'Neutral grip — full ROM', protocol: '4x8-10', tag: 'COMPOUND', sets: 4, cues: ['Core braced', 'Full lockout', 'Control the descent'] },
      { name: 'Barbell Curl', subtitle: 'Strict form — EZ bar', protocol: '4x8-10', tag: 'ISOLATION', sets: 4, cues: ['Elbows pinned', 'Squeeze at top', 'Slow negative'] },
      { name: 'Skull Crusher', subtitle: 'EZ bar — long head focus', protocol: '4x10-12', tag: 'ISOLATION', sets: 4, cues: ['Elbows in', 'Lower behind head slightly', 'Full extension'] },
      { name: 'Hammer Curl', subtitle: 'DB — brachialis focus', protocol: '3x10-12', tag: 'ISOLATION', sets: 3, cues: ['Neutral grip', 'No swinging', 'Controlled tempo'] },
      { name: 'Overhead Cable Extension', subtitle: 'Rope — FST-7 finisher', protocol: '7x10-12', tag: 'FST-7', sets: 7, cues: ['45 sec rest', 'Spread rope at extension', 'Full stretch behind head'] },
    ]
  },
  {
    d: 7, t: 'BACK THICKNESS + TRAPS', m: 70,
    warmup: ['5 min row machine', 'Band rows x20', 'Dead hang 30 sec', 'Thoracic rotations x10/side'],
    exercises: [
      { name: 'Deadlift', subtitle: 'Conventional — full body', protocol: '5x3-5', tag: 'COMPOUND', sets: 5, cues: ['Brace and breathe', 'Push floor away', 'Lock hips at top', 'Controlled descent'] },
      { name: 'T-Bar Row', subtitle: 'Close grip — thickness', protocol: '4x8-10', tag: 'COMPOUND', sets: 4, cues: ['Chest on pad', 'Drive elbows back', 'Squeeze at contraction'] },
      { name: 'Cable Row', subtitle: 'Seated — V-handle', protocol: '4x10-12', tag: 'COMPOUND', sets: 4, cues: ['Full stretch forward', 'Pull to navel', 'Retract scapulae'] },
      { name: 'Barbell Shrug', subtitle: 'Heavy — trap focus', protocol: '4x10-12', tag: 'ISOLATION', sets: 4, cues: ['Straight up and down', 'Hold at top 2 sec', 'Heavy weight'] },
      { name: 'Face Pull', subtitle: 'Rope — rear delt/trap', protocol: '4x15-20', tag: 'ISOLATION', sets: 4, cues: ['Pull to face level', 'External rotate at end', 'Light weight, high reps'] },
    ]
  },
  {
    d: 8, t: 'REST + RECOVERY', m: 0,
    warmup: [],
    exercises: [],
    isRest: true,
    recovery: ['Active recovery — yoga or swimming', 'Foam rolling problem areas', 'Mobility work 20 min', 'Mental health check-in', 'Meal prep for next training block']
  },
  {
    d: 9, t: 'CHEST + TRICEPS', m: 68,
    warmup: ['5 min light cardio', 'Push-ups x15', 'Band tricep pushdowns x15', 'Rotator cuff x12'],
    exercises: [
      { name: 'Flat Barbell Bench', subtitle: 'Competition style', protocol: '5x5', tag: 'COMPOUND', sets: 5, cues: ['Arch back slightly', 'Retract scapulae', 'Touch chest', 'Explosive press'] },
      { name: 'Incline DB Fly', subtitle: '30° — stretch focus', protocol: '4x10-12', tag: 'ISOLATION', sets: 4, cues: ['Deep stretch at bottom', 'Slight bend in elbows', 'Squeeze at top'] },
      { name: 'Dips', subtitle: 'Weighted — lean forward', protocol: '3x8-10', tag: 'COMPOUND', sets: 3, cues: ['Forward lean for chest', 'Full depth', 'Controlled tempo'] },
      { name: 'Close Grip Bench', subtitle: 'Tricep emphasis', protocol: '4x8-10', tag: 'COMPOUND', sets: 4, cues: ['Hands shoulder width', 'Elbows tucked', 'Lock out fully'] },
      { name: 'Tricep Pushdown', subtitle: 'V-bar — FST-7 finisher', protocol: '7x10-12', tag: 'FST-7', sets: 7, cues: ['45 sec rest', 'Full extension', 'Don\'t let elbows drift'] },
    ]
  },
  {
    d: 10, t: 'LEGS — FULL', m: 78,
    warmup: ['5 min incline walk', 'Hip circles x20', 'Goblet squats x12', 'Leg swings x12/side'],
    exercises: [
      { name: 'Front Squat', subtitle: 'Clean grip — quad dominant', protocol: '4x6-8', tag: 'COMPOUND', sets: 4, cues: ['Elbows high', 'Upright torso', 'Full depth', 'Drive through quads'] },
      { name: 'Stiff Leg Deadlift', subtitle: 'DB — hamstring focus', protocol: '4x10-12', tag: 'COMPOUND', sets: 4, cues: ['Straight legs', 'Hinge deep', 'Feel hamstring stretch'] },
      { name: 'Hack Squat', subtitle: 'Machine — quad isolation', protocol: '4x10-12', tag: 'COMPOUND', sets: 4, cues: ['Narrow stance', 'Full depth', 'Controlled negative'] },
      { name: 'Glute Ham Raise', subtitle: 'Bodyweight — posterior chain', protocol: '3x8-10', tag: 'COMPOUND', sets: 3, cues: ['Control the eccentric', 'Push through toes', 'Full extension'] },
      { name: 'Seated Calf Raise', subtitle: 'FST-7 finisher — soleus focus', protocol: '7x15-20', tag: 'FST-7', sets: 7, cues: ['45 sec rest', 'Full stretch', 'Hold at top', 'Slow tempo'] },
    ]
  },
  {
    d: 11, t: 'BACK + BICEPS', m: 72,
    warmup: ['5 min rowing', 'Band pull-aparts x20', 'Light curls x12', 'Scapular mobility x10'],
    exercises: [
      { name: 'Pendlay Row', subtitle: 'From floor — explosive', protocol: '4x5-7', tag: 'COMPOUND', sets: 4, cues: ['Dead stop each rep', 'Explosive pull', 'Touch lower chest'] },
      { name: 'Lat Pulldown', subtitle: 'Wide grip — stretch focus', protocol: '4x10-12', tag: 'COMPOUND', sets: 4, cues: ['Lean back slightly', 'Drive elbows down', 'Full stretch at top'] },
      { name: 'Meadows Row', subtitle: 'Landmine — single arm', protocol: '3x10-12/side', tag: 'UNILATERAL', sets: 3, cues: ['Staggered stance', 'Pull to hip', 'Big stretch'] },
      { name: 'Incline DB Curl', subtitle: '45° — long head stretch', protocol: '4x10-12', tag: 'ISOLATION', sets: 4, cues: ['Let arms hang', 'Curl with control', 'Full stretch at bottom'] },
      { name: 'Cable Curl', subtitle: 'Behind body — FST-7', protocol: '7x10-12', tag: 'FST-7', sets: 7, cues: ['45 sec rest', 'Constant tension', 'Peak squeeze'] },
    ]
  },
  {
    d: 12, t: 'SHOULDERS + WEAK POINTS', m: 65,
    warmup: ['5 min jump rope', 'Band pull-aparts x20', 'Light lateral raises x15', 'Rotator cuff work'],
    exercises: [
      { name: 'Standing Military Press', subtitle: 'Barbell — strict form', protocol: '4x6-8', tag: 'COMPOUND', sets: 4, cues: ['Core tight', 'Slight lean back', 'Full lockout', 'Controlled descent'] },
      { name: 'Arnold Press', subtitle: 'DB — rotation at top', protocol: '4x10-12', tag: 'COMPOUND', sets: 4, cues: ['Start palms facing you', 'Rotate as you press', 'Full ROM'] },
      { name: 'Cable Lateral Raise', subtitle: 'Behind body — constant tension', protocol: '4x12-15', tag: 'ISOLATION', sets: 4, cues: ['Cross body setup', 'Lead with elbow', 'Controlled tempo'] },
      { name: 'Front Raise', subtitle: 'Plate — anterior delt', protocol: '3x12-15', tag: 'ISOLATION', sets: 3, cues: ['Thumbs up grip', 'To eye level', 'No momentum'] },
      { name: 'Upright Row', subtitle: 'Wide grip — FST-7 finisher', protocol: '7x10-12', tag: 'FST-7', sets: 7, cues: ['45 sec rest', 'Wide grip for shoulders', 'Pull to collarbone'] },
    ]
  },
  {
    d: 13, t: 'REST + ACTIVE RECOVERY', m: 0,
    warmup: [],
    exercises: [],
    isRest: true,
    recovery: ['30 min walk outdoors', 'Full body stretching routine', 'Sauna or hot bath 15-20 min', 'Reflect on training week', 'Journal progress notes']
  },
  {
    d: 14, t: 'FULL BODY — POWER', m: 60,
    warmup: ['5 min dynamic stretching', 'Box jumps x8', 'Med ball slams x10', 'Activation circuit'],
    exercises: [
      { name: 'Power Clean', subtitle: 'From floor — explosive', protocol: '5x3', tag: 'POWER', sets: 5, cues: ['Triple extension', 'Fast elbows', 'Catch in front rack', 'Reset each rep'] },
      { name: 'Box Jump', subtitle: 'Plyo — reactive power', protocol: '4x5', tag: 'POWER', sets: 4, cues: ['Arm swing', 'Soft landing', 'Step down', 'Full extension'] },
      { name: 'Weighted Chin-Up', subtitle: 'Supinated grip — back + bis', protocol: '4x5-7', tag: 'COMPOUND', sets: 4, cues: ['Dead hang start', 'Chin over bar', 'Controlled descent'] },
      { name: 'Push Press', subtitle: 'Barbell — leg drive', protocol: '4x5-7', tag: 'POWER', sets: 4, cues: ['Dip and drive', 'Use leg power', 'Lock out overhead'] },
      { name: 'Farmer Walk', subtitle: 'Heavy DB — grip + core', protocol: '4x40m', tag: 'FUNCTIONAL', sets: 4, cues: ['Heavy as possible', 'Tall posture', 'Brace core', 'Quick steps'] },
    ]
  }
]

export const MACROS = { cal: 2500, p: 212, c: 277, f: 59 }

export const MEALS = [
  { name: 'Meal 1 — Waking', time: '7:00 AM', cal: 480, p: 42, c: 55, f: 10, items: ['6 egg whites + 1 whole egg', 'Oats 60g + banana', 'Black coffee'] },
  { name: 'Meal 2 — Pre-Workout', time: '10:30 AM', cal: 520, p: 45, c: 62, f: 8, items: ['Chicken breast 6oz', 'White rice 200g', 'Broccoli 100g'] },
  { name: 'Meal 3 — Post-Workout', time: '1:30 PM', cal: 580, p: 50, c: 70, f: 10, items: ['Whey shake 1.5 scoops', 'Cream of rice 80g', 'Banana + honey'] },
  { name: 'Meal 4 — Afternoon', time: '4:30 PM', cal: 490, p: 40, c: 52, f: 14, items: ['Ground turkey 6oz', 'Sweet potato 200g', 'Mixed greens salad'] },
  { name: 'Meal 5 — Evening', time: '7:30 PM', cal: 430, p: 35, c: 38, f: 17, items: ['Salmon 5oz', 'Jasmine rice 150g', 'Asparagus 100g'] },
]

export const SUPPLEMENTS = [
  { name: 'Creatine Monohydrate', dose: '5g', timing: 'Any time', icon: 'flask-round' },
  { name: 'Whey Protein', dose: '1.5 scoops', timing: 'Post-workout', icon: 'cup-soda' },
  { name: 'Multivitamin', dose: '1 tablet', timing: 'With meal 1', icon: 'pill' },
  { name: 'Fish Oil', dose: '2g EPA/DHA', timing: 'With meal', icon: 'droplets' },
  { name: 'Magnesium', dose: '400mg', timing: 'Before bed', icon: 'moon' },
]

export const GUIDE = [
  {
    category: 'FUNDAMENTALS',
    items: [
      { title: 'Training Structure', desc: '14-day rotating split designed to hit every muscle group with optimal frequency and volume. 5 full training cycles minimum before any program changes.' },
      { title: 'Progressive Overload', desc: 'Your primary goal each session is to do slightly more than last time — more weight, more reps, or better form. The AI tracks this automatically.' },
      { title: 'FST-7 Protocol', desc: 'Fascia Stretch Training: 7 sets of 10-12 reps with only 45 seconds rest. Used as finishers to maximize the pump and stretch the muscle fascia for growth.' },
      { title: 'Rest Periods', desc: 'Compound lifts: 90 seconds. Isolation: 60 seconds. FST-7: 45 seconds. These are optimized for the stimulus-to-fatigue ratio of each exercise type.' },
    ]
  },
  {
    category: 'NUTRITION',
    items: [
      { title: 'Macro Targets', desc: 'Your macros are calculated based on your body weight, activity level, and goals. Protein at 1g/lb, carbs timed around training, fats at minimum effective dose.' },
      { title: 'Meal Timing', desc: 'Highest carb meals are pre and post-workout to fuel performance and recovery. Evening meals are slightly lower carb with higher fats.' },
      { title: 'Hydration', desc: 'Target is 1 gallon (3.8L) per day minimum. Increase by 500ml on training days. Track using the water segments on your home screen.' },
    ]
  },
  {
    category: 'RECOVERY',
    items: [
      { title: 'Sleep', desc: '7-9 hours per night. This is non-negotiable for optimal results. The AI will reduce your training volume if sleep drops below 7 hours.' },
      { title: 'Check-Ins', desc: 'Daily check-ins help the AI fine-tune your program. Rate your sleep, stress, energy, and mood so adjustments can be made in real-time.' },
      { title: 'Deload Protocol', desc: 'Every 4th training cycle includes an automatic deload week — reduced volume by 40% to allow accumulated fatigue to dissipate.' },
    ]
  }
]
