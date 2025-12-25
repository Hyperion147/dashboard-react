import type { Task } from "./tasks"
import type { BoardColumn } from "./board"
import type { TimelinePhase } from "./timeline"
import type { Repository, CodeMetrics } from "./code"

import { tasks as project1Tasks } from "./1-tasks"
import { boardColumns as project1Board } from "./1-board"
import { phases as project1Phases, milestones as project1Milestones } from "./1-timeline"
import { repositories as project1Repos, codeMetrics as project1Metrics, recentCommits as project1Commits } from "./1-code"
import { teamMembers as project1Team, projectSummary as project1Summary } from "./1-summary"

import { tasks as project2Tasks } from "./2-tasks"
import { boardColumns as project2Board } from "./2-board"
import { phases as project2Phases, milestones as project2Milestones } from "./2-timeline"
import { repositories as project2Repos, codeMetrics as project2Metrics, recentCommits as project2Commits } from "./2-code"
import { teamMembers as project2Team, projectSummary as project2Summary } from "./2-summary"

import { tasks as project3Tasks } from "./3-tasks"
import { boardColumns as project3Board } from "./3-board"
import { phases as project3Phases, milestones as project3Milestones } from "./3-timeline"
import { repositories as project3Repos, codeMetrics as project3Metrics, recentCommits as project3Commits } from "./3-code"
import { teamMembers as project3Team, projectSummary as project3Summary } from "./3-summary"

import { tasks as project4Tasks } from "./4-tasks"
import { boardColumns as project4Board } from "./4-board"
import { phases as project4Phases, milestones as project4Milestones } from "./4-timeline"
import { repositories as project4Repos, codeMetrics as project4Metrics, recentCommits as project4Commits } from "./4-code"
import { teamMembers as project4Team, projectSummary as project4Summary } from "./4-summary"

export function getProjectTasks(projectId: string): Task[] {
  switch (projectId) {
    case "1":
      return project1Tasks
    case "2":
      return project2Tasks
    case "3":
      return project3Tasks
    case "4":
      return project4Tasks
    default:
      return project1Tasks
  }
}

export function getProjectBoard(projectId: string): BoardColumn[] {
  switch (projectId) {
    case "1":
      return project1Board
    case "2":
      return project2Board
    case "3":
      return project3Board
    case "4":
      return project4Board
    default:
      return project1Board
  }
}

export function getProjectPhases(projectId: string): TimelinePhase[] {
  switch (projectId) {
    case "1":
      return project1Phases
    case "2":
      return project2Phases
    case "3":
      return project3Phases
    case "4":
      return project4Phases
    default:
      return project1Phases
  }
}

export function getProjectMilestones(projectId: string) {
  switch (projectId) {
    case "1":
      return project1Milestones
    case "2":
      return project2Milestones
    case "3":
      return project3Milestones
    case "4":
      return project4Milestones
    default:
      return project1Milestones
  }
}

export function getProjectRepositories(projectId: string): Repository[] {
  switch (projectId) {
    case "1":
      return project1Repos
    case "2":
      return project2Repos
    case "3":
      return project3Repos
    case "4":
      return project4Repos
    default:
      return project1Repos
  }
}

export function getProjectCodeMetrics(projectId: string): CodeMetrics[] {
  switch (projectId) {
    case "1":
      return project1Metrics
    case "2":
      return project2Metrics
    case "3":
      return project3Metrics
    case "4":
      return project4Metrics
    default:
      return project1Metrics
  }
}

export function getProjectCommits(projectId: string) {
  switch (projectId) {
    case "1":
      return project1Commits
    case "2":
      return project2Commits
    case "3":
      return project3Commits
    case "4":
      return project4Commits
    default:
      return project1Commits
  }
}

export function getProjectTeam(projectId: string) {
  switch (projectId) {
    case "1":
      return project1Team
    case "2":
      return project2Team
    case "3":
      return project3Team
    case "4":
      return project4Team
    default:
      return project1Team
  }
}

export function getProjectSummary(projectId: string) {
  switch (projectId) {
    case "1":
      return project1Summary
    case "2":
      return project2Summary
    case "3":
      return project3Summary
    case "4":
      return project4Summary
    default:
      return project1Summary
  }
}

