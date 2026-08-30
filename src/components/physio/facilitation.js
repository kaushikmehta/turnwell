/*
 * Facilitation reference for the physio assessment instruments — a therapist-
 * facing job aid so each scale is run the same way by whoever administers it
 * ("codify the smartest person's decision so it's executable by the least-
 * trained hands"). This guides the CLINICIAN's administration; it never presents
 * test items to Akki, so the "recorded, not administered" principle holds.
 *
 * Content is drafted from the published administration guidance for each
 * instrument and is marked as a clinical draft in the UI — the treating team
 * remains the authority and should review it before relying on it.
 *
 * Shape per instrument:
 *   aim:     one line — what the scale measures / how it's run.
 *   setup:   ordered steps to position the patient & prepare (shown collapsed).
 *   capture: { <key>: text } — how to take each reading, surfaced as an inline
 *            ⓘ hint next to the relevant field in the form.
 */
export const ASSESSMENT_FACILITATION = {
  satco: {
    aim: "Segmental Assessment of Trunk Control — find the lowest trunk segment where control fails, testing top-down while you support just below the level under test.",
    setup: [
      "Seat him on a firm, flat bench with hips, knees and ankles at 90° and feet flat and supported. No back or arm support.",
      "Set the pelvis in neutral (slight anterior tilt) and hold it there — a slumped pelvis invalidates everything above it.",
      "Position yourself behind him. Your hands give firm support around the trunk immediately BELOW the level you're testing, so everything under your hands is controlled and only the segment above is challenged.",
      "Give his eyes/hands a target at his level so the trunk does the work, not the arms. Expose the back if you can, to see the spinal curve.",
      "Test from the head down, one level at a time. Once a level clearly has no control, you've found the level — you don't need to keep going down.",
    ],
    capture: {
      grid: "For the level under test, hands just below it, only the segment above free. STATIC: holds a neutral vertical posture unsupported ~5 s. ACTIVE: keeps neutral while turning the head ~45° and/or reaching to each side. REACTIVE: holds or quickly regains neutral after a brisk, small nudge (front-back and sideways). Mark P if maintained, A if it collapses or needs your support, NT if not tested. Reactive normally lags static/active.",
    },
  },

  tardieu: {
    aim: "Modified Tardieu — separates dynamic spasticity from fixed contracture by comparing a fast stretch (catch angle, R1) with a slow full-range stretch (R2).",
    setup: [
      "Standardise the position for each muscle and keep it identical between visits (same posture, same side lying/seated). Head in midline.",
      "Test at a consistent time of day and not straight after strenuous activity or stretching — both change tone.",
      "Settle the limb and ask him to relax; a guarded or effortful limb reads as false tone.",
      "Have a goniometer ready and agree the two velocities before you start: V1 = as slow as possible, V3 = as fast as possible.",
    ],
    capture: {
      r1r2: "R2 (slow, V1): move the limb as slowly as you can through the full available range and record the end angle — this is true passive range. R1 (fast, V3): move as fast as you can and record the angle where you feel the muscle 'catch' or react. A large R2−R1 gap = dynamic spasticity (responds to tone management); a small gap with a reduced R2 = fixed contracture forming.",
      quality: "Grade the muscle reaction felt at the fast-stretch catch: 0 none · 1 slight resistance · 2 clear catch then release · 3 fatigable clonus (<10 s) · 4 infatigable clonus (>10 s) · 5 joint immovable.",
    },
  },

  goniometry: {
    aim: "Joint range in degrees per motion and side — a repeatable line to catch range loss (contracture) before it's fixed.",
    setup: [
      "Use the same standardised start position and the same active/passive method every visit — record which you used.",
      "Find and mark the bony landmarks for the axis, proximal (stationary) arm and distal (moving) arm before you measure.",
      "Stabilise the proximal segment so only the target joint moves — no trick motion from the trunk or neighbouring joints.",
    ],
    capture: {
      reading: "Centre the goniometer axis over the joint's axis of rotation; stationary arm along the proximal landmark, moving arm along the distal landmark. Take him to the end of available range and read there, to the nearest degree. Same landmarks and start position each time — a ≥5–10° loss between visits is the flag to escalate.",
    },
  },

  peak_cough_flow: {
    aim: "Peak cough flow (L/min) — how forceful his cough is, a proxy for airway clearance and chest-infection risk (trunk weakness degrades it).",
    setup: [
      "Sit him upright, as tall as he can manage.",
      "Get a tight seal — a face mask or mouthpiece against the peak-flow meter with no leak.",
      "Rest between efforts; allow a few practice coughs so the technique is real before you record.",
    ],
    capture: {
      effort: "Coach a full deep breath in, then the hardest, sharpest single cough he can into the meter. Take the best of three technically good attempts (good seal, real effort). <270 L/min = a weakening cough to watch; <160 L/min = ineffective cough, high infection risk — flag to the team.",
    },
  },

  tis: {
    aim: "Trunk Impairment Scale — static balance, dynamic balance and coordination in sitting; the graduation measure for trunk control.",
    setup: [
      "Sit him on the edge of the bed/bench, thighs fully supported, knees at 90°, feet flat and hip-width apart.",
      "Arms rest on his legs; start upright in a neutral position. He must start each item from this position (and, for dynamic items, return to it).",
      "Work through the manual's items in order — static sitting, then dynamic (lateral flexion), then coordination (rotation).",
    ],
    capture: {
      scoring: "Score each sub-item exactly per the manual's start position and movement. Static = maintains sitting, then with legs crossed. Dynamic = shortening/lateral flexion of the trunk to each side (not a side-bend from the hip). Coordination = upper- then lower-trunk rotation. Important: if he cannot hold the basic static position (item 1 = 0), the whole scale scores 0.",
    },
  },

  scim3: {
    aim: "Spinal Cord Independence Measure III — actual daily independence / care burden across self-care, respiration & sphincter, and mobility (0–100).",
    setup: [
      "Base the score on his ACTUAL recent performance over typical days — what he does, not his best-ever or what he could do.",
      "Use the same information sources each time (direct observation plus the attendants/family who see routine care).",
    ],
    capture: {
      scoring: "Rate each subdomain from recent typical performance and sum to the 0–100 total. Self-care + respiration & sphincter management + mobility (room and indoors/outdoors). Attribute the instrument to Catz/Itzkovich. Consistency of sources between visits matters more than a single good day.",
    },
  },

  gas: {
    aim: "Goal Attainment Scaling — was the individualised goal met, under- or over-shot, on a −2…+2 scale written in advance.",
    setup: [
      "Goals and their five levels are defined by the physio BEFORE the review period — not at scoring time.",
      "Each goal's 0 = the expected outcome; the ±1 and ±2 levels are the realistic worse/better outcomes, specified in measurable terms.",
    ],
    capture: {
      scoring: "At review, observe or measure and pick the level he actually reached: −2 much less than expected · −1 less than expected · 0 expected outcome · +1 more · +2 much more than expected. Rate each pre-written goal against its own scale. Don't rewrite the goal to fit what happened.",
    },
  },

  fss: {
    aim: "Fatigue Severity Scale — his own report of how much fatigue interferes, over the past week (9 items, stored as the mean).",
    setup: [
      "This is his self-report — read each statement plainly and let him rate it. Don't lead or reinterpret.",
      "Anchor him to the past week, not just today.",
    ],
    capture: {
      rating: "For each of the nine statements he rates 1 (strongly disagree) → 7 (strongly agree). Stored as the mean of the nine; a mean ≥4 indicates clinically significant fatigue. This complements the in-session fatigue rating, which is a single moment.",
    },
  },

  performance_ratings: {
    aim: "Your clinical estimate of Akki's performance vs. his baseline at this timepoint — the qualitative counterpart to the instrument scores.",
    setup: [
      "You (Akash or Charmie) complete this — it is your judgement, not Akki's self-report.",
      "For a baseline timepoint, fill it retrospectively from your notes; for later timepoints, rate against where he started.",
      "Score the best you genuinely observed at this point in time, not the daily average.",
    ],
    capture: {
      scoring: "1 = far below where he started / very poor · 10 = best. Motivation is the trap: he'll verbally give a 9 regardless — score his ACTUAL motivation to participate, from what he does, not what he says.",
      capacity: "Qualitative, not a number — write the concrete evidence of change: counts rising, coping with more complexity, assistance reduced (e.g. 100%→75%), cueing dropping from tactile+verbal to verbal only. This is what makes the numbers legible later.",
    },
  },

  paradigm_ratings: {
    aim: "Your own experience of running the program — how learnable, memorable and session-friendly it is for the clinician.",
    setup: [
      "Rate your experience of delivering the program, not Akki's performance.",
      "Take a PRE reading early (after ~a month of use) and a POST reading after a longer stretch, so the two can be compared.",
    ],
    capture: {
      scoring: "1 = very hard / not achieved · 10 = very easy / best. The 'ease' items are about you delivering it. Overall achievement = how much of the full potential you feel has been reached so far. Put anything to carry forward in 'needs attention'.",
    },
  },

  exercise_baselines: {
    aim: "A clean, dated baseline of Akki's count and effort per exercise — the reference the capacity ratings and dashboard trends are measured against.",
    setup: [
      "Take the baseline under his normal session conditions — rested, in the afternoon safe window, same setup you'll use going forward.",
      "Baseline only the exercises you're tracking; leave the rest blank. Re-run this any time you want a fresh reference point.",
    ],
    capture: {
      reading: "Record the count he actually achieves with good form, in that exercise's own unit (reps / minutes / catches…), plus how hard it felt (1–10). Measure, don't estimate — this line is what every later 'increase in capacity' is compared to.",
    },
  },
};
