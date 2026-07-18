import type { CategoryId, Job, JobSeniority } from './types';

// Featured jobs per role for the Phase F results constellation + job-overview (DATA_MODEL §17).
// The constellation places these at the four corners around the role center (reference layout);
// tapping one opens its summary, then its full overview. **Exactly 4 featured jobs per role** (so the
// corners stay balanced and every label clears the center): Specialist + Integrator feature 4 of ARM's 5 common titles;
// Technician's 4th ("Robotics Maintenance Technician") is added from ARM's title list. The dropped /
// added titles are recorded in docs/reference/Job_Program_Data_Request.md for ARM to confirm.
//
// ⚠️ PLACEHOLDER per-job copy. The titles are real (ARM's common job titles), but each job's
// `summary`, `responsibilities`, `skills`, and `roleNoun` are plausible stand-ins authored in the
// project voice, NOT vetted ARM content. Salary + education stay role-level (no per-job override),
// matching the mockup. Real per-job detail is requested from ARM in
// docs/reference/Job_Program_Data_Request.md; swap it in when it lands — the shape stays the same.
//
// `trajectory` ladders (prior / next job ids) are authored progression paths for the job-overview
// "Where this can lead" viz — real job titles, may cross technician / specialist / integrator tiers.
// `seniority` is the job's level pill (entry / mid / senior) within its ARM role tier.

const SENIORITY = {
  entry: 'entry',
  mid: 'mid',
  senior: 'senior',
} as const satisfies Record<string, JobSeniority>;

