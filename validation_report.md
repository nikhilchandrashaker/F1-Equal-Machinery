# Validation report: Equal-Machinery F1 (EM-SIM-0.2 engine)

Results below come from running the engine in this folder. They test that the code behaves as designed, not that it matches real F1.

## Setup
- 214 drivers (drivers.json, from drivers.csv), one car (EM-01, mean component reliability 93.7).
- Parameters from simulation_parameters.csv: driver_rating_effect_strength 0.35, incident_rate_base 0.015, 50-lap races, base seed 20261010.
- Calendar: 24 rounds cycling the 5 generic track templates; 15% chance of rain on dry tracks.

## Tests
| Test | Result |
|---|---|
| Determinism: same seed gives same season | Pass |
| Rating validity: Spearman correlation between race_pace and average season points, 50 all-driver seasons (214 drivers x 24 races) | 0.962 |
| Skill signal, F1-style grid: best-rated driver in a random 20-driver field wins the title, 200 seasons | 68.5% |
| Variability setting, same test, 100 seasons each | Low 82%, Realistic 75%, High 55% |
| Title spread, 50 all-driver seasons | 8 distinct champions; Hamilton 13, Senna 11, Clark 8, Fangio 6, Schumacher 6 |
| Retirement rate, 50 all-driver seasons | 8.0% of starts |

(The two grid tests used different seed ranges, which is why the 68.5% and 75% figures differ.)

## Known problems and limitations
1. **Retirement mix is lopsided.** About 91% of DNFs are mechanical (18,745) and 9% are driver incidents (1,801). The failure rate (0.024 per lap scaled by component unreliability) and incident rate are my own calibration, because the incident parameter is marked illustrative. Recalibrate before reading anything into DNF statistics.
2. **Ratings are provisional.** drivers.csv says they are modeled estimates, and many neighbouring drivers have near-identical ratings. The 0.962 correlation partly reflects the ratings feeding the model directly, so it is not an independent check.
3. **Simplified race physics.** No traffic or overtaking simulation (racecraft only adds a small grid-position adjustment), no pit stops, no safety cars, no sprint weekends and no season replay by lap.
4. **All-driver mode is a single 214-car field**, not heats and a final, and it uses the standard top-10 points scale.
5. **Generic tracks.** The templates share nothing with real circuits and the calendar has no dates.
6. **Era effects excluded by design.** Peak ability only, with no car, era or regulation advantages.

## Next steps
Calibrate failure and incident rates to a target DNF rate, add pit-stop and safety-car modules, run 100+ seasons per configuration, and report title shares with confidence intervals.
