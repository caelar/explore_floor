import type { CategoryId, RoleDetail } from './types';

// Layer-2 role-sheet content for the narrative results screen (DATA_MODEL §17). Transcribed
// from RC.org's live three-role structure (docs/reference/ARM Updated Role Structure -
// Source Content.md): Technician (entry), Specialist (mid), Integrator (planning). The entry
// Technician folds the old Operate + Repair categories into one card, built from the
// Operate/Operator content per ARM's card. Read by the narrative results screen and the
// /select comparator.

export const roleDetails: Record<CategoryId, RoleDetail> = {
  technician: {
    categoryId: 'technician',
    roleName: 'Technician',
    tierLabel: 'Entry level',
    description:
      "In entry-level robot operating roles, you'll be responsible for the set-up, operation, and maintenance of robots and other automation equipment.",
    jobActivities: [
      'Supervise and instruct robots on existing tasks.',
      'Ensure quality outputs.',
      'Teach robots new tasks.',
      'Generate data for machine learning algorithms.',
      'Load parts.',
      'Work with the team to identify and solve issues.',
    ],
    duties: [
      {
        heading: 'Run the robots',
        text: 'Set up, start, and watch over the robots as they work, stepping in when something needs a hand.',
      },
      {
        heading: 'Keep quality high',
        text: 'Check the parts coming off the line so what gets built meets the mark.',
      },
      {
        heading: 'Teach robots new tasks',
        text: 'Program and train robots to take on new jobs as the work changes.',
      },
      {
        heading: 'Feed the data',
        text: 'Collect the data that helps the machine learning behind the robots get smarter.',
      },
      {
        heading: 'Load and prep parts',
        text: 'Keep the line moving by loading the parts and materials the robots need.',
      },
      {
        heading: 'Solve problems as a team',
        text: 'Work with your crew to catch issues early and fix them together.',
      },
    ],
    competencies: [
      'Electrical Systems',
      'Electronics & Controls',
      'Fluid Power',
      'Maintenance & Troubleshooting',
      'Mechanical Systems',
      'PLC (Programmable Logic Controllers)',
      'Robot Programming',
      'Safety (Systems and Procedures)',
    ],
    whyMomentsText:
      'You kept reaching for hands-on work, building things and keeping them running. That’s the heart of being a Technician.',
    pathUp:
      'Technician is the entry point, not the ceiling. As you build skills and earn credentials, you can grow into Specialist or Integrator. The programs under Skills, path & next steps are where that climb starts.',
    education: 'High school diploma or GED certificate required',
    educationShort: 'High school / GED',
    educationLevel: 0,
    commonJobTitles: [
      'Robot Operator',
      'Entry Level Robotics',
      'Assembly Operator',
      'Automation Technician',
      'Robotics Maintenance Technician',
    ],
    salary: 'National median $45,936/yr',
    salaryMedian: 'National median $45,936/yr',
    salaryShort: '$45,936/yr',
    payLevel: 0,
  },
  specialist: {
    categoryId: 'specialist',
    roleName: 'Specialist',
    tierLabel: 'Mid level',
    description:
      "In mid-level robotics roles, you'll design, develop, program, and implement robotic systems and technologies to enhance the efficiency, productivity, and functionality of a manufacturer.",
    jobActivities: [
      'Build, configure, or test robots or robotic applications.',
      'Design robotic systems and end-of-arm tooling.',
      'Supervise technologists, technicians, or other engineers.',
      'Design software to control robotic systems for applications.',
      'Evaluate robotic systems or prototypes.',
    ],
    duties: [
      {
        heading: 'Build and test robotic systems',
        text: 'Get hands-on with robots from the first setup all the way through testing and rollout.',
      },
      {
        heading: 'Design systems and tooling',
        text: 'Create the mechanical systems and end-of-arm tools that decide how a robot does its job.',
      },
      {
        heading: 'Lead the technical team',
        text: 'Guide technologists, technicians, and fellow engineers as you build projects together.',
      },
      {
        heading: 'Write the control software',
        text: 'Write the code that tells a robotic system exactly what to do for each application.',
      },
      {
        heading: 'Evaluate prototypes',
        text: 'Test robots and early prototypes to make sure they perform before they go live.',
      },
    ],
    competencies: [
      'Advanced Robot Programming',
      'Application Emphasis',
      'Inspection/QA',
      'Installation Concepts',
      'Project Management',
      'Robot and System Troubleshooting',
      'Safety-Risk Assessment',
      'Sensors',
      'Vision',
    ],
    whyMomentsText:
      'You kept choosing to write code and dig into hard problems. That’s the heart of being a Specialist.',
    education: "Bachelor's Degree (required) or Master's Degree (sometimes preferred)",
    educationShort: "Bachelor's",
    educationLevel: 2,
    commonJobTitles: [
      'Robotics Specialist',
      'Robotics Engineer',
      'Mechatronics Engineer',
      'Automation Engineer',
      'Robotic Systems Engineer',
    ],
    salary: '$85,000 to $147,700/yr; national median $105,000/yr',
    salaryMedian: 'National median $105,000/yr',
    salaryShort: '$105,000/yr',
    payLevel: 2,
  },
  integrator: {
    categoryId: 'integrator',
    roleName: 'Integrator',
    tierLabel: 'Planning',
    description:
      "Planning roles require experts who understand robotics at the highest level. You'll create automation plans and recommend the most efficient, effective, and profitable automation work centers for your company.",
    jobActivities: [
      'Perform feasibility studies on the automation projects, including data analysis to understand the initial process metrics and potential improvements.',
      'Test and plan using system simulation and modeling to ensure all automation systems (conveyors, sorters, industrial robots, collaborative robots, AMR, etc.) work cohesively as one unit.',
      'Determine an automation plan and oversee the implementation and testing processes to ensure improvement goals are met.',
    ],
    duties: [
      {
        heading: 'Study what is possible',
        text: 'Run feasibility studies and dig into the data to see where automation can actually help.',
      },
      {
        heading: 'Simulate the whole system',
        text: 'Use simulation and modeling to make sure every piece, from conveyors to robots, works as one.',
      },
      {
        heading: 'Plan and oversee the build',
        text: 'Set the automation plan, then guide the build and testing until it hits the goals.',
      },
    ],
    competencies: [
      'Augmented Reality/Virtual Reality',
      'Big Data',
      'Computer Programming',
      'Interoperability',
      'Offline Programming',
      'Simulation',
      'System and Process Design',
      'Systems Simulation/Modeling',
      'Visualization',
    ],
    whyMomentsText:
      'You kept choosing to plan ahead and lead the group. That’s the heart of being an Integrator.',
    education: "Bachelor's Degree (required) or Master's Degree (sometimes preferred)",
    educationShort: "Bachelor's",
    educationLevel: 2,
    commonJobTitles: [
      'Robotics Integrator',
      'Robotic Integration Design Engineer',
      'Robotics Software Integrator',
      'Robotics Application Development Engineer',
      'Advanced Industrial Integrator',
    ],
    salary: '$87,000 to $153,000/yr; national median $99,250/yr',
    salaryMedian: 'National median $99,250/yr',
    salaryShort: '$99,250/yr',
    payLevel: 2,
  },
};
