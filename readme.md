# Dark Tower — Development Roadmap

## 1. Project Vision

**Dark Tower** is a game development project built around an experiment: exploring how AI agents can transform the way games are created by an experienced solo developer.

Modern AI tools dramatically reduce the cost of experimentation. What once might have taken a small team months—prototyping and evaluating several game concepts—can potentially be accomplished by one developer in days, or even hours.

The actual speed depends on what is being explored: gameplay mechanics, balance, UI/UX, visual direction, or complete game concepts.

This creates an opportunity to explore more ideas, iterate more frequently, and make better-informed creative decisions.

The project has two goals:

1. **Build a high-quality game.** Create a cohesive, polished, and engaging product driven by strong creative direction and engineering judgment.
2. **Explore agent-driven development.** Gain practical experience using AI agents throughout the entire game development lifecycle, from initial prototyping to commercial release.

This document focuses on the game's development strategy and roadmap. The processes, tools, and methodology of agent-driven development will be explored and documented separately.

---

## 2. Development Roadmap

The project follows an iterative approach. Each phase produces something playable, testable, or directly useful for the next stage.

### Phase 1 — Gameplay Prototype

*Platform: JavaScript / Browser*

**Objective:** Validate the game's core systems, economy, and initial user experience through rapid experimentation.

The JavaScript prototype is a lightweight environment for developing and testing gameplay ideas. Its value lies primarily in the game design and knowledge it produces.

Key activities:

- Implement and refine the complete core gameplay loop.
- Explore interactions between gameplay systems.
- Experiment with progression, economy, and balance.
- Develop and iterate on functional UI/UX.
- Conduct early playtests with real users.
- Identify mechanics worth keeping, changing, or removing.

The prototype should offer a complete, playable experience with sufficient depth to evaluate the game as a whole.

**Milestone:** A playable, externally tested prototype with a validated core loop, initial balance, and documented design decisions.

### Phase 2 — Unity Vertical Slice

*Platform: Unity / PC*

**Objective:** Establish the game's technical foundation and validate its final presentation.

Reimplement the proven gameplay concepts in Unity, starting with a small but polished vertical slice.

Key activities:

- Establish maintainable, extensible game architecture.
- Reimplement essential gameplay systems.
- Develop the visual identity and presentation style.
- Iterate on animation, interaction, and player feedback.
- Refine UI/UX using lessons from the browser prototype.
- Establish automated testing and regular playable builds.
- Test the vertical slice with external players.

The vertical slice serves as a quality reference for the rest of development.

**Milestone:** A polished, playable section of the game that demonstrates the intended look, feel, and technical quality.

### Phase 3 — Complete Core Game

**Objective:** Build a complete game around the validated mechanics and presentation.

Expand the Unity implementation to include all essential gameplay systems and the full progression from beginning to end.

Key activities:

- Implement all core rooms, systems, and interactions.
- Complete the mission and world progression.
- Integrate the game economy, upgrades, and balancing.
- Implement victory, defeat, saving, and loading.
- Expand gameplay testing and automated validation.
- Iterate on the complete player experience using playtest results.

The game should become fully playable from start to finish, even if its content variety and replayability are still limited.

**Milestone:** A feature-complete core game with a coherent progression and a satisfying gameplay loop.

### Phase 4 — Replayability & Content Expansion

**Objective:** Transform the core game into a replayable roguelike experience.

Introduce a larger structure built around multiple runs, different worlds, and meaningful gameplay variation.

Key activities:

- Introduce multiple worlds with distinct characteristics.
- Implement runs and transitions between worlds.
- Define what persists or resets between runs.
- Add new events, enemies, items, and gameplay modifiers.
- Explore procedural and combinatorial content generation.
- Balance progression and difficulty across multiple runs.
- Test whether repeated playthroughs remain engaging.

The fundamental requirements of this structure should be considered during earlier phases to avoid unnecessary architectural constraints.

**Milestone:** A replayable game in which successive runs offer meaningful variation and new strategic decisions.

### Phase 5 — Release Preparation

**Objective:** Turn the expanded game into a stable, content-rich product ready for commercial release.

Key activities:

- Expand content variety and polish existing systems.
- Refine the overall balance and difficulty curve.
- Address usability issues discovered through playtesting.
- Optimize performance and improve stability.
- Finalize localization, settings, and accessibility.
- Verify save compatibility and update procedures.
- Prepare and distribute a public Steam demo.
- Conduct broader playtests and release candidate testing.
- Establish a practical strategy for post-release updates.

Content expansion should be efficient enough to support future updates without repeatedly redesigning existing systems.

**Milestone:** A polished, stable release candidate with validated gameplay, content, and technical quality.

