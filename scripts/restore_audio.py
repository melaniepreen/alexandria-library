"""Restore optional sample audio from the owner's original ZIP (no downloads)."""
import argparse
from pathlib import Path
from zipfile import ZipFile

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('archive', type=Path)
args = parser.parse_args()
names = ['Reinforcement Learning For Quantitative Trading.mp3', 'How FinRL Meta simulates market chaos.mp3', 'Predicting stocks with visibility graph geometry.mp3', 'Pricing European calls with Quantum Fourier Transform.mp3', 'The peak of doom in quantum computers.mp3']
target = Path(__file__).resolve().parents[1] / 'public' / 'audio'
with ZipFile(args.archive) as archive:
    entries = {Path(name).name: name for name in archive.namelist()}
    missing = [name for name in names if name not in entries]
    if missing:
        parser.error('Archive is missing: ' + ', '.join(missing))
    target.mkdir(parents=True, exist_ok=True)
    for i, name in enumerate(names):
        (target / f'episode-{i}.mp3').write_bytes(archive.read(entries[name]))
print('Restored all five sample recordings.')