export const jobs: Record<CategoryId, Job[]> = {
  technician: [
    {
      id: 'technician-robot-operator',
      categoryId: 'technician',
      title: 'Robot Operator',
      seniority: SENIORITY.mid,
      summary:
        "You're the person who keeps the robots running on the floor all shift. You power up the cells, load the parts they need, and watch the screens for trouble. When something stalls, you're the first one in to clear it, and a smooth run is on you.",
      responsibilities: [
        "Power up robotic work cells at the start of a shift and confirm they're running right.",
        'Load parts, fixtures, and materials so the robots never sit waiting.',
        'Watch the cell through the run and clear small jams and faults as they pop up.',
        'Run quick quality checks on finished parts and pull anything that looks off.',
        'Log faults, downtime, and part counts so the team can spot patterns.',
        'Hand bigger issues to maintenance with a clear note on what happened.',
      ],
      skills: [
        'Machine operation',
        'Cell startup',
        'Part loading',
        'Quality checks',
        'Fault logging',
        'Shop safety',
      ],
      roleNoun: 'robot operator',
      trajectory: {
        prior: { jobId: 'technician-entry-level-robotics' },
        next: { jobId: 'technician-robotics-maintenance-technician' },
      },
    },
    {
      id: 'technician-entry-level-robotics',
      categoryId: 'technician',
      title: 'Entry Level Robotics',
      seniority: SENIORITY.entry,
      summary:
        "This is your way into robotics work, with no experience needed on day one. You shadow a lead operator, learn how each cell runs, and pick up the safety habits that keep everyone in one piece. Every shift you get a little more hands-on.",
      responsibilities: [
        'Learn each robotic cell on the line and how it connects to the next one.',
        'Help set up and tend the robots while a lead operator shows you the ropes.',
        'Follow the safety rules and lockout steps every single time.',
        'Read work instructions and match your setup to what the job calls for.',
        'Keep the work area clean, stocked, and ready for the next run.',
        'Ask questions and write down what you learn so it sticks.',
      ],
      skills: [
        'Shop safety',
        'Reading work orders',
        'Hand tools',
        'Following setups',
        'Teamwork',
        'Quick learning',
      ],
      roleNoun: 'robotics operator',
      trajectory: { next: { jobId: 'technician-robot-operator' } },
    },
    {
      id: 'technician-assembly-operator',
      categoryId: 'technician',
      title: 'Assembly Operator',
      seniority: SENIORITY.entry,
      summary:
        "You work right next to the robots, putting parts together and checking that each one fits and looks right. The robot handles the heavy, repeating moves, and you make the calls a machine can't. Nothing leaves your station unless it's built the way it should be.",
      responsibilities: [
        'Assemble parts as they come off the robotic cell, following the build sheet.',
        'Check fit, finish, and torque so each piece meets spec.',
        'Spot defects early and pull any part that misses the mark.',
        'Restock components and fixtures so the station keeps moving.',
        'Count output and record it at the end of each run.',
        'Flag repeat defects to the lead so the root cause gets fixed.',
      ],
      skills: [
        'Hand assembly',
        'Visual inspection',
        'Attention to detail',
        'Reading build sheets',
        'Recordkeeping',
        'Steady pace',
      ],
      roleNoun: 'assembly operator',
      trajectory: { next: { jobId: 'technician-robot-operator' } },
    },
    {
      id: 'technician-robotics-maintenance-technician',
      categoryId: 'technician',
      title: 'Robotics Maintenance Technician',
      seniority: SENIORITY.senior,
      summary:
        "You're the one who keeps the robots healthy so the line never stops for long. You run the routine checkups, swap worn parts before they fail, and chase down the cause when a cell goes down. When the floor needs a fix fast, they call you.",
      responsibilities: [
        'Run scheduled maintenance on robotic cells so small problems never become big ones.',
        'Diagnose breakdowns and get the cell back up as fast as it is safe to.',
        'Replace worn grippers, cables, and sensors before they fail mid-run.',
        'Read fault codes and trace a problem to the part that actually caused it.',
        'Keep spare parts stocked and the maintenance logs up to date.',
        'Work with operators to catch the early signs of a cell going bad.',
      ],
      skills: [
        'Preventive maintenance',
        'Troubleshooting',
        'Electrical and mechanical repair',
        'Reading fault codes',
        'Parts replacement',
        'Shop safety',
      ],
      roleNoun: 'robotics maintenance technician',
      trajectory: {
        prior: { jobId: 'technician-robot-operator' },
        next: { jobId: 'specialist-robotics-specialist' },
      },
    },
  ],
  specialist: [
    {
      id: 'specialist-robotics-specialist',
      categoryId: 'specialist',
      title: 'Robotics Programmer',
      seniority: SENIORITY.entry,
      summary:
        "You're the one who makes a robotic cell actually work the way it should. You set it up, program the moves, and fine-tune it until it hits cycle time without dropping quality. When the floor team hits a problem they can't crack, they come to you.",
      responsibilities: [
        'Set up and program robotic cells for each new job on the line.',
        'Tune motion paths and timing to hit cycle-time and quality targets.',
        'Run trials, read the data, and adjust until the cell holds steady.',
        "Troubleshoot faults the floor operators can't clear on their own.",
        'Train operators on how to run and watch the system safely.',
        'Document the setup so the next run starts from a known-good baseline.',
      ],
      skills: [
        'Robot programming',
        'Cell setup',
        'Cycle-time tuning',
        'Troubleshooting',
        'QA and inspection',
        'Operator training',
      ],
      roleNoun: 'robotics programmer',
      trajectory: {
        prior: { jobId: 'technician-robot-operator' },
        next: { jobId: 'specialist-robotics-engineer' },
      },
    },
    {
      id: 'specialist-robotics-engineer',
      categoryId: 'specialist',
      title: 'Robotics Engineer',
      seniority: SENIORITY.senior,
      summary:
        "You design robotic systems from a blank page, deciding how a robot reaches, grips, and gets the job done. You sketch the mechanics, pick the parts, and write the control code that brings it to life. Then you build a prototype and prove it works before it ever hits the floor.",
      responsibilities: [
        'Design robotic systems and the end-of-arm tooling that does the real work.',
        'Choose the motors, grippers, and sensors that fit the job and the budget.',
        'Write the control software that drives each application.',
        'Build and test prototypes, then fix what the testing turns up.',
        'Run the numbers on reach, payload, and cycle time to confirm the design holds.',
        'Hand off drawings and code the build team can actually follow.',
      ],
      skills: [
        'Mechanical design',
        'CAD modeling',
        'Control coding',
        'Prototyping',
        'End-of-arm tooling',
        'Design testing',
      ],
      roleNoun: 'robotics engineer',
      trajectory: {
        prior: { jobId: 'specialist-robotics-specialist' },
        next: { jobId: 'integrator-robotic-integration-design-engineer' },
      },
    },
    {
      id: 'specialist-mechatronics-engineer',
      categoryId: 'specialist',
      title: 'Mechatronics Engineer',
      seniority: SENIORITY.mid,
      summary:
        "You live where the machine, the wiring, and the code all meet. Your job is to blend the mechanical parts, the electronics, and the software so a robotic system runs like one machine instead of three. When something breaks across that line, you're the one who can trace it.",
      responsibilities: [
        'Pull the mechanical, electrical, and software pieces into one working system.',
        'Spec the sensors, motors, and controls a build needs.',
        'Wire and test control circuits, then confirm they talk to the software.',
        'Debug problems that cross hardware and code, not just one side.',
        'Tune sensor feedback so the system reacts the way it should.',
        'Document the wiring and logic so others can service it later.',
      ],
      skills: [
        'Electronics and controls',
        'Sensor integration',
        'Mechanical systems',
        'Embedded coding',
        'System wiring',
        'Cross-system debugging',
      ],
      roleNoun: 'mechatronics engineer',
      trajectory: {
        prior: { jobId: 'technician-robotics-maintenance-technician' },
        next: { jobId: 'specialist-robotics-engineer' },
      },
    },
    {
      id: 'specialist-automation-engineer',
      categoryId: 'specialist',
      title: 'Automation Engineer',
      seniority: SENIORITY.mid,
      summary:
        "You take steps people used to do by hand and turn them into systems that run on their own. You plan the process, program the controllers, and wire up the equipment so the line keeps moving without someone babysitting it. Then you measure the results and push the throughput higher.",
      responsibilities: [
        'Map out an automated process for a production line, step by step.',
        'Program PLCs and set the logic that coordinates the equipment.',
        'Wire and configure the sensors, drives, and safety devices.',
        'Run the line, measure throughput, and chase down bottlenecks.',
        "Build in safety stops and error handling so faults don't cascade.",
        'Track results against the goal and tune the process to do better.',
      ],
      skills: [
        'PLC programming',
        'Process design',
        'Throughput analysis',
        'Project planning',
        'Safety logic',
        'Data analysis',
      ],
      roleNoun: 'automation engineer',
      trajectory: {
        prior: { jobId: 'specialist-robotics-specialist' },
        next: { jobId: 'integrator-robotics-integrator' },
      },
    },
  ],
  integrator: [
    {
      id: 'integrator-robotics-integrator',
      categoryId: 'integrator',
      title: 'Robotics Integrator',
      seniority: SENIORITY.senior,
      summary:
        "You bring a whole automation project together from a pile of separate parts. Robots, conveyors, controls, and software all have to act as one system, and you're the person who plans that and makes it real. You own it from the first layout to the day it hits the numbers the plant needs.",
      responsibilities: [
        'Plan how a full automation cell will come together before the build starts.',
        'Coordinate the robots, conveyors, and controls so they run as one unit.',
        'Sequence the install so each piece goes in the right order.',
        'Oversee testing and tuning until the cell hits its targets.',
        'Work with vendors and the floor team to clear roadblocks fast.',
        'Sign off on the system once it proves out and hand over the docs.',
      ],
      skills: [
        'Systems integration',
        'Project planning',
        'Process design',
        'Simulation',
        'Install oversight',
        'Vendor coordination',
      ],
      roleNoun: 'robotics integrator',
      trajectory: { prior: { jobId: 'integrator-robotic-integration-design-engineer' } },
    },
    {
      id: 'integrator-robotic-integration-design-engineer',
      categoryId: 'integrator',
      title: 'Robotic Integration Design Engineer',
      seniority: SENIORITY.mid,
      summary:
        "You draw the plan for an automated work center before anyone picks up a tool. You lay out where every robot and conveyor sits, check the reach and the timing, and model it in simulation so the pieces line up the first time. Get this right and the build goes smooth; miss it and the floor pays for it.",
      responsibilities: [
        'Lay out the work cell with reach, coverage, and cycle time in mind.',
        'Model the full design in simulation before the build begins.',
        'Check that the robots can reach every point without crashing into each other.',
        'Program the robots offline so the floor build starts ahead.',
        'Adjust the layout when the simulation turns up a clash or a slow spot.',
        'Hand the build team a clear, buildable plan with the details locked in.',
      ],
      skills: [
        'System and process design',
        'Simulation',
        'CAD and layout',
        'Offline programming',
        'Reach studies',
        'Cycle-time analysis',
      ],
      roleNoun: 'robotic integration design engineer',
      trajectory: {
        prior: { jobId: 'specialist-robotics-engineer' },
        next: { jobId: 'integrator-robotics-integrator' },
      },
    },
    {
      id: 'integrator-robotics-software-integrator',
      categoryId: 'integrator',
      title: 'Robotics Software Integrator',
      seniority: SENIORITY.mid,
      summary:
        "You write and connect the software that lets every machine in an automated system work as a team. Each robot and controller speaks its own language, and your job is to get them sharing data and staying in sync. When the whole line has to move as one, the code making that happen is yours.",
      responsibilities: [
        'Connect the control software across the robots, machines, and controllers.',
        'Build the links that let separate systems share data in real time.',
        'Make sure every machine stays in sync through a full cycle.',
        'Test and debug the integrated software end to end.',
        'Set up logging so problems are easy to trace later.',
        'Update the integration as machines get added or swapped out.',
      ],
      skills: [
        'Computer programming',
        'System interoperability',
        'Data integration',
        'Real-time sync',
        'Debugging',
        'Logging and tracing',
      ],
      roleNoun: 'robotics software integrator',
      trajectory: {
        prior: { jobId: 'integrator-robotics-application-development-engineer' },
        next: { jobId: 'integrator-robotics-integrator' },
      },
    },
    {
      id: 'integrator-robotics-application-development-engineer',
      categoryId: 'integrator',
      title: 'Robotics Application Development Engineer',
      seniority: SENIORITY.entry,
      summary:
        "You build the software that tells an automated system exactly what to do for one specific job. You take a plan and a customer's process and turn them into a working application the robots can run. Every plant is a little different, so a lot of the work is making the software fit theirs.",
      responsibilities: [
        'Develop applications that run new automation jobs from end to end.',
        "Tailor the software to each customer's process and parts.",
        'Work from the integration plan to keep the app in line with the system.',
        "Test the application against the plan and fix what doesn't match.",
        "Walk the customer's team through how the application runs.",
        'Refine the app after launch as real-world use turns up edge cases.',
      ],
      skills: [
        'Application development',
        'Programming',
        'Process knowledge',
        'Software testing',
        'Customer fit',
        'Post-launch support',
      ],
      roleNoun: 'robotics application developer',
      trajectory: {
        prior: { jobId: 'specialist-robotics-specialist' },
        next: { jobId: 'integrator-robotics-software-integrator' },
      },
    },
  ],
};
