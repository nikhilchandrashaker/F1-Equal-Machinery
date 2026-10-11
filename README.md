# Equal-Machinery F1 simulator
Run `node season_engine.js [races] [grid|all] [fieldSize] [seed] [variability]`, for example `node season_engine.js 24 all 214 20261010 1`. This rewrites standings.csv, race_results.csv and season_summary.json.
Files: race_engine.js (one Grand Prix), season_engine.js (championship), export.js (CSV/JSON), calendar.json, drivers.json (built from drivers.csv and the parameter files), validation_report.md. The interactive version is season_replay.html (self-contained).
The files in this folder come from one 24-race, 214-driver season with seed 20261010.
