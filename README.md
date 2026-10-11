# Equal-Machinery F1 simulator (engine v2)
- One season: `node season_engine.js [races=24] [grid|all] [fieldSize=20] [seed=20261010] [variability=1]` writes standings.csv, race_results.csv, season_summary.json.
- Repeated seasons and experiments: `node run_multi.js 100` writes results/multi_season_summary.json, results/title_counts_all214.csv, results/driver_avg_points_all214.csv.
- Files: race_engine.js (lap-by-lap race), season_engine.js, export.js, run_multi.js, calendar.json, drivers.json, season_replay.html (self-contained interactive page with lap-by-lap replay), figures/ (6 PNGs), validation_report.md.
- The committed CSV and JSON outputs come from one 24-race, random 20-car season with seed 20261010.
