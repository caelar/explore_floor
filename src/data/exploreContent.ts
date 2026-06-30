import type { CategoryId } from '@/data/types';

// Explore-view content for the job-overview "How you fit" tab (Phase G, DATA_MODEL §17).
//
// ⚠️ PLACEHOLDER content. The fit narratives are plausible stand-ins authored in the project voice,
// NOT vetted ARM content. Real per-role detail is requested from ARM in
// docs/reference/Job_Program_Data_Request.md; swap it in when it lands, the shape stays. (The "where
// this can lead" trajectory now reads from the three real roles in roleDetails — see TrajectoryViz.)

/** 2nd-person, encouraging "You as a {noun}" narrative for the job-overview "How you fit" tab.
 *  May include the literal token `{noun}` (the UI fills it with the job's roleNoun). PLACEHOLDER. */
export const fitNarrative: Record<CategoryId, string> = {
  technician:
    "Like working with your hands and watching a thing actually run? As a {noun}, you're on the floor every day, starting up the robots, keeping them fed, and stepping in the moment a cell needs you. You don't need a degree to begin, just the drive to learn the machines and keep them moving. It's the kind of work where you can point at what you got done by the end of the shift.",
  specialist:
    "Love the idea of bringing machines to life? As a {noun}, you'll design, program, and fine-tune the robotic systems that decide how fast and how well a whole line runs. You bring the technical chops, usually a bachelor's behind you, to turn a rough idea into a system that holds up under real production. When the floor team is stuck, you're the one who figures out why.",
  integrator:
    "Like seeing the whole board and calling the smart move? As a {noun}, you map out entire automation projects, pulling robots, conveyors, and software into one system that does exactly what a plant needs. You work a few steps ahead of everyone, modeling and planning before a single part gets installed. This is the role where your call shapes how a whole factory runs.",
};
