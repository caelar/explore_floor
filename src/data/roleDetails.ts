import type { CategoryId, RoleDetail } from './types';

// Layer-2 role-sheet content for the category results screen (DATA_MODEL §17).
// Transcribed verbatim from the RC.org role cards on the team's board (see
// docs/reference/Narrative Quiz Structure Content Spec.md). Read by the narrative
// results screen and the /select comparator.

export const roleDetails: Record<CategoryId, RoleDetail> = {
  operate: {
    categoryId: 'operate',
    roleName: 'Operator',
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
    education: 'High school diploma or GED certificate required',
    educationLevel: 0,
    commonJobTitles: ['Robot Operator', 'Entry Level Robotics', 'Assembly Operator'],
    salary: 'National median $40,300/yr',
    payLevel: 0,
  },
  repair: {
    categoryId: 'repair',
    roleName: 'Technician',
    description:
      "In entry-level repair roles, you'll focus on the day-to-day maintenance of robots on the manufacturing floor and collaborate with those operating the robots.",
    jobActivities: [
      'Install, service, maintain, troubleshoot, and repair robots and automated production systems.',
      'Maximize the efficiency of robotic systems and minimize downtime.',
      'Understand computers, electrical and electronic systems, sensor and feedback principles, and how robots work as machines.',
    ],
    education: "Associate's degree or a post-secondary certificate required",
    educationLevel: 1,
    commonJobTitles: [
      'Automation Technician',
      'Robotics Maintenance Technician',
      'Mechatronics & Robotics Technician',
      'Robotics Process Controls Technician',
    ],
    salary: '$54,000 to $78,000/yr; national median $66,000/yr',
    payLevel: 1,
  },
  program: {
    categoryId: 'program',
    roleName: 'Specialist',
    description:
      "In mid-level robotics roles, you'll design, develop, program, and implement robotic systems and technologies to enhance the efficiency, productivity, and functionality of a manufacturer.",
    jobActivities: [
      'Build, configure, or test robots or robotic applications.',
      'Design robotic systems and end-of-arm tooling.',
      'Supervise technologists, technicians, or other engineers.',
      'Design software to control robotic systems for applications.',
      'Evaluate robotic systems or prototypes.',
    ],
    education: "Bachelor's Degree (preferred), Associate's Degree (required)",
    educationLevel: 2,
    commonJobTitles: [
      'Robotics Specialist',
      'Robotics Engineer',
      'Mechatronics Engineer',
      'Automation Engineer',
      'Robotic Systems Engineer',
    ],
    salary: '$86,000 to $124,000/yr; national median $105,000/yr',
    payLevel: 2,
  },
  plan: {
    categoryId: 'plan',
    roleName: 'Integrator',
    description:
      "Planning roles require experts who understand robotics at the highest level. You'll create automation plans and recommend the most efficient, effective, and profitable automation work centers for your company.",
    jobActivities: [
      'Perform feasibility studies on the automation projects, including data analysis to understand the initial process metrics and potential improvements.',
      'Test and plan using system simulation and modeling to ensure all automation systems (conveyors, sorters, industrial robots, collaborative robots, AMR, etc.) work cohesively as one unit.',
      'Determine an automation plan and oversee the implementation and testing processes to ensure improvement goals are met.',
    ],
    education: "Bachelor's Degree (required) or Master's Degree (sometimes preferred)",
    educationLevel: 2,
    commonJobTitles: [
      'Robotics Integrator',
      'Robotic Integration Design Engineer',
      'Robotics Software Integrator',
      'Robotics Application Development Engineer',
      'Advanced Industrial Integrator',
    ],
    salary: '$87,000 to $153,000/yr; national median $127,000/yr',
    payLevel: 2,
  },
};
