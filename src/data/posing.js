// ══════════════════════════════════════════════════════════════
// NPC / IFBB POSING — Division-specific mandatory poses
// Standards based on official NPC/IFBB judging criteria
// ══════════════════════════════════════════════════════════════

const DIVISIONS = [
  {
    id: "mens_bb",
    name: "Men's Bodybuilding",
    org: "NPC / IFBB",
    desc: "Mass, symmetry, conditioning, and stage presence",
    poses: [
      { id: "fdb", name: "Front Double Bicep", cues: "Feet shoulder-width, vacuum tight, spread lats wide, peak biceps hard, keep quads flexed and separated" },
      { id: "fls", name: "Front Lat Spread", cues: "Hands on hips at iliac crest, flare lats maximally, chest high, abs vacuumed, quads tensed" },
      { id: "sc_l", name: "Side Chest (Left)", cues: "Clasp hands, press rear arm into chest, flex pec hard, bend front knee slightly to show sweep, calf raised" },
      { id: "sc_r", name: "Side Chest (Right)", cues: "Mirror of left side — press rear arm into pec, flex chest, show hamstring-quad tie-in" },
      { id: "bdb", name: "Back Double Bicep", cues: "One foot back on toe for calf, spread lats wide, peak biceps, flex glutes and hamstrings hard" },
      { id: "bls", name: "Back Lat Spread", cues: "Hands on hips, spread lats as wide as possible, flex glutes, show rear delt separation and Christmas tree" },
      { id: "st_l", name: "Side Tricep (Left)", cues: "Clasp hands behind back, lock arm to flex tricep, twist torso slightly to show abs, flex quads" },
      { id: "st_r", name: "Side Tricep (Right)", cues: "Mirror of left — lock arm for horseshoe tricep, show ab detail and quad sweep" },
      { id: "at", name: "Abs & Thigh", cues: "Hands behind head, crunch abs hard, exhale and vacuum, one leg forward with quad fully flexed" },
      { id: "mm", name: "Most Muscular", cues: "Crab most muscular or hands-on-hips variation — flex everything, show trap and delt fullness, grimace optional" },
    ],
  },
  {
    id: "classic",
    name: "Classic Physique",
    org: "NPC / IFBB",
    desc: "Golden-era aesthetics with size limits by height",
    poses: [
      { id: "fdb", name: "Front Double Bicep", cues: "Feet staggered, vacuum tight, peak biceps, emphasize V-taper and small waist" },
      { id: "sc", name: "Side Chest", cues: "Clasp hands, flex pec and bicep, bend front knee for sweep, chest high, waist tight" },
      { id: "bdb", name: "Back Double Bicep", cues: "Foot back on toe, spread lats, flex biceps, show glute-ham tie-in and rear detail" },
      { id: "at", name: "Abs & Thigh", cues: "Hands behind head, crunch and vacuum, one leg extended with quad fully flexed, show serratus" },
      { id: "fav", name: "Favorite Classic Pose", cues: "Vacuum pose, side pose, or any pose that highlights your best classic lines — sell the aesthetic" },
    ],
  },
  {
    id: "mens_phys",
    name: "Men's Physique",
    org: "NPC / IFBB",
    desc: "Athletic build, V-taper, board shorts — no mandatory poses",
    poses: [
      { id: "front", name: "Front Stance", cues: "One hand in pocket or relaxed at side, slight angle, shoulders broad, lats flared subtly, abs tight" },
      { id: "back", name: "Back Stance", cues: "Look over one shoulder, show V-taper and rear delt caps, lats subtly spread, confident posture" },
      { id: "qt_l", name: "Left Quarter Turn", cues: "Slight twist showing shoulder-to-waist ratio, chest high, relaxed confidence, no hard flexing" },
      { id: "qt_r", name: "Right Quarter Turn", cues: "Mirror of left — show taper, arm hanging natural, subtle lat engagement" },
    ],
  },
  {
    id: "bikini",
    name: "Bikini",
    org: "NPC / IFBB",
    desc: "Balanced, toned physique with stage presence and confidence",
    poses: [
      { id: "front", name: "Front Pose", cues: "One foot slightly forward, hand on hip, slight lean, shoulders back, smile confidently" },
      { id: "back", name: "Back Pose", cues: "Look over shoulder, slight S-curve, show glute-hamstring shape, hand on hip, confident expression" },
      { id: "t_walk", name: "T-Walk", cues: "Walk forward with confidence, pause at each corner, smooth transitions, show personality" },
      { id: "model", name: "Model Quarter Turns", cues: "Smooth and fluid transitions, maintain posture and smile throughout, own the stage" },
    ],
  },
  {
    id: "figure",
    name: "Figure",
    org: "NPC / IFBB",
    desc: "Muscular but feminine, athletic symmetry and conditioning",
    poses: [
      { id: "front", name: "Front Pose", cues: "Feet together, one slightly forward, hands at sides with slight fist, lats flared, shoulders wide, smile" },
      { id: "back", name: "Back Pose", cues: "Look over shoulder, show V-taper, glute-ham tie-in, calf development, hands at sides" },
      { id: "qt_l", name: "Left Side Pose", cues: "Show shoulder cap, sweep of quads, tight waist, arms at sides with slight flex" },
      { id: "qt_r", name: "Right Side Pose", cues: "Mirror of left — show muscle maturity and symmetry from all angles" },
    ],
  },
  {
    id: "wellness",
    name: "Wellness",
    org: "NPC / IFBB",
    desc: "Athletic with emphasis on glutes, hips, and thighs",
    poses: [
      { id: "front", name: "Front Pose", cues: "Feet hip-width, one slightly forward, show quad sweep and overall balance, hands relaxed, smile" },
      { id: "back", name: "Back Pose", cues: "Show glute fullness and hamstring development, slight arch, look over shoulder, confident posture" },
      { id: "qt_l", name: "Left Side Pose", cues: "Emphasize glute-ham tie-in and thigh development, waist tight, shoulders back" },
      { id: "qt_r", name: "Right Side Pose", cues: "Mirror of left — show the signature wellness lower body from all angles" },
    ],
  },
  {
    id: "womens_phys",
    name: "Women's Physique",
    org: "NPC / IFBB",
    desc: "Muscular and defined with femininity and symmetry",
    poses: [
      { id: "fdb", name: "Front Double Bicep", cues: "Feet staggered, vacuum tight, peak biceps, show V-taper and quad separation" },
      { id: "sc", name: "Side Chest", cues: "Clasp hands, flex pec and bicep, chest high, one knee bent to show sweep" },
      { id: "bdb", name: "Back Double Bicep", cues: "Foot back on toe, lats spread, flex biceps, show glute-ham tie-in and rear detail" },
      { id: "st", name: "Side Tricep", cues: "Clasp behind back, lock arm for tricep, twist for abs, flex quads" },
      { id: "at", name: "Abs & Thigh", cues: "Hands behind head, crunch hard, one leg forward with quad flexed, show serratus and obliques" },
    ],
  },
  {
    id: "womens_bb",
    name: "Women's Bodybuilding",
    org: "NPC / IFBB",
    desc: "Maximum muscularity, symmetry, and conditioning",
    poses: [
      { id: "fdb", name: "Front Double Bicep", cues: "Spread lats, peak biceps, vacuum, show full quad separation and sweep" },
      { id: "fls", name: "Front Lat Spread", cues: "Hands on hips, flare lats maximally, chest high, abs tight, quads flexed" },
      { id: "sc_l", name: "Side Chest (Left)", cues: "Clasp hands, press arm into pec, flex chest hard, bend knee for quad sweep" },
      { id: "sc_r", name: "Side Chest (Right)", cues: "Mirror of left side — show chest thickness and leg development" },
      { id: "bdb", name: "Back Double Bicep", cues: "Foot back on toe, lats wide, biceps peaked, flex glutes and hamstrings" },
      { id: "bls", name: "Back Lat Spread", cues: "Hands on hips, lats flared, show Christmas tree and rear delt separation" },
      { id: "st_l", name: "Side Tricep (Left)", cues: "Clasp behind back, lock tricep, show abs and quad detail" },
      { id: "st_r", name: "Side Tricep (Right)", cues: "Mirror of left — horseshoe tricep, tight waist, quad sweep" },
      { id: "at", name: "Abs & Thigh", cues: "Hands behind head, crunch, one leg forward fully flexed, show serratus" },
      { id: "mm", name: "Most Muscular", cues: "Crab or hands-on-hips — flex everything, show full muscularity and conditioning" },
    ],
  },
];

export default DIVISIONS;
