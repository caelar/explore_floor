import type { CategoryFlow } from '../types';

// The Narrative flow (DATA_MODEL §17): six intro questions, then a day-in-the-life story in
// seven scenes. Scores ARM's three robotics roles — Technician (entry), Specialist (mid),
// Integrator (planning). This file + its tests are the canonical content (the upstream
// "Narrative Quiz Structure Content Spec" was retired; live model in DATA_MODEL.md §17), grounded
// in the role salaries + education in docs/reference/ARM Updated Role Structure - Source Content.md.
//
// Q0 (experience) is an unscored background question (routing parked for later).
// Education (Q1 "college?" + Q2 "how long?") and salary (Q3) nudge the score on the role
// tier ladder — one point each (D-023): no college / $45k → technician; 4+ years / $85k+ →
// specialist + integrator. "1-2 years" is deliberately UNSCORED — it sits between the entry
// Technician (HS/GED) and the degreed roles (Bachelor's), matching no role, which also keeps
// the three role ceilings equal at 11. Q2 "Whatever" stays unscored too. These tags are a
// parallel signal to the screener fit line (flows/screeners.ts), kept consistent with its
// levels but not merged. Q4 and Q5 each map one choice per role.

export const narrativeFlow: CategoryFlow = {
  id: 'narrative',
  kind: 'narrative',
  name: 'Narrative',
  landingCopy: {
    overline: 'RoboticsCareer.org',
    heading: 'Explore the Floor',
    description:
      "Walk through a day in your life, make some choices, and we'll match you to real robotics careers.",
    cta: 'Start the story',
  },
  steps: [
    {
      type: 'mc',
      id: 'n-q0',
      prompt: "Let's start with some basic questions...",
      question: 'Do you have any experience in this field?',
      choices: [
        { id: 'n-q0-yes', label: 'Yes', categories: [] },
        { id: 'n-q0-no', label: 'No', categories: [] },
      ],
    },
    {
      type: 'mc',
      id: 'n-q1',
      question: 'Are you planning on going to college?',
      choices: [
        { id: 'n-q1-yes', label: 'Yes', categories: [] }, // education defers to Q2
        { id: 'n-q1-no', label: 'No', categories: ['technician'], branchTo: 'n-q3' }, // level 0
      ],
    },
    {
      type: 'mc',
      id: 'n-q2',
      // Self-contained on purpose: "How long?" alone leaned on the previous question for meaning,
      // and the lead-in line is exactly what testers skip. The full question stands on its own.
      question: 'How long would you want to attend college?',
      choices: [
        // "1-2 years" matches no role (above HS, below Bachelor's) — unscored on purpose.
        { id: 'n-q2-short', label: 'Little as possible (1-2 years)', categories: [] },
        { id: 'n-q2-typical', label: 'Typical (4 years)', categories: ['specialist', 'integrator'] }, // level 2
        {
          id: 'n-q2-long',
          label: 'Long as possible (4+ years)',
          categories: ['specialist', 'integrator'],
        }, // level 2
        { id: 'n-q2-whatever', label: 'Whatever', categories: [] }, // noncommittal — unscored (D-023)
      ],
    },
    {
      type: 'mc',
      id: 'n-q3',
      // A factual qualifier, not a scenario — shown BELOW the question as a quiet reference line so
      // it reads as supporting detail and doesn't compete with the real scene scenarios up top.
      prompt: 'For reference, robotics roles run from about $46,000 to over $150,000.',
      promptPlacement: 'below',
      question: 'What is the lowest salary you would feel satisfied with?',
      choices: [
        { id: 'n-q3-45', label: '$45,000', categories: ['technician'] }, // Technician median $45,936
        { id: 'n-q3-85', label: '$85,000', categories: ['specialist', 'integrator'] }, // degreed floor
        {
          id: 'n-q3-105',
          label: '$105,000+',
          categories: ['specialist', 'integrator'],
        }, // degreed medians
      ],
    },
    {
      type: 'mc',
      id: 'n-q4',
      question: 'What would you be happy spending your day doing?',
      choices: [
        {
          id: 'n-q4-hands',
          label: 'Doing hands-on work to keep things running',
          chipLabel: 'Hands-on work',
          categories: ['technician'],
        },
        { id: 'n-q4-typing', label: 'Typing on a computer', categories: ['specialist'] },
        { id: 'n-q4-leading', label: 'Leading others', categories: ['integrator'] },
      ],
    },
    {
      type: 'mc',
      id: 'n-q5',
      prompt: 'Okay, one last thing.',
      question: 'What do you think will bring you the most happiness?',
      choices: [
        { id: 'n-q5-inspiring', label: 'Inspiring others', categories: ['integrator'] },
        {
          id: 'n-q5-building',
          label: 'Seeing something I built actually work',
          chipLabel: 'Seeing my build work',
          categories: ['technician'],
        },
        { id: 'n-q5-solving', label: 'Solving difficult problems', categories: ['specialist'] },
      ],
    },
    {
      type: 'scene',
      id: 'n-s1',
      prompt:
        "Your alarm goes off in the morning. You're getting ready for your first day of school.",
      question: 'How do you start the day?',
      choices: [
        {
          id: 'n-s1-integrator',
          label: 'Get dressed in the outfit I planned the night before',
          chipLabel: 'Wear my planned outfit',
          category: 'integrator',
        },
        {
          id: 'n-s1-technician',
          label: 'Make breakfast and help a younger sibling get ready',
          chipLabel: 'Help a sibling get ready',
          category: 'technician',
        },
        {
          id: 'n-s1-specialist',
          label: 'Write down a step-by-step to-do list',
          chipLabel: 'Write a to-do list',
          category: 'specialist',
        },
      ],
    },
    {
      type: 'scene',
      id: 'n-s2',
      prompt: 'You arrive at school, but have some time to kill.',
      question: 'What do you want to check out in that time?',
      choices: [
        {
          id: 'n-s2-technician',
          label: 'Take a look at the shop class',
          chipLabel: 'Check out shop class',
          category: 'technician',
        },
        { id: 'n-s2-specialist', label: 'Explore the computer lab', category: 'specialist' },
        {
          id: 'n-s2-integrator',
          label: 'Meet with my friends to make some afterschool plans',
          chipLabel: 'Make afterschool plans',
          category: 'integrator',
        },
      ],
    },
    {
      type: 'scene',
      id: 'n-s3',
      prompt:
        'The bell rings so you head to class. Your teacher hands you a handout of all the assignments for that year.',
      question: 'What are you most excited for?',
      choices: [
        {
          id: 'n-s3-integrator',
          label: 'Taking the lead on a group project',
          chipLabel: 'Lead a group project',
          category: 'integrator',
        },
        { id: 'n-s3-technician', label: 'Building a 3D model', category: 'technician' },
        {
          id: 'n-s3-specialist',
          label: 'Solving some difficult math problems',
          chipLabel: 'Solve math problems',
          category: 'specialist',
        },
      ],
    },
    {
      type: 'scene',
      id: 'n-s4',
      prompt: "It's lunch time! You usually spend this time with the club you are a part of.",
      question: 'Where will you be?',
      choices: [
        { id: 'n-s4-technician', label: 'Shop club', category: 'technician' },
        { id: 'n-s4-specialist', label: 'Computer science club', category: 'specialist' },
        { id: 'n-s4-integrator', label: 'Debate club', category: 'integrator' },
      ],
    },
    {
      type: 'scene',
      id: 'n-s5',
      prompt: "You're back home after a long day of school.",
      question: 'What are you doing around the house?',
      choices: [
        { id: 'n-s5-specialist', label: 'Coding a game', category: 'specialist' },
        { id: 'n-s5-technician', label: 'Fix your bike', category: 'technician' },
        {
          id: 'n-s5-integrator',
          label: 'Planning the rest of my week',
          chipLabel: 'Plan my week',
          category: 'integrator',
        },
      ],
    },
    {
      type: 'scene',
      id: 'n-s6',
      prompt: 'You have to do some homework.',
      question: 'Which assignment would you want to complete the most?',
      choices: [
        {
          id: 'n-s6-integrator',
          label: 'Working on my presentation',
          chipLabel: 'Build a presentation',
          category: 'integrator',
        },
        {
          id: 'n-s6-technician',
          label: 'Make 10 posters for a club event',
          chipLabel: 'Make club posters',
          category: 'technician',
        },
        { id: 'n-s6-specialist', label: 'Writing code', category: 'specialist' },
      ],
    },
    {
      type: 'scene',
      id: 'n-s7',
      prompt: 'You finally have some time to relax. You decide to play a video game.',
      question: 'What are you playing?',
      choices: [
        { id: 'n-s7-specialist', label: 'Puzzle-solving game', category: 'specialist' },
        { id: 'n-s7-integrator', label: 'Strategy game', category: 'integrator' },
        { id: 'n-s7-technician', label: 'Building game', category: 'technician' },
      ],
    },
  ],
  // technician: Q1(no-college) + Q3 + Q4 + Q5 + 7 scenes = 11. specialist/integrator:
  // Q2(4yr) + Q3 + Q4 + Q5 + 7 scenes = 11. "1-2 years" unscored keeps the three equal.
  // computeCategoryMax sums each step's per-role presence, so the Q1/Q2 branch split doesn't
  // change the ceiling.
  expectedCategoryMax: { technician: 11, specialist: 11, integrator: 11 },
  resultsCopy: {
    heading: 'Here’s how your day matches up',
    mapHint: 'Tap another role to bring it front and center, then tap a job title to learn more.',
    centerLabel: 'Your top match',
    retake: 'Retake quiz',
    cards: {
      matchLabels: ['Your top match', 'Your second closest match', 'Your third closest match'],
      stepLabel: '{index} of {total}',
      compareCta: 'Compare roles',
      mapCta: 'Skip to your career map',
      exploreCta: 'Explore your career map',
      whyHeading: 'Why {role}?',
      collapsedLine:
        'Across the {total} moments of the quiz, {pointed} of your answers pointed toward {role}{moreThanAny}. That’s where your {pct}% comes from.',
      moreThanAny: ', more than any other role',
      seeBreakdown: 'See full breakdown',
      hideBreakdown: 'Hide breakdown',
      chosenLabel: 'What you chose',
      moreAnswers: '+{n} more answers',
      connectLabel: 'How they connected',
      openerNoun: 'opener',
      openersLabel: 'School & pay',
      momentNoun: 'moment',
      meaningLabel: 'What this all means',
      meaningText:
        'Across the {total} moments the quiz could read you, {pointed} pointed toward {role}{moreThanAny}. That’s your {pct}%. But your match is a tally, not a verdict. It’s there to help you see yourself in these roles, so keep exploring and decide what fits. Whatever you choose, RoboticsCareer.org will help you get there.',
      passedLabel: 'What you passed on',
      passedCountLabel: '{passed} of {total}',
      passedText:
        'On {passed} of the {total} moments, {role} was an option and you went another way{passedExamples}. That’s why it landed at {pct}% and not higher.',
      passedExample: ', like passing on {a} and {b}',
      roleTab: 'The role',
      skillsTab: 'Skills, path & next steps',
      descriptionHeading: 'Role description',
      dutiesHeading: 'What you’ll do',
      competenciesHeading: 'Competencies you’ll build',
      bridgeHeading: 'How to bridge the gap',
      bridgeSubtitle:
        'Training programs that get you the competencies and credentials for this path.',
      salaryLabel: 'Salary',
      educationLabel: 'Education',
      backToRole: 'Back to {role}',
      compareWithLabel: 'Compare with',
      recommendationLabel: 'Our take',
      recommendation: {
        clearWinner:
          'Your answers point more to {high}. {low} is still worth a look if it pulls at you.',
        closeLowerBarrier:
          '{lowBarrier} and {growToward} are close. {lowBarrier} is the easier place to start, since it needs less school to get going, and you can grow toward {growToward} from there.',
        closeEqualBarrier:
          'These two are close. {high} edges ahead, but either one is a solid place to start.',
      },
      backToResults: 'Back to your results',
      map: {
        title: 'Your career map',
        intro: 'Your three role paths, scored by how often your answers leaned toward each.',
        dots: 'The small dots are real jobs on each path. Zoom in to see their names.',
        hint: 'Tap a path to open it, then tap a job to see what it takes and where it leads.',
        showDirections: 'Show the map directions',
        hideDirections: 'Hide the map directions',
      },
      explore: {
        allPathsBack: 'All paths',
        overviewBack: 'Close job overview',
        jobsInPathHeading: 'Jobs in this path',
        jobsInPathCount: '{n} jobs',
        roleOverviewCta: 'Role overview',
        jobEyebrow: 'Job in {role}',
        responsibilitiesHeading: 'What you’ll do',
        jobOverviewCta: 'Job overview',
        setTargetCta: 'Set as target role',
        currentTargetCta: 'Current target role',
        overviewTabs: ['Job overview', 'Skills & competencies', 'How you fit'],
        jobSkillsHeading: 'Skills for this job',
        closeGapHeading: 'How to close the gap',
        closeGapSubtitle:
          'Training programs that build the skills and credentials this path asks for.',
        youAsHeading: 'You as a {noun}',
        trajectoryHeading: 'Where this can lead',
        trajectoryCrossRole: '{role} path',
      },
    },
    sheet: {
      activities: 'Job activities',
      education: 'Education',
      titles: 'Common job titles',
      salary: 'Salary',
      fit: 'How you fit',
      addToProfile: 'Add this Role to your profile',
    },
  },
};