### Phase 6 — Steam 1.0 & Beyond

**Objective:** Launch the game commercially and establish its long-term development cycle.

Key activities:

- Release version 1.0 on Steam.
- Monitor stability, reviews, and player feedback.
- Deliver fixes and quality-of-life improvements.
- Evaluate opportunities for additional content and features.
- Refine the post-release development strategy based on actual player behavior.

**Milestone:** A successful technical launch and a sustainable process for maintaining and expanding the game.

---

## 3. Continuous Development Processes

Several activities run throughout the entire roadmap rather than belonging to any individual phase.

### Player Feedback & Playtesting

**Player feedback is part of every development phase, starting with the JavaScript prototype.**

The basic iteration cycle is:

**Build → Playtest → Observe → Analyze → Improve → Repeat**

The focus of testing evolves with the project:

| Stage | Primary questions |
|---|---|
| JavaScript Prototype | Are the mechanics understandable? Is the core loop engaging? Is the UI intuitive? |
| Unity Vertical Slice | Does the game feel good to play? Does its presentation support gameplay? |
| Complete Core Game | Is progression satisfying? Where do players struggle or lose interest? |
| Replayability | Do players want another run? Are different strategies viable? |
| Pre-release | Is the experience polished, stable, and ready for a wider audience? |
| Post-release | What do players value most? What should be fixed, improved, or expanded? |

Feedback should combine direct player observations, interviews, usability testing, and gameplay data where appropriate.

Player behavior is especially valuable: what players actually do often reveals more than what they say they want.

Playtest findings should translate into concrete development decisions and priorities.

### Steam Presence & Community

Steam visibility and community development begin well before release.

The goal is to establish early contact with potential players, validate the game's appeal, and gradually build an audience.

Activities include:

- Publish a Steam Coming Soon page once representative visuals and a clear game identity are available.
- Begin collecting wishlists and building awareness.
- Share meaningful development updates and gameplay footage.
- Recruit interested players for testing.
- Gather feedback on the game's presentation and positioning.
- Release a public demo when the experience reaches an appropriate quality level.
- Use community feedback to help prioritize improvements.

Steam should become an ongoing channel for communicating with players and learning from them, rather than a platform considered only during the final release phase.

### Documentation & Knowledge Management

Documentation serves as the project's **source of truth** for game design, technical architecture, and significant decisions.

It should be structured hierarchically, allowing both developers and AI agents to access the relevant context without reading the entire project history.

Documentation has four main levels:

1. **Project:** vision, roadmap, core design principles, and high-level architecture.
2. **Systems:** the responsibilities and interactions of major gameplay systems.
3. **Features:** individual mechanics, rules, configurations, and edge cases within those systems.
4. **Knowledge:** design decisions, playtest findings, and the reasoning behind important changes.

Example structure:

```text
README.md
CLAUDE.md

Documentation/
├── Vision.md
├── Roadmap.md
├── GameDesign.md
│
├── Design/
│   ├── CoreLoop.md
│   └── Systems/
│       ├── Economy/
│       │   ├── Overview.md
│       │   ├── Payroll.md
│       │   └── Selling.md
│       │
│       ├── Raids/
│       │   ├── Overview.md
│       │   ├── Missions.md
│       │   └── LootAndClaim.md
│       │
│       └── Minions/
│           ├── Overview.md
│           ├── Training.md
│           └── Recovery.md
│
├── Engineering/
│   └── Architecture.md
│
├── Decisions/
│
└── Playtests/
```

Guiding principles:

- Keep high-level documents concise and link to detailed specifications.
- Give each gameplay system a clear documentation entry point.
- Split complex systems into feature-level documents when necessary.
- Maintain one authoritative description of each rule.
- Record significant decisions and the reasons behind them.
- Update documentation alongside changes in design and implementation.
- Introduce additional structure only when complexity justifies it.

Documentation is treated as a living part of the project, supporting consistency across iterations and preserving knowledge over long development cycles.

---

## 4. Definition of Success

The project has two complementary outcomes.

### A High-Quality Game

A complete commercial game with engaging mechanics, thoughtful UI/UX, strong presentation, balanced progression, and meaningful replayability.

Its quality is continuously evaluated through real player experience, not solely through internal development milestones.

### A Proven Development Approach

Practical experience building and maintaining a complete game with significant AI-agent involvement.

The project should provide a concrete understanding of where AI-driven development delivers the greatest value, how it affects development speed and iteration capacity, and what it takes to maintain product quality throughout a long-running project.

The detailed methodology and experiments will be documented separately.

**The central ambition is to combine experienced creative direction with the speed and flexibility of AI-assisted development, enabling a single developer to build increasingly ambitious games while maintaining a high standard of quality.**