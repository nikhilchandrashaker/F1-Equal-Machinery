# Validation report: Equal-Machinery F1 (EM-SIM engine v2)

Everything below was produced by running the code in this folder (`node run_multi.js 100`, base seed 20261010). The tests check that the engine behaves as designed. They do not show that it matches real F1.

## Calibration
Starting constants gave 91% mechanical retirements. After setting the mechanical multiplier to 0.014 and the incident multiplier to 6, retirements are about 8.3% of starts (4.1% mechanical, 4.2% incident) in a random 20-car field, with 0.78 safety cars per race and about one pit stop per start. These two constants are hand-set, because the dataset marks its incident rate as illustrative.

## Tests (100 seasons per configuration, 24 races each)
| Test | Result |
|---|---|
| Determinism: same seed gives same season and replays | Pass |
| Rank correlation, race pace vs average points, all 214 drivers | 0.975 (partly built in, since ratings feed the model) |
| Best-rated driver wins title, random 20 field | 71% |
| Best-rated driver wins title, top-20 field | 18% (7 distinct champions) |
| Best-rated driver wins title, all 214 | 14% (10 distinct champions) |
| Variability sweep (low / realistic / high) | 82% / 71% / 55% |
| Ablation, 200 seasons: full / no safety cars / no safety cars or pit stops | 73.5% / 77.5% / 74.0% (differences within about one standard error, roughly 3 points) |
| Safety cars per race: random 20 / top 20 / all 214 | 0.78 / 0.17 / 2.92 |
| Wet vs dry race winners, wet-weather rating minus race pace | -0.76 vs -0.89 (effect too small to interpret) |

## Known limitations
1. Ratings are provisional modeled estimates; all rankings inherit that.
2. Lap times are additive deltas, not a vehicle model. No explicit overtaking logic, no tire choice beyond two compounds, no sprint weekends.
3. Generic repeated tracks, no dates.
4. The wet-weather rating barely changes results, a modeling weakness.
5. All-driver mode is a single field with the top-10 points scale, not heats and a final.
6. One hundred seasons resolves effects of roughly 10 percentage points or more.
7. Fastest laps are recorded but earn no points.
