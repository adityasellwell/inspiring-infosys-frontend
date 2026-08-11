# Inspiring Infosys Frontend Modernization Guide

## Project Overview

This project is a frontend modernization of the existing Inspiring Infosys website.

Current Website:
https://inspiringinfosys.com/

Technology Stack:
- React
- JavaScript
- React Router
- Framer Motion
- Tailwind (depending on project decision)

This is NOT a complete redesign.

The objective is to preserve the company's identity while modernizing the UI, UX, responsiveness, animations, maintainability, and frontend architecture.

The final website should feel premium, modern, and handcrafted—not AI-generated.

---

# Primary References

Existing Website:
https://inspiringinfosys.com/

UI Inspiration:
https://www.vervali.com/in/
https://bitbluetech.com/
IMPORTANT:

Do NOT copy Vervali.

Only take inspiration from:

- spacing
- typography
- layouts
- animation quality
- interactions
- component polish

The final result must still look like Inspiring Infosys.

---

# Core Objectives

Modernize the frontend while preserving:

- branding
- services
- navigation
- content hierarchy
- business identity
- existing images whenever possible

Improve:

- UI
- UX
- responsiveness
- readability
- accessibility
- maintainability
- animation quality

---

# Development Philosophy

Keep things simple.

Do NOT overengineer.

Prefer simple solutions over clever solutions.

Write code that another developer can understand in five minutes.

Readable code is better than smart code.

---

# Important Rules

## DO NOT overengineer

Avoid unnecessary:

- abstractions
- hooks
- custom utilities
- helper functions
- contexts
- wrappers
- configuration

If React already provides a simple solution, use it.

---

## Build incrementally

Never generate the entire project at once.

Work section by section.

Example:

Step 1
Navbar

↓

Approval

↓

Step 2
Hero

↓

Approval

↓

Step 3
Services

↓

Approval

Continue this workflow until the project is complete.

---

## Never assume requirements

Do NOT invent:

- new services
- new pages
- new sections
- new animations
- new content
- new images

If something is unclear:

STOP.

Ask for clarification.

Never guess.

---

## Ask before changing architecture

If a major structural change is required:

Explain:

- why
- advantages
- disadvantages

Wait for approval.

---

## Respect existing branding

Reuse existing:

- company logo
- colors (unless instructed)
- images
- illustrations
- content
- services

Modernize presentation.

Do not replace company identity.

---

# React Guidelines

Use:

- Functional Components
- React Router
- Reusable Components

Keep components focused.

One component = one responsibility.

---

# Folder Organization

Respect the existing folder structure.

Do not restructure the project unless explicitly instructed.

---

# Component Rules

Every component should have one responsibility.

Good examples:

Navbar

Hero

Footer

ServiceCard

ProjectCard

SectionHeading

Container

Button

Avoid giant files.

Avoid components with multiple unrelated responsibilities.

---

# Styling

Maintain consistency.

Use:

- consistent spacing
- consistent typography
- consistent border radius
- consistent shadows

Do not create multiple design languages.

---

# Animation Rules

Animations should support usability.

Allowed:

- Fade
- Slide
- Scale
- Stagger
- Hover Lift
- Navbar Blur
- Image Zoom

Avoid:

- excessive motion
- distracting effects
- animations that slow the website

Every animation should have a purpose.

---

# Responsive Design

Desktop First.

Then:

- Laptop
- Tablet
- Mobile

Every component must be tested across breakpoints.

Never leave responsiveness until the end.

---

# Accessibility

Use semantic HTML.

Buttons should be buttons.

Links should be links.

Use aria-label where necessary.

Maintain keyboard accessibility.

Maintain sufficient color contrast.

---

# Performance

Prefer:

- lazy loading
- optimized images
- SVG icons
- reusable components

Avoid unnecessary re-renders.

Avoid unnecessary dependencies.

---

# Code Quality

Write code for humans.

Prefer clarity over cleverness.

Avoid deeply nested JSX.

Keep files reasonably small.

Keep naming predictable.

---

# Git Workflow

Make small logical commits.

Examples:

feat: build responsive navbar

feat: add hero section

fix: improve mobile navigation

refactor: simplify service cards

---

# Communication Rules

Never continue after completing a major section.

Always stop.

Summarize:

- what was completed
- what changed
- why it was done

Then ask for approval before continuing.

---

# When unsure

Do not guess.

Ask questions.

Do not assume business logic.

Do not invent UI.

Do not create placeholder content unless requested.

---

# Final Goal

Create a premium React frontend that feels handcrafted by experienced frontend engineers.

The final product should:

- look modern
- look professional
- be maintainable
- be responsive
- be performant

without losing the identity of Inspiring Infosys.

The website should never feel autogenerated or template-based.